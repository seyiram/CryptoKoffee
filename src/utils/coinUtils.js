export const getCoinCodeByChainId = (chainId) => {
    const chainNumber = Number(chainId);
  switch (chainNumber) {
    case 137: // Polygon Mainnet
    case 80001: // Polygon Mumbai Testnet
    case 80002: // Polygon Testnet
      return "MATIC";
    default:
      return "ETH";
  }
};
