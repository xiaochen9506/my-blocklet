import React from 'react';
import { dateFormat, toBTC } from '../../utils';
import IconNet from './icon-net';
import '../home.scss';

const Transaction = (props) => {
  // eslint-disable-next-line react/prop-types
  const { transactions } = props;
  const getBtc = (list) => {
    return toBTC(list.reduce((value, item) => value + item.value, 0));
  };
  return (
    <>
      <div className="transactions">
        <h3 className="common-title">Block Transactions</h3>
        {/* eslint-disable-next-line react/prop-types */}
        {transactions.map((item) => (
          <div key={item.hash} className="transaction">
            <div className="transaction-item">
              <div className="transaction-item-fee">
                <div className="half item flex-end">
                  <div className="mobile key">Amount</div>
                  <div className="btc-box">{getBtc(item.out)}</div>
                </div>
                <div className="half item">
                  <div className="key">Fee</div>
                  <div>
                    <div>{toBTC(item.fee)}</div>
                    <div>
                      ({(item.fee / item.size).toFixed(3)} sat/B - {(item.fee / item.weight).toFixed(3)} sat/WU -{' '}
                      {item.size} bytes)
                    </div>
                    <div>
                      ({(item.fee / Math.ceil(item.weight / 4)).toFixed(3)} sat/vByte - {Math.ceil(item.weight / 4)}{' '}
                      virtual bytes)
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="transaction-item">
              <div className="transaction-item-key flex">
                <div className="flex half">
                  <div className="key item">Hash</div>
                  <a className="item ellipsis" href={`https://www.blockchain.com/btc/tx/${item.hash}`} alt="">
                    {item.hash}
                  </a>
                </div>
                <div className="half item flex-end">
                  <div className="mobile key">Date</div>
                  <span>{dateFormat(new Date(item.time * 1000), 'yyyy-MM-dd hh:mm')}</span>
                </div>
              </div>
              <div className="transaction-item-key flex">
                <div className="half item">
                  <div className="mobile key">From</div>
                  <div className="calc-width">
                    {item.inputs.map((i) => (
                      <div className="flex-slide addr">
                        {!i.prev_out.addr ? (
                          <span className="coinbase">COINBASE (Newly Generated Coins)</span>
                        ) : (
                          <a
                            className="link ellipsis"
                            href={`https://www.blockchain.com/btc/address/${i.prev_out.addr}`}>
                            {i.prev_out.addr}
                          </a>
                        )}
                        {i.prev_out.value ? (
                          <div className="btc flex">
                            {toBTC(i.prev_out.value)}
                            <IconNet fill="rgb(61, 137, 245)" />
                          </div>
                        ) : (
                          ''
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="half item">
                  <div className="svg">
                    <svg
                      enableBackground="new 0 0 32 32"
                      height="32px"
                      id="svg2"
                      version="1.1"
                      viewBox="0 0 32 32"
                      fill="rgb(51, 159, 123)"
                      className="sc-1ub63u6-0 hDAkGl">
                      <g id="background">
                        <rect fill="none" height="32" width="32" />
                      </g>
                      <g id="arrow_x5F_full_x5F_right">
                        <polygon points="16,2.001 16,10 2,10 2,22 16,22 16,30 30,16  " />
                      </g>
                    </svg>
                  </div>
                  <div className="out calc-width">
                    <div className="mobile key">To</div>
                    <div className="out-content">
                      {item.out.map((o) => (
                        <div className="flex-slide addr" key={o.script}>
                          {o.addr ? (
                            <a
                              className="calc-width link ellipsis"
                              href={`https://www.blockchain.com/btc/address/${o.addr}`}>
                              {o.addr}
                            </a>
                          ) : (
                            <span className="calc-width ellipsis">OP_RETURN</span>
                          )}
                          <div className="btc flex-ac">
                            {toBTC(o.value)}
                            {o.value !== 0 && <IconNet fill={o.spent ? 'rgb(51, 159, 123)' : 'rgb(234, 91, 80)'} />}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Transaction;
