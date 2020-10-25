'use strict';

const expect = require('chai').expect;
const nock = require('nock');
const EbayAuthToken = require('../src/index');

describe('test EbayAuthToken', () => {
    it('EbayAuthToken is a function', () => {
        expect(EbayAuthToken).to.be.a('function');
    });

    it('test without options', () => {
        expect(() => {
            new EbayAuthToken(); // eslint-disable-line no-new
        }).to.throw(Error, 'This method accepts an object with filepath or with client id and client secret');
    });

    it('test input params without filePath', () => {
        const ebayAuthToken = new EbayAuthToken({
            clientId: 'PROD1234ABCD',
            clientSecret: 'PRODSSSXXXZZZZ',
            devid: 'SANDBOXDEVID'
        });
        expect(ebayAuthToken.credentials).deep.equals({
            'PRODUCTION': {
                'clientId': 'PROD1234ABCD',
                'clientSecret': 'PRODSSSXXXZZZZ',
                'devid': 'SANDBOXDEVID',
                'env': 'PRODUCTION',
                'baseUrl': 'api.ebay.com'
            }
        });
    });

    it('test getApplicationToken method using filePath', () => {
        const ebayAuthToken = new EbayAuthToken({
            filePath: 'test/test.json'
        });
        const pathname = '/identity/v1/oauth2/token';
        const hostname = 'api.ebay.com';
        const mock = nock(`https://${hostname}`);
        const response = {
            access_token: 'QWESJAHS12323OP'
        };
        mock
            .post(pathname, { grant_type: 'client_credentials', scope: 'https://api.ebay.com/oauth/api_scope' })
            .reply(200, response);
        ebayAuthToken.getApplicationToken('PRODUCTION', 'https://api.ebay.com/oauth/api_scope').then((data) => {
            const jsonResp = JSON.parse(data);
            expect(jsonResp.access_token).to.equal('QWESJAHS12323OP');
        });
        // test grant Type
        expect(ebayAuthToken.grantType).to.equal('client_credentials');
    });

    it('test generateUserAuthorizationUrl with incorrect filepath', () => {
        const ebayAuthToken = new EbayAuthToken({
            filePath: 'test/test.json'
        });
        const scope = 'https://api.ebay.com/oauth/api_scope';
        expect(() => {
            ebayAuthToken.generateUserAuthorizationUrl('PRODUCTION11', scope);
        }).to.throw(Error, 'Error while reading the credentials, Kindly check here to configure');
    });

    it('test generateUserAuthorizationUrl without options', () => {
        const ebayAuthToken = new EbayAuthToken({
            filePath: 'test/test.json'
        });
        const scope = 'https://api.ebay.com/oauth/api_scope';
        expect(ebayAuthToken.generateUserAuthorizationUrl('PRODUCTION', scope)).to.equal('https://auth.ebay.com/oauth2/authorize?client_id=PROD1234ABCD&redirect_uri=PRODREDIRECT&response_type=code&scope=https://api.ebay.com/oauth/api_scope');
    });

    it('test generateUserAuthorizationUrl with incorrect options', () => {
        const ebayAuthToken = new EbayAuthToken({
            filePath: 'test/test.json'
        });
        const scope = 'https://api.ebay.com/oauth/api_scope';
        expect(() => {
            ebayAuthToken.generateUserAuthorizationUrl('PRODUCTION', scope, 'options');
        }).to.throw(Error, 'Improper way to provide optional values');
    });

    it('test generateUserAuthorizationUrl with options', () => {
        const ebayAuthToken = new EbayAuthToken({
            filePath: 'test/test.json'
        });
        const scope = 'https://api.ebay.com/oauth/api_scope';
        const options = { prompt: 'login', state: 'state' };
        expect(ebayAuthToken.generateUserAuthorizationUrl('PRODUCTION', scope, options)).to.equal('https://auth.ebay.com/oauth2/authorize?client_id=PROD1234ABCD&redirect_uri=PRODREDIRECT&response_type=code&scope=https://api.ebay.com/oauth/api_scope&prompt=login&state=state');
    });

    it('test generateUserAuthorizationUrl with sandbox env', () => {
        const ebayAuthToken = new EbayAuthToken({
            filePath: 'test/test.json'
        });
        const scope = 'https://api.ebay.com/oauth/api_scope';
        expect(ebayAuthToken.generateUserAuthorizationUrl('SANDBOX', scope)).to.equal('https://auth.sandbox.ebay.com/oauth2/authorize?client_id=SAND1234ABCD&redirect_uri=SANDBOXREDIRECT&response_type=code&scope=https://api.ebay.com/oauth/api_scope');
    });

    it('test exchangeCodeForAccessToken without code', () => {
        const ebayAuthToken = new EbayAuthToken({
            filePath: 'test/test.json'
        });
        expect(() => {
            ebayAuthToken.exchangeCodeForAccessToken();
        }).to.throw(Error, 'Authorization code is required');
    });

    it('test exchangeCodeForAccessToken without environment', () => {
        const ebayAuthToken = new EbayAuthToken({
            filePath: 'test/test.json'
        });
        expect(() => {
            ebayAuthToken.exchangeCodeForAccessToken(null, '12345ABC');
        }).to.throw(Error, 'Kindly provide the environment - PRODUCTION/SANDBOX');
    });
});

