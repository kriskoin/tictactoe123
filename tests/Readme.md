
# tictactoe unit tests, 
The follow tests were design to test the smart contract's actions. test are
build to run on ubuntu 18

## Enviroment
Ubuntu 20.04.5 LTS
x86_64 GNU/Linux
node v10.19.0
yarn 1.22.19

### test environment
chai": "^4.2.0",
    "eosjs": "^22.1.0",
    "lodash": "^4.17.15",
    "lodash.get": "^4.4.2",
    "lodash.isequal": "^4.5.0",
    "mocha": "^7.0.1",
    "node-fetch": "^2.6.0"

## Prerequisites node.js 
1) in case you don have  Node.js installed on your system, install the Nodejs package by typing:

If Node.js is not installed on your system, install the Node.js package by typing:
$ sudo dnf install @nodejs

## install yarn:
ref:
https://linuxize.com/post/how-to-install-yarn-on-ubuntu-18-04/

`curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add - `
` echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list `

`sudo apt update `
`sudo apt install --no-install-recommends yarn`



## setup our tests
### change to test's directory
`cd tictactoe123/test`

### Install eosjs
`yarn add eosjs`

### setup test requeriments
run the command 'yarn install' within the test directory
`tictactoe123/test`

`yarn install `

## Setup smart contract accounts
Accounts gamehost1111, gamechallen1,gamehost2222,gamechallen2 must exits in the blockchain, theres a script to create those. `mocha create_test_accts.js`

## How to Run tests

`mocha create_test_accts.js` to create tests accounts

` mocha test_create_close.js ` to test create and close  actions
` mocha test_move.js ` to test move action
` mocha test_winner.js ` to test winner logic
` mocha test_tie.js ` to test tie logic