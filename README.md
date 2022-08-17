## Install

```
npm install
```

### Compile

```
npm run compile
```


### Deploy to Ganache
Note: you need to have ganache running
This will deploy a new ERC20 contract to represent TRAC and mint all the tokens to the deployer wallet.

```shell
npm run deploy-ganache
```

### Deploy to Mumbai
Note: You need to make sure the .env file contains your Mumbai deployment wallet private key. The same wallet should also contain test MATIC tokens. 
The TRAC smart contract used is the existing TTRAC contract on Mumbai address: 0x10ed38c374b2f5bba3e85b9c478b9fc69559355b  


```shell
npm run deploy-mumbai
```


### Deploying to mainnet

Coming soon