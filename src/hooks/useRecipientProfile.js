import { useQuery } from "@tanstack/react-query";
import { fetchRecipientProfile } from "../graphql/service";
import { useCallback, useMemo } from "react";

export const useRecipientProfile = (walletAddress, options = {}) => {
  const queryFn = useCallback(async () => {
    if (!walletAddress) {
      return null;
    }
    
    try {
      const profile = await fetchRecipientProfile(walletAddress);
      return profile;
    } catch (error) {
      console.error('Error in useRecipientProfile:', error);
      return null;
    }
  }, [walletAddress]);

  const queryOptions = useMemo(() => ({
    queryKey: ["recipientProfile", walletAddress],
    queryFn,
    enabled: !!walletAddress,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false, // Profile data changes less frequently
    refetchInterval: 60 * 1000, // Refetch every minute
    ...options,
  }), [walletAddress, queryFn, options]);

  return useQuery(queryOptions);
};