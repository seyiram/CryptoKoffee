import React, { useMemo } from "react";
import "./PriceTracker.css";
import bitcoinIcon from "../../assets/icons/bitcoin.svg";
import ethereumIcon from "../../assets/icons/ethereum.svg";
import solanaIcon from "../../assets/icons/solana.svg";
import polygonIcon from "../../assets/icons/polygon.svg";
import binanceIcon from "../../assets/icons/binance.svg";
import tronIcon from "../../assets/icons/tron.svg";
import { useCryptoPrices } from "../../hooks/useCryptoPrices";

const CRYPTO_ICONS = {
  bitcoin: bitcoinIcon,
  ethereum: ethereumIcon,
  solana: solanaIcon,
  polygon: polygonIcon,
  binancecoin: binanceIcon,
  tron: tronIcon,
};



const PriceTracker = () => {
  const { data, isLoading, error } = useCryptoPrices();

  const prices = useMemo(() => {
    if (!data?.data) return {};
    
    return {
      bitcoin: data.data.BTC?.quote?.USDT?.price,
      ethereum: data.data.ETH?.quote?.USDT?.price,
      solana: data.data.SOL?.quote?.USDT?.price,
      polygon: data.data.MATIC?.quote?.USDT?.price, // Use MATIC key from API but display as POL
      binancecoin: data.data.BNB?.quote?.USDT?.price,
      tron: data.data.TRX?.quote?.USDT?.price,
    };
  }, [data]);

  const cryptoList = useMemo(() => {
    return Object.keys(prices).map((crypto) => {
      // Map display names - show "Polygon" instead of "Matic" 
      const displayName = crypto === 'polygon' ? 'Polygon' : crypto.charAt(0).toUpperCase() + crypto.slice(1);
      
      // Handle null prices
      let formattedPrice = "Loading...";
      if (prices[crypto] && prices[crypto] !== null) {
        formattedPrice = `$${prices[crypto].toFixed(2)}`;
      } else if (crypto === 'polygon') {
        // Special case for polygon if price is null
        formattedPrice = "Price unavailable";
      }
      
      return {
        key: crypto,
        name: displayName,
        icon: CRYPTO_ICONS[crypto],
        price: prices[crypto],
        formattedPrice: formattedPrice,
      };
    });
  }, [prices]);

  if (isLoading) return (
    <div className="price-tracker-card">
      <h3>Exchange Rates</h3>
      <div className="price-tracker-loading">Loading exchange rates...</div>
    </div>
  );
  
  if (error) return (
    <div className="price-tracker-card">
      <h3>Exchange Rates</h3>
      <div className="price-tracker-error">
        Failed to load exchange rates. Please try again later.
      </div>
    </div>
  );

  return (
    <div className="price-tracker-card">
      <h3>Exchange Rates</h3>
      <div className="price-list">
        {cryptoList.map((crypto) => (
          <div key={crypto.key} className="price-item">
            <div className="crypto-details">
              <img src={crypto.icon} className="crypto-icon" alt={crypto.name} />
              <span className="crypto-name">{crypto.name}</span>
            </div>
            <span className="crypto-price">{crypto.formattedPrice}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(PriceTracker);
