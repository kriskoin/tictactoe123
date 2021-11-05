/*
* @file
* @author  (C) 2021 by kriskoin https://github.com/kriskoin
* @version 1.1.0
*
* @section DESCRIPTION
*  basic unit test for ticatactoe contract's action
*
*/

const { Api, JsonRpc, RpcError } = require('eosjs');
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');      // development only
const fetch = require('node-fetch');                                    // node only; not needed in browsers
const { TextEncoder, TextDecoder } = require('util');                   // node only; native TextEncoder/Decoder



const acct_priv_key='5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3';
const acct_pub_key='EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV';

//host and challenger  test accounts
const host_1       = 'gamehost1111'; 
const challenger_1 = 'gamechallen1';
const host_2       = 'gamehost2222'; 
const challenger_2 = 'gamechallen2';

const signatureProvider = new JsSignatureProvider([acct_priv_key]);
const rpc = new JsonRpc('http://localhost:8888', { fetch });
const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });
const get = require('lodash.get')
var chai = require('chai'),assert = chai.assert;

describe ('tictactoe creating tests accounts \n', function(){
  it("create test account: host_1 \n", async () => {
    try {
      const result = await api.transact(
        {
          actions: [
            {
              account: "eosio",
              name: "newaccount",
              authorization: [
                {
                  actor: "eosio",
                  permission: "active",
                },
              ],
              data: {
                creator: 'eosio',
                name: host_1,
                owner: {
                  threshold: 1,
                  keys: [{
                    key: acct_pub_key,
                    weight: 1
                  }],
                  accounts: [],
                  waits: []
                },
                active: {
                  threshold: 1,
                  keys: [{
                    key: acct_pub_key,
                    weight: 1
                  }],
                  accounts: [],
                  waits: []
                },
              },//
            },
          ],
        },
        {
          blocksBehind: 3,
          expireSeconds: 30,
        }
      );
    } catch (err) {
      console.log('\nCaught exception: ' + err);
    }
  });

  it("create test account: chagenller_1 \n", async () => {
    try {
      const result = await api.transact(
        {
          actions: [
            {
              account: "eosio",
              name: "newaccount",
              authorization: [
                {
                  actor: "eosio",
                  permission: "active",
                },
              ],
              data: {
                creator: 'eosio',
                name: challenger_1,
                owner: {
                  threshold: 1,
                  keys: [{
                    key: acct_pub_key,
                    weight: 1
                  }],
                  accounts: [],
                  waits: []
                },
                active: {
                  threshold: 1,
                  keys: [{
                    key: acct_pub_key,
                    weight: 1
                  }],
                  accounts: [],
                  waits: []
                },
              },//
            },
          ],
        },
        {
          blocksBehind: 3,
          expireSeconds: 30,
        }
      );
    } catch (err) {
      console.log('\nCaught exception: ' + err);
    }
  });

  it("create test account: host_2 \n", async () => {
    try {
      const result = await api.transact(
        {
          actions: [
            {
              account: "eosio",
              name: "newaccount",
              authorization: [
                {
                  actor: "eosio",
                  permission: "active",
                },
              ],
              data: {
                creator: 'eosio',
                name: host_2,
                owner: {
                  threshold: 1,
                  keys: [{
                    key: acct_pub_key,
                    weight: 1
                  }],
                  accounts: [],
                  waits: []
                },
                active: {
                  threshold: 1,
                  keys: [{
                    key: acct_pub_key,
                    weight: 1
                  }],
                  accounts: [],
                  waits: []
                },
              },//
            },
          ],
        },
        {
          blocksBehind: 3,
          expireSeconds: 30,
        }
      );
    } catch (err) {
      console.log('\nCaught exception: ' + err);
    }
  });

  it("create test account: chagenller_2 \n", async () => {
    try {
      const result = await api.transact(
        {
          actions: [
            {
              account: "eosio",
              name: "newaccount",
              authorization: [
                {
                  actor: "eosio",
                  permission: "active",
                },
              ],
              data: {
                creator: 'eosio',
                name: challenger_2,
                owner: {
                  threshold: 1,
                  keys: [{
                    key: acct_pub_key,
                    weight: 1
                  }],
                  accounts: [],
                  waits: []
                },
                active: {
                  threshold: 1,
                  keys: [{
                    key: acct_pub_key,
                    weight: 1
                  }],
                  accounts: [],
                  waits: []
                },
              },//
            },
          ],
        },
        {
          blocksBehind: 3,
          expireSeconds: 30,
        }
      );
    } catch (err) {
      console.log('\nCaught exception: ' + err);
    }
  });

});