import {
  AddLiquidityLog as AddLiquidityEvent,
  CloseInPublicPoolLog as CloseInPublicPoolEvent,
  MatchWithPublicPoolLog as MatchWithPublicPoolEvent,
  MoveToPublicLog as MoveToPublicEvent,
  RiskInPubicPoolLog as RiskInPubicPoolEvent,
  TransferLog as TransferEvent,
  WithdrawLog as WithdrawEvent,
} from '../types/abi-interfaces/PublicPool';
import {
  AddLiquidityPublic,
  CloseInPublicPool,
  MatchWithPublicPool,
  MoveToPublic,
  Order,
  RiskInPubicPool,
  Taker,
  Transfer,
  WithdrawPublic,
} from '../types';
import { loadOrder, loadTaker, ONE } from './load-entities';

export async function handleAddPublicPoolLiquidity(event: AddLiquidityEvent): Promise<void> {
  if (!event.args) {
    return;
  }

  const id: string = event.transactionHash.concat(event.logIndex.toString());
  const entity: AddLiquidityPublic = AddLiquidityPublic.create({
    id: id,
    account: event.args.account.toLowerCase(),
    amount: event.args.amount.toBigInt(),
    minted: event.args.minted.toBigInt(),
    fromContract: event.address.toLowerCase(),
    blockNumber: BigInt(event.blockNumber),
    blockTimestamp: event.block.timestamp,
    transactionHash: event.transactionHash,
  });

  await entity.save();
}

export async function handleCloseInPublicPool(event: CloseInPublicPoolEvent): Promise<void> {
  if (!event.args) {
    return;
  }

  const id: string = event.transactionHash.concat(event.logIndex.toString());
  const entity: CloseInPublicPool = CloseInPublicPool.create({
    id: id,
    makerID: event.args.makerID.toBigInt(),
    orderID: event.args.orderID.toBigInt(),
    userProfit: event.args.userProfit.toBigInt(),
    fromContract: event.address.toLowerCase(),
    blockNumber: BigInt(event.blockNumber),
    blockTimestamp: event.block.timestamp,
    transactionHash: event.transactionHash,
  });
  await entity.save();

  // ----
  const order: Order = await loadOrder(event.args.orderID.toString());
  order.positionProfit = event.args.userProfit.toBigInt();
  await order.save();

  // ----
  const userHasProfit: boolean = !event.args.userProfit.isZero();
  if (userHasProfit) {
    const taker: Taker = await loadTaker(order.taker);
    taker.orderCountProfit = taker.orderCountProfit + ONE;

    await taker.save();
  }
}

export async function handleMatchWithPublicPool(event: MatchWithPublicPoolEvent): Promise<void> {
  if (!event.args) {
    return;
  }

  const id: string = event.transactionHash.concat(event.logIndex.toString());
  const entity: MatchWithPublicPool = MatchWithPublicPool.create({
    id: id,
    orderID: event.args.orderID.toBigInt(),
    makerID: event.args.makerID.toBigInt(),
    marginAmount: event.args.marginAmount.toBigInt(),
    marginFee: event.args.marginFee.toBigInt(),
    fromContract: event.address.toLowerCase(),
    blockNumber: BigInt(event.blockNumber),
    blockTimestamp: event.block.timestamp,
    transactionHash: event.transactionHash,
  });
  await entity.save();

  // ----

  const order: Order = await loadOrder(event.args.orderID.toString());
  order.usedPubPool = true;
  await order.save();
}

export async function handleMoveToPublic(event: MoveToPublicEvent): Promise<void> {
  if (!event.args) {
    return;
  }

  const id: string = event.transactionHash.concat(event.logIndex.toString());
  const entity: MoveToPublic = MoveToPublic.create({
    id: id,
    orderID: event.args.id.toBigInt(),
    profit: event.args.profit.toBigInt(),
    moveProfit: event.args.moveProfit.toBigInt(),
    openPrice: event.args.openPrice.toBigInt(),
    movePrice: event.args.movePrice.toBigInt(),
    fromContract: event.address.toLowerCase(),
    blockNumber: BigInt(event.blockNumber),
    blockTimestamp: event.block.timestamp,
    transactionHash: event.transactionHash,
  });
  await entity.save();

  // ----

  const order: Order = await loadOrder(event.args.id.toString());
  order.usedPubPool = true;
  order.movedToPubPool = true;
  order.movedProfit = event.args.moveProfit.toBigInt();
  await order.save();
}

export async function handleRiskInPubicPool(event: RiskInPubicPoolEvent): Promise<void> {
  if (!event.args) {
    return;
  }

  const id: string = event.transactionHash.concat(event.logIndex.toString());
  const entity: RiskInPubicPool = RiskInPubicPool.create({
    id: id,
    makerID: event.args.makerID.toBigInt(),
    orderID: event.args.orderID.toBigInt(),
    userProfit: event.args.userProfit.toBigInt(),
    fromContract: event.address.toLowerCase(),
    blockNumber: BigInt(event.blockNumber),
    blockTimestamp: event.block.timestamp,
    transactionHash: event.transactionHash,
  });
  await entity.save();
}

export async function handleTransferReToken(event: TransferEvent): Promise<void> {
  if (!event.args) {
    return;
  }

  const id: string = event.transactionHash.concat(event.logIndex.toString());
  const entity: Transfer = Transfer.create({
    id: id,
    from: event.args.from.toLowerCase(),
    to: event.args.to.toLowerCase(),
    value: event.args.value.toBigInt(),
    fromContract: event.address.toLowerCase(),
    blockNumber: BigInt(event.blockNumber),
    blockTimestamp: event.block.timestamp,
    transactionHash: event.transactionHash,
  });
  await entity.save();
}

export async function handleWithdrawFromPublicPool(event: WithdrawEvent): Promise<void> {
  if (!event.args) {
    return;
  }

  const id: string = event.transactionHash.concat(event.logIndex.toString());
  const entity: WithdrawPublic = WithdrawPublic.create({
    id: id,
    account: event.args.account.toLowerCase(),
    amount: event.args.amount.toBigInt(),
    fromContract: event.address.toLowerCase(),
    blockNumber: BigInt(event.blockNumber),
    blockTimestamp: event.block.timestamp,
    transactionHash: event.transactionHash,
  });
  await entity.save();
}
