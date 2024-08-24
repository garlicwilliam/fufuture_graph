import {
  AddLiquidity as AddLiquidityEvent,
  AddMargin as AddMarginEvent,
  CloseInPrivatePool as CloseInPrivatePoolEvent,
  MatchWithPrivatePool as MatchWithPrivatePoolEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  RiskInPrivatePool as RiskInPrivatePoolEvent,
  Withdraw as WithdrawEvent,
} from '../generated/templates/PrivatePool/PrivatePool';
import {
  AddLiquidityPrivate,
  AddMargin,
  CloseInPrivatePool,
  MakerIndexOrderIdMap,
  MatchWithPrivatePool,
  Order,
  PrivatePoolOrder,
  PrivatePoolOwnershipTransferred,
  RiskInPrivatePool,
  Taker,
  WithdrawPrivate,
} from '../generated/schema';
import {
  createMakerIndexMap,
  loadMakerIndexMap,
  loadOrder,
  loadPrivatePoolOrder,
  loadTaker,
  ONE,
  updatePrivatePoolUnderlying,
} from './load-entities';
import { BigInt } from '@graphprotocol/graph-ts';

export function handleAddLiquidity(event: AddLiquidityEvent): void {
  let entity: AddLiquidityPrivate = new AddLiquidityPrivate(event.transaction.hash.concatI32(event.logIndex.toI32()));
  entity.account = event.params.account;
  entity.amount = event.params.amount;
  entity.fromContract = event.address;
  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;
  entity.save();

  updatePrivatePoolUnderlying(event.address);
}

export function handleAddMargin(event: AddMarginEvent): void {
  let entity: AddMargin = new AddMargin(event.transaction.hash.concatI32(event.logIndex.toI32()));
  entity.account = event.params.account;
  entity.makerID = event.params.orderID;
  entity.amount = event.params.amount;
  entity.margin = event.params.margin;
  entity.fromContract = event.address;
  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;
  entity.save();

  const makerIndexMap: MakerIndexOrderIdMap | null = loadMakerIndexMap(event.address, event.params.orderID);

  if (makerIndexMap !== null) {
    const order: Order = loadOrder(makerIndexMap.orderID.toString());
    order.makerMargin = event.params.margin;
    order.save();
  }
}

export function handleCloseInPrivatePool(event: CloseInPrivatePoolEvent): void {
  let entity: CloseInPrivatePool = new CloseInPrivatePool(event.transaction.hash.concatI32(event.logIndex.toI32()));
  entity.maker = event.params.maker;
  entity.makerID = event.params.makerID;
  entity.orderID = event.params.orderID;
  entity.userProfit = event.params.userProfit;
  entity.fromContract = event.address;
  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  const order: Order = loadOrder(event.params.orderID.toString());
  order.positionProfit = event.params.userProfit;
  order.save();

  const hasUserProfit: boolean = !event.params.userProfit.isZero();
  if (hasUserProfit) {
    const taker: Taker = loadTaker(order.taker);
    taker.orderCountProfit = taker.orderCountProfit.plus(ONE);
    taker.save();
  }

  const poolOrder: PrivatePoolOrder = loadPrivatePoolOrder(event.params.orderID.toString());
  poolOrder.isActive = false;
  poolOrder.save();
}

export function handleMatchWithPrivatePool(event: MatchWithPrivatePoolEvent): void {
  let entity: MatchWithPrivatePool = new MatchWithPrivatePool(event.transaction.hash.concatI32(event.logIndex.toI32()));
  entity.orderID = event.params.orderID;
  entity.maker = event.params.maker;
  entity.makerID = event.params.makerID;
  entity.marginAmount = event.params.marginAmount;
  entity.marginFee = event.params.marginFee;
  entity.fromContract = event.address;
  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;
  entity.save();

  const orderID: string = event.params.orderID.toString();
  const order: Order = loadOrder(orderID);
  order.maker = event.params.maker;
  order.makerMargin = event.params.marginAmount;
  order.makerMaintenanceMargin = event.params.marginFee;
  order.save();

  const makerIndex: BigInt = event.params.makerID.minus(ONE);
  createMakerIndexMap(event.address, makerIndex, event.params.orderID);

  const poolOrder: PrivatePoolOrder = loadPrivatePoolOrder(orderID);
  poolOrder.makerID = makerIndex;
  poolOrder.pool = event.address;
  poolOrder.maker = event.params.maker;
  poolOrder.isActive = true;
  poolOrder.save();
}

export function handleOwnershipTransferred(event: OwnershipTransferredEvent): void {
  let entity: PrivatePoolOwnershipTransferred = new PrivatePoolOwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.previousOwner = event.params.previousOwner;
  entity.newOwner = event.params.newOwner;
  entity.fromContract = event.address;
  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;
  entity.save();
}

export function handleRiskInPrivatePool(event: RiskInPrivatePoolEvent): void {
  let entity: RiskInPrivatePool = new RiskInPrivatePool(event.transaction.hash.concatI32(event.logIndex.toI32()));
  entity.maker = event.params.maker;
  entity.makerID = event.params.makerID;
  entity.orderID = event.params.orderID;
  entity.userProfit = event.params.userProfit;
  entity.fromContract = event.address;
  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;
  entity.save();

  const poolOrder: PrivatePoolOrder = loadPrivatePoolOrder(event.params.orderID.toString());
  poolOrder.isActive = false;
  poolOrder.save();
}

export function handleWithdraw(event: WithdrawEvent): void {
  let entity: WithdrawPrivate = new WithdrawPrivate(event.transaction.hash.concatI32(event.logIndex.toI32()));
  entity.account = event.params.account;
  entity.amount = event.params.amount;
  entity.fromContract = event.address;
  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;
  entity.save();
}
