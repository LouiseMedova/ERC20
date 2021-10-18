import { ERC20 } from '../typechain'
import {ethers, run} from 'hardhat'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import {delay} from '../utils'
let user0: SignerWithAddress
let user1: SignerWithAddress


async function deployCustomToken() {
	const ERC20 = await ethers.getContractFactory('ERC20');
    [user0, user1] = await ethers.getSigners()
    
	console.log('starting deploying token...')
	const token = await ERC20.deploy('CustomToken', 'CTM', 18,10000000000, user0.address, user0.address) as ERC20
	console.log('CustomToken deployed with address: ' + token.address)
	console.log('wait of deploying...')
	await token.deployed()
	console.log('wait of delay...')
	await delay(25000)
	console.log('starting verify token...')
	try {
		await run('verify:verify', {
			address: token!.address,
			contract: 'contracts/ERC20.sol:ERC20',
			constructorArguments: [ 'CustomToken', 'CTM', 18,10000000000, user0.address, user0.address],
		});
		console.log('verify success')
	} catch (e: any) {
		console.log(e.message)
	}
}

deployCustomToken()
.then(() => process.exit(0))
.catch(error => {
	console.error(error)
	process.exit(1)
})