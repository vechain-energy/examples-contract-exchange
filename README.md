# Setup

Install dependencies:

```shell
yarn init -y
yarn add --dev hardhat @nomiclabs/hardhat-waffle @nomiclabs/hardhat-ethers @vechain.energy/hardhat-thor @openzeppelin/contracts hardhat-jest-plugin nodemon
```

manually add `hardhat.config.js`:
```js
require("@nomiclabs/hardhat-waffle");
require('@vechain.energy/hardhat-thor')
require("hardhat-jest-plugin")

module.exports = {
  solidity: "0.8.4",
  networks: {
    vechain: {
      url: 'https://testnet.veblocks.net',
      privateKey: "0x80b97e2ecfab8b1c78100c418328e8a88624e3d19928ec791a8a51cdcf01f16f",
      delegateUrl: 'https://sponsor-testnet.vechain.energy/by/90'
    }
  }
};
```

init jest tests:
```shell
$ npx jest --init

The following questions will help Jest to create a suitable configuration for your project

✔ Would you like to use Jest when running "test" script in "package.json"? … no
✔ Would you like to use Typescript for the configuration file? … no
✔ Choose the test environment that will be used for testing › node
✔ Do you want Jest to add coverage reports? … no
✔ Which provider should be used to instrument code for coverage? › v8
✔ Automatically clear mock calls, instances and results before every test? … yes

📝  Configuration file created at /jest.config.js
```

# Commands

* `yarn build` to compile contract
* `yarn test` to run tests
* `yarn test:watch` to run tests again when something changes
* `yarn deploy Factory` to deploy contract
* `yarn deploy:proxy Factory` to deploy contract with proxy in front
* `yarn deploy:upgrade Factory` to deploy contract and upgrade proxy
* `yarn contract:call <Contract Name> <Function Name> <Args>` to call a function or initiate a transaction to execute a function


# Example

## Deploy

```shell
$ yarn deploy:proxy Exchange  
yarn run v1.22.17
$ node scripts/deploy-proxy.js Exchange

Deploying to **TEST** network

ℹ [Exchange] Transaction Id: 0xd485d80365ea3b41e3d6e9523ef7e04a7097cc5b5fdbd8060b7688e6bd318e03
ℹ [Exchange] Contract is now available at 0x1116bd12002e44927DB95cc191fc718084252FAf
ℹ [Exchange] Artifact written to src/contracts/test/Exchange.json
✔ [Exchange] Proxied Contract is now available at 0xA1F0247553D8DAAE8F943F6461816d82c4535c82

✨  Done in 35.75s.
```

## Init

* Obtained router address from: https://github.com/VeRocket/uni-v2

```shell
$ yarn call Exchange setExchangeRouter 0x91e42759290239a62ac757cf85bb5b74ace57927
yarn run v1.22.17
$ node scripts/contract-call.js Exchange setExchangeRouter 0x91e42759290239a62ac757cf85bb5b74ace57927

Working on **TEST** network

ℹ [Exchange] 0xA1F0247553D8DAAE8F943F6461816d82c4535c82 executing setExchangeRouter(0x91e42759290239a62ac757cf85bb5b74ace57927)
ℹ [Exchange] Gas costs: 45163 VTHO
✔ [Exchange] Completed with Transaction Id 0xbfff4c26cb21adb1f6105a300db665256e1e96e055a0c58cc9ff2d967c96dcba
✨  Done in 19.72s.
```

## Test

* obtained test tokens from https://faucet.vecha.in/
* sent all VET + VTHO to contract address (`0xA1F0247553D8DAAE8F943F6461816d82c4535c82`)


1:10 swap fails because of bad rates:

```shell
$ yarn call Exchange swap 0x0000000000000000000000000000456e65726779 10          
yarn run v1.22.17
$ node scripts/contract-call.js Exchange swap 0x0000000000000000000000000000456e65726779 10

Working on **TEST** network

ℹ [Exchange] 0xA1F0247553D8DAAE8F943F6461816d82c4535c82 executing swap(0x0000000000000000000000000000456e65726779, 10)
✖ [Exchange] UniswapV2Router: INSUFFICIENT_OUTPUT_AMOUNT
✨  Done in 1.66s.
```


1:20 swap successful:

```shell
$ yarn call Exchange swap 0x0000000000000000000000000000456e65726779 20
yarn run v1.22.17
$ node scripts/contract-call.js Exchange swap 0x0000000000000000000000000000456e65726779 20

Working on **TEST** network

ℹ [Exchange] 0xA1F0247553D8DAAE8F943F6461816d82c4535c82 executing swap(0x0000000000000000000000000000456e65726779, 20)
ℹ [Exchange] emitted undefined
ℹ [Exchange] 
undefined
ℹ [Exchange] emitted undefined
ℹ [Exchange] 
undefined
ℹ [Exchange] emitted undefined
ℹ [Exchange] 
undefined
ℹ [Exchange] emitted undefined
ℹ [Exchange] 
undefined
ℹ [Exchange] emitted undefined
ℹ [Exchange] 
undefined
ℹ [Exchange] emitted undefined
ℹ [Exchange] 
undefined
ℹ [Exchange] emitted Deposit(address,uint256)
ℹ [Exchange] 
[
  "0x91e42759290239a62aC757cf85Bb5B74aCE57927",
  {
    "type": "BigNumber",
    "hex": "0x31b10beeb97c181e"
  }
]
ℹ [Exchange] Gas costs: 194693 VTHO
✔ [Exchange] Completed with Transaction Id 0xc8816e3aa250ac57ce1544e345bd6c4ce4df07ccbaa6e67fa6d56f1143338ee8
✨  Done in 18.32s.
```

withdraw test:

```shell
$ yarn call Exchange withdraw 0xF503A2cC1271CE16cdAE3cC8f98d4C88d3F13163
yarn run v1.22.17
$ node scripts/contract-call.js Exchange withdraw 0xF503A2cC1271CE16cdAE3cC8f98d4C88d3F13163

Working on **TEST** network

ℹ [Exchange] 0xA1F0247553D8DAAE8F943F6461816d82c4535c82 executing withdraw(0xF503A2cC1271CE16cdAE3cC8f98d4C88d3F13163)
ℹ [Exchange] emitted Withdraw(address,uint256)
ℹ [Exchange] 
[
  "0xF503A2cC1271CE16cdAE3cC8f98d4C88d3F13163",
  {
    "type": "BigNumber",
    "hex": "0x1b4c95e2d1a8cc181e"
  }
]
ℹ [Exchange] Gas costs: 34370 VTHO
✔ [Exchange] Completed with Transaction Id 0xf50584683897b9898ef62c384d519e6590abd372c2987f0acc59c208f026bf34
✨  Done in 27.11s.
```


## Result

* Exchange-Transaction: https://explore-testnet.vechain.org/transactions/0xc8816e3aa250ac57ce1544e345bd6c4ce4df07ccbaa6e67fa6d56f1143338ee8#info
* Withdraw-Transaction: https://explore-testnet.vechain.org/transactions/0xf50584683897b9898ef62c384d519e6590abd372c2987f0acc59c208f026bf34#info


## Bonus

Using the vechain.energy transaction API the swap can be executed using curl in a cronjob or a an interval called from IFTTT.

### grant a Transaction-API Key an Admin-Role

```shell
$ yarn call Exchange ADMIN_ROLE                                         
yarn run v1.22.17
$ node scripts/contract-call.js Exchange ADMIN_ROLE

Working on **TEST** network

ℹ [Exchange] 0xA1F0247553D8DAAE8F943F6461816d82c4535c82 calling ADMIN_ROLE()
✔ Results:

0xa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775
✨  Done in 1.60s.

$ yarn call Exchange grantRole 0xa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775 0x00a4e31340ca8565c65e047f050145094b0fbb8d
yarn run v1.22.17
$ node scripts/contract-call.js Exchange grantRole 0xa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775 0x00a4e31340ca8565c65e047f050145094b0fbb8d

Working on **TEST** network

ℹ [Exchange] 0xA1F0247553D8DAAE8F943F6461816d82c4535c82 executing grantRole(0xa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775, 0x00a4e31340ca8565c65e047f050145094b0fbb8d)
ℹ [Exchange] emitted RoleGranted(bytes32,address,address)
ℹ [Exchange] 
[
  "0xa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775",
  "0x00a4E31340CA8565c65e047f050145094b0FBB8d",
  "0x7eF0CbaDFc0da51A6153F35a99185B59a8cbc463"
]
ℹ [Exchange] Gas costs: 50419 VTHO
✔ [Exchange] Completed with Transaction Id 0x4917769a5c019481039c120abee53ae618c842d77d9eac7c1b994fe81f7e4346
✨  Done in 18.26s.

```

### Swap with curl

```shell
$ curl -X POST https://sponsor-testnet.vechain.energy/by/115/transaction \
  -H "X-API-Key: gqxao258sg.65fdb6ea8d8f634080fb65322f3170fed920b7dc4adc3f805ec023de07b27282" \
  -H "Content-Type: application/json" \
  -d '{"clauses": [ "0xA1F0247553D8DAAE8F943F6461816d82c4535c82.swap(address 0x0000000000000000000000000000456e65726779, uint256 20)" ]}'
```

```json
{"id":"0x18f21bebc1f238f475f102834c79035bae5a3ba026fab83af1387925c12c2236","url":"https://vethor-node-test.vechaindev.com/transactions/0x18f21bebc1f238f475f102834c79035bae5a3ba026fab83af1387925c12c2236?pending=true"}
```

* Transaction: https://explore-testnet.vechain.org/transactions/0x18f21bebc1f238f475f102834c79035bae5a3ba026fab83af1387925c12c2236#info