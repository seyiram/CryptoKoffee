import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  DonationEvent,
  OwnershipTransferred,
  PaymentEvent,
  WalletInfoEvent
} from "../generated/Contract/Contract"

export function createDonationEventEvent(
  amount: BigInt,
  donor: Address,
  timeStamp: BigInt,
  recipient: Address
): DonationEvent {
  let donationEventEvent = changetype<DonationEvent>(newMockEvent())

  donationEventEvent.parameters = new Array()

  donationEventEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  donationEventEvent.parameters.push(
    new ethereum.EventParam("donor", ethereum.Value.fromAddress(donor))
  )
  donationEventEvent.parameters.push(
    new ethereum.EventParam(
      "timeStamp",
      ethereum.Value.fromUnsignedBigInt(timeStamp)
    )
  )
  donationEventEvent.parameters.push(
    new ethereum.EventParam("recipient", ethereum.Value.fromAddress(recipient))
  )

  return donationEventEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createPaymentEventEvent(
  amount: BigInt,
  timeStamp: BigInt,
  sender: Address,
  recipient: Address,
  description: string
): PaymentEvent {
  let paymentEventEvent = changetype<PaymentEvent>(newMockEvent())

  paymentEventEvent.parameters = new Array()

  paymentEventEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  paymentEventEvent.parameters.push(
    new ethereum.EventParam(
      "timeStamp",
      ethereum.Value.fromUnsignedBigInt(timeStamp)
    )
  )
  paymentEventEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  paymentEventEvent.parameters.push(
    new ethereum.EventParam("recipient", ethereum.Value.fromAddress(recipient))
  )
  paymentEventEvent.parameters.push(
    new ethereum.EventParam(
      "description",
      ethereum.Value.fromString(description)
    )
  )

  return paymentEventEvent
}

export function createWalletInfoEventEvent(
  walletAddress: Address,
  currentWalletBalance: BigInt,
  numOfDonations: BigInt
): WalletInfoEvent {
  let walletInfoEventEvent = changetype<WalletInfoEvent>(newMockEvent())

  walletInfoEventEvent.parameters = new Array()

  walletInfoEventEvent.parameters.push(
    new ethereum.EventParam(
      "walletAddress",
      ethereum.Value.fromAddress(walletAddress)
    )
  )
  walletInfoEventEvent.parameters.push(
    new ethereum.EventParam(
      "currentWalletBalance",
      ethereum.Value.fromUnsignedBigInt(currentWalletBalance)
    )
  )
  walletInfoEventEvent.parameters.push(
    new ethereum.EventParam(
      "numOfDonations",
      ethereum.Value.fromUnsignedBigInt(numOfDonations)
    )
  )

  return walletInfoEventEvent
}
