import React, { createContext, useContext, useReducer, useEffect, useRef, useCallback, useMemo } from "react";
import { StrictMode } from "react";
import { ethers } from "ethers";
import { initializeProvider, checkAndSwitchNetwork } from "../utils/interact";
import { toast } from "react-toastify";

const WalletContext = createContext();

const initialState = {
  account: null,
  isConnected: false,
  isConnecting: false,
  network: null,
  provider: null,
  signer: null,
  error: null,
  isLoading: false,
};

const walletReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_CONNECTING":
      return { ...state, isConnecting: action.payload };
    case "SET_ACCOUNT":
      return { 
        ...state, 
        account: action.payload, 
        isConnected: !!action.payload,
        error: null 
      };
    case "SET_NETWORK":
      return { ...state, network: action.payload };
    case "SET_PROVIDER":
      return { ...state, provider: action.payload };
    case "SET_SIGNER":
      return { ...state, signer: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload, isLoading: false };
    case "DISCONNECT":
      return { 
        ...initialState, 
        provider: state.provider // Provider for network detection
      };
    case "RESET":
      return initialState;
    default:
      return state;
  }
};

export const WalletProvider = ({ children }) => {
  const [state, dispatch] = useReducer(walletReducer, initialState);
  const accountRef = useRef(state.account);
  
  // Update ref when account changes
  useEffect(() => {
    accountRef.current = state.account;
  }, [state.account]);

  const detectNetwork = useCallback(async () => {
    try {
      await checkAndSwitchNetwork();
      // Get network info after successful check
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const network = await provider.getNetwork();
        dispatch({ type: "SET_NETWORK", payload: {
          chainId: network.chainId,
          name: network.name,
        }});
      }
    } catch (error) {
      console.error("Network detection error:", error);
      dispatch({ type: "SET_ERROR", payload: error.message });
      throw error; // Re-throw for modal handling
    }
  }, []);

  const disconnect = useCallback(() => {
    dispatch({ type: "DISCONNECT" });
    localStorage.removeItem("account");
    toast.info("Wallet disconnected");
  }, []);

  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      toast.error("Please install MetaMask or another Web3 wallet");
      return;
    }

    dispatch({ type: "SET_CONNECTING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const account = accounts[0];
      dispatch({ type: "SET_ACCOUNT", payload: account });
      localStorage.setItem("account", account);

      await initializeProvider();
      await detectNetwork();

      toast.success("Wallet connected successfully!");
    } catch (error) {
      console.error("Error connecting wallet:", error);
      dispatch({ type: "SET_ERROR", payload: error.message });
      toast.error("Failed to connect wallet");
    } finally {
      dispatch({ type: "SET_CONNECTING", payload: false });
    }
  }, [detectNetwork]);

  // Initialize wallet state on mount
  useEffect(() => {
    const initializeWallet = async () => {
      dispatch({ type: "SET_LOADING", payload: true });
      
      try {
        const storedAccount = localStorage.getItem("account");
        if (storedAccount && window.ethereum) {
          dispatch({ type: "SET_ACCOUNT", payload: storedAccount });
          await initializeProvider();
          await detectNetwork();
        }
      } catch (error) {
        console.error("Error initializing wallet:", error);
        dispatch({ type: "SET_ERROR", payload: error.message });
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    // Add a small delay to ensure context is ready
    setTimeout(initializeWallet, 0);
  }, [detectNetwork]);

  // Set up event listeners for wallet changes
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        disconnect();
      } else if (accounts[0] !== accountRef.current) {
        dispatch({ type: "SET_ACCOUNT", payload: accounts[0] });
        localStorage.setItem("account", accounts[0]);
      }
    };

    const handleChainChanged = async (chainId) => {
      try {
        await detectNetwork();
      } catch (error) {
        console.error("Network change error:", error);
        dispatch({ type: "SET_ERROR", payload: error.message });
      }
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum.removeListener("chainChanged", handleChainChanged);
    };
  }, [detectNetwork, disconnect]);

  const switchNetwork = useCallback(async (networkName) => {
    if (!window.ethereum) return;

    const networkConfigs = {
      polygon: {
        chainId: "0x13882", // 80002 in hex
        chainName: "Polygon Amoy",
        rpcUrls: ["https://rpc-amoy.polygon.technology/"],
        nativeCurrency: {
          name: "POL",
          symbol: "POL",
          decimals: 18,
        },
        blockExplorerUrls: ["https://amoy.polygonscan.com/"],
      },
      arbitrumSepolia: {
        chainId: "0x66eee", // 421614 in hex
        chainName: "Arbitrum Sepolia",
        rpcUrls: ["https://sepolia-rollup.arbitrum.io/rpc"],
        nativeCurrency: {
          name: "ETH",
          symbol: "ETH",
          decimals: 18,
        },
        blockExplorerUrls: ["https://sepolia.arbiscan.io/"],
      },
    };

    const config = networkConfigs[networkName];
    if (!config) {
      dispatch({ type: "SET_ERROR", payload: "Unsupported network" });
      return;
    }

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: config.chainId }],
      });
    } catch (error) {
      if (error.code === 4902) {
        // Network not added to wallet, add it
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [config],
          });
        } catch (addError) {
          console.error("Error adding network:", addError);
          dispatch({ type: "SET_ERROR", payload: addError.message });
        }
      } else {
        console.error("Error switching network:", error);
        dispatch({ type: "SET_ERROR", payload: error.message });
      }
    }
  }, []);

  const value = useMemo(() => ({
    ...state,
    connectWallet,
    disconnect,
    switchNetwork,
    detectNetwork,
  }), [state, connectWallet, disconnect, switchNetwork, detectNetwork]);

  if (!value) {
    console.error("WalletProvider value is null/undefined");
    return null;
  }

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    console.error("useWallet called outside of WalletProvider. Stack trace:", new Error().stack);
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};

export default WalletContext;