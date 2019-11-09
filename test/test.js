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
        }).to.throw(Error, 'input filePath is required');
    });

    it('test getApplicationToken method', () => {
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

    it('test generateUserAuthorizationUrl without prompt', () => {
        const ebayAuthToken = new EbayAuthToken({
            filePath: 'test/test.json'
        });
        const scope = 'https://api.ebay.com/oauth/api_scope';
        expect(ebayAuthToken.generateUserAuthorizationUrl('PRODUCTION', scope)).to.equal('https://auth.ebay.com/oauth2/authorize?client_id=PROD1234ABCD&redirect_uri=PRODREDIRECT&response_type=code&scope=https://api.ebay.com/oauth/api_scope&prompt=undefined');
    });

    it('test generateUserAuthorizationUrl with state', () => {
        const ebayAuthToken = new EbayAuthToken({
            filePath: 'test/test.json'
        });
        const scope = 'https://api.ebay.com/oauth/api_scope';
        expect(ebayAuthToken.generateUserAuthorizationUrl('PRODUCTION', scope, 'state')).to.equal('https://auth.ebay.com/oauth2/authorize?client_id=PROD1234ABCD&redirect_uri=PRODREDIRECT&response_type=code&scope=https://api.ebay.com/oauth/api_scope&prompt=undefined&state=state');
    });

    it('test generateUserAuthorizationUrl with sandbox env', () => {
        const ebayAuthToken = new EbayAuthToken({
            filePath: 'test/test.json'
        });
        const scope = 'https://api.ebay.com/oauth/api_scope';
        expect(ebayAuthToken.generateUserAuthorizationUrl('SANDBOX', scope)).to.equal('https://auth.sandbox.ebay.com/oauth2/authorize?client_id=SAND1234ABCD&redirect_uri=SANDBOXREDIRECT&response_type=code&scope=https://api.ebay.com/oauth/api_scope&prompt=undefined');
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

