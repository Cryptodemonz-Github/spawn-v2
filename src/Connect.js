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
