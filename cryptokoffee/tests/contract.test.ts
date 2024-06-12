import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Address } from "@graphprotocol/graph-ts"
import { DonationEvent } from "../generated/schema"
import { DonationEvent as DonationEventEvent } from "../generated/Contract/Contract"
import { handleDonationEvent } from "../src/contract"
import { createDonationEventEvent } from "./contract-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let amount = BigInt.fromI32(234)
    let donor = Address.fromString("0x0000000000000000000000000000000000000001")
    let timeStamp = BigInt.fromI32(234)
    let recipient = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let newDonationEventEvent = createDonationEventEvent(
      amount,
      donor,
      timeStamp,
      recipient
    )
    handleDonationEvent(newDonationEventEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("DonationEvent created and stored", () => {
    assert.entityCount("DonationEvent", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "DonationEvent",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "amount",
      "234"
    )
    assert.fieldEquals(
      "DonationEvent",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "donor",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "DonationEvent",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "timeStamp",
      "234"
    )
    assert.fieldEquals(
      "DonationEvent",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "recipient",
      "0x0000000000000000000000000000000000000001"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
