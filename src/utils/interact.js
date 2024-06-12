import { ethers } from "ethers";
import MyContract from "../contracts/CryptoKoffee.json";

const contractAddress = "0x144b6c5671a84d32f390cab635502e3dfe244cc3"; // contract address

export const getContract = () => {
    // Connect to the Polygon Amoy testnet using the provided RPC URL
    const provider = new ethers.providers.JsonRpcProvider("https://rpc-amoy.polygon.technology");
    const signer = provider.getSigner();
    return new ethers.Contract(contractAddress, MyContract, signer);
};

export const getMessage = async () => {
    const contract = getContract();
    return await contract.message();
};

export const setMessage = async (newMessage) => {
    const contract = getContract();
    const transaction = await contract.setMessage(newMessage);
    await transaction.wait();
};


export const getBalance = async () => {
    const contract = getContract();
    const balance = await contract.getBalance();
    return ethers.utils.formatEther(balance); // Convert from wei to ether
};

export const getDonationsThisWeek = async () => {
    const contract = getContract();
    const donations = await contract.getDonationsThisWeek();
    return ethers.utils.formatEther(donations); // Convert from wei to ether
};

export const getDonationsThisMonth = async () => {
    const contract = getContract();
    const donations = await contract.getDonationsThisMonth();
    return ethers.utils.formatEther(donations); // Convert from wei to ether
};

export const getDonationHistory = async () => {
    const contract = getContract();
    const history = await contract.getDonationHistory();
    return history.map(donation => ({
        name: "Date Placeholder", // Replace with actual date handling if needed
        donation: ethers.utils.formatEther(donation)
    }));
};