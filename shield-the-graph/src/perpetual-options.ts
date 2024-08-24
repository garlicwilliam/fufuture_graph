import {
  CloseOrder as CloseOrderEvent,
  Deposit as DepositEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  SetRiskFundAddr as SetRiskFundAddrEvent,
  Trade as TradeEvent,
  Withdrawn as WithdrawnEvent,
} from '../generated/PerpetualOptions/PerpetualOptions';
import {
  Broker,
  BrokerReward,
  BrokerTradingFee,
  CloseOrder,
  Deposit,
  Order,
  OwnershipTransferred,
  SetRiskFundAddr,
  Taker,
  TakerFund,
  TakerTradingFee,
  Trade,
  UnderlyingPosition,
  Withdrawn,
} from '../generated/schema';
import {
  EMPTY_ADDRESS,
  HUNDRED,
  loadBroker,
  loadBrokerTradingFee,
  loadOrder,
  loadTaker,
  loadTakerFund,
  loadTakerTradingFee,
  loadUnderlyingPosition,
  ONE,
  readBrokerPortion,
  ZERO,
} from './load-entities';
import { BigInt, Bytes } from '@graphprotocol/graph-ts';

export function handleCloseOrder(event: CloseOrderEvent): void {
  let entity: CloseOrder = new CloseOrder(event.transaction.hash.concatI32(event.logIndex.toI32()));
  entity.holder = event.params.holder;
  entity.token = event.params.token;
  entity.orderID = event.params.orderID;
  entity.state = event.params.state;
  entity.isBuy = event.params.isBuy;
  entity.name = event.params.name;
  entity.number = event.params.number;
  entity.fundingFeePaid = event.params.fundingFeePaid;
  entity.openPrice = event.params.openPrice;
  entity.closePrice = event.params.closePrice;
  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;
  entity.save();

  const order: Order = loadOrder(event.params.orderID.toString());
  order.fundingFee = event.params.fundingFeePaid;
  if (event.params.state > 0) {
    order.status = event.params.state;
    order.closePrice = event.params.closePrice;
    order.closeTimestamp = event.block.timestamp;
    order.closeBlockNumber = event.block.number;
  }
  order.save();

  if (event.params.state > 0) {
    const taker: Taker = loadTaker(order.taker);
    taker.orderCountClosed = taker.orderCountProfit.plus(ONE);
    taker.save();
  }

  if (event.params.state > 0) {
    const underlyingPos: UnderlyingPosition = loadUnderlyingPosition(event.params.name, event.params.token);
    underlyingPos.amount = underlyingPos.amount.ge(event.params.number)
      ? underlyingPos.amount.minus(event.params.number)
      : ZERO;
    underlyingPos.save();
  }
}

export function handleDeposit(event: DepositEvent): void {
  // ----------------------------------------------------------------------------------------
  // Entity Deposit

  let entity: Deposit = new Deposit(event.transaction.hash.concatI32(event.logIndex.toI32()));
  entity.user = event.params.user;
  entity.token = event.params.token;
  entity.amount = event.params.amount;
  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;
  entity.save();

  // ----------------------------------------------------------------------------------------
  // Entity Taker

  const taker: Taker = loadTaker(event.params.user);
  if (taker.firstDepositTimestamp.isZero()) {
    taker.firstDepositTimestamp = event.block.timestamp;
    taker.save();
  }

  // -----------------------------------------------------------------------------------------
  // Entity TakerFund

  const takerFund: TakerFund = loadTakerFund(event.params.user, event.params.token);
  takerFund.deposited = takerFund.deposited.plus(event.params.amount);
  takerFund.netDeposit = takerFund.deposited.minus(takerFund.withdrawn);
  takerFund.save();
}

export function handleOwnershipTransferred(event: OwnershipTransferredEvent): void {
  let entity: OwnershipTransferred = new OwnershipTransferred(event.transaction.hash.concatI32(event.logIndex.toI32()));
  entity.previousOwner = event.params.previousOwner;
  entity.newOwner = event.params.newOwner;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleSetRiskFundAddr(event: SetRiskFundAddrEvent): void {
  let entity = new SetRiskFundAddr(event.transaction.hash.concatI32(event.logIndex.toI32()));
  entity.oldAddr = event.params.oldAddr;
  entity.newAddr = event.params.newAddr;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleTrade(event: TradeEvent): void {
  // ----------------------------------------------------------------------------------------
  // Entity Trade

  let entity: Trade = new Trade(event.transaction.hash.concatI32(event.logIndex.toI32()));
  entity.holder = event.params.holder;
  entity.token = event.params.token;
  entity.orderID = event.params.orderID;
  entity.isBuy = event.params.isBuy;
  entity.name = event.params.name;
  entity.number = event.params.number;
  entity.tradingFee = event.params.tradingFee;
  entity.liquidationFee = event.params.liquidationFee;
  entity.fundingFee = event.params.fundingFee;
  entity.fundingFeePaid = event.params.fundingFeePaid;
  entity.openPrice = event.params.openPrice;
  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;
  entity.save();

  // ----------------------------------------------------------------------------------------
  // Entity Taker

  const taker: Taker = loadTaker(event.params.holder);
  taker.orderCount = taker.orderCount.plus(ONE);
  taker.lastOrderTimestamp = event.block.timestamp;
  taker.save();

  // -----------------------------------------------------------------------------------------
  // Entity Order

  const order: Order = loadOrder(event.params.orderID.toString());
  order.taker = event.params.holder;
  order.token = event.params.token;
  order.isBuy = event.params.isBuy;
  order.name = event.params.name;
  order.amount = event.params.number;
  order.tradingFee = event.params.tradingFee;
  order.openPrice = event.params.openPrice;
  order.openTimestamp = event.block.timestamp;
  order.openBlockNumber = event.block.number;
  order.status = 0;
  order.fundingFee = event.params.fundingFeePaid;
  order.closePrice = BigInt.zero();
  order.closeTimestamp = BigInt.zero();
  order.closeBlockNumber = BigInt.zero();
  order.positionProfit = BigInt.zero();
  order.inviter = taker.inviter;
  order.save();

  // -----------------------------------------------------------------------------------------
  // Entity TakerTradingFee

  const takerFee: TakerTradingFee = loadTakerTradingFee(event.params.holder, event.params.token);
  takerFee.totalPaid = takerFee.totalPaid.plus(event.params.tradingFee);
  takerFee.save();

  // -----------------------------------------------------------------------------------------

  // has inviter
  if (!taker.inviter.equals(EMPTY_ADDRESS)) {
    const brokerAddr: Bytes = taker.inviter;
    const portion: BigInt = readBrokerPortion(event.address);
    const commission: BigInt = event.params.tradingFee.times(portion).div(HUNDRED);

    // ---------------------------------------------------------------------------------------
    // Entity Broker

    const broker: Broker = loadBroker(brokerAddr);
    broker.referralOrderCount = broker.referralOrderCount.plus(ONE);
    broker.save();

    // ---------------------------------------------------------------------------------------
    // Entity BrokerTradingFee

    const brokerFee: BrokerTradingFee = loadBrokerTradingFee(brokerAddr, event.params.token);
    brokerFee.takerTotalPaid = brokerFee.takerTotalPaid.plus(event.params.tradingFee);
    brokerFee.totalReceived = brokerFee.totalReceived.plus(commission);
    brokerFee.save();

    // ---------------------------------------------------------------------------------------

    const brokerReward: BrokerReward = new BrokerReward(event.transaction.hash.concatI32(event.logIndex.toI32()));
    brokerReward.broker = brokerAddr;
    brokerReward.taker = event.params.holder;
    brokerReward.token = event.params.token;
    brokerReward.orderID = event.params.orderID;
    brokerReward.tradingFee = event.params.tradingFee;
    brokerReward.brokerPortion = portion;
    brokerReward.reward = commission;

    brokerReward.transactionHash = event.transaction.hash;
    brokerReward.blockNumber = event.block.number;
    brokerReward.blockTimestamp = event.block.timestamp;

    brokerReward.save();
  }

  // -----------------------------------------------------------------------------------------
  // Entity UnderlyingPosition

  const underlyingPos: UnderlyingPosition = loadUnderlyingPosition(event.params.name, event.params.token);
  underlyingPos.amount = underlyingPos.amount.plus(event.params.number);
  underlyingPos.save();
}

export function handleWithdrawn(event: WithdrawnEvent): void {
  // ----------------------------------------------------------------------------------------
  // Entity Withdrawn

  let entity: Withdrawn = new Withdrawn(event.transaction.hash.concatI32(event.logIndex.toI32()));
  entity.user = event.params.user;
  entity.token = event.params.token;
  entity.amount = event.params.amount;
  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;
  entity.save();

  // ----------------------------------------------------------------------------------------
  // Entity TakerFund

  const takerFund: TakerFund = loadTakerFund(event.params.user, event.params.token);
  takerFund.withdrawn = takerFund.withdrawn.plus(event.params.amount);
  takerFund.netDeposit = takerFund.deposited.minus(takerFund.withdrawn);
  takerFund.save();
}
