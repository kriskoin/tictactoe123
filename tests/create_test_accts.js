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

const contract_name="ggoodsggoods";

const acct_priv_key='5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3';
const acct_pub_key='EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV';

//host and challenger  test accounts
const host_1       = 'gamehost1111'; 
const chagenller_1 = 'gamechagen11';
const host_2       = 'gamehost2222'; 
const chagenller_2 = 'gamechagen22';

const signatureProvider = new JsSignatureProvider([acct_priv_key]);
const rpc = new JsonRpc('http://localhost:8888', { fetch });
const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });
const get = require('lodash.get')
var chai = require('chai'),assert = chai.assert;

describe ('tictactoes tests', function(){
  
});
