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

const LOW_BOUND_ROW = 1;
const HIGH_BOUND_ROW = 3;
const LOW_BOUND_COL = 1;
const HIGH_BOUND_COL = 3;

describe ('tictactoe test move action auth & range check\n', function(){
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

  it("test move with unauthorized account",async () => {
    try {
        const result = await api.transact({
            actions: [{
              account: contract_name,
              name: 'move',
              authorization: [{
                actor: unauthorized_acc,
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
        let errorMessage =  get(err, 'json.error.details[0].message')
          errorMessage && (errorMessage = errorMessage.replace('assertion failure with message:', '').trim())
          assert.equal(errorMessage, 'transaction declares authority \'{"actor":"unauthorized","permission":"active"}\', but does not have signatures for it.')
      }
  });

  it("test move with unauthorized by",async () => {
    try {
        const result = await api.transact({
            actions: [{
              account: contract_name,
              name: 'move',
              authorization: [{
                actor: contract_name,
                permission: 'active',
              }],
              data: {
                host: host_1,
                challenger: challenger_1,
                by:unauthorized_acc,
                row:1,
                column: 1
              },
            }]
          }, {
            blocksBehind: 3,
            expireSeconds: 30,
          });
      } catch (err) {
        let errorMessage =  get(err, 'json.error.details[0].message')
          errorMessage && (errorMessage = errorMessage.replace('assertion failure with message:', '').trim())
          assert.equal(errorMessage, 'missing authority of unauthorized')
      }
  });

  it("test move action with dup host name ",async () => {
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
                challenger: host_1,
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
        let errorMessage = get(err, "json.error.details[0].message");
        errorMessage = errorMessage.replace("assertion failure with message:", "").trim();
        assert.equal(errorMessage, "challenger and host must be diferent");
      }
  });

  it("test move action with invalid row (low)",async () => {
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
                row:LOW_BOUND_ROW-1,
                column: 1
              },
            }]
          }, {
            blocksBehind: 3,
            expireSeconds: 30,
          });
      } catch (err) {
        let errorMessage = get(err, "json.error.details[0].message");
        errorMessage = errorMessage.replace("assertion failure with message:", "").trim();
        assert.equal(errorMessage, "row value out of range");
      }
  });

  it("test move action with invalid row (high)",async () => {
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
                row:HIGH_BOUND_ROW+1,
                column: 1
              },
            }]
          }, {
            blocksBehind: 3,
            expireSeconds: 30,
          });
      } catch (err) {
        let errorMessage = get(err, "json.error.details[0].message");
        errorMessage = errorMessage.replace("assertion failure with message:", "").trim();
        assert.equal(errorMessage, "row value out of range");
      }
  });

  
  it("test move action with invalid column (low)",async () => {
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
                column: LOW_BOUND_COL-1
              },
            }]
          }, {
            blocksBehind: 3,
            expireSeconds: 30,
          });
      } catch (err) {
        let errorMessage = get(err, "json.error.details[0].message");
        errorMessage = errorMessage.replace("assertion failure with message:", "").trim();
        assert.equal(errorMessage, "column value out of range");
      }
  });

  it("test move action with invalid column (high)",async () => {
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
                column: HIGH_BOUND_COL +1
              },
            }]
          }, {
            blocksBehind: 3,
            expireSeconds: 30,
          });
      } catch (err) {
        let errorMessage = get(err, "json.error.details[0].message");
        errorMessage = errorMessage.replace("assertion failure with message:", "").trim();
        assert.equal(errorMessage, "column value out of range");
      }
  });

  it("test move action with invalid game",async () => {
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
        let errorMessage = get(err, "json.error.details[0].message");
        errorMessage = errorMessage.replace("assertion failure with message:", "").trim();
        assert.equal(errorMessage, "Game does not exists");
      }
  });

});


describe ('tictactoe test move action invalid turn logic \n', function(){

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

    it("test move action with invalid turn",async () => {
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
            let errorMessage = get(err, "json.error.details[0].message");
            errorMessage = errorMessage.replace("assertion failure with message:", "").trim();
            assert.equal(errorMessage, "is not your turn");
          }
      });

      it("test move action with valid turn",async () => {
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
                    row:1,
                    column: 1
                  },
                }]
              }, {
                blocksBehind: 3,
                expireSeconds: 30,
              });
          } catch (err) {
            console.log("\n [test move action with valid turn] caught exception: " + err);
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
 

describe ('tictactoe test move action with invalid (used) position \n', function(){
    
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

 

      it("test move challenger marks [1,1]",async () => {
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
                    row:1,
                    column: 1
                  },
                }]
              }, {
                blocksBehind: 3,
                expireSeconds: 30,
              });
          } catch (err) {
            console.log("\n test move challenger marks [1,1] caught exception: " + err);
          }
      });

      it("test move challenger marks [1,2] with wrong turn",async () => {
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
                    row:1,
                    column: 2
                  },
                }]
              }, {
                blocksBehind: 3,
                expireSeconds: 30,
              });
          } catch (err) {
            let errorMessage = get(err, "json.error.details[0].message");
            errorMessage = errorMessage.replace("assertion failure with message:", "").trim();
            assert.equal(errorMessage, "is not your turn");
          }
      });

      it("test move host marks [3,3]",async () => {
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
                    row:3,
                    column: 3
                  },
                }]
              }, {
                blocksBehind: 3,
                expireSeconds: 30,
              });
          } catch (err) {
            console.log("\n test move host marks [3,3] caught exception: " + err);
          }
      });

      it("test move challenger marks [3,3] position already used",async () => {
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
            let errorMessage = get(err, "json.error.details[0].message");
            errorMessage = errorMessage.replace("assertion failure with message:", "").trim();
            assert.equal(errorMessage, "This position is already used");
          }
      });

      it("test move challenger marks [2,2]",async () => {
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
                    row:2,
                    column: 2
                  },
                }]
              }, {
                blocksBehind: 3,
                expireSeconds: 30,
              });
          } catch (err) {
            console.log("\n test move challenger marks [2,2] caught exception: " + err);
          }
      });

      it("test move host marks [3,1]",async () => {
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
                    row:3,
                    column: 1
                  },
                }]
              }, {
                blocksBehind: 3,
                expireSeconds: 30,
              });
          } catch (err) {
            console.log("\n test move host marks [3,1] caught exception: " + err);
          }
      });

      it("test move challenger marks [1,3]",async () => {
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
                    row:1,
                    column: 3
                  },
                }]
              }, {
                blocksBehind: 3,
                expireSeconds: 30,
              });
          } catch (err) {
            console.log("\n test move challenger marks [1,3] caught exception: " + err);
          }
      });

      it("test move host marks [2,2] position already used",async () => {
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
                    row:2,
                    column: 2
                  },
                }]
              }, {
                blocksBehind: 3,
                expireSeconds: 30,
              });
          } catch (err) {
            let errorMessage = get(err, "json.error.details[0].message");
            errorMessage = errorMessage.replace("assertion failure with message:", "").trim();
            assert.equal(errorMessage, "This position is already used");
          }
      });

      it("test move host marks [3,1] position already used",async () => {
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
                    row:3,
                    column: 1
                  },
                }]
              }, {
                blocksBehind: 3,
                expireSeconds: 30,
              });
          } catch (err) {
            let errorMessage = get(err, "json.error.details[0].message");
            errorMessage = errorMessage.replace("assertion failure with message:", "").trim();
            assert.equal(errorMessage, "This position is already used");
          }
      });

      it("test move host marks [3,1] position already used",async () => {
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
                    row:3,
                    column: 1
                  },
                }]
              }, {
                blocksBehind: 3,
                expireSeconds: 30,
              });
          } catch (err) {
            let errorMessage = get(err, "json.error.details[0].message");
            errorMessage = errorMessage.replace("assertion failure with message:", "").trim();
            assert.equal(errorMessage, "This position is already used");
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
 