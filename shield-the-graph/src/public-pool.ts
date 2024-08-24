import {
  AddLiquidity as AddLiquidityEvent,
  Approval as ApprovalEvent,
  CloseInPublicPool as CloseInPublicPoolEvent,
  MatchWithPublicPool as MatchWithPublicPoolEvent,
  MoveToPublic as MoveToPublicEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  RiskInPubicPool as RiskInPubicPoolEvent,
  Transfer as TransferEvent,
  Withdraw as WithdrawEvent
} from "../generated/templates/PublicPool/PublicPool";
import {
  AddLiquidityPublic,
  Approval,
  CloseInPublicPool,
  MatchWithPublicPool,
  MoveToPublic,
  Order,
  PublicPoolOwnershipTransferred,
  RiskInPubicPool,
  Taker,
  Transfer,
  WithdrawPublic
} from "../generated/schema";
import { loadOrder, loadTaker, ONE } from "./load-entities";

export function handleAddLiquidity(event: AddLiquidityEvent): void {
  let entity: AddLiquidityPublic = new AddLiquidityPublic(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.account = event.params.account;
  entity.amount = event.params.amount;
  entity.minted = event.params.minted;
  entity.fromContract = event.address;
  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;
  entity.save();
}

export function handleApproval(event: ApprovalEvent): void {
  let entity = new Approval(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.owner = event.params.owner;
  entity.spender = event.params.spender;
  entity.value = event.params.value;
  entity.fromContract = event.address;
  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleCloseInPublicPool(event: CloseInPublicPoolEvent): void {
  let entity: CloseInPublicPool = new CloseInPublicPool(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
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

  const userHasProfit: boolean = !event.params.userProfit.isZero();
  if (userHasProfit) {
    const taker: Taker = loadTaker(order.taker);
    taker.orderCountProfit = taker.orderCountProfit.plus(ONE);
    taker.save();
  }
}

export function handleMatchWithPublicPool(
  event: MatchWithPublicPoolEvent
): void {
  let entity: MatchWithPublicPool = new MatchWithPublicPool(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.orderID = event.params.orderID;
  entity.makerID = event.params.makerID;
  entity.marginAmount = event.params.marginAmount;
  entity.marginFee = event.params.marginFee;
  entity.fromContract = event.address;
  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;
  entity.save();

  const order: Order = loadOrder(event.params.orderID.toString());
  order.usedPubPool = true;
  order.save();
}

export function handleMoveToPublic(event: MoveToPublicEvent): void {
  let entity: MoveToPublic = new MoveToPublic(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.orderID = event.params.id;
  entity.profit = event.params.profit;
  entity.moveProfit = event.params.moveProfit;
  entity.openPrice = event.params.openPrice;
  entity.movePrice = event.params.movePrice;
  entity.fromContract = event.address;
  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;
  entity.save();

  const order: Order = loadOrder(event.params.id.toString());
  order.usedPubPool = true;
  order.movedToPubPool = true;
  order.movedProfit = event.params.moveProfit;
  order.save();
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity: PublicPoolOwnershipTransferred = new PublicPoolOwnershipTransferred(
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

export function handleRiskInPubicPool(event: RiskInPubicPoolEvent): void {
  let entity: RiskInPubicPool = new RiskInPubicPool(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.makerID = event.params.makerID;
  entity.orderID = event.params.orderID;
  entity.userProfit = event.params.userProfit;
  entity.fromContract = event.address;
  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;
  entity.save();
}

export function handleTransfer(event: TransferEvent): void {
  let entity = new Transfer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.from = event.params.from;
  entity.to = event.params.to;
  entity.value = event.params.value;
  entity.fromContract = event.address;
  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleWithdraw(event: WithdrawEvent): void {
  let entity: WithdrawPublic = new WithdrawPublic(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.account = event.params.account;
  entity.amount = event.params.amount;
  entity.fromContract = event.address;
  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;
  entity.save();
}
