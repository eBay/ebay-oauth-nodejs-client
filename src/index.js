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

'use strict';

const queryString = require('querystring');
const consts = require('./constants');
const postRequest = require('./request');
const { readJSONFile, validateParams, readOptions } = require('./utils');

/**
 * Creates a Ebay Oauth instance.
 *
 * @param {Object} options Configuration options
 * @param {String} options.clientId eBay App ID
 * @param {String} options.clientSecret eBay CertId
 * @param {String} options.env environment (PROD/SANDBOX)
 * @param {String} options.redirectUri redirect url for your eBay App.
 * @param {String} [options.scope] array of scopes, for details https://developer.ebay.com/api-docs/static/oauth-scopes.html
 * @constructor
 * @public
 */

class EbayOauthToken {
    constructor(options) {
        if (!options) {
            throw new Error('This method accepts an object with filepath or with client id and client secret');
        }
        this.credentials = options.filePath ? readJSONFile(options.filePath) : readOptions(options);
        this.grantType = '';
        return this;
    }

    getApplicationToken(environment, scopes) {
        validateParams(environment, scopes, this.credentials);
        this.grantType = consts.PAYLOAD_VALUE_CLIENT_CREDENTIALS;
        this.scope = Array.isArray(scopes) ? scopes.join('%20') : scopes;
        const data = queryString.stringify({
            grant_type: this.grantType,
            scope: this.scope
        });
        return postRequest(data, this.credentials[environment]);
    }

    generateUserAuthorizationUrl(environment, scopes, state) {
        validateParams(environment, scopes, this.credentials);
        const credentials = this.credentials[environment];
        if (!credentials) throw new Error('Error while reading the credentials, Kindly check here to configure');
        if (!credentials.redirectUri) throw new Error('redirect_uri is required for redirection after sign in \n kindly check here https://developer.ebay.com/api-docs/static/oauth-redirect-uri.html');
        this.scope = Array.isArray(scopes) ? scopes.join('%20') : scopes;
        let queryParam = `client_id=${credentials.clientId}`;
        queryParam = `${queryParam}&redirect_uri=${credentials.redirectUri}`;
        queryParam = `${queryParam}&response_type=code`;
        queryParam = `${queryParam}&scope=${this.scope}`;
        queryParam = `${queryParam}&prompt=${this.prompt}`;
        queryParam = state ? `${queryParam}&state=${state}` : queryParam;
        const baseUrl = environment === 'PRODUCTION' ? consts.OAUTHENVIRONMENT_WEBENDPOINT_PRODUCTION
            : consts.OAUTHENVIRONMENT_WEBENDPOINT_SANDBOX; // eslint-disable-line 
        return `${baseUrl}?${queryParam}`;
    }

    exchangeCodeForAccessToken(environment, code) {
        if (!code) {
            throw new Error('Authorization code is required');
        }
        validateParams(environment, true, this.credentials[environment]);
        const credentials = this.credentials[environment];
        const data = `code=${code}&grant_type=${consts.PAYLOAD_VALUE_AUTHORIZATION_CODE}&redirect_uri=${credentials.redirectUri}`; // eslint-disable-line 
        return postRequest(data, credentials);
    }

    getAccessToken(environment, refreshToken, scopes) {
        const token = refreshToken || this.getRefreshToken();
        validateParams(environment, scopes, this.credentials);
        this.scope = Array.isArray(scopes) ? scopes.join('%20') : scopes;
        if (!token) {
            throw new Error('Refresh token is required, to generate refresh token use exchangeCodeForAccessToken method'); // eslint-disable-line max-len
        }
        const data = `refresh_token=${token}&grant_type=${consts.PAYLOAD_REFRESH_TOKEN}&scope=${this.scope}`;
        return postRequest(data, this.credentials[environment]);
    }

    setRefreshToken(refreshToken) {
        this.refreshToken = refreshToken;
    }

    getRefreshToken() {
        return this.refreshToken;
    }
}

module.exports = EbayOauthToken;
