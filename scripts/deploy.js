const hre = require("hardhat");

const tokens = (nToken) => {
  return hre.ethers.utils.parseUnits(nToken.toString(), "ether");
};

async function main() {
  //WOOX TOKEN
  const initialSupply = tokens(500000000000);
  const Woox = await hre.ethers.getContractFactory("Woox");
  const woox = await Woox.deploy(initialSupply);

  await woox.deployed();
  console.log("Woox deployed to:", woox.address);

  //ICO WOOX
  const _tokenPrice = tokens(0.0001);
  const ICOWoox = await hre.ethers.getContractFactory("ICOWoox");
  const icoWoox = await ICOWoox.deploy(woox.address, _tokenPrice);

  await icoWoox.deployed();
  console.log("ICO WOOX deployed to:", icoWoox.address);

  //LIQUIDITY
  const Liquidity = await hre.ethers.getContractFactory("Liquidity");
  const liquidity = await Liquidity.deploy();

  await liquidity.deployed();
  console.log("Liquidity deployed to:", liquidity.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode(1);
});
