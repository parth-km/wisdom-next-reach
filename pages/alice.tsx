import { useState } from "react";
// @ts-ignore
import * as backend from "../build/index.main.mjs";
import { loadStdlib } from "@reach-sh/stdlib";
const reach = loadStdlib("ETH");

import styles from "../styles/Home.module.css";
import { useDefaultAcc } from "./_app";
import { Button } from "@mantine/core";

const PRICE = 0.001;

export default function Alice() {
  const acc = useDefaultAcc();
  const [contractInfoStr, setContractInfoStr] = useState<null | string>(null);

  console.log({ contractInfoStr });

  const checkContract = async () => {
    console.log("Checking contract...");
    const ctc = await acc.contract(backend);
    console.log("Got ctc", ctc);
    const ctcInfo = await ctc.getInfo();
    console.log({ info: ctcInfo });
    const ctcInfoStr = await JSON.stringify(ctcInfo, null, 2);
    console.log("Deployed contract:", ctcInfoStr);
    setContractInfoStr(ctcInfoStr);
  };

  const deployContract = async () => {
    console.log("deploying contract");
    const ctc = await acc.contract(backend);

    const request = reach.parseCurrency(PRICE);
    await backend.Alice(ctc, { request, info: "it works!" });

    const ctcInfo = await ctc.getInfo();
    console.log({ info: ctcInfo });
    const ctcInfoStr = await JSON.stringify(ctcInfo, null, 2);
    console.log("Deployed contract:", ctcInfoStr);
    setContractInfoStr(ctcInfoStr);
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to Alice</h1>
        <Button onClick={async () => await checkContract()}>Check Contract</Button>
        <br />
        <Button onClick={async () => await deployContract()}>Deploy Contract</Button>
        <br />
        Contract: {contractInfoStr}
      </main>
    </div>
  );
}
