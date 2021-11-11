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

const contract_name="tictactoe123";

const acct_priv_key='5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3';
const acct_pub_key='EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV';

//host and challenger  test accounts
const host_1       = 'gamehost1111'; 
const challenger_1 = 'gamechallen1';
const host_2       = 'gamehost2222'; 
const challenger_2 = 'gamechallen2';
const unauthorized_acc = 'unauthorized';

const signatureProvider = new JsSignatureProvider([acct_priv_key]);
const rpc = new JsonRpc('http://localhost:8888', { fetch });
const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });
const get = require('lodash.get')
var chai = require('chai'),assert = chai.assert;



/*
scenario 1

--------------------
|  H  |     |  H  | 
--------------------
|     |     |     | 
--------------------
|  C  |  C  |  C  | 
--------------------

moves sequence:
challenger : 3,1
host: 1,1
challenger :3,2
host:1,3
challenger : 3,3


challenger :
host:
*/

describe ('tictactoe test winner in a row  scenario 1 \n', function(){
    it("cleaning games' table",async () => {
        try {
            const result = await api.transact({
                actions: [{
                  account: contract_name,
                  name: 'clear',
                  authorization: [{
                    actor: contract_name,
                    permission: 'active',
                  }],
                  data: {
                  },
                }]
              }, {
                blocksBehind: 3,
                expireSeconds: 30,
              });
          } catch (err) {
            console.log("\n action clear caught exception: " + err);
          }
    });

    it("create game",async () => {
        try {
            const result = await api.transact({
                actions: [{
                  account: contract_name,
                  name: 'create',
                  authorization: [{
                    actor: host_1,
                    permission: 'active',
                  }],
                  data: {
                    host: host_1,
                    challenger: challenger_1,
                  },
                }]
              }, {
                blocksBehind: 3,
                expireSeconds: 30,
              });
          } catch (err) {
            console.log("\n action create caught exception: " + err);
          }
     });    

      it("challenger : 3,1",async () => {
        try {
            const result = await api.transact({
                actions: [{
                  account: contract_name,
                  name: 'move',
                  authorization: [{
                    actor: challenger_1,
                    permission: 'active',
                  }],
                  data: {
                    host: host_1,
                    challenger: challenger_1,
                    by:challenger_1,
                    row:3,
                    column: 1
                  },
                }]
              }, {
                blocksBehind: 3,
                expireSeconds: 30,
              });
          } catch (err) {
            console.log("\n challenger : 3,1 caught exception: " + err);
          }
      });

      it("host: 1,1",async () => {
        try {
            const result = await api.transact({
                actions: [{
                  account: contract_name,
                  name: 'move',
                  authorization: [{
                    actor: host_1,
                    permission: 'active',
                  }],
                  data: {
                    host: host_1,
                    challenger: challenger_1,
                    by:host_1,
                    row:1,
                    column: 1
                  },
                }]
              }, {
                blocksBehind: 3,
                expireSeconds: 30,
              });
          } catch (err) {
            console.log("\n host: 1,1 caught exception: " + err);
          }
      });

      it("challenger : 3,2",async () => {
        try {
            const result = await api.transact({
                actions: [{
                  account: contract_name,
                  name: 'move',
                  authorization: [{
                    actor: challenger_1,
                    permission: 'active',
                  }],
                  data: {
                    host: host_1,
                    challenger: challenger_1,
                    by:challenger_1,
                    row:3,
                    column: 2
                  },
                }]
              }, {
                blocksBehind: 3,
                expireSeconds: 30,
              });
          } catch (err) {
            console.log("\n challenger : 3,2 caught exception: " + err);
          }
      });

      it("host: 1,3",async () => {
        try {
            const result = await api.transact({
                actions: [{
                  account: contract_name,
                  name: 'move',
                  authorization: [{
                    actor: host_1,
                    permission: 'active',
                  }],
                  data: {
                    host: host_1,
                    challenger: challenger_1,
                    by:host_1,
                    row:1,
                    column: 3
                  },
                }]
              }, {
                blocksBehind: 3,
                expireSeconds: 30,
              });
          } catch (err) {
            console.log("\n host: 1,3 caught exception: " + err);
          }
      });

      it("challenger : 3,3",async () => {
        try {
            const result = await api.transact({
                actions: [{
                  account: contract_name,
                  name: 'move',
                  authorization: [{
                    actor: challenger_1,
                    permission: 'active',
                  }],
                  data: {
                    host: host_1,
                    challenger: challenger_1,
                    by:challenger_1,
                    row:3,
                    column: 3
                  },
                }]
              }, {
                blocksBehind: 3,
                expireSeconds: 30,
              });
          } catch (err) {
            console.log("\n challenger : 3,3 caught exception: " + err);
          }
      });

      it("get winner",async () => {
        try {
            const result = await api.transact({
                actions: [{
                  account: contract_name,
                  name: 'move',
                  authorization: [{
                    actor: host_1,
                    permission: 'active',
                  }],
                  data: {
                    host: host_1,
                    challenger: challenger_1,
                    by:host_1,
                    row:1,
                    column: 2
                  },
                }]
              }, {
                blocksBehind: 3,
                expireSeconds: 30,
              });
          } catch (err) {
            console.log("\n host: 1,2 caught exception: " + err);
          }
      });

    it(" close game",async () => {
        try {
            const result = await api.transact({
                actions: [{
                  account: contract_name,
                  name: 'close',
                  authorization: [{
                    actor: host_1,
                    permission: 'active',
                  }],
                  data: {
                    host: host_1,
                    challenger: challenger_1,
                  },
                }]
              }, {
                blocksBehind: 3,
                expireSeconds: 30,
              });
          } catch (err) {
            console.log("\n action close caught exception: " + err);
          }
     });
});
