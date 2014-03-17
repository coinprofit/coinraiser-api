/**
 * DonationController
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

var math = require('mathjs')({
  number: 'bignumber',
  decimals: 8
});

module.exports = {

  fulfill: function(req, res) {

    var donation = req.donation;
    var campaign = donation.campaign;
    var user = req.user;

    // Check if donation has already been converted
    if (donation.transaction) {
      // If already converted, return
      return res.json({
        message: 'This donation has already been completed',
        transaction: donation.transaction
      });
    }

    // Convert from mbtc to btc
    var amount = math.number(math.eval(donation.amount+'/1000'));

    var props = {
      transaction: {
        to: campaign.addressOwner || campaign.addressEscrow,
        amount: ''+amount,
        notes: donation.comment
      }
    };

    // Send money from user account to campaign
    CoinbaseService.sendMoney(user, props, function(err, results) {

      if (err) {
        sails.log.error('Failed to send money', err);
        return req.badRequest(err);
      }

      if (results.success) {
        // Funds have been successfully sent
        sails.log.info('Donation created and BTC sent to linked user', results.transaction);

        // Update donation model with transacction results
        donation.transaction = results.transaction;
      }
      else {
        // Unable to send fund, due to invalid amount entered, bad address, unavailable funds, etc.
        sails.log.error('Donation created and user linked, but unable to send money', results.errors);
      }

      // Save donation model
      donation.save(function(err, updatedDonation) {

        if (err) {
          sails.log.error('Failed to update donation', err);
          res.badRequest(err);
        }

        // Get all donations in this campaign
        //
        // Add up the total donation amounts
        //
        // Update campaign with new raised and pledged amounts

        // Get this donation's campaign and all of its donations
        Campaign.findOneById(updatedDonation.campaign).populate('donations').exec(function(err, theCampaign) {

          if (err) {
            sails.log.error('Failed to find campaign', err);
            res.badRequest(err);
          }

          // Iterate over all donations in campaign, getting total amount raised and pledged
          var sum = _.reduce(theCampaign.donations, function(output, donation) {
            // console.log(output,donation.amount);
            if (donation.isPledge()) {
              // output.pledged = Math.round(1e8 * parseFloat(output.pledged)) + Math.round(1e8 * parseFloat(donation.amount));
              // output.pledged = math.select(output.pledged).add(donation.amount);
              output.pledged = math.number(math.eval(output.pledged+'+'+donation.amount));
            }
            else {
              // output.raised = Math.round(1e8 * parseFloat(output.raised)) + Math.round(1e8 * parseFloat(donation.amount));
              // output.raised = math.select(output.raised).add(donation.amount);
              output.raised = math.number(math.eval(output.raised+'+'+donation.amount));
            }
            // console.log(output);
            return output;
          }, { pledged: 0, raised: 0});

          console.log('sum of donations', sum);

          // Update campaign with new amounts
          theCampaign.pledged = sum.pledged;
          theCampaign.raised = sum.raised;
          // campaign.pledged = sum.pledged.toString();
          // campaign.raised = sum.raised.toString();
          // campaign.pledged = sum.pledged / 1e8;
          // campaign.raised = sum.raised / 1e8;

          // console.log('pledged', campaign.pledged);
          // console.log('raised', campaign.raised);

          // Save campaign
          theCampaign.save(function(err, updatedCampaign) {

            if (err) {
              sails.log.error('Failed to update campaign', err);
              res.badRequest(err);
            }

            // If we have the pubsub hook, use the model class's publish method
            // to notify all subscribers about the created item
            if (sails.hooks.pubsub) {

              if (req.isSocket) {
                Donation.subscribe(req, updatedDonation);
                // Introduce to classroom
                Donation.introduce(updatedDonation);
              }

              Donation.publishCreate(updatedDonation, !sails.config.blueprints.mirror && req);
            }

            // Set status code (HTTP 201: Created)
            res.status(201);

            // Send JSONP-friendly response if it's supported
            // if ( jsonp ) {
            //   return res.jsonp(updatedDonation.toJSON());
            // }

            // // Otherwise, strictly JSON.
            // else {
              return res.json(updatedDonation.toJSON());
            // }


          });

        });

      });

    });

  },

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

    console.log('campaign', data);

    // Campaign.findOneById(data.campaign).populate('donations').exec(function(err, campaign) {
    //   var sum = _.reduce(campaign.donations, function(output, donation, idx) {
    //     if (donation.isPledge()) {
    //       output.pledged += donation.amount;
    //     }
    //     else {
    //       output.raised += donation.amount;
    //     }
    //     console.log('donation '+idx, output, donation);
    //     return output;
    //   }, { pledged: 0, raised: 0});

    //   console.log(sum);
    //   return res.json(sum);
    // });

    // return;


    // Load campaign model to get address
    Campaign.findOneById(data.campaign).populate('donations').exec(function(err, theCampaign) {
      if (err) return res.badRequest(err);


      console.log('theCampaign.donation.length', theCampaign.donations.length);

      // Create Donation model

      // Create new instance of model using data from params
      Model.create(data).exec(function created (err, newInstance) {

        // Differentiate between waterline-originated validation errors
        // and serious underlying issues. Respond with badRequest if a
        // validation error is encountered, w/ validation info.
        if (err && err.status === 'invalid') return res.badRequest(err);
        if (err) return res.serverError(err);

        var user = req.user;

        // Convert from mbtc to btc
        var amount = math.number(math.eval(data.amount+'/1000'));

        var props = {
          transaction: {
            to: theCampaign.addressOwner || theCampaign.addressEscrow,
            amount: ''+amount,
            notes: data.comment
          }
        };

        // Send money to campaign if user is linked
        if (user.isLinked()) {
          CoinbaseService.sendMoney(user, props, function(err, results) {

            if (err) {
              sails.log.error('Failed to send money', err);
              return req.badRequest(err);
            }

            if (results.success) {
              // Funds have been successfully sent
              sails.log.info('Donation created and BTC sent to linked user', results.transaction);

              // Update donation model with transacction results
              newInstance.transaction = results.transaction;
            }
            else {
              // Unable to send fund, due to invalid amount entered, bad address, unavailable funds, etc.

              sails.log.error('Donation created and user linked, but unable to send money', results.errors);
              // return req.badRequest({errors: results.errors});

              // // Return new Donation to client

              // // If we have the pubsub hook, use the model class's publish method
              // // to notify all subscribers about the created item
              // if (sails.hooks.pubsub) {

              //   if (req.isSocket) {
              //     Model.subscribe(req, newInstance);
              //     // Introduce to classroom
              //     Model.introduce(newInstance);
              //   }

              //   Model.publishCreate(newInstance, !sails.config.blueprints.mirror && req);
              // }

              // // Set status code (HTTP 201: Created)
              // res.status(201);

              // // Send JSONP-friendly response if it's supported
              // if ( jsonp ) {
              //   return res.jsonp(newInstance.toJSON());
              // }

              // // Otherwise, strictly JSON.
              // else {
              //   return res.json(newInstance.toJSON());
              // }
            }

            // Save donation model
            newInstance.save(function(err, updatedDonation) {

              if (err) {
                sails.log.error('Failed to update donation', err);
                res.badRequest(err);
              }

              // Get all donations in this campaign
              //
              // Add up the total donation amounts
              //
              // Update campaign with new raised and pledged amounts

              console.log('campaign3',updatedDonation.campaign);

              // Get this donation's campaign and all of its donations
              Campaign.findOneById(updatedDonation.campaign).populate('donations').exec(function(err, campaign) {


                if (err) {
                  sails.log.error('Failed to find campaign', err);
                  return res.badRequest(err);
                }

                console.log('campaign.donations.length', campaign.donations.length);

                // Iterate over all donations in campaign, getting total amount raised and pledged
                var sum = _.reduce(campaign.donations, function(output, donation) {
                  // console.log(output,donation.amount);
                  if (donation.isPledge()) {
                    // output.pledged = Math.round(1e8 * parseFloat(output.pledged)) + Math.round(1e8 * parseFloat(donation.amount));
                    // output.pledged = math.select(output.pledged).add(donation.amount);
                    output.pledged = math.number(math.eval(output.pledged+'+'+donation.amount));
                  }
                  else {
                    // output.raised = Math.round(1e8 * parseFloat(output.raised)) + Math.round(1e8 * parseFloat(donation.amount));
                    // output.raised = math.select(output.raised).add(donation.amount);
                    output.raised = math.number(math.eval(output.raised+'+'+donation.amount));
                  }
                  // console.log(output);
                  return output;
                }, { pledged: 0, raised: 0});

                console.log('sum of donations', sum);

                // Update campaign with new amounts
                campaign.pledged = sum.pledged;
                campaign.raised = sum.raised;
                // campaign.pledged = sum.pledged.toString();
                // campaign.raised = sum.raised.toString();
                // campaign.pledged = sum.pledged / 1e8;
                // campaign.raised = sum.raised / 1e8;

                // console.log('pledged', campaign.pledged);
                // console.log('raised', campaign.raised);

                // Save campaign
                campaign.save(function(err, updatedCampaign) {

                  if (err) {
                    sails.log.error('Failed to update campaign', err);
                    res.badRequest(err);
                  }

                  // If we have the pubsub hook, use the model class's publish method
                  // to notify all subscribers about the created item
                  if (sails.hooks.pubsub) {

                    if (req.isSocket) {
                      Model.subscribe(req, updatedDonation);
                      // Introduce to classroom
                      Model.introduce(updatedDonation);
                    }

                    Model.publishCreate(updatedDonation, !sails.config.blueprints.mirror && req);
                  }

                  // Set status code (HTTP 201: Created)
                  res.status(201);

                  // Send JSONP-friendly response if it's supported
                  if ( jsonp ) {
                    return res.jsonp(updatedDonation.toJSON());
                  }

                  // Otherwise, strictly JSON.
                  else {
                    return res.json(updatedDonation.toJSON());
                  }


                });

              });

            });

          });

        }
        else {
          // Donation is actually a pledge
          sails.log.info('Creating pledge for unlinked user '+user.username);

          // Get this donation's campaign and all of its donations
          Campaign.findOneById(theCampaign.id).populate('donations').exec(function(err, campaign) {

            if (err) {
              sails.log.error('Failed to find campaign', err);
              return res.badRequest(err);
            }

            console.log('campaign', campaign, campaign.donations.length);

            // Iterate over all donations in campaign, getting total amount raised and pledged
            var sum = _.reduce(campaign.donations, function(output, donation) {
              // console.log(output,donation.amount);
              if (donation.isPledge()) {
                // output.pledged = Math.round(1e8 * parseFloat(output.pledged)) + Math.round(1e8 * parseFloat(donation.amount));
                // output.pledged = math.select(output.pledged).add(donation.amount);
                output.pledged = math.number(math.eval(output.pledged+'+'+donation.amount));
              }
              else {
                // output.raised = Math.round(1e8 * parseFloat(output.raised)) + Math.round(1e8 * parseFloat(donation.amount));
                // output.raised = math.select(output.raised).add(donation.amount);
                output.raised = math.number(math.eval(output.raised+'+'+donation.amount));
              }
              console.log(output);
              return output;
            }, { pledged: 0, raised: 0});

            console.log('sum of donations', sum);

            // Update campaign with new amounts
            campaign.pledged = sum.pledged;
            campaign.raised = sum.raised;
            // campaign.pledged = sum.pledged.toString();
            // campaign.raised = sum.raised.toString();
            // campaign.pledged = sum.pledged / 1e8;
            // campaign.raised = sum.raised / 1e8;

            // console.log('pledged', campaign.pledged);
            // console.log('raised', campaign.raised);

            // Save campaign
            campaign.save(function(err, updatedCampaign) {

              if (err) {
                sails.log.error('Failed to update campaign', err);
                res.badRequest(err);
              }

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



        }



      });

    });




  },



  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to DonationController)
   */
  _config: {}


};
