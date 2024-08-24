import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  CloseOrder,
  Deposit,
  OwnershipTransferred,
  SetRiskFundAddr,
  Trade,
  Withdrawn
} from "../generated/PerpetualOptions/PerpetualOptions"

export function createCloseOrderEvent(
  holder: Address,
  token: Address,
  orderID: BigInt,
  state: i32,
  isBuy: boolean,
  name: string,
  number: BigInt,
  fundingFeePaid: BigInt,
  openPrice: BigInt,
  closePrice: BigInt
): CloseOrder {
  let closeOrderEvent = changetype<CloseOrder>(newMockEvent())

  closeOrderEvent.parameters = new Array()

  closeOrderEvent.parameters.push(
    new ethereum.EventParam("holder", ethereum.Value.fromAddress(holder))
  )
  closeOrderEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  )
  closeOrderEvent.parameters.push(
    new ethereum.EventParam(
      "orderID",
      ethereum.Value.fromUnsignedBigInt(orderID)
    )
  )
  closeOrderEvent.parameters.push(
    new ethereum.EventParam(
      "state",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(state))
    )
  )
  closeOrderEvent.parameters.push(
    new ethereum.EventParam("isBuy", ethereum.Value.fromBoolean(isBuy))
  )
  closeOrderEvent.parameters.push(
    new ethereum.EventParam("name", ethereum.Value.fromString(name))
  )
  closeOrderEvent.parameters.push(
    new ethereum.EventParam("number", ethereum.Value.fromUnsignedBigInt(number))
  )
  closeOrderEvent.parameters.push(
    new ethereum.EventParam(
      "fundingFeePaid",
      ethereum.Value.fromUnsignedBigInt(fundingFeePaid)
    )
  )
  closeOrderEvent.parameters.push(
    new ethereum.EventParam(
      "openPrice",
      ethereum.Value.fromUnsignedBigInt(openPrice)
    )
  )
  closeOrderEvent.parameters.push(
    new ethereum.EventParam(
      "closePrice",
      ethereum.Value.fromUnsignedBigInt(closePrice)
    )
  )

  return closeOrderEvent
}

export function createDepositEvent(
  user: Address,
  token: Address,
  amount: BigInt
): Deposit {
  let depositEvent = changetype<Deposit>(newMockEvent())

  depositEvent.parameters = new Array()

  depositEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  depositEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  )
  depositEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return depositEvent
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

export function createSetRiskFundAddrEvent(
  oldAddr: Address,
  newAddr: Address
): SetRiskFundAddr {
  let setRiskFundAddrEvent = changetype<SetRiskFundAddr>(newMockEvent())

  setRiskFundAddrEvent.parameters = new Array()

  setRiskFundAddrEvent.parameters.push(
    new ethereum.EventParam("oldAddr", ethereum.Value.fromAddress(oldAddr))
  )
  setRiskFundAddrEvent.parameters.push(
    new ethereum.EventParam("newAddr", ethereum.Value.fromAddress(newAddr))
  )

  return setRiskFundAddrEvent
}

export function createTradeEvent(
  holder: Address,
  token: Address,
  orderID: BigInt,
  isBuy: boolean,
  name: string,
  number: BigInt,
  tradingFee: BigInt,
  liquidationFee: BigInt,
  fundingFee: BigInt,
  fundingFeePaid: BigInt,
  openPrice: BigInt
): Trade {
  let tradeEvent = changetype<Trade>(newMockEvent())

  tradeEvent.parameters = new Array()

  tradeEvent.parameters.push(
    new ethereum.EventParam("holder", ethereum.Value.fromAddress(holder))
  )
  tradeEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  )
  tradeEvent.parameters.push(
    new ethereum.EventParam(
      "orderID",
      ethereum.Value.fromUnsignedBigInt(orderID)
    )
  )
  tradeEvent.parameters.push(
    new ethereum.EventParam("isBuy", ethereum.Value.fromBoolean(isBuy))
  )
  tradeEvent.parameters.push(
    new ethereum.EventParam("name", ethereum.Value.fromString(name))
  )
  tradeEvent.parameters.push(
    new ethereum.EventParam("number", ethereum.Value.fromUnsignedBigInt(number))
  )
  tradeEvent.parameters.push(
    new ethereum.EventParam(
      "tradingFee",
      ethereum.Value.fromUnsignedBigInt(tradingFee)
    )
  )
  tradeEvent.parameters.push(
    new ethereum.EventParam(
      "liquidationFee",
      ethereum.Value.fromUnsignedBigInt(liquidationFee)
    )
  )
  tradeEvent.parameters.push(
    new ethereum.EventParam(
      "fundingFee",
      ethereum.Value.fromUnsignedBigInt(fundingFee)
    )
  )
  tradeEvent.parameters.push(
    new ethereum.EventParam(
      "fundingFeePaid",
      ethereum.Value.fromUnsignedBigInt(fundingFeePaid)
    )
  )
  tradeEvent.parameters.push(
    new ethereum.EventParam(
      "openPrice",
      ethereum.Value.fromUnsignedBigInt(openPrice)
    )
  )

  return tradeEvent
}

export function createWithdrawnEvent(
  user: Address,
  token: Address,
  amount: BigInt
): Withdrawn {
  let withdrawnEvent = changetype<Withdrawn>(newMockEvent())

  withdrawnEvent.parameters = new Array()

  withdrawnEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  withdrawnEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  )
  withdrawnEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return withdrawnEvent
}
