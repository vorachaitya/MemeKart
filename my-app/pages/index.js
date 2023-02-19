
import { Contract, utils } from "ethers";
import { providers } from "ethers";
import Head from "next/head";
import React, { useEffect, useRef, useState } from "react";
import Web3Modal from "web3modal";
import { abi, NFT_CONTRACT_ADDRESS } from "../constants";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tokenIdsMinted, setTokenIdsMinted] = useState("0");
  
  const web3ModalRef = useRef();
  const publicMint = async () => {
    try {
      console.log("Public mint");
      
      const signer = await getProviderOrSigner(true);
      
      const nftContract = new Contract(NFT_CONTRACT_ADDRESS, abi, signer);
      const tx = await nftContract.mint({
        value: utils.parseEther("0.01"),
      });
      setLoading(true);

      await tx.wait();
      setLoading(false);
      window.alert("You successfully minted a meme!");
    } catch (err) {
      console.error(err);
    }
  };

  const connectWallet = async () => {
    try {
      
      await getProviderOrSigner();
      setWalletConnected(true);
    } catch (err) {
      console.error(err);
    }
  };

  
  const getTokenIdsMinted = async () => {
    try {
      
      const provider = await getProviderOrSigner();
      
      const nftContract = new Contract(NFT_CONTRACT_ADDRESS, abi, provider);
    
      const _tokenIds = await nftContract.tokenIds();
      console.log("tokenIds", _tokenIds);
      setTokenIdsMinted(_tokenIds.toString());
    } catch (err) {
      console.error(err);
    }
  };

  
  const getProviderOrSigner = async (needSigner = false) => {
    
    const provider = await web3ModalRef.current.connect();
    console.log(provider);
    const web3Provider = new providers.Web3Provider(provider);

    const { chainId } = await web3Provider.getNetwork();
    if (chainId != 5) {
      window.alert("Change the network to Goerli");
      throw new Error("Change network to Goerli");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  };

  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "goerli",
        providerOptions: {},
        disableInjectedProvider: false,
      });

      connectWallet();

      getTokenIdsMinted();

      setInterval(async function () {
        await getTokenIdsMinted();
      }, 5 * 1000);
    }
  }, [walletConnected]);

  const renderButton = () => {
    if (!walletConnected) {
      return (
        <button onClick={connectWallet} className={styles.button}>
          Connect your wallet
        </button>
      );
    }

    if (loading) {
      return <button className={styles.button}>Loading...</button>;
    }

    return (
      <button className={styles.button} onClick={publicMint}>
        Public Mint 🚀
      </button>
    );
  };

  return (
    <div>
      <Head>
        <title>Memes</title>
        <meta name="description" content="LW3Punks-Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>Welcome to MemeKart!</h1>
          <div className={styles.description}>
            Mint the meme you love and be the owner of that meme!
          </div>
          <div className={styles.description}>
            {tokenIdsMinted}/5 have been minted
          </div>
          {renderButton()}
        </div>
        <div>
          <img className={styles.image} src="./SampleMemes/1.jpg" />
        </div>
      </div>

      <footer className={styles.footer}>Made with &#10084; by MightyBots</footer>
    </div>
  );
}
