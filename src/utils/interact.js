import { ethers } from "ethers";
import CryptoKoffee from "../contracts/CryptoKoffee.json";

const contractAddress = "0xaf8ccd9dc04764f0ab0f07cb96a69098c88dbf2c";

let provider;
let signer;

export const initializeProvider = async () => {
  if (window.ethereum) {
    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
  } else {
    throw new Error("Ethereum provider not found");
  }
};

const ensureProviderInitialized = async () => {
  if (!provider || !signer) {
    await initializeProvider();
  }
};

export const getContract = async () => {
  await ensureProviderInitialized();
  return new ethers.Contract(contractAddress, CryptoKoffee.abi, signer);
};

export const getBalance = async () => {
  const contract = await getContract();
  const balance = await contract.getDonationBalance();
  if (!balance) {
    throw new Error("Invalid balance value");
  }
  return ethers.formatEther(balance); // Convert from wei to ether
};

export async function fetchDonationEvents(callback) {
  try {
    const contract = await getContract();
    const filter = contract.filters.DonationEvent(null, null, null);
    const events = await contract.queryFilter(filter, 0, "latest");

    const formattedEvents = events.map((event) => ({
      amount: ethers.formatEther(event.args.amount),
      donor: event.args.donor,
      timeStamp: new Date(Number(event.args.timeStamp.toString()) * 1000),
      recipient: event.args.recipient,
    }));

    console.log("Donation events:", formattedEvents);
    callback(formattedEvents); // Callback with the data
  } catch (error) {
    console.error("Error fetching donation events:", error);
  }
}

export async function fetchDonationEventsForWallet(walletAddress, callback) {
  try {
    const contract = await getContract();
    const donationFilter = contract.filters.DonationEvent(
      null,
      walletAddress,
      null,
    );
    const events = await contract.queryFilter(donationFilter, 0, "latest");

    const formattedEvents = events.map((event) => ({
      amount: ethers.formatEther(event.args.amount),
      donor: event.args.donor,
      timeStamp: new Date(Number(event.args.timeStamp.toString()) * 1000),
      recipient: event.args.recipient,
    }));

    console.log("Donation events for wallet:", formattedEvents);
    callback(formattedEvents); // Callback with the data
  } catch (error) {
    console.error("Error fetching donation events for wallet:", error);
    callback([]);
  }
}

export async function fetchPaymentEvents(callback) {
  try {
    const contract = await getContract();
    const paymentFilter = contract.filters.PaymentEvent();
    const events = await contract.queryFilter(paymentFilter, 0, "latest");

    const processedEvents = events.map((event) => ({
      amount: ethers.formatEther(event.args.amount),
      sender: event.args.sender,
      recipient: event.args.recipient,
      description: event.args.description,
      timeStamp: new Date(Number(event.args.timeStamp.toString()) * 1000),
    }));

    console.log("Payment events:", processedEvents);
    callback(processedEvents);
  } catch (error) {
    console.error("Error fetching payment events:", error);
  }
}

export const fetchPaymentEventsForWallet = async (walletAddress, callback) => {
  const contract = await getContract();
  try {
    console.log(`Fetching payment events for wallet: ${walletAddress}`);
    const paymentFilterSender = contract.filters.PaymentEvent(
      null,
      null,
      walletAddress
    );
    const paymentFilterRecipient = contract.filters.PaymentEvent(
      null,
      walletAddress,
      null
    );

    const eventsSender = await contract.queryFilter(
      paymentFilterSender,
      0,
      "latest"
    );
    const eventsRecipient = await contract.queryFilter(
      paymentFilterRecipient,
      0,
      "latest"
    );

    const events = [...eventsSender, ...eventsRecipient];

    const formattedEvents = events.map((event) => ({
      amount: ethers.formatEther(event.args.amount),
      sender: event.args.sender,
      recipient: event.args.recipient,
      description: event.args.description,
      timeStamp: new Date(Number(event.args.timeStamp.toString()) * 1000),
    }));

    console.log("Payment events for wallet:", formattedEvents);
    callback(formattedEvents);
  } catch (error) {
    console.error("Error fetching payment events for wallet:", error);
    callback([]);
  }
};

export const createWallet = async () => {
  const contract = await getContract();
  const transaction = await contract.createWallet();
  await transaction.wait();
  return transaction;
};

export const donate = async (donationAddress, amount) => {
  const contract = await getContract();
  const transaction = await contract.donate(donationAddress, {
    value: ethers.parseEther(amount),
  });
  await transaction.wait();
  return transaction;
};

export const withdrawFunds = async (toAddress, amount) => {
  const contract = await getContract();
  const transaction = await contract.withdrawFunds(
    toAddress,
    ethers.parseEther(amount)
  );
  await transaction.wait();
  return transaction;
};



export const getWallet = async () => {
  const contract = await getContract();
  try {
    const walletInfo = await contract.getWallet();

    const [walletAddress, currentBalance, numOfDonations] = walletInfo;

    if (
      !walletAddress ||
      walletAddress === "0x0000000000000000000000000000000000000000"
    ) {
      return null;
    }

    return {
      walletAddress,
      currentBalance: ethers.formatEther(currentBalance),
      numOfDonations: numOfDonations.toString(),
    };
  } catch (error) {
    console.error("Error fetching wallet info", error);
    return null;
  }
};

export const transferOwnership = async (newOwner) => {
  const contract = await getContract();
  const transaction = await contract.transferOwnership(newOwner);
  await transaction.wait();
  return transaction;
};

export const hashString = async (string) => {
  const contract = await getContract();
  const hash = await contract.hash(string);
  return hash;
};

export const data = {}


export const getNetworkType = async (walletAddress) => {
  // Assuming you have a provider set up
  const provider = new ethers.JsonRpcProvider('https://rpc-amoy.polygon.technology/');

  const network = await provider.getNetwork();
  switch (network.chainId) {
    case 1: // Ethereum Mainnet
      return "ETH";
    case 137: // Polygon Mainnet
      return "MATIC";
    // Add more cases as needed
    default:
      return "ETH"; // Default to ETH if unknown
  }
};
