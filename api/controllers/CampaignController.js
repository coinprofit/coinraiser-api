/**
 * CampaignController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {

  // find: function(req, res) {
  //   var userId = req.param('user');
  //   var criteria = {};
  //   if (userId) {
  //     criteria.userId = userId;
  //   }

  //   Campaign.find().where(criteria).done(function(error, campaigns) {
  //     if (error) {
  //       return res.forbidden(error);
  //     }
  //     return res.send(campaigns);
  //   });
  // },

  // createWithAddress: function(req,res) {
  //   console.log('controllers',_.keys(sails.controllers.campaign));
  //   console.log('controllers',_.keys(this));

  //   sails.controllers.campaign.create(req,res);
  // },


  create: function (req, res) {

    // Ensure a model can be deduced from the request options.
    var model = req.options.model || req.options.controller;
    var jsonp = req.options.jsonp;
    if (!model) return res.badRequest();


    // Get access to `sails` (globals might be disabled) and look up the model.
    var sails = req._sails;
    var Model = sails.models[model];

    // If no model exists for this controller, it's a 404.
    if ( !Model ) return res.notFound();



    // The name of the parameter to use for JSONP callbacks
    var JSONP_CALLBACK_PARAM = 'callback';

    // if req.transport is falsy or doesn't contain the phrase "socket"
    // and JSONP is enabled for this action, we'll say we're "isJSONPCompatible"
    var isJSONPCompatible = jsonp && ! ( req.transport && req.transport.match(/socket/i) );


    // Create data object (monolithic combination of all parameters)
    // Omit the JSONP callback parameter (if this is isJSONPCompatible)
    // and params whose values are `undefined`
    var data = req.params.all();
    if (isJSONPCompatible) { data = sails.util.omit(data, JSONP_CALLBACK_PARAM); }


    var user = req.user;
    var props = {
      address: {
        label: user.username+':'+data.name
        // callback_url: ''
      }
    };
    CoinbaseService.createReceiveAddress(user, props, function(err, results) {

      if (err) {
        sails.log.error('Failed to create bitcoin address', err);
        return req.badRequest(err);
      }

      console.log('address',results);
      if (user.isLinked()) {
        data.addressOwner = results.address;
      }
      else {
        data.addressEscrow = results.address;
      }

      // Create new instance of model using data from params
      Model.create(data).exec(function created (err, newInstance) {

        // Differentiate between waterline-originated validation errors
        // and serious underlying issues. Respond with badRequest if a
        // validation error is encountered, w/ validation info.
        if (err && err.status === 'invalid') return res.badRequest(err);
        if (err) return res.serverError(err);

        // If we have the pubsub hook, use the model class's publish method
        // to notify all subscribers about the created item
        if (sails.hooks.pubsub) {

          if (req.isSocket) {
            Model.subscribe(req, newInstance);
            // Introduce to classroom
            Model.introduce(newInstance);
          }

          Model.publishCreate(newInstance, !sails.config.blueprints.mirror && req);
        }

        // Set status code (HTTP 201: Created)
        res.status(201);

        // Send JSONP-friendly response if it's supported
        if ( jsonp ) {
          return res.jsonp(newInstance.toJSON());
        }

        // Otherwise, strictly JSON.
        else {
          return res.json(newInstance.toJSON());
        }
      });

    });

  },

  claim: function(req, res) {

    var user = req.user;
    var campaign = req.campaign;

    sails.log.info('Funds in campaign '+campaign.id+' ('+campaign.name+') have been claimed by user '+user.id+' ('+user.username+')');

    // Check if user model is linked
    if (user.isLinked()) {

      // Get bitcoin address from campaign
      console.log('claim', campaign.addressOwner, campaign.addressEscrow);

    }
    else {
      res.badRequest({
        message: 'You must link your account to Coinbase before you can claim the funds in this campaign'
      });
    }


    res.json({
      message: 'Not implemented'
    });
  },

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to CampaignController)
   */
  _config: {}


};
