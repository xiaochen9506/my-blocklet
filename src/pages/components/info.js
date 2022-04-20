import React, { useState } from 'react';
import { dateFormat, fillNumber, getType, numberFormat, toBTC, toBTCNumber } from '../../utils';
import '../home.scss';

const Month = {
  1: 'January',
  2: 'February',
  3: 'March',
  4: 'April',
  5: 'May',
  6: 'June',
  7: 'July',
  8: 'August',
  9: 'September',
  10: 'October',
  11: 'November',
  12: 'December',
};

const Info = (props) => {
  // eslint-disable-next-line react/prop-types
  const { data = {}, currency = {} } = props;
  const [active, setActive] = useState('BTC');
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
      key: (obj) => getBtcOrMoney(obj.transactionVolume - obj.fee),
    },
    { label: 'Block Reward', key: (obj) => getBtcOrMoney(obj.blockReward) },
    { label: 'Fee Reward', key: (obj) => getBtcOrMoney(obj.fee) },
  ];
  const getTimeStr = () => {
    // eslint-disable-next-line react/prop-types
    const date = new Date(data.time * 1000);
    const month = Month[date.getMonth() + 1];
    const day = date.getDate();
    const year = date.getFullYear();
    const hour = date.getHours();
    const minutes = date.getMinutes();
    const timezone = -date.getTimezoneOffset() / 60;

    return `${month} ${day}, ${year} at ${hour - 12 > 0 ? fillNumber(hour - 12) : fillNumber(hour)}:${fillNumber(
      minutes
    )} ${hour >= 12 ? 'PM' : 'AM'} GMT${timezone > 0 ? `+${timezone}` : `-${timezone}`}`;
  };

  const getMoney = (btc) => {
    if (currency) {
      return `${currency.symbol}${numberFormat(Number((toBTCNumber(btc) * currency.buy).toFixed(2)))}`;
    }
    return btc;
  };

  const getBtcOrMoney = (btc) => {
    if (active === 'BTC') return toBTC(btc);
    return getMoney(btc);
  };

  return (
    <>
      {/* eslint-disable-next-line react/prop-types */}
      <h3 className="common-title flex-slide">
        Block {data.block_index}
        <div className="flex info-radio">
          {currency && (
            <div className={active === currency.symbol ? 'active' : ''} onClick={() => setActive(currency.symbol)}>
              {currency.symbol}
            </div>
          )}
          <div className={active === 'BTC' ? 'active' : ''} onClick={() => setActive('BTC')}>
            BTC
          </div>
        </div>
      </h3>
      <div className="info-desc" style={{ marginBottom: '20px' }}>
        This block was mined on {getTimeStr()} by <a href="/">Unknown(这个暂未计算出来)</a>. It currently has
        (这个暂未计算出来) confirmations on the Bitcoin Bitcoin Bitcoin blockchain.
        <div style={{ height: 16 }} />
        The miner(s) of this block earned a total reward of {toBTC(data.blockReward)} ({getMoney(data.blockReward)}).
        The reward consisted of a base reward of {toBTC(data.blockReward)} ({getMoney(data.blockReward)}) with an
        additional {toBTC(data.fee)} ({getMoney(data.fee)}) reward paid as fees of the {data.n_tx} transactions which
        included in the block. The Block rewards, also known as the Coinbase reward, were sent to this{' '}
        <a href="/">address(这个暂未计算出来)</a>.
        <div style={{ height: 16 }} />A total of {toBTC(data.transactionVolume - data.fee)} (
        {getMoney(data.transactionVolume - data.fee)}) were sent in the block with the average transaction being{' '}
        {toBTC((data.transactionVolume - data.fee) / data.n_tx)} BTC (
        {getMoney((data.transactionVolume - data.fee) / data.n_tx)}). Learn more about{' '}
        <a href="/">how blocks work(这个暂未计算出来)</a>.
      </div>
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
