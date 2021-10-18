import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { ethers, network } from 'hardhat'
import { expect, assert } from 'chai'

import BigNumber from 'bignumber.js'
BigNumber.config({ EXPONENTIAL_AT: 60 })

import Web3 from 'web3'
// @ts-ignore
const web3 = new Web3(network.provider) as Web3

import { ERC20 } from '../typechain'
import { isTypedArray } from 'util/types'

let token0: ERC20

let owner: SignerWithAddress
let user0: SignerWithAddress
let user1: SignerWithAddress

async function reDeploy() {
	[owner, user0, user1] = await ethers.getSigners()
	let ERC20 = await ethers.getContractFactory('ERC20')
	token0 = await ERC20.deploy('CustomToken', 'CTM', 18, 10000000000, user0.address, user1.address) as ERC20
}

describe('Contract: CustomToken', () => {
	describe('test initial state', () => {
        it('check name, symbol, decimals and balance', async () => {
			await reDeploy()
			const [
				name,
				symbol,
                decimals,
				balanceOwner,
			] = await Promise.all([
				token0.name(),
				token0.symbol(),
                token0.decimals(),
				token0.balanceOf(owner.address),
			])
			expect(name).to.to.equal('CustomToken')
			expect(symbol).to.to.equal('CTM')
            
            expect(decimals).to.to.equal(18)
			expect(balanceOwner).to.to.equal(new BigNumber('10000000000').toString())
		})
	})

    describe('test transfer, approve and transferFrom', () => {
        it('should transfer tokens', async () => {
            await reDeploy()
			const ownerInitialBalance = await token0.balanceOf(owner.address);
            await token0.transfer(user0.address, 100);
            const ownerFinalBalance = await token0.balanceOf(owner.address);
            const user0Balance = await token0.balanceOf(user0.address); 
            
            expect(user0Balance).to.to.equal(new BigNumber('100').toString())
            expect(ownerInitialBalance.sub(ownerFinalBalance)).to.to.equal(new BigNumber('100').toString())

		})

        it('should not transfer tokens if ballance is too low', async () => {
            await reDeploy()
            await token0.transfer(user0.address, 100);
            await expect(
                token0
                    .connect(user0)
                    .transfer(user1.address, 101)
            )
                .to
                .be
                .revertedWith('balance must be >= _value')

		})

        it('should approve user0 to transfer tokens of owner', async () => {
            await reDeploy()
            await token0.approve(user0.address, 1000);
            const allowance = await token0.allowance(owner.address, user0.address);
            expect(allowance).to.to.equal(new BigNumber('1000').toString());
        })

        it('user0 should transfer tokens from owner to user1', async () => {
            await reDeploy()
            await token0.approve(user0.address, 1000);
            const initialAllowance = await token0.allowance(owner.address, user0.address);
            await token0.connect(user0).transferFrom(owner.address, user1.address, 500);
            const finalAllowance = await token0.allowance(owner.address, user0.address);
            const user1Balance = await token0.balanceOf(user1.address);
            expect(user1Balance).to.to.equal(new BigNumber('500').toString());
            expect(initialAllowance.sub(finalAllowance)).to.to.equal(new BigNumber('500').toString());
        })
        
        it('should fail if user0 are not allowed to transfer tokens or amount of tokens >= the allowed amount', async () => {
            await reDeploy()
            await expect(
                token0
                    .connect(user0)
                    .transferFrom(owner.address, user1.address, 100)
            )
                .to
                .be
                .revertedWith('msg.sender must be approved to transfer >= _value')

            await token0.approve(user0.address, 99);
            await expect(
                token0
                    .connect(user0)
                    .transferFrom(owner.address, user1.address, 100)
            )
                .to
                .be
                .revertedWith('msg.sender must be approved to transfer >= _value')
        })     
	})

    describe('burn and mint', () => {
        it('should burn tokens', async () => {
            await reDeploy();
            const ownerInitialBalance = await token0.balanceOf(owner.address);
            await token0.connect(user1).burn(owner.address, 1000);
            const ownerFinalBalance = await token0.balanceOf(owner.address);
            expect(ownerInitialBalance.sub(ownerFinalBalance)).to.to.equal(new BigNumber('1000').toString())
		})

        it('should not burn tokens if caller is not burner', async () => {
            await reDeploy();
            await expect(
                token0
                    .burn(owner.address, 100)
            )
                .to
                .be
                .revertedWith('msg.sender must be a burner')
		}) 
        it('should mint tokens', async () => {
            await reDeploy();
            const ownerInitialBalance = await token0.balanceOf(owner.address);
            await token0.connect(user0).mint(owner.address, 1000);
            const ownerFinalBalance = await token0.balanceOf(owner.address);
            expect(ownerFinalBalance.sub(ownerInitialBalance)).to.to.equal(new BigNumber('1000').toString())
		})

        it('should not mint tokens if caller is not minter', async () => {
            await reDeploy();
            await expect(
                token0
                    .mint(owner.address, 100)
            )
                .to
                .be
                .revertedWith('msg.sender must be a minter')
		}) 

    })
})
