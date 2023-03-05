import { useEffect, useState } from 'react';
import './App.css';
import CurrencyRow from './CurrencyRow';

const BASE_URL = 'https://api.apilayer.com/exchangerates_data/latest'

function App() {
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [fromCurrency, setFromCurrency] = useState();
  const [toCurrency, setToCurrency] = useState();
  const [amount, setAmount] = useState(1);
  const [amountInFromCurrency, setAmountInFromCurrency] = useState(true)
  const [exchangeRate, setExchangeRate] = useState()

  let toAmount, fromAmount
  if (amountInFromCurrency) {
    fromAmount = amount
    toAmount = amount * exchangeRate
  } else {
    toAmount = amount
    fromAmount = amount / exchangeRate
  }

  useEffect(() => {
    const theHeaders = new Headers();
    theHeaders.append("apikey", "oS4JM3isaaCRaziWwm5m3Pd2H2OfPu74");
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
      headers: theHeaders
    };
    fetch(BASE_URL, requestOptions)
    .then(res => res.json())
    .then(data => {
      const firstCurrency = Object.keys(data.rates)[0]
      setCurrencyOptions([...Object.keys(data.rates)])
      setFromCurrency(data.base)
      setToCurrency(firstCurrency)
      setExchangeRate(data.rates[firstCurrency])
    }).catch ((e) => {
      alert(`Fetch Failed\nExhange Rates API Free Monthly Quota Exceeded \n"${e}"`)
    })
  }, [])

  useEffect(() => {
    if(fromCurrency != null && toCurrency != null){
      const theHeaders = new Headers();
      theHeaders.append("apikey", "oS4JM3isaaCRaziWwm5m3Pd2H2OfPu74");
      var requestOptions = {
        method: 'GET',
        redirect: 'follow',
        headers: theHeaders
      };
        fetch(`${BASE_URL}?base=${fromCurrency}&symbols=${toCurrency}`, requestOptions)
        .then(res => res.json())
        .then(data => setExchangeRate(data.rates[toCurrency]))
      }
    }, [fromCurrency, toCurrency])


  function handleFromAmountChange(e) {
    setAmount(e.target.value)
    setAmountInFromCurrency(true)
  }

  function handleToAmountChange(e) {
    setAmount(e.target.value)
    setAmountInFromCurrency(false)
  }

  return (
    <div id="currencyContainer">
    <h1>Convert Currency</h1>
    <h2>Using React &amp; Exchange Rates API</h2>
    <CurrencyRow 
      currencyOptions={currencyOptions} 
      selectedCurrency={fromCurrency}
      onChangeCurrency={e => setFromCurrency(e.target.value)}
      onChangeAmount={handleFromAmountChange}
      amount={fromAmount}

    />
    <div className="equals">=</div>
    <CurrencyRow 
      currencyOptions={currencyOptions} 
      selectedCurrency={toCurrency}
      onChangeCurrency={e => setToCurrency(e.target.value)}
      onChangeAmount={handleToAmountChange}
      amount={toAmount}

    />
    </div>
  );
}

export default App;
