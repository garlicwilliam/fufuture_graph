import { AddBrokerLog as AddBrokerEvent } from '../types/abi-interfaces/Broker';
import { AddBroker, Broker, Taker } from '../types';
import { loadBroker, loadTaker, ONE, ZERO, EMPTY_ADDRESS } from './load-entities';

export async function handleAddBroker(event: AddBrokerEvent): Promise<void> {
  if (!event.args) {
    return;
  }

  const id: string = event.transaction.hash.concat(event.logIndex.toString());

  const entity: AddBroker = AddBroker.create({
    id: id,
    invitee: event.args.invitee.toLowerCase(),
    inviter: event.args.inviter.toLowerCase(),
    blockNumber: BigInt(event.blockNumber),
    blockTimestamp: event.block.timestamp,
    transactionHash: event.transactionHash,
  });

  await entity.save();

  if (event.args.inviter.toLowerCase() === EMPTY_ADDRESS) {
    return;
  }

  // Taker
  const taker: Taker = await loadTaker(event.args.invitee.toLowerCase());
  taker.inviter = event.args.inviter.toLowerCase();
  taker.inviteTimestamp = event.block.timestamp;

  await taker.save();

  // Broker
  const broker: Broker = await loadBroker(event.args.inviter.toLowerCase());
  broker.referralCount = broker.referralCount + ONE;
  broker.lastReferralTimestamp = event.block.timestamp;

  if (broker.firstReferralTimestamp === ZERO) {
    broker.firstReferralTimestamp = event.block.timestamp;
  }

  await broker.save();
}
