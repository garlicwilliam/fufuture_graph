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
} from '../types';
import { PrivatePool__factory, PrivatePool, PerpetualOptions__factory, PerpetualOptions } from '../types/contracts';
import { BigNumber } from 'ethers';

export const EMPTY_ADDRESS: string = '0x0000000000000000000000000000000000000000';
export const ZERO: bigint = BigInt(0);
export const ONE: bigint = BigInt(1);
export const HUNDRED: bigint = BigInt(100);

export async function loadTaker(takerAddr: string): Promise<Taker> {
  let taker: Taker | undefined = await Taker.get(takerAddr);

  if (!taker) {
    taker = Taker.create({
      id: takerAddr,
      inviter: EMPTY_ADDRESS,
      inviteTimestamp: ZERO,
      orderCount: ZERO,
      orderCountClosed: ZERO,
      orderCountProfit: ZERO,
      firstDepositTimestamp: ZERO,
      lastOrderTimestamp: ZERO,
    });

    await taker.save();
  }

  return taker;
}

export async function loadTakerTradingFee(taker: string, token: string): Promise<TakerTradingFee> {
  const id: string = taker.concat(token);

  let takerFee: TakerTradingFee | undefined = await TakerTradingFee.get(id);

  if (!takerFee) {
    takerFee = TakerTradingFee.create({
      id: id,
      taker: taker,
      token: token,
      totalPaid: ZERO,
    });

    await takerFee.save();
  }

  return takerFee;
}

export async function loadTakerFund(takerAddr: string, token: string): Promise<TakerFund> {
  const id: string = takerAddr.concat(token);

  let takerFund: TakerFund | undefined = await TakerFund.get(id);

  if (!takerFund) {
    takerFund = TakerFund.create({
      id: id,
      taker: takerAddr,
      token: token,
      deposited: ZERO,
      withdrawn: ZERO,
      netDeposit: ZERO,
    });

    await takerFund.save();
  }

  return takerFund;
}

export async function loadBroker(brokerAddr: string): Promise<Broker> {
  let broker: Broker | undefined = await Broker.get(brokerAddr);

  if (!broker) {
    broker = Broker.create({
      id: brokerAddr,
      referralCount: ZERO,
      referralOrderCount: ZERO,
      firstReferralTimestamp: ZERO,
      lastReferralTimestamp: ZERO,
    });

    await broker.save();
  }

  return broker;
}

export async function loadBrokerTradingFee(brokerAddr: string, token: string): Promise<BrokerTradingFee> {
  const id: string = brokerAddr.concat(token);

  let brokerFee: BrokerTradingFee | undefined = await BrokerTradingFee.get(id);
  if (!brokerFee) {
    brokerFee = BrokerTradingFee.create({
      id: id,
      broker: brokerAddr,
      token: token,
      takerTotalPaid: ZERO,
      totalReceived: ZERO,
    });

    await brokerFee.save();
  }

  return brokerFee;
}

export async function loadUnderlyingPosition(underlying: string, token: string): Promise<UnderlyingPosition> {
  const id: string = underlying.concat(token);

  let pos: UnderlyingPosition | undefined = await UnderlyingPosition.get(id);

  if (!pos) {
    pos = UnderlyingPosition.create({
      id: id,
      underlying: underlying,
      token: token,
      amount: ZERO,
    });

    await pos.save();
  }

  return pos;
}

export async function loadOrder(orderId: string): Promise<Order> {
  let order: Order | undefined = await Order.get(orderId);

  if (!order) {
    order = Order.create({
      id: orderId,
      taker: EMPTY_ADDRESS,
      token: EMPTY_ADDRESS,
      isBuy: true,
      name: '',
      amount: ZERO,
      tradingFee: ZERO,
      openPrice: ZERO,
      openTimestamp: ZERO,
      openBlockNumber: ZERO,
      status: 0,
      fundingFee: ZERO,
      closePrice: ZERO,
      closeTimestamp: ZERO,
      closeBlockNumber: ZERO,
      positionProfit: ZERO,
      inviter: EMPTY_ADDRESS,
      maker: EMPTY_ADDRESS,
      makerMargin: ZERO,
      makerMaintenanceMargin: ZERO,
      usedPubPool: false,
      movedToPubPool: false,
      movedProfit: ZERO,
    });

    await order.save();
  }

  return order;
}

export async function loadPrivatePoolOrder(orderId: string): Promise<PrivatePoolOrder> {
  let order: PrivatePoolOrder | undefined = await PrivatePoolOrder.get(orderId);

  if (!order) {
    order = PrivatePoolOrder.create({
      id: orderId,
      makerID: ZERO,
      pool: EMPTY_ADDRESS,
      maker: EMPTY_ADDRESS,
      isActive: true,
    });

    await order.save();
  }

  return order;
}

export async function createMakerIndexMap(pool: string, index: bigint, orderId: bigint): Promise<MakerIndexOrderIdMap> {
  const id: string = pool.concat(index.toString());

  let makerIndexMap: MakerIndexOrderIdMap | undefined = await MakerIndexOrderIdMap.get(id);

  if (!makerIndexMap) {
    makerIndexMap = MakerIndexOrderIdMap.create({
      id: id,
      makerIndex: index,
      orderID: orderId,
      privatePool: pool,
    });

    await makerIndexMap.save();
  }

  return makerIndexMap;
}

export async function loadMakerIndexMap(pool: string, index: bigint): Promise<MakerIndexOrderIdMap | null> {
  const id: string = pool.concat(index.toString());

  const idMap: MakerIndexOrderIdMap | undefined = await MakerIndexOrderIdMap.get(id);

  return idMap || null;
}

export async function createPrivatePool(
  pool: string,
  underlying: string,
  token: string,
  timestamp: bigint,
  blockNumber: bigint
): Promise<PrivatePoolInstance> {
  let privatePool: PrivatePoolInstance | undefined = await PrivatePoolInstance.get(pool);

  if (!privatePool) {
    privatePool = PrivatePoolInstance.create({
      id: pool,
      underlying: underlying,
      token: token,
      createTimestamp: timestamp,
      createBlockNumber: blockNumber,
    });

    await privatePool.save();
  }

  return privatePool;
}

export async function updatePrivatePoolUnderlying(poolAddr: string): Promise<PrivatePoolInstance | null> {
  const privatePool: PrivatePoolInstance | undefined = await PrivatePoolInstance.get(poolAddr);

  if (!!privatePool && privatePool.underlying.trim().length === 0) {
    const privatePoolContract: PrivatePool = PrivatePool__factory.connect(poolAddr, api);

    privatePool.underlying = await privatePoolContract.underlyingName();

    await privatePool.save();

    return privatePool;
  }

  return null;
}

export async function createPublicPool(
  pool: string,
  token: string,
  timestamp: bigint,
  blockNumber: bigint
): Promise<PublicPoolInstance> {
  let publicPool: PublicPoolInstance | undefined = await PublicPoolInstance.get(pool);

  if (!publicPool) {
    publicPool = PublicPoolInstance.create({
      id: pool,
      token: token,
      createTimestamp: timestamp,
      createBlockNumber: blockNumber,
    });

    await publicPool.save();
  }

  return publicPool;
}

export async function readBrokerPortion(optionAddr: string): Promise<bigint> {
  const optionContract: PerpetualOptions = PerpetualOptions__factory.connect(optionAddr, api);
  const portionNum: BigNumber = await optionContract.brokerPortion();

  return portionNum.toBigInt();
}
