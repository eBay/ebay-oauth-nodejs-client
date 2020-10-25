/*
 * *
 *  * Copyright 2019 eBay Inc.
 *  *
 *  * Licensed under the Apache License, Version 2.0 (the "License");
 *  * you may not use this file except in compliance with the License.
 *  * You may obtain a copy of the License at
 *  *
 *  *  http://www.apache.org/licenses/LICENSE-2.0
 *  *
 *  * Unless required by applicable law or agreed to in writing, software
 *  * distributed under the License is distributed on an "AS IS" BASIS,
 *  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  * See the License for the specific language governing permissions and
 *  * limitations under the License.
 *  *
 */

/* eslint no-console: "off" */
/* eslint no-redeclare: "off" */
'use strict';
const EbayAuthToken = require('../src/index');

const scopes = ['https://api.ebay.com/oauth/api_scope',
    'https://api.ebay.com/oauth/api_scope/sell.marketing.readonly',
    'https://api.ebay.com/oauth/api_scope/sell.marketing',
    'https://api.ebay.com/oauth/api_scope/sell.inventory.readonly',
    'https://api.ebay.com/oauth/api_scope/sell.inventory',
    'https://api.ebay.com/oauth/api_scope/sell.account.readonly',
    'https://api.ebay.com/oauth/api_scope/sell.account',
    'https://api.ebay.com/oauth/api_scope/sell.fulfillment.readonly',
    'https://api.ebay.com/oauth/api_scope/sell.fulfillment'
];

// pass the credentials through the ext file.
let ebayAuthToken = new EbayAuthToken({
    filePath: 'demo/ebay-config-sample.json'
});

// pass the credentials through constructor
ebayAuthToken = new EbayAuthToken({
    clientId: '---Client id ----',
    clientSecret: '-- client secret---',
    redirectUri: '-- redirect uri name --'
});

const clientScope = 'https://api.ebay.com/oauth/api_scope';
// // Client Crendential Auth Flow
ebayAuthToken.getApplicationToken('PRODUCTION', clientScope).then((data) => {
    console.log(data);
}).catch((error) => {
    console.log(`Error to get Access token :${JSON.stringify(error)}`);
});

// // Authorization Code Auth Flow
ebayAuthToken.generateUserAuthorizationUrl('PRODUCTION', scopes); // get user consent url.
// Using user consent url, you will be able to generate the code which you can use it for exchangeCodeForAccessToken.
// Also accepts optional values: prompt, state
ebayAuthToken.generateUserAuthorizationUrl('PRODUCTION', scopes, { prompt: 'login', state: 'custom-state-value' });

// // Exchange Code for Authorization token
ebayAuthToken.exchangeCodeForAccessToken('PRODUCTION', code).then((data) => { // eslint-disable-line no-undef
    console.log(data);
}).catch((error) => {
    console.log(error);
    console.log(`Error to get Access token :${JSON.stringify(error)}`);
});

// // Getting access token from refresh token obtained from Authorization Code flow
const refreshToken = 'v^1.1#i^1#r^1#f^0#I^3#p^3#t^Ul4xMF8yOjNDMjU1MUI0OTJBMDg5NUZGMUY4RkEwNjk1MDRBQjQ2XzNfMSNFXjI2MA==';
ebayAuthToken.getAccessToken('PRODUCTION', refreshToken, scopes).then((data) => {
    console.log(data);
}).catch((error) => {
    console.log(`Error to get Access token from refresh token:${JSON.stringify(error)}`);
});
