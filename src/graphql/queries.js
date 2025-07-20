import { gql } from 'graphql-request';

// Get donations for a specific wallet (both sent and received)
export const GET_WALLET_DONATIONS = gql`
  query GetWalletDonations($walletAddress: Bytes!, $first: Int = 50, $skip: Int = 0) {
    sentDonations: donations(
      where: { donor: $walletAddress }
      first: $first
      skip: $skip
      orderBy: timestamp
      orderDirection: desc
    ) {
      id
      amount
      donor
      recipient
      timestamp
      transactionHash
    }
    receivedDonations: donations(
      where: { recipient: $walletAddress }
      first: $first
      skip: $skip
      orderBy: timestamp
      orderDirection: desc
    ) {
      id
      amount
      donor
      recipient
      timestamp
      transactionHash
    }
  }
`;

// Get donations for a specific recipient
export const GET_DONATIONS_FOR_RECIPIENT = gql`
  query GetDonationsForRecipient($recipient: Bytes!, $first: Int = 100, $skip: Int = 0) {
    donations(
      where: { recipient: $recipient }
      first: $first
      skip: $skip
      orderBy: timestamp
      orderDirection: desc
    ) {
      id
      amount
      donor
      recipient
      timestamp
      blockNumber
      transactionHash
      donorProfile {
        address
        totalDonated
        donationCount
      }
    }
  }
`;

// Get recipient profile with stats
export const GET_RECIPIENT_PROFILE = gql`
  query GetRecipientProfile($address: Bytes!) {
    recipientProfile(id: $address) {
      id
      address
      totalReceived
      donationCount
      uniqueDonorCount
      firstDonationTimestamp
      lastDonationTimestamp
      topDonors(first: 10, orderBy: totalAmount, orderDirection: desc) {
        donor
        totalAmount
        donationCount
        firstDonationTimestamp
        lastDonationTimestamp
      }
    }
  }
`;

// Get donor profile
export const GET_DONOR_PROFILE = gql`
  query GetDonorProfile($address: Bytes!) {
    donorProfile(id: $address) {
      id
      address
      totalDonated
      donationCount
      firstDonationTimestamp
      lastDonationTimestamp
      donations(first: 100, orderBy: timestamp, orderDirection: desc) {
        id
        amount
        recipient
        timestamp
        recipientProfile {
          address
        }
      }
    }
  }
`;

// Get recent donations across all recipients
export const GET_RECENT_DONATIONS = gql`
  query GetRecentDonations($first: Int = 50) {
    donations(
      first: $first
      orderBy: timestamp
      orderDirection: desc
    ) {
      id
      amount
      donor
      recipient
      timestamp
      donorProfile {
        address
        donationCount
      }
      recipientProfile {
        address
      }
    }
  }
`;

// Get top recipients by total received
export const GET_TOP_RECIPIENTS = gql`
  query GetTopRecipients($first: Int = 10) {
    recipientProfiles(
      first: $first
      orderBy: totalReceived
      orderDirection: desc
    ) {
      id
      address
      totalReceived
      donationCount
      uniqueDonorCount
      lastDonationTimestamp
    }
  }
`;

// Get top donors by total donated
export const GET_TOP_DONORS = gql`
  query GetTopDonors($first: Int = 10) {
    donorProfiles(
      first: $first
      orderBy: totalDonated
      orderDirection: desc
    ) {
      id
      address
      totalDonated
      donationCount
      lastDonationTimestamp
    }
  }
`;

// Get global statistics
export const GET_GLOBAL_STATS = gql`
  query GetGlobalStats {
    globalStats(id: "global") {
      totalDonations
      totalDonationCount
      totalUniqueRecipients
      totalUniqueDonors
      lastUpdated
    }
  }
`;

// Get daily statistics for charts
export const GET_DAILY_STATS = gql`
  query GetDailyStats($startDate: String!, $endDate: String!) {
    dailyStats(
      where: { date_gte: $startDate, date_lte: $endDate }
      orderBy: date
      orderDirection: asc
    ) {
      id
      date
      totalDonations
      donationCount
      uniqueDonors
      uniqueRecipients
      averageDonation
    }
  }
`;

// Get monthly statistics
export const GET_MONTHLY_STATS = gql`
  query GetMonthlyStats($first: Int = 12) {
    monthlyStats(
      first: $first
      orderBy: month
      orderDirection: desc
    ) {
      id
      month
      totalDonations
      donationCount
      uniqueDonors
      uniqueRecipients
      averageDonation
    }
  }
`;

// Search donations by amount range
export const GET_DONATIONS_BY_AMOUNT_RANGE = gql`
  query GetDonationsByAmountRange($minAmount: BigInt!, $maxAmount: BigInt!, $first: Int = 100) {
    donations(
      where: { amount_gte: $minAmount, amount_lte: $maxAmount }
      first: $first
      orderBy: timestamp
      orderDirection: desc
    ) {
      id
      amount
      donor
      recipient
      timestamp
      donorProfile {
        address
      }
      recipientProfile {
        address
      }
    }
  }
`;

// Get donations in a specific time range
export const GET_DONATIONS_BY_TIME_RANGE = gql`
  query GetDonationsByTimeRange($startTime: BigInt!, $endTime: BigInt!, $first: Int = 100) {
    donations(
      where: { timestamp_gte: $startTime, timestamp_lte: $endTime }
      first: $first
      orderBy: timestamp
      orderDirection: desc
    ) {
      id
      amount
      donor
      recipient
      timestamp
      donorProfile {
        address
      }
      recipientProfile {
        address
      }
    }
  }
`;

// Get payment events for a specific wallet
export const GET_WALLET_PAYMENTS = gql`
  query GetWalletPayments($walletAddress: Bytes!, $first: Int = 50, $skip: Int = 0) {
    sentPayments: payments(
      where: { sender: $walletAddress }
      first: $first
      skip: $skip
      orderBy: timestamp
      orderDirection: desc
    ) {
      id
      amount
      sender
      recipient
      description
      timestamp
      transactionHash
    }
    receivedPayments: payments(
      where: { recipient: $walletAddress }
      first: $first
      skip: $skip
      orderBy: timestamp
      orderDirection: desc
    ) {
      id
      amount
      sender
      recipient
      description
      timestamp
      transactionHash
    }
  }
`;

// Get recent payments across all wallets
export const GET_RECENT_PAYMENTS = gql`
  query GetRecentPayments($first: Int = 50) {
    payments(
      first: $first
      orderBy: timestamp
      orderDirection: desc
    ) {
      id
      amount
      sender
      recipient
      description
      timestamp
      transactionHash
    }
  }
`;