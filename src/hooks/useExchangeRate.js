import { useQuery } from '@tanstack/react-query';

const fetchExchangeRate = async (chainId) => {
    let coinCode = "ETH";
  
    switch (Number(chainId)) {
      case 137: // Polygon Mainnet
      case 80001: // Polygon Mumbai Testnet
      case 80002: // Polygon Testnet ( 80002 is a testnet)
        coinCode = "MATIC";
        break;
      default:
        coinCode = "ETH";
    }
  
    const response = await fetch(`https://api.livecoinwatch.com/coins/list`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": import.meta.env.VITE_LIVECOINWATCH_API_KEY,
      },
      body: JSON.stringify({
        currency: "USD",
        sort: "rank",
        order: "ascending",
        offset: 0,
        meta: false,
      }),
    });
  
    const data = await response.json();
    const coin = data.find((coin) => coin.code === coinCode);
    if (coin) {
      return coin.rate;
    } else {
      throw new Error("Coin not found in response");
    }
  };
  
  const useExchangeRate = (chainId) => {
    // Convert BigInt to string or number if necessary
    const chainIdStr = typeof chainId === 'bigint' ? chainId.toString() : chainId;
  
    return useQuery({
      queryKey: ['exchangeRate', chainIdStr],
      queryFn: () => fetchExchangeRate(chainIdStr),
      enabled: !!chainIdStr, // Only run the query if chainId is available
    });
  };
  
  export default useExchangeRate;