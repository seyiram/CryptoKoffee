import React, { useEffect, useState } from 'react';
import './PriceTracker.css';

const PriceTracker = () => {
  const [prices, setPrices] = useState({
    bitcoin: null,
    ethereum: null,
    solana: null,
    polygon: null,
    binancecoin: null,
    tron: null,
  });

  useEffect(() => {
    // Fetch cryptocurrency prices from an API
    const fetchPrices = async () => {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,polygon,binancecoin,tron&vs_currencies=usd');
      const data = await response.json();
      setPrices({
        bitcoin: data.bitcoin.usd,
        ethereum: data.ethereum.usd,
        solana: data.solana.usd,
        polygon: data.polygon.usd,
        binancecoin: data.binancecoin.usd,
        tron: data.tron.usd,
      });
    };
    fetchPrices();
  }, []);

  return (
    <div className="price-tracker-card">
      <h3>Exchange Rates</h3>
      <div className="price-list">
        {Object.keys(prices).map((crypto) => (
          <div key={crypto} className="price-item">
            <span className="crypto-name">{crypto.charAt(0).toUpperCase() + crypto.slice(1)}</span>
            <span className="crypto-price">
              {prices[crypto] ? `$${prices[crypto].toFixed(2)}` : 'Loading...'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PriceTracker;
