const Web3 = require("web3")
const ContractKit = require('@celo/contractkit')
const web3 = new Web3('https://alfajores-forno.celo-testnet.org')
const kit = ContractKit.newKitFromWeb3(web3)
const getAccount = require('./getAccount').getAccount

createAccount()
send()
//console.log('tesdt',kit)
// 3. Get the token contract wrappers
async function foo()
{
 let goldtoken = await kit.contracts.getGoldToken()
 let stabletoken = await kit.contracts.getStableToken()
//console.log('goldtoken', goldtoken)
//console.log('stabletoken', stabletoken)

 // 4. Address to look up
 let anAddress = '0xD86518b29BB52a5DAC5991eACf09481CE4B0710d'

 // 5. Get token balances
 let celoBalance = await goldtoken.balanceOf(anAddress)
 let cUSDBalance = await stabletoken.balanceOf(anAddress)
 
 // Print balances
 console.log(`${anAddress} CELO balance: ${celoBalance.toString()}`)
 console.log(`${anAddress} cUSD balance: ${cUSDBalance.toString()}`)
}
// 6. Import the getAccount function

async function createAccount(){
    // 7. Get your account
    let account = await getAccount()

    // 8. Get the token contract wrappers
    let goldtoken = await kit.contracts.getGoldToken()
    let stabletoken = await kit.contracts.getStableToken()

    // 9. Get your token balances
    let celoBalance = await goldtoken.balanceOf(account.address)
    let cUSDBalance = await stabletoken.balanceOf(account.address)

    // Print your account info
    console.log(`Your account address: ${account.address}`)
    console.log(`Your account CELO balance: ${celoBalance.toString()}`)
    console.log(`Your account cUSD balance: ${cUSDBalance.toString()}`)
}
async function send(){
    // 10. Get your account
    let account = await getAccount()

    // 11. Add your account to ContractKit to sign transactions
    kit.connection.addAccount(account.privateKey)

    // 12. Specify recipient Address
    let anAddress = '0xD86518b29BB52a5DAC5991eACf09481CE4B0710d'

    // 13. Specify an amount to send
    let amount = 100000

    // 14. Get the token contract wrappers    
    let goldtoken = await kit.contracts.getGoldToken()
    let stabletoken = await kit.contracts.getStableToken()

    // 15. Transfer CELO and cUSD from your account to anAddress
    // Specify cUSD as the feeCurrency when sending cUSD
    let celotx = await goldtoken.transfer(anAddress, amount).send({from: account.address})
    let cUSDtx = await stabletoken.transfer(anAddress, amount).send({from: account.address, feeCurrency: stabletoken.address})

    // 16. Wait for the transactions to be processed
    let celoReceipt = await celotx.waitReceipt()
    let cUSDReceipt = await cUSDtx.waitReceipt()

    // 17. Print receipts
    console.log('CELO Transaction receipt: %o', celoReceipt)
    console.log('cUSD Transaction receipt: %o', cUSDReceipt)

    // 18. Get your new balances
    let celoBalance = await goldtoken.balanceOf(account.address)
    let cUSDBalance = await stabletoken.balanceOf(account.address)

    // 19. Print new balance
    console.log(`Your new account CELO balance: ${celoBalance.toString()}`)
    console.log(`Your new account cUSD balance: ${cUSDBalance.toString()}`)
}

