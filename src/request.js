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
const https = require('https');

const base64Encode = (encodeData) => {
    const buff = new Buffer.from(encodeData); // eslint-disable-line 
    return buff.toString('base64');
};

const postRequest = (data, ebayAuthToken) => {
    const encodedStr = base64Encode(`${ebayAuthToken.clientId}:${ebayAuthToken.clientSecret}`);
    const auth = `Basic ${encodedStr}`;
    return new Promise((resolve, reject) => {
        const request = https.request({
            headers: {
                'Content-Length': data.length,
                'Content-Type': 'application/x-www-form-urlencoded',
                'authorization': auth
            },
            path: '/identity/v1/oauth2/token',
            hostname: ebayAuthToken.baseUrl,
            method: 'POST'
        });
        request.on('response', (response) => {
            let body = '';
            response.setEncoding('utf8');
            response.on('data', (chunk) => body += chunk); // eslint-disable-line 
            response.on('end', () => {
                if (body.error) {
                    reject(body);
                }
                resolve(body);
            });
        });

        request.on('error', (error) => {
            reject(error);
        });
        request.end(data);
    });
};

module.exports = postRequest;
