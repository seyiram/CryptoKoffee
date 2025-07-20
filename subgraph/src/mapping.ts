import { BigInt, Address, Bytes } from "@graphprotocol/graph-ts";
import {
  DonationEvent,
  WalletInfoEvent,
  PaymentEvent,
} from "../generated/CryptoKoffeeArbitrumSepolia/CryptoKoffee";
import {
  Donation,
  DonorProfile,
  RecipientProfile,
  DonorSummary,
  WalletInfo,
  Payment,
  GlobalStats,
  DailyStats,
  MonthlyStats,
} from "../generated/schema";

// Helper function to get or create global stats
function getGlobalStats(): GlobalStats {
  let stats = GlobalStats.load("global");
  if (!stats) {
    stats = new GlobalStats("global");
    stats.totalDonations = BigInt.fromI32(0);
    stats.totalDonationCount = 0;
    stats.totalUniqueRecipients = 0;
    stats.totalUniqueDonors = 0;
    stats.lastUpdated = BigInt.fromI32(0);
  }
  return stats;
}

// Helper function to get date string from timestamp
function getDateString(timestamp: BigInt): string {
  const date = new Date(timestamp.toI32() * 1000);
  return date.toISOString().split("T")[0]; // YYYY-MM-DD
}

// Helper function to get month string from timestamp
function getMonthString(timestamp: BigInt): string {
  const date = new Date(timestamp.toI32() * 1000);
  return date.toISOString().substring(0, 7); // YYYY-MM
}

export function handleDonationEvent(event: DonationEvent): void {
  const donationId = event.transaction.hash.toHex() + "-" + event.logIndex.toString();
  
  // Create donation entity
  let donation = new Donation(donationId);
  donation.amount = event.params.amount;
  donation.donor = event.params.donor;
  donation.recipient = event.params.recipient;
  donation.timestamp = event.params.timeStamp;
  donation.blockNumber = event.block.number;
  donation.transactionHash = event.transaction.hash;

  // Handle donor profile
  let donorProfile = DonorProfile.load(event.params.donor.toHex());
  if (!donorProfile) {
    donorProfile = new DonorProfile(event.params.donor.toHex());
    donorProfile.address = event.params.donor;
    donorProfile.totalDonated = BigInt.fromI32(0);
    donorProfile.donationCount = 0;
    donorProfile.firstDonationTimestamp = event.params.timeStamp;
  }
  
  donorProfile.totalDonated = donorProfile.totalDonated.plus(event.params.amount);
  donorProfile.donationCount = donorProfile.donationCount + 1;
  donorProfile.lastDonationTimestamp = event.params.timeStamp;
  
  // Handle recipient profile
  let recipientProfile = RecipientProfile.load(event.params.recipient.toHex());
  if (!recipientProfile) {
    recipientProfile = new RecipientProfile(event.params.recipient.toHex());
    recipientProfile.address = event.params.recipient;
    recipientProfile.totalReceived = BigInt.fromI32(0);
    recipientProfile.donationCount = 0;
    recipientProfile.uniqueDonorCount = 0;
    recipientProfile.firstDonationTimestamp = event.params.timeStamp;
  }
  
  recipientProfile.totalReceived = recipientProfile.totalReceived.plus(event.params.amount);
  recipientProfile.donationCount = recipientProfile.donationCount + 1;
  recipientProfile.lastDonationTimestamp = event.params.timeStamp;

  // Handle donor summary (for recipient's top donors)
  const donorSummaryId = event.params.recipient.toHex() + "-" + event.params.donor.toHex();
  let donorSummary = DonorSummary.load(donorSummaryId);
  if (!donorSummary) {
    donorSummary = new DonorSummary(donorSummaryId);
    donorSummary.donor = event.params.donor;
    donorSummary.recipient = recipientProfile.id;
    donorSummary.totalAmount = BigInt.fromI32(0);
    donorSummary.donationCount = 0;
    donorSummary.firstDonationTimestamp = event.params.timeStamp;
    
    // Increment unique donor count for recipient
    recipientProfile.uniqueDonorCount = recipientProfile.uniqueDonorCount + 1;
  }
  
  donorSummary.totalAmount = donorSummary.totalAmount.plus(event.params.amount);
  donorSummary.donationCount = donorSummary.donationCount + 1;
  donorSummary.lastDonationTimestamp = event.params.timeStamp;

  // Update relationships
  donation.donorProfile = donorProfile.id;
  donation.recipientProfile = recipientProfile.id;

  // Update global stats
  let globalStats = getGlobalStats();
  globalStats.totalDonations = globalStats.totalDonations.plus(event.params.amount);
  globalStats.totalDonationCount = globalStats.totalDonationCount + 1;
  globalStats.lastUpdated = event.block.timestamp;

  // Update daily stats
  const dateString = getDateString(event.params.timeStamp);
  let dailyStats = DailyStats.load(dateString);
  if (!dailyStats) {
    dailyStats = new DailyStats(dateString);
    dailyStats.date = dateString;
    dailyStats.totalDonations = BigInt.fromI32(0);
    dailyStats.donationCount = 0;
    dailyStats.uniqueDonors = 0;
    dailyStats.uniqueRecipients = 0;
    dailyStats.averageDonation = BigInt.fromI32(0);
  }
  
  dailyStats.totalDonations = dailyStats.totalDonations.plus(event.params.amount);
  dailyStats.donationCount = dailyStats.donationCount + 1;
  if (dailyStats.donationCount > 0) {
    dailyStats.averageDonation = dailyStats.totalDonations.div(BigInt.fromI32(dailyStats.donationCount));
  }

  // Update monthly stats
  const monthString = getMonthString(event.params.timeStamp);
  let monthlyStats = MonthlyStats.load(monthString);
  if (!monthlyStats) {
    monthlyStats = new MonthlyStats(monthString);
    monthlyStats.month = monthString;
    monthlyStats.totalDonations = BigInt.fromI32(0);
    monthlyStats.donationCount = 0;
    monthlyStats.uniqueDonors = 0;
    monthlyStats.uniqueRecipients = 0;
    monthlyStats.averageDonation = BigInt.fromI32(0);
  }
  
  monthlyStats.totalDonations = monthlyStats.totalDonations.plus(event.params.amount);
  monthlyStats.donationCount = monthlyStats.donationCount + 1;
  if (monthlyStats.donationCount > 0) {
    monthlyStats.averageDonation = monthlyStats.totalDonations.div(BigInt.fromI32(monthlyStats.donationCount));
  }

  // Save all entities
  donation.save();
  donorProfile.save();
  recipientProfile.save();
  donorSummary.save();
  globalStats.save();
  dailyStats.save();
  monthlyStats.save();
}

export function handleWalletInfoEvent(event: WalletInfoEvent): void {
  let walletInfo = WalletInfo.load(event.params.walletAddress.toHex());
  if (!walletInfo) {
    walletInfo = new WalletInfo(event.params.walletAddress.toHex());
    walletInfo.walletAddress = event.params.walletAddress;
  }
  
  walletInfo.currentBalance = event.params.currentWalletBalance;
  walletInfo.numOfDonations = event.params.numOfDonations.toI32();
  walletInfo.lastUpdated = event.block.timestamp;
  
  walletInfo.save();
}

export function handlePaymentEvent(event: PaymentEvent): void {
  const paymentId = event.transaction.hash.toHex() + "-" + event.logIndex.toString();
  
  let payment = new Payment(paymentId);
  payment.amount = event.params.amount;
  payment.timestamp = event.params.timeStamp;
  payment.sender = event.params.sender;
  payment.recipient = event.params.recipient;
  payment.description = event.params.description;
  payment.blockNumber = event.block.number;
  payment.transactionHash = event.transaction.hash;
  
  payment.save();
}