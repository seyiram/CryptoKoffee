import {
  DonationEvent as DonationEventEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  PaymentEvent as PaymentEventEvent,
  WalletInfoEvent as WalletInfoEventEvent
} from "../generated/Contract/Contract"
import {
  DonationEvent,
  OwnershipTransferred,
  PaymentEvent,
  WalletInfoEvent
} from "../generated/schema"

export function handleDonationEvent(event: DonationEventEvent): void {
  let entity = new DonationEvent(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.amount = event.params.amount
  entity.donor = event.params.donor
  entity.timeStamp = event.params.timeStamp
  entity.recipient = event.params.recipient

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlePaymentEvent(event: PaymentEventEvent): void {
  let entity = new PaymentEvent(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.amount = event.params.amount
  entity.timeStamp = event.params.timeStamp
  entity.sender = event.params.sender
  entity.recipient = event.params.recipient
  entity.description = event.params.description

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleWalletInfoEvent(event: WalletInfoEventEvent): void {
  let entity = new WalletInfoEvent(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.walletAddress = event.params.walletAddress
  entity.currentWalletBalance = event.params.currentWalletBalance
  entity.numOfDonations = event.params.numOfDonations

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
