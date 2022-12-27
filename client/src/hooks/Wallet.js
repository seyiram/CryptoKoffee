import Web3Modal from "web3modal";
import Web3 from "web3";


import WalletConnectProvider from "@walletconnect/web3-provider";
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';
import Web3ProviderConnect from "../contexts/Web3ProviderContext/Web3ProviderConnect";
import CryptoKoffeeContract from "../contracts/CryptoKoffee.json";





const providerOptions = {
    /* See Provider Options Section */
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        infuraId: "INFURA_ID" // required
      }
    },
    coinbasewallet: {
      package: CoinbaseWalletSDK, // Required
      options: {
        appName: "My Awesome App", // Required
        infuraId: "INFURA_ID", // Required
        rpc: "", // Optional if `infuraId` is provided; otherwise it's required
        chainId: 1, // Optional. It defaults to 1 if not provided
        darkMode: false // Optional. Use dark theme, defaults to false
      }
    }
  };

  export const web3Modal = new Web3Modal({
    network: "testnet", // optional
    cacheProvider: true, // optional
    providerOptions // required
  });


  export const connectToWallet = async () => {
    const provider = await web3Modal.connect();
    const web3 = new Web3(provider);
    console.log(await web3.eth.getAccounts())

  };