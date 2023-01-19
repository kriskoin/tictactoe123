tictactoe game for eosio learning course 202
TODO:
Add a token pot mechanic, where:

the host stakes tokens to start a game,
the opponent must stake in order to accept, and
the winner takes the pot.
If the host calls the close action before the opponent accepts, or if the game ends in a tie, refund the player(s).

## Setup smart contract accounts
Accounts gamehost1111, gamechallen1,gamehost2222,gamechallen2 must exits in the blockchain, theres a script on tests folder  `mocha create_test_accts.js`
##  create account
` cleos create account eosio tictactoe123 EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV `
## set permissions:
` cleos set account permission tictactoe123 active --add-code `\
` cleos set account permission gamehost1111 active --add-code `\
` cleos set account permission gamechallen1 active --add-code `
## Compile contract

` eosio-cpp -abigen tictactoe123.cpp -o tictactoe123.wasm `\
` eosio-cpp -abigen tictactoe123.cpp -o tictactoe123.wasm  -R ./ricardian `

## publish contract

` cleos set contract tictactoe123 . -p tictactoe123@active `
#### remove contract
` cleos set contract tictactoe123 . --clear -p tictactoe123@active `

## setup defalt contract values (singleton)

### Set token symbol
` cleos push action tictactoe123 setsymbol '{"symbol":"TICTAC"}' -p tictactoe123@active `

### Set stake amount
` cleos push action tictactoe123 setstake '{"stake":1}' -p tictactoe123@active `


##  Game Logic Actions
` cleos push action tictactoe123 create '{"host":"gamehost1111","challenger":"gamechallen1"}' -p gamehost1111@active `

` cleos push action tictactoe123 move '{"host":"gamehost1111","challenger":"gamechallen1","by":"gamehost1111","row":1,"column":1}' -p gamehost1111@active `

` cleos push action tictactoe123 move '{"host":"gamehost1111","challenger":"gamechallen1","by":"gamechallen1","row":3"column":1}' -p gamechallen1@active `

` cleos push action tictactoe123 close '{"host":"gamehost1111","challenger":"gamechallen1"}' -p gamehost1111@active `

## Contract tables

` cleos get table tictactoe123 tictactoe123 games `\ 
` cleos get table tictactoe123 tictactoe123 leaderboards `\
` cleos get table tictactoe123 tictactoe123 gamesettings  ` Singleton\
` cleos get table tictactoe123 tictactoe123 balance `  players` balance 

## clear contract Tables
` cleos push action tictactoe123 clear '[]' -p tictactoe123@active `

## Set TICTAC token

` `

### create TICTAC token
` cleos push action eosio.token create '{"issuer":"tictactoe123","maximum_supply":"9000000 TICTAC",}' -p eosio.token `

### issue TICTAC token

` cleos push action eosio.token issue '{"to":"tictactoe123","quantity":"9000000 TICTAC","memo":"first issued"}' -p tictactoe123@active `

### Tranfer TICTAC token to the players
` cleos push action eosio.token transfer '{"from":"tictactoe123","to":"gamehost1111","quantity":"50 TICTAC","memo":"a TICTAC transfer"}' -p tictactoe123@active `

` cleos push action eosio.token transfer '{"from":"tictactoe123","to":"gamechallen1","quantity":"50 TICTAC","memo":"a TICTAC transfer"}' -p tictactoe123@active `

` cleos push action eosio.token transfer '{"from":"tictactoe123","to":"gamehost2222","quantity":"50 TICTAC","memo":"a TICTAC transfer"}' -p tictactoe123@active `

` cleos push action eosio.token transfer '{"from":"tictactoe123","to":"gamechallen2","quantity":"50 TICTAC","memo":"a TICTAC transfer"}' -p tictactoe123@active `

### Setup balance within tictactoe123 contract
` cleos push action eosio.token transfer '{"from":"gamehost1111","to":"tictactoe123","quantity":"5 TICTAC","memo":"a TICTAC transfer"}' -p gamehost1111@active `\
` cleos push action eosio.token transfer '{"from":"gamehost2222","to":"tictactoe123","quantity":"5 TICTAC","memo":"a TICTAC transfer"}' -p gamehost2222@active `\
` cleos push action eosio.token transfer '{"from":"gamechallen1","to":"tictactoe123","quantity":"5 TICTAC","memo":"a TICTAC transfer"}' -p gamechallen1@active `\
` cleos push action eosio.token transfer '{"from":"gamechallen2","to":"tictactoe123","quantity":"5 TICTAC","memo":"a TICTAC transfer"}' -p gamechallen2@active `


### Check players balances

` cleos get currency balance eosio.token  gamehost1111  TICTAC `\
` cleos get currency balance eosio.token  gamechallen1  TICTAC `\
` cleos get currency balance eosio.token  gamehost2222  TICTAC `\
` cleos get currency balance eosio.token  gamechallen2  TICTAC `\
` cleos get currency balance eosio.token  tictactoe123  TICTAC `