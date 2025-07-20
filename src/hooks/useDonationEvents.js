import { useQuery } from "@tanstack/react-query";
import { fetchDonationEventsFromSubgraph } from "../graphql/service";
import { useCallback, useMemo } from "react";

export const useDonationEvents = (walletAddress, options = {}) => {
  const queryFn = useCallback(async () => {
    if (!walletAddress) {
      return [];
    }
    
    try {
      const donations = await fetchDonationEventsFromSubgraph(walletAddress);
      return donations || [];
    } catch (error) {
      console.error('Error in useDonationEvents:', error);
      return [];
    }
  }, [walletAddress]);

  const queryOptions = useMemo(() => ({
    queryKey: ["donationEvents", walletAddress],
    queryFn,
    enabled: !!walletAddress,
    staleTime: 2 * 60 * 1000, // 2 minutes (shorter for real-time data)
    cacheTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true, // Refetch when window regains focus
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
    ...options,
  }), [walletAddress, queryFn, options]);

  return useQuery(queryOptions);
};

export const useDonationEventsForProfile = (profile, options = {}) => {
  const walletAddress = useMemo(() => profile?.wallet_address, [profile?.wallet_address]);
  
  const queryFn = useCallback(async () => {
    if (!walletAddress) {
      return [];
    }
    
    try {
      const donations = await fetchDonationEventsFromSubgraph(walletAddress);
      return donations || [];
    } catch (error) {
      console.error('Error in useDonationEventsForProfile:', error);
      return [];
    }
  }, [walletAddress]);

  const queryOptions = useMemo(() => ({
    queryKey: ["donationEvents", "profile", walletAddress],
    queryFn,
    enabled: !!walletAddress,
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
    refetchInterval: 30 * 1000, // Refetch every 30 seconds for donations
    ...options,
  }), [walletAddress, queryFn, options]);

  return useQuery(queryOptions);
};