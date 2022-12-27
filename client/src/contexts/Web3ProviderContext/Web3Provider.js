import React, { useState, useEffect } from "react";
import CryptoKoffeeContract from "../../contracts/CryptoKoffee.json";
import getWeb3 from "./getWeb3";



const Web3Provider = () => {
  const [walletInfo, setWalletInfo] = useState({name: "", link: "", walletAddress: "", walletBalance: "", numOfDonations: ""})
  const [web3, setWeb3] = useState(null)
  const [accounts, setAccounts] = useState(null)
  const [contract, setContract] = useState(null)
  const [loading, setLoading] =useState(false)

  useEffect(() => {
    connectToProvider()

  }, []);

  useEffect(() => {
    runExample();
  }, [contract]);

  const connectToProvider = async () => {
    setLoading(true)
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = CryptoKoffeeContract.networks[networkId];
      const contractInstance = new web3.eth.Contract(
        CryptoKoffeeContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
      // setWeb3(web3)
      setWeb3(web3)
      setAccounts(accounts)
      setContract(contractInstance)

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      // this.setState({ web3, accounts, contract: instance }, this.runExample);
      
      console.log(contractInstance)
      console.log(web3)
      console.log(accounts)
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  }
  const runExample = async () => {
    setLoading(true)
    // const { accounts, contract } = this.state;
    // console.log(contract.methods)
    // Stores a given value, 5 by default.
    await contract.methods.createWallet("walletName1", "Link").send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.getWallet().call();

    // Update state with the result.
    setWalletInfo({name: response.name, link: response.link, 
      walletAddress: response.walletAddress, walletBalance: response.walletBalance.valueOf(), 
      numOfDonations: response.numOfDonations});
    setLoading(false)
  };

  return (
   <div>
    {
      loading  ? <div>Loading Web3, accounts, and contract...</div> 
    : 
    <div className="App">
        <h1>Yeeaayy CryptoKoffee is Here!</h1>
        <p> Your wallet has been created and ready to accept donations.</p>
       
        <h2>Wallet created details</h2>
      
        <div>Wallet Identifier: {walletInfo.name}</div>
        <div>Wallet Link hashed: {walletInfo.link}</div>
        <div>Wallet Address: {walletInfo.walletAddress}</div>
        <div>Donation Balance: {walletInfo.walletBalance}</div>
        <div>Number of Donations: {walletInfo.numOfDonations}</div>
     </div>
    } 
    </div>
  );
}

export default Web3Provider;

