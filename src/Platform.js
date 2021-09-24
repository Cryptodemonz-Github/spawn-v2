import React from "react";
import Web3 from "web3";
import Summoning from "./components/summoning/Summoning";
import CallDemonz from "./test-contracts/Demonzv1_testing";
import Demonzv2_testing from "./config/Demonzv2_testnet.json";

class Wrapper extends React.Component {
  constructor() {
    super();
    this.state = {
      welcomeMsg: true,
      decision: "none",
      moveForward: "false",
      web3: undefined,
      contract: undefined,
      connected: false,
      accounts: [],
    };
  }

  SetAccounts = (accounts) => {
    this.setState({ accounts: accounts });
  };

  SetConnected = (connected) => {
    this.setState({ connected: connected });
  };

  Init = () => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      const contract = new web3.eth.Contract(
        Demonzv2_testing,
        "0x840244370Cabc0b2F09751D071799Ca81cD1BCeC"
      );
      this.setState({ web3: web3 });
      this.setState({ contract: contract });
    }
  };

  ConnectMetaMask = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x61" }],
        });
      } catch (error) {
        console.error(error);
      }
      this.setState({ accounts: accounts });
    } else {
      alert(
        "MetaMask is not installed. Please consider installing it: https://metamask.io/download.html"
      );
      return 0;
    }
  };

  RequestAccounts = async () => {
    const accounts = await window.ethereum
      .request({
        method: "eth_accounts",
      })
      .catch((err) => {
        if (err.code === 4001) {
          console.log("Please connect to MetaMask.");
        } else {
          console.error(err);
        }
      });
    this.setState({ accounts: accounts });
  };

  Handler() {
    if (this.state.moveForward === "false") {
      return this.WelcomeMsg();
    } else {
      switch (this.state.decision) {
        case "sacrifice":
          return this.Sacrifice();

        case "summoning":
          return this.Summoning();
      }
    }
  }

  componentWillMount() {
    this.Init();
    if (window.ethereum && window.ethereum.isConnected) {
      this.RequestAccounts();
    }

    if (this.state.accounts !== undefined && this.state.accounts.length > 0) {
      this.setState({ connected: true });
    } else {
      this.setState({ connected: false });
    }
  }

  componentDidMount() {
    console.log("Loaded successfully");
  }

  WelcomeMsg() {
    const dialogueContainer = () => {
      switch (this.state.decision) {
        case "none":
          return (
            <div className="css-typing">
              <p>I'm so glad to see you made it, I thought you were chicken!</p>
              <p>We're about to get started</p>
              <p>
                Do you want to join the{" "}
                <a
                  href="#"
                  onClick={() => {
                    this.setState({ decision: "summoning" });
                  }}
                >
                  summoning
                </a>{" "}
                or{" "}
                <a
                  href="#"
                  onClick={() => {
                    this.setState({ decision: "sacrifice" });
                  }}
                >
                  sacrifice
                </a>
                ?
              </p>
            </div>
          );

        case "summoning":
          return (
            <div className="css-typing">
              <p>Excellent choice!</p>
              <p>
                We have scored the best goats blood for our summoning. I hope
                you have brought your ingredients.
              </p>
              <p>Now follow me.</p>
              <div className="row">
                <div className="col text-center">
                  <button
                    type="button"
                    className="custombtn follow"
                    onClick={() => {
                      this.setState({ moveForward: "true" });
                    }}
                  ></button>
                </div>
                <div className="col text-center">
                  <button
                    type="button"
                    className="custombtn leave"
                    onClick={() => {
                      this.setState({ decision: "none" });
                    }}
                  ></button>
                </div>
              </div>
            </div>
          );

        case "sacrifice":
          return (
            <div className="css-typing">
              <p>The bloodlust on you!</p>
              <p>
                Fine, bring your lowley demonz and follow me. Lilith is waiting.
              </p>
              <div className="row">
                <div className="col text-center">
                  <button
                    type="button"
                    className="custombtn follow"
                    onClick={() => {
                      this.setState({ moveForward: "true" });
                    }}
                  ></button>
                </div>
                <div className="col text-center">
                  <button
                    type="button"
                    className="custombtn leave"
                    onClick={() => {
                      this.setState({ decision: "none" });
                    }}
                  ></button>
                </div>
              </div>
            </div>
          );
      }
    };

    return (
      <div className="container full">
        <div className="top-spacer"></div>
        <div className="row justify-content-md-center">
          <div className="col-md-6">
            <div className="card border-dark bg-dark mb-3 dialogue-card">
              <div className="card-body">
                <div class="row">
                  <div class="col text-center">
                    <img
                      className="mx-auto d-block"
                      src="/images/lilith.gif"
                      alt="Satan the almighty"
                      height="300px"
                    />
                  </div>
                </div>
                <div class="row">
                  <div class="col">
                    <div className="dialogue-container">
                      {dialogueContainer()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // just need a place to call test contract
  Sacrifice() {
    return <CallDemonz />;
  }

  Summoning() {
    return (
      <Summoning
        connected={this.state.connected}
        contract={this.state.contract}
        accounts={this.state.accounts}
        ConnectMetaMask={this.ConnectMetaMask}
        setAccounts={this.SetAccounts}
        setConnected={this.SetConnected}
      />
    );
  }

  render() {
    return this.Handler();
  }
}

export default Wrapper;
