import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { CloseOrder } from "../generated/schema"
import { CloseOrder as CloseOrderEvent } from "../generated/PerpetualOptions/PerpetualOptions"
import { handleCloseOrder } from "../src/perpetual-options"
import { createCloseOrderEvent } from "./perpetual-options-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let holder = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let token = Address.fromString("0x0000000000000000000000000000000000000001")
    let orderID = BigInt.fromI32(234)
    let state = 123
    let isBuy = "boolean Not implemented"
    let name = "Example string value"
    let number = BigInt.fromI32(234)
    let fundingFeePaid = BigInt.fromI32(234)
    let openPrice = BigInt.fromI32(234)
    let closePrice = BigInt.fromI32(234)
    let newCloseOrderEvent = createCloseOrderEvent(
      holder,
      token,
      orderID,
      state,
      isBuy,
      name,
      number,
      fundingFeePaid,
      openPrice,
      closePrice
    )
    handleCloseOrder(newCloseOrderEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("CloseOrder created and stored", () => {
    assert.entityCount("CloseOrder", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "CloseOrder",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "holder",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "CloseOrder",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "token",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "CloseOrder",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "orderID",
      "234"
    )
    assert.fieldEquals(
      "CloseOrder",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "state",
      "123"
    )
    assert.fieldEquals(
      "CloseOrder",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "isBuy",
      "boolean Not implemented"
    )
    assert.fieldEquals(
      "CloseOrder",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "name",
      "Example string value"
    )
    assert.fieldEquals(
      "CloseOrder",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "number",
      "234"
    )
    assert.fieldEquals(
      "CloseOrder",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "fundingFeePaid",
      "234"
    )
    assert.fieldEquals(
      "CloseOrder",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "openPrice",
      "234"
    )
    assert.fieldEquals(
      "CloseOrder",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "closePrice",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
