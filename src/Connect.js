export const ConnectMetaMask = async () => {
  if (window.ethereum) {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "1" }],
      });
    } catch (error) {
      console.error(error);
    }
    return accounts;
  } else {
    alert(
      "MetaMask is not installed. Please consider installing it: https://metamask.io/download.html"
    );
    return 0;
  }
};

export const RequestAccounts = async () => {
  const accs = await window.ethereum
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
  return accs;
};
