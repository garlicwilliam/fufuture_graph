import {
  AddLiquidityLog as AddLiquidityEvent,
  AddMarginLog as AddMarginEvent,
  CloseInPrivatePoolLog as CloseInPrivatePoolEvent,
  MatchWithPrivatePoolLog as MatchWithPrivatePoolEvent,
  RiskInPrivatePoolLog as RiskInPrivatePoolEvent,
  WithdrawLog as WithdrawEvent,
} from '../types/abi-interfaces/PrivatePool';
import {
  AddLiquidityPrivate,
  AddMargin,
  CloseInPrivatePool,
  MakerIndexOrderIdMap,
  MatchWithPrivatePool,
  Order,
  PrivatePoolOrder,
  RiskInPrivatePool,
  Taker,
  WithdrawPrivate,
} from '../types';
import {
  createMakerIndexMap,
  loadMakerIndexMap,
  loadOrder,
  loadPrivatePoolOrder,
  loadTaker,
  ONE,
  updatePrivatePoolUnderlying,
} from './load-entities';

export async function handleAddPrivatePoolLiquidity(event: AddLiquidityEvent): Promise<void> {
  if (!event.args) {
    return;
  }

  const id: string = event.transactionHash.concat(event.logIndex.toString());
  const entity: AddLiquidityPrivate = AddLiquidityPrivate.create({
    id: id,
    account: event.args.account.toLowerCase(),
    amount: event.args.amount.toBigInt(),
    fromContract: event.address.toLowerCase(),
    blockNumber: BigInt(event.blockNumber),
    blockTimestamp: event.block.timestamp,
    transactionHash: event.transactionHash,
  });
  await entity.save();

  // -------------------------------------------------------------------------------------------------------------------

  await updatePrivatePoolUnderlying(event.address.toLowerCase());
}

export async function handleAddMargin(event: AddMarginEvent): Promise<void> {
  if (!event.args) {
    return;
  }

  const id: string = event.transactionHash.concat(event.logIndex.toString());
  const entity: AddMargin = AddMargin.create({
    id: id,
    account: event.args.account.toLowerCase(),
    makerID: event.args.orderID.toBigInt(),
    amount: event.args.amount.toBigInt(),
    margin: event.args.margin.toBigInt(),
    fromContract: event.address.toLowerCase(),
    blockNumber: BigInt(event.blockNumber),
    blockTimestamp: event.block.timestamp,
    transactionHash: event.transactionHash,
  });
  await entity.save();

  //
  const makerIndexMap: MakerIndexOrderIdMap | null = await loadMakerIndexMap(
    event.address.toLowerCase(),
    event.args.orderID.toBigInt()
  );

  if (makerIndexMap !== null) {
    const order: Order = await loadOrder(makerIndexMap.orderID.toString());
    order.makerMargin = event.args.margin.toBigInt();

    await order.save();
  }
}

export async function handleCloseInPrivatePool(event: CloseInPrivatePoolEvent): Promise<void> {
  if (!event.args) {
    return;
  }

  const id: string = event.transactionHash.concat(event.logIndex.toString());
  const entity: CloseInPrivatePool = CloseInPrivatePool.create({
    id: id,
    maker: event.args.maker.toLowerCase(),
    makerID: event.args.makerID.toBigInt(),
    orderID: event.args.orderID.toBigInt(),
    userProfit: event.args.userProfit.toBigInt(),
    fromContract: event.address.toLowerCase(),
    blockNumber: BigInt(event.blockNumber),
    blockTimestamp: event.block.timestamp,
    transactionHash: event.transactionHash,
  });

  await entity.save();

  const order: Order = await loadOrder(event.args.orderID.toString());
  order.positionProfit = event.args.userProfit.toBigInt();
  await order.save();

  const hasUserProfit: boolean = !event.args.userProfit.isZero();
  if (hasUserProfit) {
    const taker: Taker = await loadTaker(order.taker);
    taker.orderCountProfit = taker.orderCountProfit + ONE;
    await taker.save();
  }

  const poolOrder: PrivatePoolOrder = await loadPrivatePoolOrder(event.args.orderID.toString());
  poolOrder.isActive = false;
  await poolOrder.save();
}

export async function handleMatchWithPrivatePool(event: MatchWithPrivatePoolEvent): Promise<void> {
  if (!event.args) {
    return;
  }

  const id: string = event.transactionHash.concat(event.logIndex.toString());
  const entity: MatchWithPrivatePool = MatchWithPrivatePool.create({
    id: id,
    orderID: event.args.orderID.toBigInt(),
    maker: event.args.maker.toLowerCase(),
    makerID: event.args.makerID.toBigInt(),
    marginAmount: event.args.marginAmount.toBigInt(),
    marginFee: event.args.marginFee.toBigInt(),
    fromContract: event.address.toLowerCase(),
    blockNumber: BigInt(event.blockNumber),
    blockTimestamp: event.block.timestamp,
    transactionHash: event.transactionHash,
  });
  await entity.save();

  //

  const orderID: string = event.args.orderID.toString();
  const order: Order = await loadOrder(orderID);

  order.maker = event.args.maker.toLowerCase();
  order.makerMargin = event.args.marginAmount.toBigInt();
  order.makerMaintenanceMargin = event.args.marginFee.toBigInt();
  await order.save();

  const makerIndex: bigint = event.args.makerID.toBigInt() - ONE;
  await createMakerIndexMap(event.address.toLowerCase(), makerIndex, event.args.orderID.toBigInt());

  const poolOrder: PrivatePoolOrder = await loadPrivatePoolOrder(orderID);
  poolOrder.makerID = makerIndex;
  poolOrder.pool = event.address.toLowerCase();
  poolOrder.maker = event.args.maker.toLowerCase();
  poolOrder.isActive = true;
  await poolOrder.save();
}

export async function handleRiskInPrivatePool(event: RiskInPrivatePoolEvent): Promise<void> {
  if (!event.args) {
    return;
  }

  const id: string = event.transactionHash.concat(event.logIndex.toString());
  const entity: RiskInPrivatePool = RiskInPrivatePool.create({
    id: id,
    maker: event.args.maker.toLowerCase(),
    makerID: event.args.makerID.toBigInt(),
    orderID: event.args.orderID.toBigInt(),
    userProfit: event.args.userProfit.toBigInt(),
    fromContract: event.address.toLowerCase(),
    blockNumber: BigInt(event.blockNumber),
    blockTimestamp: event.block.timestamp,
    transactionHash: event.transactionHash,
  });
  await entity.save();

  const poolOrder: PrivatePoolOrder = await loadPrivatePoolOrder(event.args.orderID.toString());
  poolOrder.isActive = false;
  await poolOrder.save();
}

export async function handleWithdrawFromPrivatePool(event: WithdrawEvent): Promise<void> {
  if (!event.args) {
    return;
  }

  const id: string = event.transactionHash.concat(event.logIndex.toString());
  const entity: WithdrawPrivate = WithdrawPrivate.create({
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
