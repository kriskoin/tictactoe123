
# tictactoe unit tests, 
The follow tests were design to test the smart contract's actions. test are
build to run on ubuntu 18

## Prerequisites node.js
1) in case you don have  Node.js installed on your system, install the Nodejs package by typing:

If Node.js is not installed on your system, install the Node.js package by typing:
$ sudo dnf install @nodejs

Enable the Yarn repository and import the repository’s GPG key:
$ curl --silent --location https://dl.yarnpkg.com/rpm/yarn.repo | sudo tee /etc/yum.repos.d/yarn.repo

$ sudo rpm --import https://dl.yarnpkg.com/rpm/pubkey.gpg

Once the repository is enabled, install Yarn:
$ sudo dnf install yarn
yarn add eosjs

yarn install

2) Accounts gamehost1111, gamechallen1,gamehost2222,gamechallen2 must exits in the blockchain, theres a script to create those. ```mocha create_test_accts.js```

## How to Run tests

```mocha create_test_accts.js``` to create tests accounts
```mocha test_create_close.js``` to test create and close  actions
```mocha test_move.js``` to test move action
```mocha test_winner.js``` to test winner logic
```mocha test_tie.js``` to test tie logic