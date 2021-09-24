// will call mock demonz for testing purposes!!!
import Web3 from "web3";
import Demonzv1_testnet from "../config/Demonzv1_testnet.json";
import Demonzv2_testing from "../config/Demonzv2_testnet.json";
import { ConnectMetaMask } from "../Connect";

const CallDemonz = () => {

    const web3 = new Web3(window.ethereum);
    const contract = new web3.eth.Contract(
        Demonzv1_testnet,
        "0x47a46Ec5470B8b85B59B0691AEb104B5cf5E7354",
    );

    const demonzv2 = new web3.eth.Contract(
        Demonzv2_testing,
        "0x840244370Cabc0b2F09751D071799Ca81cD1BCeC",
    );
    
    let account = "0x21751deC771cE1F6AA6017d8Ca7332f122652FfD";


    const toggleMinting = async () => {
        demonzv2.methods.toggleMinting().call({
            from: account,
            gasLimit: "300000",
            maxPriorityFeePerGas: null,
            maxFeePerGas: null,
        })

        console.log("what the fuck")
    }

    const Summon = async () => {
        contract.methods.mintToken(10).send({
            from: account,
            gasLimit: 10 * "300000",
            maxPriorityFeePerGas: null,
            maxFeePerGas: null,
        })
    }

    const Summonv2 = async () => {
        demonzv2.methods.toggleMinting().send({
            from: account,
            gasLimit: "300000",
            maxPriorityFeePerGas: null,
            maxFeePerGas: null,
        })
    }
    

    return (
        <div>
            <button onClick={ConnectMetaMask}>connect</button>
            <button onClick={Summon}>mint</button>
            <button onClick={Summonv2}>start</button>
        </div>
    )

}

export default CallDemonz;