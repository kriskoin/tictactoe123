tictactoe game for eosio learning course 202
TODO:
Add a token pot mechanic, where:

the host stakes tokens to start a game,
the opponent must stake in order to accept, and
the winner takes the pot.
If the host calls the close action before the opponent accepts, or if the game ends in a tie, refund the player(s).

# Setup smart contract tests' accounts
Accounts gamehost1111, gamechallen1,gamehost2222,gamechallen2 must exits in the blockchain, theres a script on tests folder  `mocha create_test_accts.js`
#  create account
` cleos create account eosio tictactoe123 EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV `
# set permissions:
` cleos set account permission tictactoe123 active --add-code `
# Compile contract

` eosio-cpp -abigen tictactoe123.cpp -o tictactoe123.wasm `\
` eosio-cpp -abigen tictactoe123.cpp -o tictactoe123.wasm  -R ./ricardian `

# publish contract

` cleos set contract tictactoe123 . -p tictactoe123@active `
## remove contract
` cleos set contract tictactoe123 . --clear -p tictactoe123@active `

# setup defalt contract values (singleton)
You need to setup the token symbol and the stake amount 
## Set token symbol
` cleos push action tictactoe123 setsymbol '{"symbol":"TICTAC"}' -p tictactoe123@active `

## Set stake amount
` cleos push action tictactoe123 setstake '{"stake":2}' -p tictactoe123@active `


#  Game Logic Actions

## STEP 1  create the token TICTAC
` cleos push action eosio.token create '{"issuer":"tictactoe123","maximum_supply":"9000000 TICTAC",}' -p eosio.token `
issue the TICTAC TOKEN\
` cleos push action eosio.token issue '{"to":"tictactoe123","quantity":"9000000 TICTAC","memo":"first issued"}' -p tictactoe123@active `

## STEP 2 Add Funds to the tests accounts
` cleos push action eosio.token transfer '{"from":"tictactoe123","to":"gamehost1111","quantity":"50 TICTAC","memo":"a TICTAC transfer"}' -p tictactoe123@active `

` cleos push action eosio.token transfer '{"from":"tictactoe123","to":"gamechallen1","quantity":"50 TICTAC","memo":"a TICTAC transfer"}' -p tictactoe123@active `

` cleos push action eosio.token transfer '{"from":"tictactoe123","to":"gamehost2222","quantity":"50 TICTAC","memo":"a TICTAC transfer"}' -p tictactoe123@active `

` cleos push action eosio.token transfer '{"from":"tictactoe123","to":"gamechallen2","quantity":"50 TICTAC","memo":"a TICTAC transfer"}' -p tictactoe123@active `
## STEP 3 Stake tokens 
Before call tictactoe 's actions you need to stake (transfer) funds within smartcontract\
` cleos push action eosio.token transfer '{"from":"gamehost1111","to":"tictactoe123","quantity":"5 TICTAC","memo":"a TICTAC transfer"}' -p gamehost1111@active `\
` cleos push action eosio.token transfer '{"from":"gamehost2222","to":"tictactoe123","quantity":"5 TICTAC","memo":"a TICTAC transfer"}' -p gamehost2222@active `\
` cleos push action eosio.token transfer '{"from":"gamechallen1","to":"tictactoe123","quantity":"5 TICTAC","memo":"a TICTAC transfer"}' -p gamechallen1@active `\
` cleos push action eosio.token transfer '{"from":"gamechallen2","to":"tictactoe123","quantity":"5 TICTAC","memo":"a TICTAC transfer"}' -p gamechallen2@active `
### Table balance 
the smartcontract store the player's funds within the internal table **balance** you can check players balance with ` cleos get table tictactoe123 tictactoe123 balance ` , players ' WIN/LOSSES will be reflected
in this table. withdrawals are made on the balances stored in this table.

### STEP4 GAME LOGIC an example
` cleos push action tictactoe123 create '{"host":"gamehost1111","challenger":"gamechallen1"}' -p gamehost1111@active `

` cleos push action tictactoe123 move '{"host":"gamehost1111","challenger":"gamechallen1","by":"gamechallen1","row":1"column":1}' -p gamechallen1@active `

` cleos push action tictactoe123 move '{"host":"gamehost1111","challenger":"gamechallen1","by":"gamehost1111","row":3,"column":1}' -p gamehost1111@active `

` cleos push action tictactoe123 move '{"host":"gamehost1111","challenger":"gamechallen1","by":"gamechallen1","row":1"column":2}' -p gamechallen1@active `

` cleos push action tictactoe123 move '{"host":"gamehost1111","challenger":"gamechallen1","by":"gamehost1111","row":3,"column":2}' -p gamehost1111@active `


` cleos push action tictactoe123 move '{"host":"gamehost1111","challenger":"gamechallen1","by":"gamechallen1","row":1"column":3}' -p gamechallen1@active `\
Winner gamechallen1 detected here, funds will transfer to balance table

` cleos push action tictactoe123 move '{"host":"gamehost1111","challenger":"gamechallen1","by":"gamehost1111","row":3,"column":1}' -p gamehost1111@active `

#### Close a game
` cleos push action tictactoe123 close '{"host":"gamehost1111","challenger":"gamechallen1"}' -p gamehost1111@active `

## STEP 5 withdrawl funds
` cleos push action tictactoe123 withdrawal '{"player":"gamehost1111","funds":1}' -p gamehost1111@active `\
` cleos push action tictactoe123 withdrawal '{"player":"gamechallen1","funds":1}' -p gamechallen1@active `

### Contract tables

` cleos get table tictactoe123 tictactoe123 games `\
` cleos get table tictactoe123 tictactoe123 leaderboards `\
` cleos get table tictactoe123 tictactoe123 gamesettings  ` Singleton\
` cleos get table tictactoe123 tictactoe123 balance `  players` balance 

### clear contract Tables
` cleos push action tictactoe123 clear '[]' -p tictactoe123@active `

### Check players balances

` cleos get currency balance eosio.token  gamehost1111  TICTAC `\
` cleos get currency balance eosio.token  gamechallen1  TICTAC `\
` cleos get currency balance eosio.token  gamehost2222  TICTAC `\
` cleos get currency balance eosio.token  gamechallen2  TICTAC `\
` cleos get currency balance eosio.token  tictactoe123  TICTAC `