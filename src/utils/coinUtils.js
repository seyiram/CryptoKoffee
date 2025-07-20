export const getCoinCodeByChainId = (chainId) => {
  const chainNumber = Number(chainId);
  switch (chainNumber) {
    case 137: // Polygon Mainnet
    case 80001: // Polygon Mumbai Testnet
    case 80002: // Polygon Amoy
      return "POL";
    case 421614: // Arbitrum Sepolia
    case 42161: // Arbitrum One
    case 421613: // Arbitrum Goerli
    case 1: // Ethereum Mainnet
    case 11155111: // Sepolia Testnet
    case 5: // Goerli Testnet
      return "ETH";
    default:
      return "ETH";
  }
};

// Alias for better naming consistency across components
export const getNetworkCurrency = (chainId) => {
  return getCoinCodeByChainId(chainId);
};
