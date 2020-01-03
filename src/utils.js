'use strict';
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
const fs = require('fs');
const path = require('path');
const sandboxBaseUrl = 'api.sandbox.ebay.com';
const prodBaseUrl = 'api.ebay.com';

const readJSONFile = (fileName) => {
    try {
        const resolvePath = path.resolve(process.cwd(), fileName);
        const configData = JSON.parse(fs.readFileSync(resolvePath));
        return configData;
    } catch (err) {
        console.error(err);
    }
};

const validateParams = (environment, scopes, credentials) => {
    if (!environment) throw new Error('Kindly provide the environment - PRODUCTION/SANDBOX');
    if (!scopes) throw new Error('scopes is required');
    if (!credentials) throw new Error('credentials configured incorrectly');
};

const readOptions = (options) => {
    const credentials = {};
    if (!options.env) options.env = 'PRODUCTION';
    options.baseUrl = options.env === 'PRODUCTION' ? prodBaseUrl : sandboxBaseUrl;
    credentials[options.env] = { ...options };
    return credentials;
};

module.exports = { readJSONFile, validateParams, readOptions };
