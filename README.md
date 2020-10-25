# Ebay Oauth Client

This code allows developers to fetch an OAuth token that can be used to call the eBay Developer REST APIs.  The code is intended for use with Node.js.

[![npm version](https://badge.fury.io/js/ebay-oauth-nodejs-client.svg)](https://badge.fury.io/js/ebay-oauth-nodejs-client)
[![Build Status](https://travis-ci.com/eBay/ebay-oauth-nodejs-client.svg?branch=master)](https://travis-ci.com/github/eBay/ebay-oauth-nodejs-client)


## Table of Contents

* [What is OAuth 2.0](#what-is-oauth)
* [Installation](#installation)
* [Library Setup and getting started](#library-setup-and-getting-started)
* [Configure credentials](#configure-credentials)
* [Types of Tokens](#types-of-tokens)
   * [Application Token](#application-token)
   * [User Token](#user-token) 
* [Supported Grant Types for OAuth](#supported-grant-types-for-oauth)
    * [Grant Type: Client Credentials](#client-credentials)
    * [Grant Type: Authorization Code](#authorization-code)
    * [Grant Type: Refresh Token](#refresh-token)
* [References](#references)
* [License](#license)

## What is OAuth
OAuth 2.0 is the most widely used standard for authentication and authorization for API based access. The complete end to end documentation on how eBay OAuth functions may be used is available at developer.ebay.com. 
See: https://developer.ebay.com/api-docs/static/oauth-tokens.html

## Installation

Using npm:
```shell
npm install ebay-oauth-nodejs-client
```

Using yarn:
```shell
yarn add ebay-oauth-nodejs-client
```

## Usage

##### EbayAuthToken(config)
Create a new instance of `EbayAuthToken` with a relevant config.
```js
const EbayAuthToken = require('ebay-oauth-nodejs-client');

const ebayAuthToken = new EbayAuthToken({
    clientId: '<your_client_id>',
    clientSecret: '<your_client_secret>',
    redirectUri: '<redirect uri>'
});
```

##### ebayAuthToken.getApplicationToken(environment)
Generate client credential token.
```js
(async () => {
    const token = await ebayAuthToken.getApplicationToken('PRODUCTION');
    console.log(token);
})();
```

##### ebayAuthToken.generateUserAuthorizationUrl(environment, scopes[, options])
Generate user consent authorization url.
```js
(() => {
    const authUrl = ebayAuthToken.generateUserAuthorizationUrl('PRODUCTION', scopes);
    console.log(authUrl);
})();
```

You can also provide optional values:\
**state:** An opaque value used by the client to maintain state between the request and callback.\
**prompt:** Force a user to log in when you redirect them to the Grant Application Access page, even if they already have an existing user session.

The method call above could also be done as
```js
(() => {
    const options = { state: 'custom-state-value', prompt: 'login' };
    const authUrl = ebayAuthToken.generateUserAuthorizationUrl('PRODUCTION', scopes, options);
    console.log(authUrl);
})();
```

##### ebayAuthToken.exchangeCodeForAccessToken(environment, code)
Getting a User access token.
```js
(async () => {
    const accessToken = await ebayAuthToken.exchangeCodeForAccessToken('PRODUCTION', code);
    console.log(accessToken);
})();
```

##### ebayAuthToken.getAccessToken(environment, refreshToken, scopes)
Using a refresh token to update a User access token (Updating the expired access token).
```js
(async () => {
    const accessToken = await ebayAuthToken.getAccessToken('PRODUCTION', refreshToken, scopes);
    console.log(accessToken);
})();
```

## Library Setup and getting started

1. Invoke the oauth ebay library as given below
```javascript
const EbayAuthToken = require('ebay-oauth-nodejs-client');
const ebayAuthToken = new EbayAuthToken({
    filePath: 'demo/eBayJson.json' // input file path.
})
```
OR
```javascript
const ebayAuthToken = new EbayAuthToken({
    clientId: '<your_client_id>',
    clientSecret: '<your_client_secret>',
    redirectUri: '<redirect_uri_name>'
});
```
2. If you want to get your application credentials such as AppId, DevId, and CertId. Refer to [Creating eBay Developer Account](https://developer.ebay.com/api-docs/static/creating-edp-account.html) for details on how to get these credentials.
3. You can refer to example.js for an example of how to use credentials.
4. For Authorization code grant
    1. Get User consent url using ```ebayAuthToken.generateUserAuthorizationUrl()```
    2. Open the generateUserAuthorizationUrl in the browser, which allows you to login in to ebay site. You will get a authorization code, or if you are using express, use ```res.direct(generateUserAuthorizationUrl);```
    3. Pass the authorization code retrieved in the above step to exchangeCodeForAccessToken method using ```ebayAuthToken.exchangeCodeForAccessToken(environment, code)```

## Configure credentials
Create a config JSON file in your application. The config file should contain your eBay applications keys: App Id, Cert Id & Dev Id. A sample config file is available at demo/ebay-config-sample.json. Learn more about creating application keys.

```json
{
    "SANDBOX": {
        "clientId": "---Client Id---",
        "clientSecret": "--- client secret---",
        "devid": "-- dev id ---",
        "redirectUri": "-- redirect uri ---",
        "baseUrl": "api.sandbox.ebay.com" //don't change these values
    },
    "PRODUCTION": {
        "clientId": "---Client Id---",
        "clientSecret": "--- client secret---",
        "devid": "-- dev id ---",
        "redirectUri": "-- redirect uri ---",
        "baseUrl": "api.ebay.com" //don't change these values
    }
}
```

## Types of Tokens
There are mainly two types of tokens in usage.

### Application Token
An application token contains an application identity which is generated using client_credentials grant type. These application tokens are useful for interaction with application specific APIs such as usage statistics etc.,
### User Token
A user token (access token or refresh token) contains a user identity and the application’s identity. This is usually generated using the authorization_code grant type or the refresh_token grant type.

## Supported Grant Types for OAuth
All of the regular OAuth 2.0 specifications such as client_credentials, authorization_code, and refresh_token are supported. [Refer to eBay Developer Portal](https://developer.ebay.com/api-docs/static/oauth-tokens.html)

### Client Credentials
This grant type can be performed by simply using ```ebayAuthToken.getApplicationToken()```. Read more about this grant type at [oauth-client-credentials-grant](https://developer.ebay.com/api-docs/static/oauth-client-credentials-grant.html).

### Authorization Code

This grant type can be performed by a two step process. Call ```ebayAuthToken.generateUserAuthorizationUrl(environment, scopes, state)``` to get the Authorization URL to redirect the user to. Once the user authenticates and approves the consent, the callback needs to be captured by the redirect URL setup by the app and then call ```ebayAuthToken.exchangeCodeForAccessToken(environment, code)``` to get the refresh and access tokens.

Read more about this grant type at [oauth-authorization-code-grant](https://developer.ebay.com/api-docs/static/oauth-authorization-code-grant.html).

### Refresh Token

This grant type can be performed by simply using ```ebayAuthToken.getAccessToken(environment, refreshToken, scopes)```. Usually access tokens are short lived and if the access token is expired, the caller can use the refresh token to generate a new access token. Read more about it at [Using a refresh token to update a user access token](https://developer.ebay.com/api-docs/static/oauth-auth-code-grant-request.html)

## Questions/problems?
you've found an bug/issue, please file it on [GitHub](https://github.com/eBay/ebay-oauth-nodejs-client/issues).

## References

1. https://developer.ebay.com/api-docs/static/oauth-tokens.html

2. https://developer.ebay.com/api-docs/static/oauth-quick-ref-user-tokens.html

3. https://developer.ebay.com/api-docs/static/oauth-gen-app-token.html

4. https://developer.ebay.com/my/keys

## License 
Copyright (c) 2019 eBay Inc.

Use of this source code is governed by a Apache-2.0 license that can be found in the LICENSE file or at https://opensource.org/licenses/Apache-2.0.

## Useful links

* Getting Client Id and Client Secret: https://developer.ebay.com/api-docs/static/oauth-credentials.html
* Getting your redirect_uri value: https://developer.ebay.com/api-docs/static/oauth-redirect-uri.html
* Specifying right scopes: https://developer.ebay.com/api-docs/static/oauth-scopes.html
