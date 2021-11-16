
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

2) Accounts gamehost1111, gamechallen1,gamehost2222,gamechallen2 must exits in the blockchain, theres a script to create those. ```yarn createacc```

## How to Run tests

```yarn createacc``` to create tests accounts
```yarn testcreate``` to test create and close  actions
```yarn testmove``` to test move action
```yarn testwinner``` to test winner logic