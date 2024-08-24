import {
  CloseOrderLog as CloseOrderEvent,
  DepositLog as DepositEvent,
  TradeLog as TradeEvent,
  WithdrawnLog as WithdrawnEvent,
} from '../types/abi-interfaces/PerpetualOptions';
import {
  Broker,
  BrokerReward,
  BrokerTradingFee,
  CloseOrder,
  Deposit,
  Order,
  Taker,
  TakerFund,
  TakerTradingFee,
  Trade,
  UnderlyingPosition,
  Withdrawn,
} from '../types';
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

export async function handleCloseOrder(event: CloseOrderEvent): Promise<void> {
  if (!event.args) {
    return;
  }

  // create close-order entity
  const id: string = event.transactionHash.concat(event.logIndex.toString());
  const closeOrderLog: CloseOrder = CloseOrder.create({
    id: id,
    holder: event.args.holder.toLowerCase(),
    token: event.args.token.toLowerCase(),
    orderID: event.args.orderID.toBigInt(),
    state: event.args.state,
    isBuy: event.args.isBuy,
    name: event.args.name,
    number: event.args.number.toBigInt(),
    fundingFeePaid: event.args.fundingFeePaid.toBigInt(),
    openPrice: event.args.openPrice.toBigInt(),
    closePrice: event.args.closePrice.toBigInt(),
    blockNumber: BigInt(event.blockNumber),
    blockTimestamp: event.block.timestamp,
    transactionHash: event.transactionHash,
  });
  await closeOrderLog.save();

  // create order entity
  const order: Order = await loadOrder(event.args.orderID.toString());
  order.fundingFee = event.args.fundingFeePaid.toBigInt();
  if (event.args.state > 0) {
    order.status = event.args.state;
    order.closePrice = event.args.closePrice.toBigInt();
    order.closeTimestamp = event.block.timestamp;
    order.closeBlockNumber = BigInt(event.blockNumber);
  }
  await order.save();

  // update taker entity
  if (event.args.state > 0) {
    const taker: Taker = await loadTaker(order.taker);
    taker.orderCountClosed = taker.orderCountProfit + ONE;

    await taker.save();
  }

  // update taker trading fee entity
  if (event.args.state > 0) {
    const underlyingPos: UnderlyingPosition = await loadUnderlyingPosition(
      event.args.name,
      event.args.token.toLowerCase()
    );

    underlyingPos.amount =
      underlyingPos.amount > event.args.number.toBigInt() ? underlyingPos.amount - event.args.number.toBigInt() : ZERO;

    await underlyingPos.save();
  }
}

export async function handleDeposit(event: DepositEvent): Promise<void> {
  if (!event.args) {
    return;
  }

  // ----------------------------------------------------------------------------------------
  // Entity Deposit
  const id: string = event.transaction.hash.concat(event.logIndex.toString());

  const deposit: Deposit = Deposit.create({
    id: id,
    user: event.args.user.toLowerCase(),
    token: event.args.token.toLowerCase(),
    amount: event.args.amount.toBigInt(),
    blockNumber: BigInt(event.blockNumber),
    blockTimestamp: event.block.timestamp,
    transactionHash: event.transactionHash,
  });

  await deposit.save();

  // ----------------------------------------------------------------------------------------
  // Entity Taker

  const taker: Taker = await loadTaker(event.args.user.toLowerCase());
  if (taker.firstDepositTimestamp === ZERO) {
    taker.firstDepositTimestamp = event.block.timestamp;
    await taker.save();
  }

  // -----------------------------------------------------------------------------------------
  // Entity TakerFund

  const takerFund: TakerFund = await loadTakerFund(event.args.user.toLowerCase(), event.args.token.toLowerCase());
  takerFund.deposited = takerFund.deposited + event.args.amount.toBigInt();
  takerFund.netDeposit = takerFund.deposited - takerFund.withdrawn;

  await takerFund.save();
}

export async function handleTrade(event: TradeEvent): Promise<void> {
  if (!event.args) {
    return;
  }

  // ----------------------------------------------------------------------------------------
  // Entity Trade

  const id: string = event.transactionHash.concat(event.logIndex.toString());

  const trade: Trade = Trade.create({
    id: id,
    holder: event.args.holder.toLowerCase(),
    token: event.args.token.toLowerCase(),
    orderID: event.args.orderID.toBigInt(),
    isBuy: event.args.isBuy,
    name: event.args.name,
    number: event.args.number.toBigInt(),
    tradingFee: event.args.tradingFee.toBigInt(),
    liquidationFee: event.args.liquidationFee.toBigInt(),
    fundingFee: event.args.fundingFee.toBigInt(),
    fundingFeePaid: event.args.fundingFeePaid.toBigInt(),
    openPrice: event.args.openPrice.toBigInt(),
    blockNumber: BigInt(event.blockNumber),
    blockTimestamp: event.block.timestamp,
    transactionHash: event.transactionHash,
  });

  await trade.save();

  // ----------------------------------------------------------------------------------------
  // Entity Taker

  const taker: Taker = await loadTaker(event.args.holder.toLowerCase());
  taker.orderCount = taker.orderCount + ONE;
  taker.lastOrderTimestamp = event.block.timestamp;
  await taker.save();

  // -----------------------------------------------------------------------------------------
  // Entity Order

  const order: Order = await loadOrder(event.args.orderID.toString());
  order.taker = event.args.holder.toLowerCase();
  order.token = event.args.token.toLowerCase();
  order.isBuy = event.args.isBuy;
  order.name = event.args.name;
  order.amount = event.args.number.toBigInt();
  order.tradingFee = event.args.tradingFee.toBigInt();
  order.openPrice = event.args.openPrice.toBigInt();
  order.openTimestamp = event.block.timestamp;
  order.openBlockNumber = BigInt(event.block.number);
  order.status = 0;
  order.fundingFee = event.args.fundingFeePaid.toBigInt();
  order.closePrice = ZERO;
  order.closeTimestamp = ZERO;
  order.closeBlockNumber = ZERO;
  order.positionProfit = ZERO;
  order.inviter = taker.inviter;
  await order.save();

  // -----------------------------------------------------------------------------------------
  // Entity TakerTradingFee

  const takerFee: TakerTradingFee = await loadTakerTradingFee(
    event.args.holder.toLowerCase(),
    event.args.token.toLowerCase()
  );

  takerFee.totalPaid = takerFee.totalPaid + event.args.tradingFee.toBigInt();
  await takerFee.save();

  // -----------------------------------------------------------------------------------------

  // has inviter
  if (taker.inviter.toLowerCase() !== EMPTY_ADDRESS) {
    const brokerAddr: string = taker.inviter;
    const portion: bigint = await readBrokerPortion(event.address);
    const commission: bigint = (event.args.tradingFee.toBigInt() * portion) / HUNDRED;

    // ---------------------------------------------------------------------------------------
    // Entity Broker

    const broker: Broker = await loadBroker(brokerAddr);
    broker.referralOrderCount = broker.referralOrderCount + ONE;
    await broker.save();

    // ---------------------------------------------------------------------------------------
    // Entity BrokerTradingFee

    const brokerFee: BrokerTradingFee = await loadBrokerTradingFee(brokerAddr, event.args.token.toLowerCase());
    brokerFee.takerTotalPaid = brokerFee.takerTotalPaid + event.args.tradingFee.toBigInt();
    brokerFee.totalReceived = brokerFee.totalReceived + commission;
    await brokerFee.save();

    // ---------------------------------------------------------------------------------------

    const rewardId: string = event.transactionHash.concat(event.logIndex.toString());
    const brokerReward: BrokerReward = BrokerReward.create({
      id: rewardId,
      broker: brokerAddr,
      taker: event.args.holder.toLowerCase(),
      token: event.args.token.toLowerCase(),
      orderID: event.args.orderID.toBigInt(),
      tradingFee: event.args.tradingFee.toBigInt(),
      brokerPortion: portion,
      reward: commission,
      transactionHash: event.transactionHash,
      blockNumber: BigInt(event.block.number),
      blockTimestamp: event.block.timestamp,
    });
    await brokerReward.save();
  }

  // -----------------------------------------------------------------------------------------
  // Entity UnderlyingPosition

  const underlyingPos: UnderlyingPosition = await loadUnderlyingPosition(
    event.args.name,
    event.args.token.toLowerCase()
  );
  underlyingPos.amount = underlyingPos.amount + event.args.number.toBigInt();
  await underlyingPos.save();
}

export async function handleWithdrawn(event: WithdrawnEvent): Promise<void> {
  if (!event.args) {
    return;
  }

  // ----------------------------------------------------------------------------------------
  // Entity Withdrawn

  const id: string = event.transactionHash.concat(event.logIndex.toString());

  const entity: Withdrawn = Withdrawn.create({
    id: id,
    user: event.args.user.toLowerCase(),
    token: event.args.token.toLowerCase(),
    amount: event.args.amount.toBigInt(),
    blockNumber: BigInt(event.blockNumber),
    blockTimestamp: event.block.timestamp,
    transactionHash: event.transactionHash,
  });

  await entity.save();

  // ----------------------------------------------------------------------------------------
  // Entity TakerFund

  const takerFund: TakerFund = await loadTakerFund(event.args.user.toLowerCase(), event.args.token.toLowerCase());
  takerFund.withdrawn = takerFund.withdrawn + event.args.amount.toBigInt();
  takerFund.netDeposit = takerFund.deposited - takerFund.withdrawn;

  await takerFund.save();
}
