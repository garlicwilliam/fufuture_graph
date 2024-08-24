import {
  CreatePrivatePoolLog as CreatePrivatePoolEvent,
  CreatePublicPoolLog as CreatePublicPoolEvent,
} from '../types/abi-interfaces/LiquidityManager';
import {CreatePrivatePool, createPrivatePoolDatasource, CreatePublicPool, createPublicPoolDatasource} from '../types';
import { createPrivatePool, createPublicPool } from './load-entities';

export async function handleCreatePrivatePool(event: CreatePrivatePoolEvent): Promise<void> {
  if (!event.args) {
    return;
  }

  await createPrivatePoolDatasource({ address: event.args.poolAddr });

  // Create Event
  const id: string = event.transactionHash.concat(event.logIndex.toString());
  const entity: CreatePrivatePool = CreatePrivatePool.create({
    id: id,
    creator: event.args.creator.toLowerCase(),
    tokenAddr: event.args.tokenAddr.toLowerCase(),
    poolAddr: event.args.poolAddr.toLowerCase(),
    blockNumber: BigInt(event.blockNumber),
    blockTimestamp: event.block.timestamp,
    transactionHash: event.transactionHash,
  });

  await entity.save();

  // create private pool entity
  await createPrivatePool(
    event.args.poolAddr.toLowerCase(),
    '',
    event.args.tokenAddr.toLowerCase(),
    event.block.timestamp,
    BigInt(event.block.number)
  );
}

export async function handleCreatePublicPool(event: CreatePublicPoolEvent): Promise<void> {
  if (!event.args) {
    return;
  }

  await createPublicPoolDatasource({ address: event.args.poolAddr });

  // Create Event
  const id: string = event.transactionHash.concat(event.logIndex.toString());
  const entity: CreatePublicPool = CreatePublicPool.create({
    id: id,
    creator: event.args.creator.toLowerCase(),
    tokenAddr: event.args.tokenAddr.toLowerCase(),
    poolAddr: event.args.poolAddr.toLowerCase(),
    blockNumber: BigInt(event.blockNumber),
    blockTimestamp: event.block.timestamp,
    transactionHash: event.transactionHash,
  });
  await entity.save();

  // create public pool entity
  await createPublicPool(
    event.args.poolAddr.toLowerCase(),
    event.args.tokenAddr.toLowerCase(),
    event.block.timestamp,
    BigInt(event.block.number)
  );
}
