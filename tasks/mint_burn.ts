import { task } from 'hardhat/config'
import BigNumber from "bignumber.js"
import {delay} from '../utils'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'


task('mint', 'mint tokens to user')
	.addParam('token', 'Token address')
	.addParam('user', 'User address')
	.addParam('amount', 'Amount of tokens')
	.setAction(async ({ token, user, amount}, { ethers }) => {
		const accounts = await ethers.getSigners();
		console.log(accounts[2].address);	
		const contract = await ethers.getContractAt("ERC20", token)	
		await contract.connect(accounts[1]).mint(user,  amount)
		const balance = await contract.balanceOf(user);
		console.log(balance.toString());
})

task('burn', 'burn tokens from user')
	.addParam('token', 'Token address')
	.addParam('user', 'User address')
	.addParam('amount', 'Amount of tokens')
	.setAction(async ({ token, user, amount}, { ethers }) => {
		const accounts = await ethers.getSigners();
		const contract = await ethers.getContractAt("ERC20", token)	
		await contract.connect(accounts[2]).burn(user,  amount)
		const balance = await contract.balanceOf(user);
		console.log(balance.toString());
})

task('approveBurn', 'approve to burn tokens from user')
	.addParam('token', 'Token address')
	.addParam('amount', 'Amount of tokens')
	.setAction(async ({ token, amount}, { ethers }) => {
		const accounts = await ethers.getSigners();
		const contract = await ethers.getContractAt("ERC20", token)	
		await contract.approve(accounts[2].address, amount);

})