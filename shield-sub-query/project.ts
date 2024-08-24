import { EthereumDatasourceKind, EthereumHandlerKind, EthereumProject } from '@subql/types-ethereum';

import * as dotenv from 'dotenv';
import * as path from 'path';

const mode = process.env.NODE_ENV || 'production';

// Load the appropriate .env file
const dotenvPath = path.resolve(process.cwd(), `.env${mode !== 'production' ? `.${mode}` : ''}`);
dotenv.config({ path: dotenvPath });

// Can expand the Datasource processor types via the generic param
const project: EthereumProject = {
  specVersion: '1.0.0',
  version: '0.0.1',
  name: 'opbnb-starter',
  description: 'This project can be use as a starting point for developing your new opBNB SubQuery project',
  runner: {
    node: {
      name: '@subql/node-ethereum',
      version: '>=3.0.0',
      options: {
        skipTransactions: true,
      },
    },
    query: {
      name: '@subql/query',
      version: '*',
    },
  },
  schema: {
    file: './schema.graphql',
  },
  network: {
    chainId: process.env.CHAIN_ID!,
    endpoint: process.env.ENDPOINT!?.split(',') as string[] | string,
  },
  dataSources: [
    {
      kind: EthereumDatasourceKind.Runtime,
      startBlock: 26466500,
      options: {
        abi: 'PerpetualOptions',
        address: '0xa5a6B19aDC9e92C1be1720b0e2E2eC03Ac16845d',
      },
      assets: new Map([['PerpetualOptions', { file: './abis/PerpetualOptions.json' }]]),
      mapping: {
        file: './dist/index.js',
        handlers: [
          {
            kind: EthereumHandlerKind.Event,
            handler: 'handleCloseOrder',
            filter: {
              topics: [
                'CloseOrder(address indexed,address indexed,uint256,uint8,bool,string,uint256,uint256,uint256,uint256)',
              ],
            },
          },
          {
            kind: EthereumHandlerKind.Event,
            handler: 'handleDeposit',
            filter: {
              topics: ['Deposit(address,address,uint256)'],
            },
          },
          {
            kind: EthereumHandlerKind.Event,
            handler: 'handleTrade',
            filter: {
              topics: [
                'Trade(address indexed,address indexed,uint256,bool,string,uint256,uint256,uint256,uint256,uint256,uint256)',
              ],
            },
          },
          {
            kind: EthereumHandlerKind.Event,
            handler: 'handleWithdrawn',
            filter: {
              topics: ['Withdrawn(address,address,uint256)'],
            },
          },
        ],
      },
    },
    {
      kind: EthereumDatasourceKind.Runtime,
      startBlock: 26466500,
      options: {
        abi: 'Broker',
        address: '0xd3B7E0117487682c6a099CbBB4910c6e209f7061',
      },
      assets: new Map([['Broker', { file: './abis/Broker.json' }]]),
      mapping: {
        file: './dist/index.js',
        handlers: [
          {
            kind: EthereumHandlerKind.Event,
            handler: 'handleAddBroker',
            filter: {
              topics: ['AddBroker(address,address)'],
            },
          },
        ],
      },
    },
    {
      kind: EthereumDatasourceKind.Runtime,
      startBlock: 26466500,
      options: {
        abi: 'LiquidityManager',
        address: '0x755773F8e288Ec4B4c5E9b823F29ebDf84CFA7e2',
      },
      assets: new Map([
        ['LiquidityManager', { file: './abis/LiquidityManager.json' }],
        ['PublicPool', { file: './abis/PublicPool.json' }],
        ['PrivatePool', { file: './abis/PrivatePool.json' }],
      ]),
      mapping: {
        file: './dist/index.js',
        handlers: [
          {
            kind: EthereumHandlerKind.Event,
            handler: 'handleCreatePrivatePool',
            filter: {
              topics: ['CreatePrivatePool(address indexed,address indexed,address indexed)'],
            },
          },
          {
            kind: EthereumHandlerKind.Event,
            handler: 'handleCreatePublicPool',
            filter: {
              topics: ['CreatePublicPool(address indexed,address indexed,address indexed)'],
            },
          },
        ],
      },
    },
  ],
  templates: [
    {
      kind: EthereumDatasourceKind.Runtime,
      name: 'PrivatePool',
      options: {
        abi: 'PrivatePool',
      },
      assets: new Map([['PrivatePool', { file: './abis/PrivatePool.json' }]]),
      mapping: {
        file: './dist/index.js',
        handlers: [
          {
            kind: EthereumHandlerKind.Event,
            handler: 'handleAddPrivatePoolLiquidity',
            filter: {
              topics: ['AddLiquidity(address indexed,uint256)'],
            },
          },
          {
            kind: EthereumHandlerKind.Event,
            handler: 'handleAddMargin',
            filter: {
              topics: ['AddMargin(address indexed,uint256,uint256,uint256)'],
            },
          },
          {
            kind: EthereumHandlerKind.Event,
            handler: 'handleCloseInPrivatePool',
            filter: {
              topics: ['CloseInPrivatePool(address,uint256,uint256,uint256)'],
            },
          },
          {
            kind: EthereumHandlerKind.Event,
            handler: 'handleMatchWithPrivatePool',
            filter: {
              topics: ['MatchWithPrivatePool(uint256,address,uint256,uint256,uint256)'],
            },
          },
          {
            kind: EthereumHandlerKind.Event,
            handler: 'handleRiskInPrivatePool',
            filter: {
              topics: ['RiskInPrivatePool(address,uint256,uint256,uint256)'],
            },
          },
          {
            kind: EthereumHandlerKind.Event,
            handler: 'handleWithdrawFromPrivatePool',
            filter: {
              topics: ['Withdraw(address indexed,uint256)'],
            },
          },
        ],
      },
    },
    {
      kind: EthereumDatasourceKind.Runtime,
      name: 'PublicPool',
      options: {
        abi: 'PublicPool',
      },
      assets: new Map([['PublicPool', { file: './abis/PublicPool.json' }]]),
      mapping: {
        file: './dist/index.js',
        handlers: [
          {
            kind: EthereumHandlerKind.Event,
            handler: 'handleAddPublicPoolLiquidity',
            filter: {
              topics: ['AddLiquidity(address indexed,uint256,uint256)'],
            },
          },
          {
            kind: EthereumHandlerKind.Event,
            handler: 'handleCloseInPublicPool',
            filter: {
              topics: ['CloseInPublicPool(uint256,uint256,uint256)'],
            },
          },
          {
            kind: EthereumHandlerKind.Event,
            handler: 'handleMatchWithPublicPool',
            filter: {
              topics: ['MatchWithPublicPool(uint256,uint256,uint256,uint256)'],
            },
          },
          {
            kind: EthereumHandlerKind.Event,
            handler: 'handleMoveToPublic',
            filter: {
              topics: ['MoveToPublic(uint256,uint256,uint256,uint256,uint256)'],
            },
          },
          {
            kind: EthereumHandlerKind.Event,
            handler: 'handleRiskInPubicPool',
            filter: {
              topics: ['RiskInPubicPool(uint256,uint256,uint256)'],
            },
          },
          {
            kind: EthereumHandlerKind.Event,
            handler: 'handleTransferReToken',
            filter: {
              topics: ['Transfer(address indexed,address indexed,uint256)'],
            },
          },
          {
            kind: EthereumHandlerKind.Event,
            handler: 'handleWithdrawFromPublicPool',
            filter: {
              topics: ['Withdraw(address indexed,uint256)'],
            },
          },
        ],
      },
    },
  ],
  repository: 'https://github.com/subquery/ethereum-subql-starter',
};

// Must set default to the project instance
export default project;
