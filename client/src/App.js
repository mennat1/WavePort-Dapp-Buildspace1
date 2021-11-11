import React, { useEffect, useState } from "react";
import './App.css';
import { ethers } from "ethers";
import Identicon from 'identicon.js';

import obj from "./WavePortal.json"
const App = () => {
  /*
  * Just a state variable we use to store our user's public wallet.
  */
  const [currentAccount, setCurrentAccount] = useState("");
  const [loadingWave, setLoadingWave] = useState(false);
  const [allWaves, setAllWaves] = useState([]);
  const [msgValue, setMsgValue] = useState("")
 
  const contractAddress = "0x353d32Ae6494F6A002C2D1b9adA4633f567E6933";
  const contractABI = obj.abi;

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
      
      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }
      
      /*
      * Check if we're authorized to access the user's wallet
      */
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
        await getAllWaves();
      } else {
        console.log("No authorized account found");
        // await connectWallet();
      }
    } catch (error) {
      console.log(error);
    }
  }

   /**
  * Implement your connectWallet method here
  */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]); 
    } catch (error) {
      console.log(error)
    }
  }

  const wave = async (txt) => {
    try {
      setLoadingWave(true);
      const { ethereum } = window;
      // const contractAddress = "0x032015CF804bdFf881D8c729E5Ef33741C2C24C4";
      // const contractABI = obj.abi;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
        
        let waveTxn = await wavePortalContract.wave(txt, { gasLimit: 300000 });
        await waveTxn.wait();
        console.log("Just sent a wave");
        console.log("Mined -- ", waveTxn.hash);
        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
       
      } else {
        console.log("Ethereum object doesn't exist!");
      }
      setLoadingWave(false);
    } catch (error) {
      console.log(error)
    }
}



/*
  * Create a method that gets all waves from your contract
  */
const getAllWaves = async () => {
  try {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

      /*
        * Call the getAllWaves method from your Smart Contract
        */
      const waves = await wavePortalContract.getAllWaves();
      console.log("retrieved waves: ", waves);

      /*
        * We only need address, timestamp, and message in our UI so let's
        * pick those out
        */
      let wavesCleaned = [];
      waves.forEach(wave => {
        wavesCleaned.push({
          address: wave.waver,
          timestamp: new Date(wave.timestamp * 1000),
          message: wave.message
        });
      });
      console.log("Cleaned waves: ", wavesCleaned);
      /*
        * Store our data in React State
        */
      setAllWaves(wavesCleaned);
    } else {
      console.log("Ethereum object doesn't exist!")
    }
  } catch (error) {
    console.log(error);
  }
  }
  
  useEffect(() => {
    checkIfWalletIsConnected();

    let wavePortalContract;

    const onNewWave = (from, timestamp, message) => {
      console.log('NewWave', from, timestamp, message);
      setAllWaves(prevState => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          message: message,
        },
      ]);
    };

    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
      // Subscribe to event/NewWave calling listener/onNewWave when the event occurs.
      wavePortalContract.on('NewWave', onNewWave);
    }

    return () => {
      if (wavePortalContract) {
        // Unsubscribe listener to event.
        wavePortalContract.off('NewWave', onNewWave);
      }
    };
  }, [])
  
  return (
    <div>
    <nav className="navbar navbar-dark bg-dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            { currentAccount
              ? <div><img
                className="ml-2"
                width='30'
                height='30'
                src={`data:image/png;base64,${new Identicon(currentAccount, 30).toString()}`}
                alt=""
              />
              <small className="account text-secondary">
              <small id="account">Connected Account Address: {currentAccount}</small>
              </small></div>
              : <span>No Connected Account ... Connect Your Wallet!</span>
            }
             
          </a>
        </div>
      </nav>
      <div className="mainContainer">
        <div className="dataContainer">
          
          <div className="header">
            Hey there!&#10084;&#65039;
          </div>
      
          <div className="bio">
            I am Menna and I am Learning about Smart Contracts!
            Connect your Ethereum wallet and wave at me!
          </div>
      
          <div className ="formDiv">
            <form onSubmit={(event) => {
              wave(msgValue);
              event.preventDefault();
            }}>
              <label>
                <input type="text" value={msgValue} name="name" onChange={(event) => {setMsgValue(event.target.value)}}/>
              </label>
              <input type="submit" className="waveButton" value="Send a message!"/>
            </form>
          </div>
         {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}


          {loadingWave && (<p> Loading Wave Txn.... </p>)}
          {allWaves.map((wave, index) => {
            return (
              <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
                <div>Address: {wave.address}</div>
                <div>Time: {wave.timestamp.toString()}</div>
                <div>Message: {wave.message}</div>
              </div>)
          })}
        </div>
      </div>
    </div>
    );
  }
export default App