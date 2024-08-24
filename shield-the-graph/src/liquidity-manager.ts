import {
  CreatePrivatePool as CreatePrivatePoolEvent,
  CreatePublicPool as CreatePublicPoolEvent,
  OwnershipTransferred as OwnershipTransferredEvent
} from "../generated/LiquidityManager/LiquidityManager";
import {
  CreatePrivatePool,
  CreatePublicPool,
  LiquidityManagerOwnershipTransferred
} from "../generated/schema";
import { PrivatePool, PublicPool } from "../generated/templates";
import { createPrivatePool, createPublicPool } from "./load-entities";

export function handleCreatePrivatePool(event: CreatePrivatePoolEvent): void {
  PrivatePool.create(event.params.poolAddr);
  let entity: CreatePrivatePool = new CreatePrivatePool(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.creator = event.params.creator;
  entity.tokenAddr = event.params.tokenAddr;
  entity.poolAddr = event.params.poolAddr;
  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;
  entity.save();

  // create private pool entity
  createPrivatePool(
    event.params.poolAddr,
    "",
    event.params.tokenAddr,
    event.block.timestamp,
    event.block.number
  );
}

export function handleCreatePublicPool(event: CreatePublicPoolEvent): void {
  PublicPool.create(event.params.poolAddr);
  let entity: CreatePublicPool = new CreatePublicPool(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.creator = event.params.creator;
  entity.tokenAddr = event.params.tokenAddr;
  entity.poolAddr = event.params.poolAddr;
  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;
  entity.save();

  createPublicPool(
    event.params.poolAddr,
    event.params.tokenAddr,
    event.block.timestamp,
    event.block.number
  );
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new LiquidityManagerOwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.previousOwner = event.params.previousOwner;
  entity.newOwner = event.params.newOwner;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}
