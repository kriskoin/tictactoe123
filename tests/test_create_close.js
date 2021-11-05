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

describe ('tictactoe  testing create close actions  \n', function(){
    it('call create action with unathorized account \n',async () => {
        try {
            const result = await api.transact({
                actions: [{
                  account: contract_name,
                  name: 'create',
                  authorization: [{
                    actor: unauthorized_acc,
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
            /*
            let errorMessage =  get(err, 'json.error.details[0].message')
            errorMessage && (errorMessage = errorMessage.replace('assertion failure with message:', '').trim())
            assert.equal('eosio_assert_message_exception', get(err, 'json.error.name') || '')
            assert.equal(errorMessage, 'Error: transaction declares authority '{'actor':'unauthorized','permission':'active'}', but does not have signatures for it.')
            */
            let errorMessage =  get(err, 'json.error.details[0].message')
            console.log('\n' + errorMessage +'\n');
          }
    });


});