import { task } from 'hardhat/config'
import BigNumber from "bignumber.js"


task('mint', 'mint tokens to user')
	.addParam('token', 'Token address')
	.addParam('user', 'User address')
	.addParam('amount', 'Amount of tokens')
	.setAction(async ({ token, user, amount}, { ethers }) => {
		const accounts = await ethers.getSigners();
		console.log(accounts[1].address);
		
		const contract = await ethers.getContractAt("ERC20", token)	
		await contract.connect(accounts[1]).mint(user,  amount)
		const balance = await contract.balanceOf(user);
		console.log(balance.toString());
})
