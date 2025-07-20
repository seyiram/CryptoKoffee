import { useQuery } from "@tanstack/react-query";
import { fetchRecipientProfile } from "../graphql/service";
import { useCallback, useMemo } from "react";

export const useDonorSummaries = (walletAddress, options = {}) => {
  const queryFn = useCallback(async () => {
    if (!walletAddress) {
      return [];
    }
    
    try {
      const profile = await fetchRecipientProfile(walletAddress);
      return profile?.topDonors || [];
    } catch (error) {
      console.error('Error in useDonorSummaries:', error);
      return [];
    }
  }, [walletAddress]);

  const queryOptions = useMemo(() => ({
    queryKey: ["donorSummaries", walletAddress],
    queryFn,
    enabled: !!walletAddress,
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
    ...options,
  }), [walletAddress, queryFn, options]);

  return useQuery(queryOptions);
};