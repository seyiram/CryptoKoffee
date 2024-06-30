import React from "react";
import "./PriceTracker.css";
import { useQuery } from "@tanstack/react-query";
import bitcoinIcon from "../../assets/icons/bitcoin.svg";
import ethereumIcon from "../../assets/icons/ethereum.svg";
import solanaIcon from "../../assets/icons/solana.svg";
import polygonIcon from "../../assets/icons/polygon.svg";
import binanceIcon from "../../assets/icons/binance.svg";
import tronIcon from "../../assets/icons/tron.svg";

const fetchPrices = async () => {
  const response = await fetch(
    "https://cryptokoffee-backend.netlify.app/.netlify/functions/fetchPrices"
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  console.log("response here", response);
  return response.json();
};

const PriceTracker = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["prices"],
    queryFn: fetchPrices,
    staleTime: 1000 * 60 * 60, // 1 hour
    cacheTime: 1000 * 60 * 60 * 24, // 24 hours
  });

  const icons = {
    bitcoin: bitcoinIcon,
    ethereum: ethereumIcon,
    solana: solanaIcon,
    polygon: polygonIcon,
    binancecoin: binanceIcon,
    tron: tronIcon,
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
              <img src={icons[crypto]} className="crypto-icon" />
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
