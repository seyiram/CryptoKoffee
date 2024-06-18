import React from 'react';
import "./PriceTracker.css";
import {
  FaBitcoin,
  FaEthereum,
  FaCoins,
  FaGem,
  FaChartLine,
  FaTruckLoading,
} from "react-icons/fa";
import { SiSolana, SiPolygon } from "react-icons/si";
import { BsCurrencyBitcoin } from "react-icons/bs";
import { useQuery } from '@tanstack/react-query';

const fetchPrices = async () => {
  const apiKey = import.meta.env.VITE_COINMARKETCAP_API_KEY;
  const symbols = "BTC,ETH,SOL,MATIC,BNB,TRX";
  const convert = "USDT";

  const url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${symbols}&convert=${convert}`;

  const response = await fetch(url, {
    headers: {
      "X-CMC_PRO_API_KEY": apiKey,
    },
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};

const PriceTracker = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['prices'],
    queryFn: fetchPrices,
    staleTime: 1000 * 60 * 60, // 1 hour
    cacheTime: 1000 * 60 * 60 * 24, // 24 hours
  });

  const icons = {
    bitcoin: <FaBitcoin />,
    ethereum: <FaEthereum />,
    solana: <SiSolana />,
    polygon: <SiPolygon />,
    binancecoin: <FaCoins />,
    tron: <FaTruckLoading />,
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const prices = {
    bitcoin: data.data.BTC.quote.USDT.price,
    ethereum: data.data.ETH.quote.USDT.price,
    solana: data.data.SOL.quote.USDT.price,
    polygon: data.data.MATIC.quote.USDT.price,
    binancecoin: data.data.BNB.quote.USDT.price,
    tron: data.data.TRX.quote.USDT.price,
  };

  return (
    <div className="price-tracker-card">
      <h3>Exchange Rates</h3>
      <div className="price-list">
        {Object.keys(prices).map((crypto) => (
          <div key={crypto} className="price-item">
            <div className="crypto-details">
              <span className="crypto-icon">{icons[crypto]}</span>
              <span className="crypto-name">
                {crypto.charAt(0).toUpperCase() + crypto.slice(1)}
              </span>
            </div>
            <span className="crypto-price">
              {prices[crypto] ? `$${prices[crypto].toFixed(2)}` : "Loading..."}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PriceTracker;