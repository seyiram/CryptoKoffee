import { ethers } from 'ethers';
import { graphqlClient } from './client.js';
import { 
  GET_WALLET_DONATIONS, 
  GET_RECIPIENT_PROFILE, 
  GET_DONOR_PROFILE,
  GET_RECENT_DONATIONS,
  GET_DAILY_STATS,
  GET_WALLET_PAYMENTS,
  GET_RECENT_PAYMENTS
} from './queries.js';

// Convert wei to ETH for display
const formatAmount = (weiAmount) => {
  return ethers.formatEther(weiAmount);
};

// Convert timestamp to Date object
const formatTimestamp = (timestamp) => {
  return new Date(Number(timestamp) * 1000);
};

// Get donation events for a specific wallet
export const fetchDonationEventsFromSubgraph = async (walletAddress) => {
  try {
    const variables = {
      walletAddress: walletAddress.toLowerCase()
    };

    const data = await graphqlClient.request(GET_WALLET_DONATIONS, variables);
    
    // Combine sent and received donations
    const allDonations = [
      ...data.sentDonations.map(donation => ({
        ...donation,
        amount: formatAmount(donation.amount),
        timeStamp: formatTimestamp(donation.timestamp),
        type: 'sent'
      })),
      ...data.receivedDonations.map(donation => ({
        ...donation,
        amount: formatAmount(donation.amount),
        timeStamp: formatTimestamp(donation.timestamp),
        type: 'received'
      }))
    ];

    // Sort by timestamp descending
    allDonations.sort((a, b) => b.timeStamp - a.timeStamp);

    console.log('Subgraph donation events:', allDonations);
    return allDonations;
  } catch (error) {
    console.error('Error fetching donations from subgraph:', error);
    return [];
  }
};

// Get recipient profile data
export const fetchRecipientProfile = async (walletAddress) => {
  try {
    const variables = {
      address: walletAddress.toLowerCase()
    };

    const data = await graphqlClient.request(GET_RECIPIENT_PROFILE, variables);
    
    if (!data.recipientProfile) {
      return null;
    }

    const profile = {
      ...data.recipientProfile,
      totalReceived: formatAmount(data.recipientProfile.totalReceived),
      firstDonationTimestamp: formatTimestamp(data.recipientProfile.firstDonationTimestamp),
      lastDonationTimestamp: formatTimestamp(data.recipientProfile.lastDonationTimestamp),
      topDonors: data.recipientProfile.topDonors.map(donor => ({
        ...donor,
        totalAmount: formatAmount(donor.totalAmount),
        firstDonationTimestamp: formatTimestamp(donor.firstDonationTimestamp),
        lastDonationTimestamp: formatTimestamp(donor.lastDonationTimestamp)
      }))
    };

    console.log('Recipient profile from subgraph:', profile);
    return profile;
  } catch (error) {
    console.error('Error fetching recipient profile from subgraph:', error);
    return null;
  }
};

// Get donor profile data
export const fetchDonorProfile = async (walletAddress) => {
  try {
    const variables = {
      address: walletAddress.toLowerCase()
    };

    const data = await graphqlClient.request(GET_DONOR_PROFILE, variables);
    
    if (!data.donorProfile) {
      return null;
    }

    const profile = {
      ...data.donorProfile,
      totalDonated: formatAmount(data.donorProfile.totalDonated),
      firstDonationTimestamp: formatTimestamp(data.donorProfile.firstDonationTimestamp),
      lastDonationTimestamp: formatTimestamp(data.donorProfile.lastDonationTimestamp),
      donations: data.donorProfile.donations?.map(donation => ({
        ...donation,
        amount: formatAmount(donation.amount),
        timeStamp: formatTimestamp(donation.timestamp)
      })) || []
    };

    console.log('Donor profile from subgraph:', profile);
    return profile;
  } catch (error) {
    console.error('Error fetching donor profile from subgraph:', error);
    return null;
  }
};

// Get recent donations for activity feed
export const fetchRecentDonations = async (limit = 20) => {
  try {
    const variables = { first: limit };
    const data = await graphqlClient.request(GET_RECENT_DONATIONS, variables);
    
    const formattedDonations = data.donations.map(donation => ({
      ...donation,
      amount: formatAmount(donation.amount),
      timeStamp: formatTimestamp(donation.timestamp)
    }));

    console.log('Recent donations from subgraph:', formattedDonations);
    return formattedDonations;
  } catch (error) {
    console.error('Error fetching recent donations from subgraph:', error);
    return [];
  }
};

// Get daily stats for charts
export const fetchDailyStats = async (startDate, endDate) => {
  try {
    const variables = {
      startDate: startDate.toISOString().split('T')[0], // YYYY-MM-DD
      endDate: endDate.toISOString().split('T')[0]
    };

    const data = await graphqlClient.request(GET_DAILY_STATS, variables);
    
    const formattedStats = data.dailyStats.map(stat => ({
      ...stat,
      totalDonations: formatAmount(stat.totalDonations),
      averageDonation: formatAmount(stat.averageDonation),
      date: new Date(stat.date)
    }));

    console.log('Daily stats from subgraph:', formattedStats);
    return formattedStats;
  } catch (error) {
    console.error('Error fetching daily stats from subgraph:', error);
    return [];
  }
};

// Get payment events for a specific wallet
export const fetchPaymentEventsFromSubgraph = async (walletAddress) => {
  try {
    const variables = {
      walletAddress: walletAddress.toLowerCase()
    };

    const data = await graphqlClient.request(GET_WALLET_PAYMENTS, variables);
    
    // Combine sent and received payments
    const allPayments = [
      ...data.sentPayments.map(payment => ({
        ...payment,
        amount: formatAmount(payment.amount),
        timeStamp: formatTimestamp(payment.timestamp),
        type: 'sent'
      })),
      ...data.receivedPayments.map(payment => ({
        ...payment,
        amount: formatAmount(payment.amount),
        timeStamp: formatTimestamp(payment.timestamp),
        type: 'received'
      }))
    ];

    // Sort by timestamp descending
    allPayments.sort((a, b) => b.timeStamp - a.timeStamp);

    console.log('Subgraph payment events:', allPayments);
    return allPayments;
  } catch (error) {
    console.error('Error fetching payments from subgraph:', error);
    return [];
  }
};

// Get recent payments for activity feed
export const fetchRecentPayments = async (limit = 20) => {
  try {
    const variables = { first: limit };
    const data = await graphqlClient.request(GET_RECENT_PAYMENTS, variables);
    
    const formattedPayments = data.payments.map(payment => ({
      ...payment,
      amount: formatAmount(payment.amount),
      timeStamp: formatTimestamp(payment.timestamp)
    }));

    console.log('Recent payments from subgraph:', formattedPayments);
    return formattedPayments;
  } catch (error) {
    console.error('Error fetching recent payments from subgraph:', error);
    return [];
  }
};