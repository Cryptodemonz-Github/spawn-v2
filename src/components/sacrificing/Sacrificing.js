import Web3 from "web3";
import Demonzv1_testing from "../../config/Demonzv1_testnet.json";
import Demonzv2_testing from "../../config/Demonzv2_testnet.json";
import { ConnectMetaMask } from "../../Connect";

const Sacrificing = () => {
  const web3 = new Web3(window.ethereum);
  const contract = new web3.eth.Contract(
    Demonzv2_testing,
    "0x840244370Cabc0b2F09751D071799Ca81cD1BCeC"
  );
  const contractV1 = new web3.eth.Contract(
    Demonzv1_testing,
    "0xae16529ed90fafc927d774ea7be1b95d826664e3"
  );

  let account = "0x21751deC771cE1F6AA6017d8Ca7332f122652FfD";
  let idArray = [1, 2, 3];

  const getTokenIDs = (owner) => {
    const tokenCount = await contractV1.methods.balanceOf(owner).call();
    const tokenIDs = Array(tokenCount);
    for (let i = 0; i < tokenCount; i++) {
      tokensId[i] = await contractV1.methods
        .tokenOfOwnerByIndex(owner, i)
        .call();
    }

    return tokenIDs;
  };

  const Sacrifice = async () => {
    contract.methods.burnV1(idArray).call({
      from: account,
      gasLimit: amount * "300000",
      maxPriorityFeePerGas: null,
      maxFeePerGas: null,
    });
  };
};
