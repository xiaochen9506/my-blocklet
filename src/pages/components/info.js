import React from 'react';
import { dateFormat, getType, numberFormat, toBTC } from '../../utils';
import '../home.scss';

const infoKeys = [
  { label: 'Hash', key: 'hash' },
  { label: 'Confirmations', key: '' },
  { label: 'Timestamp', key: (obj) => dateFormat(new Date(obj.time * 1000), 'yyyy-MM-dd hh:mm') },
  { label: 'Height', key: 'height' },
  { label: 'Miner', key: '' },
  { label: 'Number of Transactions', key: (obj) => numberFormat(obj.n_tx) },
  { label: 'Difficulty', key: (obj) => numberFormat(obj.difficulty, 2) },
  { label: 'Merkle root', key: 'mrkl_root' },
  { label: 'Version', key: (obj) => `0x${obj.ver.toString(16)}` },
  { label: 'Bits', key: (obj) => numberFormat(obj.bits) },
  { label: 'Weight', key: (obj) => `${numberFormat(obj.weight)} WU` },
  { label: 'Size', key: (obj) => `${numberFormat(obj.weight)} bytes` },
  { label: 'Nonce', key: (obj) => numberFormat(obj.nonce) },
  {
    label: 'Transaction Volume',
    key: (obj) => toBTC(obj.transactionVolume),
  },
  { label: 'Block Reward', key: (obj) => toBTC(obj.blockReward) },
  { label: 'Fee Reward', key: (obj) => toBTC(obj.fee) },
];

const Info = (props) => {
  // eslint-disable-next-line react/prop-types
  const { data } = props;
  return (
    <>
      {/* eslint-disable-next-line react/prop-types */}
      <h3 className="common-title">Block {data.block_index}</h3>
      <div className="info">
        {infoKeys.map((item) => (
          <div key={item.label} className="info-item flex-ac">
            <div className="key">{item.label}</div>
            <div className="value">{getType(item.key) === 'function' ? item.key(data) : data[item.key]}</div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Info;
