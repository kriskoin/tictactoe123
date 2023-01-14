tictactoe game for eosio learning course 202
TODO:
Add a token pot mechanic, where:

the host stakes tokens to start a game,
the opponent must stake in order to accept, and
the winner takes the pot.
If the host calls the close action before the opponent accepts, or if the game ends in a tie, refund the player(s).

## Setup smart contract accounts
Accounts gamehost1111, gamechallen1,gamehost2222,gamechallen2 must exits in the blockchain, theres a script on tests folder  `mocha create_test_accts.js`

## set permissions:
` cleos set account permission tictactoe123 active --add-code `

## Set TICTAC token

` `

### create TICTAC token
` cleos push action eosio.token create '{"issuer":"tictactoe123","maximum_supply":"9000000 TICTAC",}' -p eosio.token `

### issue TICTAC token

` cleos push action eosio.token issue '{"to":"tictactoe123","quantity":"9000000 TICTAC","memo":"first issued"}' -p tictactoe123@active `

### Tranfer TICTAC token to the players
` cleos push action eosio.token transfer '{"from":"tictactoe123","to":"gamehost1111","quantity":"5 TICTAC","memo":"a TICTAC transfer"}' -p tictactoe123@active `

` cleos push action eosio.token transfer '{"from":"tictactoe123","to":"gamechallen1","quantity":"5 TICTAC","memo":"a TICTAC transfer"}' -p tictactoe123@active `

` cleos push action eosio.token transfer '{"from":"tictactoe123","to":"gamehost2222","quantity":"5 TICTAC","memo":"a TICTAC transfer"}' -p tictactoe123@active `

` cleos push action eosio.token transfer '{"from":"tictactoe123","to":"gamechallen2","quantity":"5 TICTAC","memo":"a TICTAC transfer"}' -p tictactoe123@active `

### Check players balances

` cleos get currency balance eosio.token  gamehost1111  TICTAC `
` cleos get currency balance eosio.token  gamechallen1  TICTAC `
` cleos get currency balance eosio.token  gamehost2222  TICTAC `
` cleos get currency balance eosio.token  gamechallen2  TICTAC `