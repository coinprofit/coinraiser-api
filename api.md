# CoinRaiser API

## Authentication

### POST /authenticate

Authenticates a user, returning user model and authentication token.

#### Request Headers

```
Content-Type: application/json
```

#### Request Body

```
{
  "username": "<your-username-here>",
  "password": "<your-password-here>"
}
```

#### Response Body

```
{
  user: {},
  token: ''
}
```

#### Curl

```
curl 'http://coinraiser.herokuapp.com/authenticate' -X POST -d '{"username":"<your-username-here>","password":"<your-password-here>"}' -H 'Content-Type: application/json' -v
```

## Current User

### GET /me

Retrieves user model for the current user. Must be authenticated with a valid token passed in the Authorization header.

#### Request Headers

```
Authorization: Bearer <your-token-here>
```

#### Request Body

```
```

#### Response Body

```
{
}
```

#### Curl

```
curl 'http://coinraiser.herokuapp.com/me' -H 'Authorization: Bearer <your-token-here>' -v
```

## Users

### POST /users

Creates a new user, returning user model and authentication token.

NOTE: Currently doesn't return token. For now, make another request to /authenticate with the username and password to get the token. This will be resolved soon.

#### Request Headers

```
Content-Type: application/json
```

#### Request Body

```
{
  "username": "<your-username-here>",
  "password": "<your-password-here>",
  "email": "<your-email-here>"
}
```

#### Response Body

```
{
}
```

#### Curl

```
curl 'http://coinraiser.herokuapp.com/users' -X POST -d '{"username":"<your-username-here>","password":"<your-password-here>","email":"<your-email-here>"}' -H 'Content-Type: application/json' -v
```

### GET /users

TEMPORARY! Retrieves all user models. This endpoint will be disabled before going to production. Eventually, it may be available to an admin user. Available to unauthenticated users.

#### Request Headers

```
```

#### Request Body

```
```

#### Response Body

```
[
  {
  },
  {
  }
]
```

#### Curl

```
curl 'http://coinraiser.herokuapp.com/users' -v
```

### GET /users/:id

Retrieves the user model with the specified `id`. Available to unauthenticated users.

Note that this endpoint filters out private user information such as email address.

#### Request Headers

```
```

#### Request Body

```
```

#### Response Body

```
{
}
```

#### Curl

```
curl 'http://coinraiser.herokuapp.com/users/<user-id>' -v
```

## Campaigns

### POST /campaigns

Creates a new campaign, returning campaign model.

#### Request Headers

```
Content-Type: application/json
```

#### Request Body

```
{
  "name": "<campaign-name>",
  "description": "<campaign-description>",
  "user": "<your-user-id>",
  "goal": 1.0
}
```

#### Response Body

```
{
}
```

#### Curl

```
curl 'http://coinraiser.herokuapp.com/campaigns' -X POST -d '{"name":"<campaign-name>","description":"<campaign-description>","user":"<your-user-id>","goal":1.0}' -H 'Content-Type: application/json' -H 'Authorization: Bearer <your-token-here>' -v
```

### GET /campaigns

Retrieves all campaigns. Available to unauthenticated users.


#### Query String

Supports filtering by using query parameters. Can query for exact property values by specifying the property name as a query param and the value to find as the value. For instance:

/campaigns?name=foo&goal=1.0

Criteria modifiers are [documented here](https://github.com/balderdashy/waterline-docs/blob/master/query-language.md)

More complex queries are supported by passing a criteria JSON object as the `where` property of the query string. The object must be url encoded. Here's an example criteria object:

```
{
  name: {
    contains: 'foo'
  },
  goal: {
    '>=': 1.0
  }
}
```

Results can be sorted, and results can be limited and pages of results skipped:

```
curl 'http://coinraiser.herokuapp.com/campaigns?sort=goal%20DESC&limit=10&skip=1' -v

curl 'http://coinraiser.herokuapp.com/campaigns?sort=name%20ASC&limit=5&skip=0' -v
```

#### Request Headers

```
```

#### Request Body

```
```

#### Response Body

```
[
  {
  },
  {
  }
]
```

#### Curl

```
curl 'http://coinraiser.herokuapp.com/campaigns' -v

curl 'http://coinraiser.herokuapp.com/campaigns?where=%7B%22name%22%3A%7B%22contains%22%3A%22foo%22%7D%7D' -v
```

### GET /campaigns/:id

Retrieves the campaign model with the specified `id`. Available to unauthenticated users.

#### Request Headers

```
```

#### Request Body

```
```

#### Response Body

```
{
{
```

#### Curl

```
curl 'http://coinraiser.herokuapp.com/campaigns/<campaign-id>' -v
```

## Donations

### POST /donations

Creates a new donation, returning donation model.

#### Request Headers

```
Content-Type: application/json
```

#### Request Body

```
{
  "campaign": "<campaign-id>",
  "user": "<your-user-id>",
  "amount": 1.0,
  "comment" "<comment-about-donation>"
}
```

#### Response Body

```
{
}
```

#### Curl

```
curl 'http://coinraiser.herokuapp.com/donations' -X POST -d '{"campaign":"<campaign-id>","comment":"<comment-about-donation>","user":"<your-user-id>","amount":0.0023}' -H 'Content-Type: application/json' -H 'Authorization: Bearer <your-token-here>' -v
```

### GET /donations

Retrieves all donations. Available to unauthenticated users.

#### Request Headers

```
```

#### Request Body

```
```

#### Response Body

```
[
  {
  },
  {
  }
]
```

#### Curl

```
curl 'http://coinraiser.herokuapp.com/donations' -v
```

### GET /donations/:id

Retrieves the donations model with the specified `id`. Available to unauthenticated users.

#### Request Headers

```
```

#### Request Body

```
```

#### Response Body

```
{
}
```

#### Curl

```
curl 'http://coinraiser.herokuapp.com/donations/<donation-id>' -v
```
