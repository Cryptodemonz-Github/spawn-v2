import Web3 from "web3";
import Demonzv2_testing from "../../config/Demonzv2_testnet.json";
import { ConnectMetaMask } from "../../Connect";

const Summoning = () => {

    const web3 = new Web3(window.ethereum);
    const contract = new web3.eth.Contract(
        Demonzv2_testing,
        "0x840244370Cabc0b2F09751D071799Ca81cD1BCeC",
    );

    //dummy
    let account = "0x21751deC771cE1F6AA6017d8Ca7332f122652FfD";
    let amount = 1;

    const Summon = async () => {
        contract.methods.mintToken(amount).send({
            from: account,
            gasLimit: amount * "300000",
            maxPriorityFeePerGas: null,
            maxFeePerGas: null,
        })
    }

    return (
        <div>
            <button onClick={ConnectMetaMask}>Connect</button>
            <button onClick={Summon}>Summon</button>
        </div>
    )
}

export default Summoning;