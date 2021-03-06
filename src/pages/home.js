import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import Select from 'react-select';
import { getDifficulty } from '../utils';
import Info from './components/info';
import Transaction from './components/transaction';
import './home.scss';

const request = (api) => {
  return fetch(api)
    .then((response) => response.json())
    .catch(() => false);
};

const PageNumber = 10;

function App() {
  const [data, setData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [tips, setTips] = useState('please input hash');
  const [select, setSelected] = useState(null);
  const [options, setOptions] = useState([]);
  const [currency, setCurrency] = useState({});

  // 查询
  const search = async (hash) => {
    if (!hash.trim()) return;
    if (loading) {
      return;
    }
    setData(null);
    setLoading(true);
    setTips('');
    const res = await request(`https://blockchain.info/rawblock/${hash.trim()}`);
    console.log(res);
    if (res && !res.error) {
      const input = res.tx.reduce(
        (value, item) => value + item.inputs.reduce((v, t) => v + (t.prev_out.value || 0), 0),
        0
      );
      const out = res.tx.reduce((value, item) => value + item.out.reduce((v, t) => v + t.value, 0), 0);
      res.blockReward = out - input;
      res.transactionVolume = input;
      res.difficulty = getDifficulty(res.bits);
      console.log(input, out);
      setData(res);
      setTransactions(res.tx.slice(0, PageNumber));
      setPageCount(Math.ceil(res.tx.length / PageNumber));
    } else {
      setTips(res && res.message ? res.message : 'invalid hash');
    }
    setLoading(false);
  };

  // 回车
  const handleConfirm = (e) => {
    if (e.keyCode === 13) {
      search(e.target.value);
    }
  };

  // 点击搜索按钮
  const handleClickSearch = () => {
    const { value } = document.querySelector('.search-input');
    search(value);
  };

  // 翻页
  const handlePageClick = ({ selected }) => {
    setTransactions(data.tx.slice(selected * PageNumber, (selected + 1) * PageNumber));
  };

  useEffect(() => {
    const init = async () => {
      const res = await request('https://blockchain.info/ticker?base=BTC');
      console.log(res);
      if (res && !res.error) {
        const keys = Object.keys(res);
        if (keys.length < 1) return;
        const o = keys.map((key) => ({ label: key, value: key }));
        setCurrency(res);
        setOptions(o);
        setSelected(o[o.length - 1]);
      }
    };

    init();
  }, []);

  const handleChange = (e) => {
    setSelected(e);
  };

  return (
    <div className="App">
      <div className="header flex-ac">
        <Select value={select} onChange={handleChange} options={options} />
        <div className="search-box flex-ac">
          <div className="search-icon" onClick={handleClickSearch}>
            <svg
              viewBox="0 0 512 512"
              className="sc-1pmbxjh-0 coriBa s0dncj-5 gTEwBp"
              height="1.5rem"
              selectable="0"
              width="1.5rem">
              <path d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z" />
            </svg>
          </div>
          <input
            className="search-input"
            disabled={loading}
            onKeyDown={handleConfirm}
            type="text"
            placeholder="Search your transaction, an address or a block"
          />
        </div>
      </div>
      <div className={`content ${loading ? 'loading' : ''}`}>
        {data ? (
          <>
            <Info currency={select ? currency[select.value] : null} data={data} />
            <Transaction transactions={transactions} />
            <ReactPaginate
              breakLabel="..."
              nextLabel=">"
              onPageChange={handlePageClick}
              pageRangeDisplayed={2}
              marginPagesDisplayed={3}
              pageCount={pageCount}
              previousLabel="<"
              nextPageRel={null}
              renderOnZeroPageCount={null}
            />
          </>
        ) : (
          <div className="tips">{tips}</div>
        )}
      </div>
    </div>
  );
}

export default App;
