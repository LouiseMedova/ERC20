import { ERC20 } from '../typechain'
import {ethers, run} from 'hardhat'
import {delay} from '../utils'

async function deployCustomToken() {
	const ERC20Token = await ethers.getContractFactory('ERC20')
	console.log('starting deploying token...')
	const token = await ERC20Token.deploy('CustomToken', 'CTM', 18,10000000000) as ERC20
	console.log('CustomToken deployed with address: ' + token.address)
	console.log('wait of deploying...')
	await token.deployed()
	console.log('wait of delay...')
	await delay(25000)
	// console.log('starting verify token...')
	// try {
	// 	await run('verify:verify', {
	// 		address: token!.address,
	// 		contract: 'contracts/ERC20.sol:ERC20',
	// 		constructorArguments: [ 'CustomToken', 'CTM', 18,10000000000 ],
	// 	});
	// 	console.log('verify success')
	// } catch (e: any) {
	// 	console.log(e.message)
	// }
}

deployCustomToken()
.then(() => process.exit(0))
.catch(error => {
	console.error(error)
	process.exit(1)
})