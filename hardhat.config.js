require("@nomiclabs/hardhat-waffle");
require('dotenv').config();
// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
 module.exports = {
  solidity: '0.8.0',
  networks: {
    rinkeby: {
      url: process.env.ALCHEMY_API_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};

// Deploying contracts with account:  0xC4003CBC00c9279cA18F66acFD951768B69fEB32
// Account balance:  25000000000000000
// WavePortal address:  0xCA6AD5819c344932a03971c2AE9609F28848AD35

// Deploying contracts with account:  0xC4003CBC00c9279cA18F66acFD951768B69fEB32
// Account balance:  24261765991063564
// WavePortal address:  0x032015CF804bdFf881D8c729E5Ef33741C2C24C4

// WavePortal address: 0x58C3Df829314EAb219e0e9d8c59cdAE8F091917E

// WavePortal address:  0xD9ef58333851a087e942f31328d46E98E03e6b6E

// WavePortal address:  0x353d32Ae6494F6A002C2D1b9adA4633f567E6933
