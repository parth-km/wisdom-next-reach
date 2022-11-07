import "../styles/globals.css";
import type { AppProps } from "next/app";
import { NotificationsProvider } from "@mantine/notifications";
import { useState, useEffect } from "react";
import { loadStdlib } from "@reach-sh/stdlib";
const reach = loadStdlib("ETH");

export default function App({ Component, pageProps }: AppProps) {
  const acc = useDefaultAcc();
  const balance = useBalanceLogger();

  if (!acc) return "Connect to MetaMask to continue...";
  return (
    <NotificationsProvider position="top-right" zIndex={2077}>
      <Component {...pageProps} />
    </NotificationsProvider>
  );
}

export function useDefaultAcc() {
  const [acc, setAcc] = useState(null);
  useEffect(() => {
    const getAcc = async () => {
      const acc = await reach.getDefaultAccount();
      setAcc(acc);
    };
    getAcc();
  }, []);
  return acc as any;
}

export function useBalanceLogger() {
  const acc = useDefaultAcc();
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const getBalance = async () => {
      const addr = reach.formatAddress(await acc.getAddress());
      const balAtomic = await reach.balanceOf(acc);
      const bal = reach.formatCurrency(balAtomic, 4);
      console.log(`Account: ${addr} Balance: ${bal}`);
      setBalance(parseFloat(bal));
    };
    if (!acc) return;
    getBalance();
  }, [acc]);
  return balance;
}
