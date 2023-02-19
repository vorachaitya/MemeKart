const { ethers } = require("hardhat");
require("dotenv").config({ path: ".env" });

async function main() {
  const metadataURL = "ipfs://QmenpejcT8qf1knNYmFBk2cHM8kDg4WrvdpK2BehYNKih6";

  const memeContract = await ethers.getContractFactory("Memes");

  const deployedMemeContract = await memeContract.deploy(metadataURL);
  await deployedMemeContract.deployed();
  console.log("Memes Contract Address: ", deployedMemeContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
