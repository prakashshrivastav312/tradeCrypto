import React, { useState } from 'react';
import Web3 from 'web3'; // Assuming TokenDistributionABI.json contains the ABI of the TokenDistribution contract

const TokenDistributionPage = () => {
  const [recipients, setRecipients] = useState('');
  const [amounts, setAmounts] = useState('');

  const TokenDistributionABI = [{"inputs":[{"internalType":"address","name":"_tokenAddress","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"recipient","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"TokensDistributed","type":"event"},{"inputs":[{"internalType":"address[]","name":"_recipients","type":"address[]"},{"internalType":"uint256[]","name":"_amounts","type":"uint256[]"}],"name":"distributeTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"token","outputs":[{"internalType":"contract ERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"}];



  const handleRecipientsChange = (event) => {
    setRecipients(event.target.value);
  };

  const handleAmountsChange = (event) => {
    setAmounts(event.target.value);
  };

  const handleDistribution = async () => {
    if (!window.ethereum) {
      alert('MetaMask extension not detected. Please install MetaMask to use this feature.');
      return;
    }

    const web3 = new Web3(window.ethereum);

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      // const networkId = await web3.eth.net.getId();
      const tokenDistributionAddress = '0x27573fF1b2BC35af660Ee5f16dF46a062E87eb1d'; // Address of your deployed TokenDistribution contract
      const tokenDistributionContract = new web3.eth.Contract(TokenDistributionABI, tokenDistributionAddress);

      const recipientsArray = recipients.split(',');
      const amountsArray = amounts.split(',').map((amount) => web3.utils.toWei(amount.trim(), 'ether'));

      await tokenDistributionContract.methods.distributeTokens(recipientsArray, amountsArray).send({ from: accounts[0] });
      alert('Tokens distributed successfully');
    } catch (error) {
      alert('Failed to distribute tokens');
    }
  };

  return (
    <div>
      <h1>Token Distribution Page</h1>
      <label>Recipients (comma-separated addresses):</label>
      <input type="text" value={recipients} onChange={handleRecipientsChange} />
      <label>Amounts (comma-separated amounts):</label>
      <input type="text" value={amounts} onChange={handleAmountsChange} />
      <button onClick={handleDistribution}>Distribute Tokens</button>
    </div>
  );
};

export default TokenDistributionPage;
