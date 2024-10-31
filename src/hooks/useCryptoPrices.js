import { useQuery } from "@tanstack/react-query";

const fetchPrices = async () => {
  const response = await fetch(
    "https://cryptokoffee-backend.netlify.app/.netlify/functions/fetchPrices"
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export const useCryptoPrices = () => {
  return useQuery({
    queryKey: ["prices"],
    queryFn: fetchPrices,
    staleTime: 1000 * 60 * 60, // 1 hour
    cacheTime: 1000 * 60 * 60 * 24, // 24 hours
  });
};