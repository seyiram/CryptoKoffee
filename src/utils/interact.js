import { ethers } from "ethers";
import CryptoKoffee from "../contracts/CryptoKoffee.json";
import { BlockRangeCalculator } from "./blockRangeCalculator";

const contractAddressPolygon = "0xc180e9ab4118b3526c3146001e39246d00ad663c";
const contractAddressArbitrum = "0x798FD171C49BBf345e50A512A638BC8B969153e9";

const SUPPORTED_NETWORKS = ["polygon", "arbitrumSepolia"];

const networkConfigs = {
  polygonAmoy: {
    chainId: 80002,
    rpcUrl: "https://rpc-amoy.polygon.technology/",
  },
  arbitrumSepolia: {
    chainId: 421614,
    rpcUrl: "https://sepolia-rollup.arbitrum.io/rpc",
  },
};

let provider;

let signer;
let currentNetwork;

const getNetworkConfig = async () => {
  if (!provider) {
    await initializeProvider();
  }
  const network = await provider.getNetwork();
  const chainId = network.chainId;

  if (chainId === BigInt(networkConfigs.polygonAmoy.chainId)) {
    currentNetwork = "polygon";
    return networkConfigs.polygonAmoy;
  } else if (chainId === BigInt(networkConfigs.arbitrumSepolia.chainId)) {
    currentNetwork = "arbitrumSepolia";
    return networkConfigs.arbitrumSepolia;
  } else {
    throw new Error(
      "Unsupported network. Please switch to Polygon or Arbitrum."
    );
  }
};

export const initializeProvider = async () => {
  if (window.ethereum) {
    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
    try {
      await getNetworkConfig();
    } catch (error) {
      console.error("Network error: ", error);
      throw error;
    }
  } else {
    throw new Error("Ethereum provider not found");
  }
};

export const checkAndSwitchNetwork = async () => {
  try {
    await getNetworkConfig();
  } catch (error) {
    if (error.message.includes("Unsupported network")) {
      // Throw an error to indicate that an unsupported network is detected
      throw new Error("Unsupported network");
    } else {
      throw error; // Re-throw any other errors to be handled by the calling component
    }
  }
};

const ensureProviderInitialized = async () => {
  if (!provider || !signer) {
    await initializeProvider();
  }
  await checkAndSwitchNetwork();
};

export const getContract = async () => {
  await ensureProviderInitialized();
  const contractAddress =
    currentNetwork === "polygon"
      ? contractAddressPolygon
      : contractAddressArbitrum;
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

export const getNetworkType = async () => {
  const networkConfig = await getNetworkConfig();
  return networkConfig.chainId;
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
    const networkConfig = await getNetworkConfig();
    const provider = new ethers.JsonRpcProvider(networkConfig.rpcUrl);

    // Ensure the wallet address is correctly formatted
    if (!ethers.isAddress(walletAddress)) {
      throw new Error("Invalid wallet address");
    }

    // Create the filter for DonationEvent
    const donationFilter = contract.filters.DonationEvent(
      null,
      null,
      null,
      walletAddress
    );

    // Fetch the latest block number to set a more specific range
    const latestBlock = await provider.getBlockNumber();
    const fromBlock = BlockRangeCalculator.calculate(latestBlock);

    // Query the events using the filter
    const events = await contract.queryFilter(
      donationFilter,
      fromBlock,
      "latest"
    );

    // Format the events
    const formattedEvents = events.map((event) => ({
      amount: ethers.formatEther(event.args.amount),
      donor: event.args.donor,
      timeStamp: new Date(Number(event.args.timeStamp.toString()) * 1000),
      recipient: event.args.recipient,
    }));

    const filteredEvents = formattedEvents.filter(
      (event) => event.recipient === walletAddress
    );

    callback(filteredEvents); // Callback with the data
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

    console.warn("Payment events from interact.js:", events);

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

    const paymentFilter = contract.filters.PaymentEvent();

    const events = await contract.queryFilter(paymentFilter, 0, "latest");

    const filteredEvents = events.filter(
      (event) =>
        event.args.sender.toLowerCase() === walletAddress.toLowerCase() ||
        event.args.recipient.toLowerCase() === walletAddress.toLowerCase()
    );

    const formattedEvents = filteredEvents.map((event) => ({
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

  try {
    const transaction = await contract.createWallet({});

    const receipt = await transaction.wait();

    return receipt;
  } catch (error) {
    console.error("Error creating wallet:", error);
    throw error;
  }
};

export const donate = async (donationAddress, amount) => {
  try {
    await ensureProviderInitialized();
    const contract = await getContract();

    console.log("Donation Address:", donationAddress);
    console.log("Amount (Wei):", amount.toString());

    // Get the current signer
    const currentSigner = await provider.getSigner();
    const signerAddress = await currentSigner.getAddress();

    // Check balance
    const balance = await provider.getBalance(signerAddress);

    console.log("Balance (Wei):", balance.toString());

    if (balance < amount) {
      throw new Error("Insufficient funds");
    }

    const tx = await contract.donate(donationAddress, {
      value: amount,
    });

    const receipt = await tx.wait();
    console.log("Transaction confirmed:", receipt.transactionHash);
    return receipt;
  } catch (error) {
    console.error("Error donating:", error);

    if (error.code === "ACTION_REJECTED") {
      throw new Error("Transaction rejected by user");
    } else if (error.message.includes("insufficient funds")) {
      throw new Error("Insufficient funds");
    } else {
      throw error;
    }
  }
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

export const data = {};

// export const getNetworkType = async (walletAddress) => {
//   // Assuming you have a provider set up
//   const provider = new ethers.JsonRpcProvider(
//     "https://rpc-amoy.polygon.technology/"
//   );

//   const network = await provider.getNetwork();
//   return network.chainId; // Return the chain ID
// };
