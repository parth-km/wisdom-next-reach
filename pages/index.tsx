import { useState, useEffect } from "react";

// @ts-ignore
import * as backend from "./build/index.main.mjs";

import styles from "../styles/Home.module.css";
import { loadStdlib } from "@reach-sh/stdlib";
import { Button, Text, Space, Title } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import Link from "next/link";
import { useDefaultAcc, useBalanceLogger } from "./_app";

const reach = loadStdlib("ETH");
const { standardUnit } = reach;
const defaultFundAmtStandard = 1;

export default function Home() {
  const acc = useDefaultAcc();
  const balance = useBalanceLogger();

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to {standardUnit}</h1>
        <h2>{`You have ${balance} ${standardUnit}`}</h2>
        <Button onClick={() => fundNewAccount()}>Get ETH</Button>
        <Space h="md" />
        <SelectRole />
      </main>
    </div>
  );
}

export function SelectRole() {
  return (
    <div>
      <Title>Please select a role:</Title>
      <br />
      <Text>
        <Link href={"/alice"}>
          <Button> Alice</Button>
        </Link>
        <br /> Requests payment from Bob in order to reveal a secret.
      </Text>

      <br />

      <Text>
        <Link href={"/bob"}>
          <Button> Bob</Button>
        </Link>
        <br /> Pays Alice in order for her to reveal a secret.
      </Text>
    </div>
  );
}

async function fundNewAccount(fundAmountStandard?: number) {
  const acc = await reach.getDefaultAccount();
  const addr = reach.formatAddress(await acc.getAddress());
  const balAtomic = await reach.balanceOf(acc);
  const bal = reach.formatCurrency(balAtomic, 4);

  const amountAtomic = reach.parseCurrency(fundAmountStandard || defaultFundAmtStandard);
  console.log(`Previous Balance for Account ${addr} - Balance: ${bal}`);
  try {
    const faucet = await reach.getFaucet();
    await reach.transfer(faucet, acc, amountAtomic);
  } catch (e: any) {
    console.log("error transferring from faucet", e);
    showNotification({
      title: "Error",
      message: "Error transferring from faucet. " + e.message,
    });
  }
}
