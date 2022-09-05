const { ethers } = require('hardhat')
const { BigNumber } = ethers
const Web3EthAbi = require('web3-eth-abi')
const ERC1967Proxy = require('@openzeppelin/contracts/build/contracts/ERC1967Proxy.json')

const contracts = {}
const users = {}

beforeEach(async function () {
  [users.owner, users.admin, users.anon, users.user1] = await ethers.getSigners()
  contracts.Exchange = await getContractWithProxy('Exchange')

  const adminRole = await contracts.Exchange.ADMIN_ROLE()
  await contracts.Exchange.grantRole(adminRole, users.admin.address)
})

describe('Exchange', () => {

  describe('Deposit & Withdraw', () => {
    it('can receive VET', async () => {
      const value = ethers.utils.parseEther("100")
      await ethers.provider.send('hardhat_setBalance', [contracts.Exchange.address, '0x0'])

      await users.owner.sendTransaction({
        to: contracts.Exchange.address,
        value,
      });

      const balance = await ethers.provider.getBalance(contracts.Exchange.address)
      expect(balance).toEqual(value)
    })

    it('can withdraw VET', async () => {
      const value = ethers.utils.parseEther("100")
      await ethers.provider.send('hardhat_setBalance', [contracts.Exchange.address, '0x0'])
      await ethers.provider.send('hardhat_setBalance', [users.user1.address, '0x0'])

      await users.owner.sendTransaction({
        to: contracts.Exchange.address,
        value,
      });


      await contracts.Exchange.connect(users.admin).withdraw(users.user1.address)
      const balance = await ethers.provider.getBalance(users.user1.address)
      expect(balance).toEqual(value)
    })

    it('requires ADMIN_ROLE to withdraw', async () => {
      const value = ethers.utils.parseEther("100")
      await ethers.provider.send('hardhat_setBalance', [contracts.Exchange.address, '0x0'])
      await ethers.provider.send('hardhat_setBalance', [users.user1.address, '0x0'])

      await users.owner.sendTransaction({
        to: contracts.Exchange.address,
        value
      });


      const adminRole = await contracts.Exchange.ADMIN_ROLE()
      await expect(contracts.Exchange.connect(users.anon).withdraw(users.user1.address)).rejects.toThrow(`is missing role ${adminRole}`)

      const balance = await ethers.provider.getBalance(contracts.Exchange.address)
      expect(balance).toEqual(value)
    })
  })

  describe('setExchangeRouter', () => {
    it('requires ADMIN_ROLE', async () => {
      const adminRole = await contracts.Exchange.ADMIN_ROLE()
      await expect(contracts.Exchange.connect(users.anon).setExchangeRouter(users.user1.address)).rejects.toThrow(`is missing role ${adminRole}`)
    })

    it('sets the new router address', async () => {
      const address = users.anon.address
      await contracts.Exchange.connect(users.admin).setExchangeRouter(address)
      
      const exchangeRouterAddress = await contracts.Exchange.exchangeRouter()
      expect(exchangeRouterAddress).toEqual(address)
    })
  })

  describe('swap', () => {
    it('requires ADMIN_ROLE', async () => {
      const adminRole = await contracts.Exchange.ADMIN_ROLE()
      await expect(contracts.Exchange.connect(users.anon).swap("0x0000000000000000000000000000456e65726779", 100)).rejects.toThrow(`is missing role ${adminRole}`)
    })

    it('requires exchangeRouter to be set', async () => {
      await expect(contracts.Exchange.connect(users.admin).swap("0x0000000000000000000000000000456e65726779", 100)).rejects.toThrow(`exchangeRouter needs to be set`)
    })
  })

})


async function getContractWithProxy(contractName) {
  // get contract details
  const Contract = await ethers.getContractFactory(contractName)
  const contract = await Contract.deploy()

  const Proxy = await ethers.getContractFactoryFromArtifact(ERC1967Proxy)

  // calculate initialize() call during deployment
  const callInitialize = Web3EthAbi.encodeFunctionCall(
    Contract.interface.fragments.find(({ name }) => name === 'initialize'), []
  )

  // deploy proxy pointing to contract
  const proxy = await Proxy.deploy(contract.address, callInitialize)

  // return proxy address attached with contract functionality
  const proxiedContract = Contract.attach(proxy.address)
  return proxiedContract
}
