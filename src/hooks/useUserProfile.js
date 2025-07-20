import { useQuery } from "@tanstack/react-query";
import { getUserProfile, getUserProfileByCustomUrl } from "../utils/aws";

export const useUserProfile = (userId, options = {}) => {
  return useQuery({
    queryKey: ["userProfile", userId],
    queryFn: () => getUserProfile(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    ...options,
  });
};

export const useUserProfileByCustomUrl = (customUrl, options = {}) => {
  return useQuery({
    queryKey: ["userProfileByCustomUrl", customUrl],
    queryFn: () => getUserProfileByCustomUrl(customUrl),
    enabled: !!customUrl,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    ...options,
  });
};