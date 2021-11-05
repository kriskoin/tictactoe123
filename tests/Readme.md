
# tictactoe unit tests, 
The follow tests were design to test the smart contract's actions. test are
build to run on ubuntu 18

## Prerequisites node.js
1) in case you don have  Node.js installed on your system, install the Nodejs package by typing:

```$ sudo dnf install @nodejs```

2) Enable the Yarn repository and import the repository’s GPG key:

```$ curl --silent --location https://dl.yarnpkg.com/rpm/yarn.repo | sudo tee /etc/yum.repos.d/yarn.repo```

```$ sudo rpm --import https://dl.yarnpkg.com/rpm/pubkey.gpg ```

3) Once the repository is enabled, install Yarn:

```$ sudo dnf install yarn```

4) Accounts ggoods.acct1, ggoods.acct2 must exits in the blockchain
## How to Run tests

 ```yarn add eosjs```

 ```yarn install```

 ```yarn test``