import {
  AddBroker as AddBrokerEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  SetKeeper as SetKeeperEvent,
} from '../generated/Broker/Broker';
import { AddBroker, Broker, BrokerOwnershipTransferred, SetKeeper, Taker } from '../generated/schema';
import { EMPTY_ADDRESS, loadBroker, loadTaker, ONE } from './load-entities';

export function handleAddBroker(event: AddBrokerEvent): void {
  let entity: AddBroker = new AddBroker(event.transaction.hash.concatI32(event.logIndex.toI32()));
  entity.invitee = event.params.invitee;
  entity.inviter = event.params.inviter;
  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;
  entity.save();

  if (event.params.inviter.equals(EMPTY_ADDRESS)) {
    return;
  }

  const taker: Taker = loadTaker(event.params.invitee);
  taker.inviter = event.params.inviter;
  taker.inviteTimestamp = event.block.timestamp;
  taker.save();

  const broker: Broker = loadBroker(event.params.inviter);
  broker.referralCount = broker.referralCount.plus(ONE);
  broker.lastReferralTimestamp = event.block.timestamp;
  if (broker.firstReferralTimestamp.isZero()) {
    broker.firstReferralTimestamp = event.block.timestamp;
  }
  broker.save();
}

export function handleOwnershipTransferred(event: OwnershipTransferredEvent): void {
  let entity: BrokerOwnershipTransferred = new BrokerOwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.previousOwner = event.params.previousOwner;
  entity.newOwner = event.params.newOwner;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleSetKeeper(event: SetKeeperEvent): void {
  let entity: SetKeeper = new SetKeeper(event.transaction.hash.concatI32(event.logIndex.toI32()));
  entity.keeper = event.params.keeper;
  entity.flag = event.params.flag;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}
