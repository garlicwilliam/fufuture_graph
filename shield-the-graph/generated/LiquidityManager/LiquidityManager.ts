// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt,
} from "@graphprotocol/graph-ts";

export class CreatePrivatePool extends ethereum.Event {
  get params(): CreatePrivatePool__Params {
    return new CreatePrivatePool__Params(this);
  }
}

export class CreatePrivatePool__Params {
  _event: CreatePrivatePool;

  constructor(event: CreatePrivatePool) {
    this._event = event;
  }

  get creator(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get tokenAddr(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get poolAddr(): Address {
    return this._event.parameters[2].value.toAddress();
  }
}

export class CreatePublicPool extends ethereum.Event {
  get params(): CreatePublicPool__Params {
    return new CreatePublicPool__Params(this);
  }
}

export class CreatePublicPool__Params {
  _event: CreatePublicPool;

  constructor(event: CreatePublicPool) {
    this._event = event;
  }

  get creator(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get tokenAddr(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get poolAddr(): Address {
    return this._event.parameters[2].value.toAddress();
  }
}

export class OwnershipTransferred extends ethereum.Event {
  get params(): OwnershipTransferred__Params {
    return new OwnershipTransferred__Params(this);
  }
}

export class OwnershipTransferred__Params {
  _event: OwnershipTransferred;

  constructor(event: OwnershipTransferred) {
    this._event = event;
  }

  get previousOwner(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get newOwner(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class LiquidityManager__getLiquidityPoolResult {
  value0: Address;
  value1: Address;

  constructor(value0: Address, value1: Address) {
    this.value0 = value0;
    this.value1 = value1;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromAddress(this.value0));
    map.set("value1", ethereum.Value.fromAddress(this.value1));
    return map;
  }

  getPriPool(): Address {
    return this.value0;
  }

  getPubPool(): Address {
    return this.value1;
  }
}

export class LiquidityManager extends ethereum.SmartContract {
  static bind(address: Address): LiquidityManager {
    return new LiquidityManager("LiquidityManager", address);
  }

  liquidityFactory(): Address {
    let result = super.call(
      "liquidityFactory",
      "liquidityFactory():(address)",
      [],
    );

    return result[0].toAddress();
  }

  try_liquidityFactory(): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "liquidityFactory",
      "liquidityFactory():(address)",
      [],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  owner(): Address {
    let result = super.call("owner", "owner():(address)", []);

    return result[0].toAddress();
  }

  try_owner(): ethereum.CallResult<Address> {
    let result = super.tryCall("owner", "owner():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  perpetual(): Address {
    let result = super.call("perpetual", "perpetual():(address)", []);

    return result[0].toAddress();
  }

  try_perpetual(): ethereum.CallResult<Address> {
    let result = super.tryCall("perpetual", "perpetual():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  privatePools(param0: Address, param1: string): Address {
    let result = super.call(
      "privatePools",
      "privatePools(address,string):(address)",
      [ethereum.Value.fromAddress(param0), ethereum.Value.fromString(param1)],
    );

    return result[0].toAddress();
  }

  try_privatePools(
    param0: Address,
    param1: string,
  ): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "privatePools",
      "privatePools(address,string):(address)",
      [ethereum.Value.fromAddress(param0), ethereum.Value.fromString(param1)],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  publicPools(param0: Address): Address {
    let result = super.call("publicPools", "publicPools(address):(address)", [
      ethereum.Value.fromAddress(param0),
    ]);

    return result[0].toAddress();
  }

  try_publicPools(param0: Address): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "publicPools",
      "publicPools(address):(address)",
      [ethereum.Value.fromAddress(param0)],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  riskFundAddr(): Address {
    let result = super.call("riskFundAddr", "riskFundAddr():(address)", []);

    return result[0].toAddress();
  }

  try_riskFundAddr(): ethereum.CallResult<Address> {
    let result = super.tryCall("riskFundAddr", "riskFundAddr():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  addLiquidity(
    _token: Address,
    _name: string,
    _isPrivate: boolean,
    _amount: BigInt,
  ): BigInt {
    let result = super.call(
      "addLiquidity",
      "addLiquidity(address,string,bool,uint256):(uint256)",
      [
        ethereum.Value.fromAddress(_token),
        ethereum.Value.fromString(_name),
        ethereum.Value.fromBoolean(_isPrivate),
        ethereum.Value.fromUnsignedBigInt(_amount),
      ],
    );

    return result[0].toBigInt();
  }

  try_addLiquidity(
    _token: Address,
    _name: string,
    _isPrivate: boolean,
    _amount: BigInt,
  ): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "addLiquidity",
      "addLiquidity(address,string,bool,uint256):(uint256)",
      [
        ethereum.Value.fromAddress(_token),
        ethereum.Value.fromString(_name),
        ethereum.Value.fromBoolean(_isPrivate),
        ethereum.Value.fromUnsignedBigInt(_amount),
      ],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  getLiquidityPool(
    _token: Address,
    _name: string,
  ): LiquidityManager__getLiquidityPoolResult {
    let result = super.call(
      "getLiquidityPool",
      "getLiquidityPool(address,string):(address,address)",
      [ethereum.Value.fromAddress(_token), ethereum.Value.fromString(_name)],
    );

    return new LiquidityManager__getLiquidityPoolResult(
      result[0].toAddress(),
      result[1].toAddress(),
    );
  }

  try_getLiquidityPool(
    _token: Address,
    _name: string,
  ): ethereum.CallResult<LiquidityManager__getLiquidityPoolResult> {
    let result = super.tryCall(
      "getLiquidityPool",
      "getLiquidityPool(address,string):(address,address)",
      [ethereum.Value.fromAddress(_token), ethereum.Value.fromString(_name)],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new LiquidityManager__getLiquidityPoolResult(
        value[0].toAddress(),
        value[1].toAddress(),
      ),
    );
  }

  getTokenListLength(): BigInt {
    let result = super.call(
      "getTokenListLength",
      "getTokenListLength():(uint256)",
      [],
    );

    return result[0].toBigInt();
  }

  try_getTokenListLength(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "getTokenListLength",
      "getTokenListLength():(uint256)",
      [],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  getTokenList(_index: BigInt, _limit: BigInt): Array<Address> {
    let result = super.call(
      "getTokenList",
      "getTokenList(uint256,uint256):(address[])",
      [
        ethereum.Value.fromUnsignedBigInt(_index),
        ethereum.Value.fromUnsignedBigInt(_limit),
      ],
    );

    return result[0].toAddressArray();
  }

  try_getTokenList(
    _index: BigInt,
    _limit: BigInt,
  ): ethereum.CallResult<Array<Address>> {
    let result = super.tryCall(
      "getTokenList",
      "getTokenList(uint256,uint256):(address[])",
      [
        ethereum.Value.fromUnsignedBigInt(_index),
        ethereum.Value.fromUnsignedBigInt(_limit),
      ],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddressArray());
  }
}

export class ConstructorCall extends ethereum.Call {
  get inputs(): ConstructorCall__Inputs {
    return new ConstructorCall__Inputs(this);
  }

  get outputs(): ConstructorCall__Outputs {
    return new ConstructorCall__Outputs(this);
  }
}

export class ConstructorCall__Inputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }

  get _factory(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _riskFundAddr(): Address {
    return this._call.inputValues[1].value.toAddress();
  }
}

export class ConstructorCall__Outputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class RenounceOwnershipCall extends ethereum.Call {
  get inputs(): RenounceOwnershipCall__Inputs {
    return new RenounceOwnershipCall__Inputs(this);
  }

  get outputs(): RenounceOwnershipCall__Outputs {
    return new RenounceOwnershipCall__Outputs(this);
  }
}

export class RenounceOwnershipCall__Inputs {
  _call: RenounceOwnershipCall;

  constructor(call: RenounceOwnershipCall) {
    this._call = call;
  }
}

export class RenounceOwnershipCall__Outputs {
  _call: RenounceOwnershipCall;

  constructor(call: RenounceOwnershipCall) {
    this._call = call;
  }
}

export class TransferOwnershipCall extends ethereum.Call {
  get inputs(): TransferOwnershipCall__Inputs {
    return new TransferOwnershipCall__Inputs(this);
  }

  get outputs(): TransferOwnershipCall__Outputs {
    return new TransferOwnershipCall__Outputs(this);
  }
}

export class TransferOwnershipCall__Inputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }

  get newOwner(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class TransferOwnershipCall__Outputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }
}

export class AddLiquidityCall extends ethereum.Call {
  get inputs(): AddLiquidityCall__Inputs {
    return new AddLiquidityCall__Inputs(this);
  }

  get outputs(): AddLiquidityCall__Outputs {
    return new AddLiquidityCall__Outputs(this);
  }
}

export class AddLiquidityCall__Inputs {
  _call: AddLiquidityCall;

  constructor(call: AddLiquidityCall) {
    this._call = call;
  }

  get _token(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _name(): string {
    return this._call.inputValues[1].value.toString();
  }

  get _isPrivate(): boolean {
    return this._call.inputValues[2].value.toBoolean();
  }

  get _amount(): BigInt {
    return this._call.inputValues[3].value.toBigInt();
  }
}

export class AddLiquidityCall__Outputs {
  _call: AddLiquidityCall;

  constructor(call: AddLiquidityCall) {
    this._call = call;
  }

  get lp(): BigInt {
    return this._call.outputValues[0].value.toBigInt();
  }
}

export class SetPerpetualCall extends ethereum.Call {
  get inputs(): SetPerpetualCall__Inputs {
    return new SetPerpetualCall__Inputs(this);
  }

  get outputs(): SetPerpetualCall__Outputs {
    return new SetPerpetualCall__Outputs(this);
  }
}

export class SetPerpetualCall__Inputs {
  _call: SetPerpetualCall;

  constructor(call: SetPerpetualCall) {
    this._call = call;
  }

  get _perpetual(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class SetPerpetualCall__Outputs {
  _call: SetPerpetualCall;

  constructor(call: SetPerpetualCall) {
    this._call = call;
  }
}
