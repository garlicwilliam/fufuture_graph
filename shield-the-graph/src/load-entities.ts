import { Address } from '@graphprotocol/graph-ts/common/numbers';
import {
  Broker,
  BrokerTradingFee,
  MakerIndexOrderIdMap,
  Order,
  PrivatePoolInstance,
  PrivatePoolOrder,
  PublicPoolInstance,
  Taker,
  TakerFund,
  TakerTradingFee,
  UnderlyingPosition,
} from '../generated/schema';
import { BigInt, Bytes } from '@graphprotocol/graph-ts';
import { PrivatePool as PrivatePoolContract } from '../generated/templates/PrivatePool/PrivatePool';
import { PerpetualOptions } from '../generated/PerpetualOptions/PerpetualOptions';

export const EMPTY_ADDRESS: Bytes = Address.zero();
export const ZERO: BigInt = BigInt.zero();
export const ONE: BigInt = BigInt.fromU32(1);
export const HUNDRED: BigInt = BigInt.fromU32(100);

export function loadTaker(takerAddr: Bytes): Taker {
  let taker = Taker.load(takerAddr);
  if (taker === null) {
    taker = new Taker(takerAddr);
    taker.inviter = EMPTY_ADDRESS;
    taker.inviteTimestamp = ZERO;
    taker.orderCount = ZERO;
    taker.orderCountClosed = ZERO;
    taker.orderCountProfit = ZERO;
    taker.firstDepositTimestamp = ZERO;
    taker.lastOrderTimestamp = ZERO;
  }

  return taker;
}

export function loadTakerTradingFee(taker: Bytes, token: Bytes): TakerTradingFee {
  const id = taker.concat(token);

  let takerFee: TakerTradingFee | null = TakerTradingFee.load(id);
  if (takerFee === null) {
    takerFee = new TakerTradingFee(id);
    takerFee.taker = taker;
    takerFee.token = token;
    takerFee.totalPaid = ZERO;
  }

  return takerFee;
}

export function loadTakerFund(takerAddr: Bytes, token: Bytes): TakerFund {
  const id: Bytes = takerAddr.concat(token);
  let takerFund: TakerFund | null = TakerFund.load(id);
  if (takerFund === null) {
    takerFund = new TakerFund(id);
    takerFund.taker = takerAddr;
    takerFund.token = token;
    takerFund.deposited = ZERO;
    takerFund.withdrawn = ZERO;
    takerFund.netDeposit = ZERO;
    takerFund.save();
  }

  return takerFund;
}

export function loadBroker(brokerAddr: Bytes): Broker {
  let broker = Broker.load(brokerAddr);
  if (broker === null) {
    broker = new Broker(brokerAddr);
    broker.referralCount = ZERO;
    broker.referralOrderCount = ZERO;
    broker.firstReferralTimestamp = ZERO;
    broker.lastReferralTimestamp = ZERO;
  }

  return broker;
}

export function loadBrokerTradingFee(brokerAddr: Bytes, token: Bytes): BrokerTradingFee {
  const id = brokerAddr.concat(token);

  let brokerFee = BrokerTradingFee.load(id);
  if (brokerFee === null) {
    brokerFee = new BrokerTradingFee(id);
    brokerFee.broker = brokerAddr;
    brokerFee.token = token;
    brokerFee.takerTotalPaid = ZERO;
    brokerFee.totalReceived = ZERO;
  }

  return brokerFee;
}

export function loadUnderlyingPosition(underlying: string, token: Bytes): UnderlyingPosition {
  const id: string = underlying.concat(token.toHexString());

  let pos: UnderlyingPosition | null = UnderlyingPosition.load(id);
  if (!pos) {
    pos = new UnderlyingPosition(id);
    pos.underlying = underlying;
    pos.token = token;
    pos.amount = ZERO;
    pos.save();
  }

  return pos;
}

export function loadOrder(orderId: string): Order {
  let order: Order | null = Order.load(orderId);
  if (order === null) {
    order = new Order(orderId);
    order.taker = EMPTY_ADDRESS;
    order.token = EMPTY_ADDRESS;
    order.isBuy = true;
    order.name = '';
    order.amount = ZERO;
    order.tradingFee = ZERO;
    order.openPrice = ZERO;
    order.openTimestamp = ZERO;
    order.openBlockNumber = ZERO;
    order.status = 0;
    order.fundingFee = ZERO;
    order.closePrice = ZERO;
    order.closeTimestamp = ZERO;
    order.closeBlockNumber = ZERO;
    order.positionProfit = ZERO;
    order.inviter = EMPTY_ADDRESS;
    order.maker = EMPTY_ADDRESS;
    order.makerMargin = ZERO;
    order.makerMaintenanceMargin = ZERO;
    order.usedPubPool = false;
    order.movedToPubPool = false;
    order.movedProfit = ZERO;
    order.save();
  }

  return order;
}

export function loadPrivatePoolOrder(orderId: string): PrivatePoolOrder {
  let order: PrivatePoolOrder | null = PrivatePoolOrder.load(orderId);
  if (order === null) {
    order = new PrivatePoolOrder(orderId);
    order.makerID = ZERO;
    order.pool = EMPTY_ADDRESS;
    order.maker = EMPTY_ADDRESS;
    order.isActive = true;
    order.save();
  }

  return order;
}

export function createMakerIndexMap(pool: Bytes, index: BigInt, orderId: BigInt): MakerIndexOrderIdMap {
  const id: Bytes = pool.concatI32(index.toI32());
  let makerIndexMap: MakerIndexOrderIdMap | null = MakerIndexOrderIdMap.load(id);

  if (makerIndexMap === null) {
    makerIndexMap = new MakerIndexOrderIdMap(id);
    makerIndexMap.makerIndex = index;
    makerIndexMap.orderID = orderId;
    makerIndexMap.privatePool = pool;
    makerIndexMap.save();
  }

  return makerIndexMap;
}

export function loadMakerIndexMap(pool: Bytes, index: BigInt): MakerIndexOrderIdMap | null {
  const id: Bytes = pool.concatI32(index.toI32());
  return MakerIndexOrderIdMap.load(id);
}

export function createPrivatePool(
  pool: Bytes,
  underlying: string,
  token: Bytes,
  timestamp: BigInt,
  blockNumber: BigInt
): PrivatePoolInstance {
  let privatePool: PrivatePoolInstance | null = PrivatePoolInstance.load(pool);
  if (privatePool === null) {
    privatePool = new PrivatePoolInstance(pool);
    privatePool.underlying = underlying;
    privatePool.token = token;
    privatePool.createTimestamp = timestamp;
    privatePool.createBlockNumber = blockNumber;
    privatePool.save();
  }

  return privatePool;
}

export function updatePrivatePoolUnderlying(poolAddr: Address): PrivatePoolInstance | null {
  const privatePool: PrivatePoolInstance | null = PrivatePoolInstance.load(poolAddr);

  if (privatePool !== null && privatePool.underlying.trim().length === 0) {
    const privatePoolContract: PrivatePoolContract = PrivatePoolContract.bind(poolAddr);
    const underlying: string = privatePoolContract.underlyingName();
    privatePool.underlying = underlying;
    privatePool.save();
  }

  return privatePool;
}

export function createPublicPool(
  pool: Bytes,
  token: Bytes,
  timestamp: BigInt,
  blockNumber: BigInt
): PublicPoolInstance {
  let publicPool: PublicPoolInstance | null = PublicPoolInstance.load(pool);
  if (publicPool === null) {
    publicPool = new PublicPoolInstance(pool);
    publicPool.token = token;
    publicPool.createBlockNumber = blockNumber;
    publicPool.createTimestamp = timestamp;
    publicPool.save();
  }

  return publicPool;
}

export function readBrokerPortion(optionAddr: Address): BigInt {
  const OptionContract: PerpetualOptions = PerpetualOptions.bind(optionAddr);
  const portion: BigInt = OptionContract.brokerPortion();

  return portion;
}
