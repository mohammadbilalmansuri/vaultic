"use client";
import React, { useState } from "react";
import { useBlockchain, BlockchainArgs } from "@/hooks/useBlockchain";

const TestFunctionalityPage = () => {
  const { sendTx, getTxHistory, getBalance } = useBlockchain();
  const [blockchain, setBlockchain] =
    useState<BlockchainArgs["blockchain"]>("solana");
  const [fromPrivateKey, setFromPrivateKey] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [result, setResult] = useState<string | any[]>("");

  const handleSendTx = async () => {
    try {
      const txHash = await sendTx({
        blockchain,
        fromPrivateKey,
        toAddress,
        amount,
      });
      setResult(`Transaction sent! Hash: ${txHash}`);
    } catch (error) {
      if (error instanceof Error) {
        setResult(`Error: ${error.message}`);
      } else {
        setResult("An unknown error occurred.");
      }
    }
  };

  const handleGetTxHistory = async () => {
    try {
      const history = await getTxHistory({ blockchain, address });
      setResult(history);
    } catch (error) {
      if (error instanceof Error) {
        setResult(`Error: ${error.message}`);
      } else {
        setResult("An unknown error occurred.");
      }
    }
  };

  const handleGetBalance = async () => {
    try {
      const balance = await getBalance({ blockchain, address });
      setResult(`Balance: ${balance}`);
    } catch (error) {
      if (error instanceof Error) {
        setResult(`Error: ${error.message}`);
      } else {
        setResult("An unknown error occurred.");
      }
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Test Blockchain Functionality</h1>

      <div>
        <label>
          Blockchain:
          <select
            value={blockchain}
            onChange={(e) =>
              setBlockchain(e.target.value as BlockchainArgs["blockchain"])
            }
          >
            <option value="solana">Solana</option>
            <option value="ethereum">Ethereum</option>
          </select>
        </label>
      </div>

      <div>
        <label>
          From Private Key:
          <input
            type="text"
            value={fromPrivateKey}
            onChange={(e) => setFromPrivateKey(e.target.value)}
          />
        </label>
      </div>

      <div>
        <label>
          To Address:
          <input
            type="text"
            value={toAddress}
            onChange={(e) => setToAddress(e.target.value)}
          />
        </label>
      </div>

      <div>
        <label>
          Amount:
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </label>
      </div>

      <div>
        <label>
          Address (for Balance/History):
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </label>
      </div>

      <div>
        <button onClick={handleSendTx}>Send Transaction</button>
        <button onClick={handleGetTxHistory}>Get Transaction History</button>
        <button onClick={handleGetBalance}>Get Balance</button>
      </div>

      <div>
        <h2>Result:</h2>
        <pre>
          {typeof result === "string"
            ? result
            : JSON.stringify(result, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default TestFunctionalityPage;
