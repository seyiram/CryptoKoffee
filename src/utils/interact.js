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

  console.log("Network Debug Info:", {
    chainId: chainId.toString(),
    polygonChainId: networkConfigs.polygonAmoy.chainId,
    arbitrumChainId: networkConfigs.arbitrumSepolia.chainId,
    networkName: network.name
  });

  if (chainId === BigInt(networkConfigs.polygonAmoy.chainId)) {
    currentNetwork = "polygon";
    console.log("Using Polygon network");
    return networkConfigs.polygonAmoy;
  } else if (chainId === BigInt(networkConfigs.arbitrumSepolia.chainId)) {
    currentNetwork = "arbitrumSepolia";
    console.log("Using Arbitrum Sepolia network");
    return networkConfigs.arbitrumSepolia;
  } else {
    console.error("Unsupported network detected:", {
      chainId: chainId.toString(),
      supportedNetworks: {
        polygonAmoy: networkConfigs.polygonAmoy.chainId,
        arbitrumSepolia: networkConfigs.arbitrumSepolia.chainId
      }
    });
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
  
  console.log("Contract Debug Info:", {
    currentNetwork,
    contractAddress,
    hasAbi: !!CryptoKoffee.abi,
    hasSigner: !!signer,
    signerAddress: signer ? await signer.getAddress() : null
  });
  
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
    // DonationEvent(uint amount, address indexed donor, uint indexed timeStamp, address indexed recipient)
    // We want to filter for events where this wallet is either donor OR recipient
    const donationFilterAsRecipient = contract.filters.DonationEvent(
      null,      // amount (any)
      null,      // donor (any) 
      null,      // timeStamp (any)
      walletAddress  // recipient (specific wallet)
    );
    
    const donationFilterAsDonor = contract.filters.DonationEvent(
      null,      // amount (any)
      walletAddress,  // donor (specific wallet)
      null,      // timeStamp (any)
      null       // recipient (any)
    );

    // Fetch the latest block number to set a more specific range
    const latestBlock = await provider.getBlockNumber();
    const fromBlock = BlockRangeCalculator.calculate(latestBlock);

    // Use chunked requests to avoid timeouts
    const chunks = BlockRangeCalculator.calculateChunks(fromBlock, latestBlock);
    const allEvents = [];

    for (const chunk of chunks) {
      try {
        // Fetch events where wallet is recipient
        const eventsAsRecipient = await contract.queryFilter(
          donationFilterAsRecipient,
          chunk.fromBlock,
          chunk.toBlock
        );
        
        // Fetch events where wallet is donor
        const eventsAsDonor = await contract.queryFilter(
          donationFilterAsDonor,
          chunk.fromBlock,
          chunk.toBlock
        );
        
        console.log(`Chunk ${chunk.fromBlock}-${chunk.toBlock}: Found ${eventsAsRecipient.length} as recipient, ${eventsAsDonor.length} as donor`);
        allEvents.push(...eventsAsRecipient, ...eventsAsDonor);
      } catch (chunkError) {
        console.warn(`Failed to fetch chunk ${chunk.fromBlock}-${chunk.toBlock}:`, chunkError);
        // Continue with other chunks even if one fails
      }
    }

    console.log(`Total events found for wallet ${walletAddress}: ${allEvents.length}`);

    // Debug raw event data
    allEvents.forEach((event, index) => {
      console.log(`Raw Event ${index}:`, {
        amountWei: event.args.amount.toString(),
        amountETH: ethers.formatEther(event.args.amount),
        donor: event.args.donor,
        recipient: event.args.recipient,
        timestamp: event.args.timeStamp.toString()
      });
    });

    // Format the events
    const formattedEvents = allEvents.map((event) => ({
      amount: ethers.formatEther(event.args.amount),
      donor: event.args.donor,
      timeStamp: new Date(Number(event.args.timeStamp.toString()) * 1000),
      recipient: event.args.recipient,
    }));

    console.log("Formatted events after conversion:", formattedEvents);

    // Filter for events where wallet is either recipient OR donor (case-insensitive)
    const filteredEvents = formattedEvents.filter(
      (event) => 
        event.recipient.toLowerCase() === walletAddress.toLowerCase() ||
        event.donor.toLowerCase() === walletAddress.toLowerCase()
    );

    console.log("Filtered events after wallet filtering:", filteredEvents);

    callback(filteredEvents); // Callback with the data
  } catch (error) {
    console.error("Error fetching donation events for wallet:", error);
    callback([]);
  }
}




export async function fetchPaymentEvents(callback) {
  try {
    const contract = await getContract();
    const networkConfig = await getNetworkConfig();
    const provider = new ethers.JsonRpcProvider(networkConfig.rpcUrl);
    
    const paymentFilter = contract.filters.PaymentEvent();
    
    // Fetch the latest block number to set a more specific range
    const latestBlock = await provider.getBlockNumber();
    const fromBlock = BlockRangeCalculator.calculate(latestBlock);

    // Use chunked requests to avoid timeouts
    const chunks = BlockRangeCalculator.calculateChunks(fromBlock, latestBlock);
    const allEvents = [];

    for (const chunk of chunks) {
      try {
        const events = await contract.queryFilter(
          paymentFilter,
          chunk.fromBlock,
          chunk.toBlock
        );
        allEvents.push(...events);
      } catch (chunkError) {
        console.warn(`Failed to fetch payment chunk ${chunk.fromBlock}-${chunk.toBlock}:`, chunkError);
        // Continue with other chunks even if one fails
      }
    }

    const processedEvents = allEvents.map((event) => ({
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
    callback([]);
  }
}

export const fetchPaymentEventsForWallet = async (walletAddress, callback) => {
  try {
    const contract = await getContract();
    const networkConfig = await getNetworkConfig();
    const provider = new ethers.JsonRpcProvider(networkConfig.rpcUrl);
    
    console.log(`Fetching payment events for wallet: ${walletAddress}`);

    const paymentFilter = contract.filters.PaymentEvent();

    // Fetch the latest block number to set a more specific range
    const latestBlock = await provider.getBlockNumber();
    const fromBlock = BlockRangeCalculator.calculate(latestBlock);

    // Use chunked requests to avoid timeouts
    const chunks = BlockRangeCalculator.calculateChunks(fromBlock, latestBlock);
    const allEvents = [];

    for (const chunk of chunks) {
      try {
        const events = await contract.queryFilter(
          paymentFilter,
          chunk.fromBlock,
          chunk.toBlock
        );
        allEvents.push(...events);
      } catch (chunkError) {
        console.warn(`Failed to fetch payment chunk ${chunk.fromBlock}-${chunk.toBlock}:`, chunkError);
        // Continue with other chunks even if one fails
      }
    }

    const filteredEvents = allEvents.filter(
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
  try {
    // Check if user is connected
    if (!window.ethereum) {
      console.warn("No wallet provider found");
      return null;
    }

    console.log("Getting wallet info...");
    const contract = await getContract();
    
    // Check if the contract exists and has the getWallet method
    if (!contract || !contract.getWallet) {
      console.error("Contract or getWallet method not found");
      return null;
    }

    // Get the current account
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    if (!accounts || accounts.length === 0) {
      console.warn("No connected accounts found");
      return null;
    }

    console.log("Calling contract.getWallet()...");
    
    // Try to check if the contract is deployed by calling a simple method first
    try {
      const owner = await contract.owner();
      console.log("Contract owner:", owner);
    } catch (ownerError) {
      console.error("Failed to get contract owner - contract may not be deployed:", ownerError);
      return null;
    }

    const walletInfo = await contract.getWallet();

    const [walletAddress, currentBalance, numOfDonations] = walletInfo;

    console.log("Wallet info received:", {
      walletAddress,
      currentBalance: currentBalance.toString(),
      numOfDonations: numOfDonations.toString()
    });

    if (
      !walletAddress ||
      walletAddress === "0x0000000000000000000000000000000000000000"
    ) {
      console.warn("Wallet not created yet or returned zero address");
      return null;
    }

    return {
      walletAddress,
      currentBalance: ethers.formatEther(currentBalance),
      numOfDonations: numOfDonations.toString(),
    };
  } catch (error) {
    console.error("Error fetching wallet info", error);
    
    // Check if it's a revert error
    if (error.code === "CALL_EXCEPTION") {
      console.warn("Contract call failed - wallet may not be created yet or contract method doesn't exist");
      return null;
    }
    
    // For other errors, also return null gracefully
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
