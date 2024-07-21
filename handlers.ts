import * as anchor from "@coral-xyz/anchor";
import { SlackCommandMiddlewareArgs } from "@slack/bolt";
import { Connection, ParsedAccountData, PublicKey } from "@solana/web3.js";

const connection = new Connection(
  process.env.SOLANA_RPC || "https://api.mainnet-beta.solana.com"
);
const provider = new anchor.AnchorProvider(connection, {} as anchor.Wallet);
anchor.setProvider(provider);

type _SayFn = SlackCommandMiddlewareArgs["say"];

export async function balance_handler(address: string, say: _SayFn) {
  const accountInfo = await connection.getAccountInfo(new PublicKey(address));

  await say(`\`${address}\` balance: ${accountInfo!.lamports / 1e9} SOL`);
}

export async function subscribe_handler(address: string, say: _SayFn) {
  const parsedAccountInfo = await connection.getParsedAccountInfo(
    new PublicKey(address)
  );

  const { program, parsed } = parsedAccountInfo.value
    ?.data as ParsedAccountData;
  if (program === "bpf-upgradeable-loader") {
    const executableDataAccount = new PublicKey(parsed.info.programData);
    const executableDataAccountInfo = await connection.getParsedAccountInfo(
      executableDataAccount
    );
    console.log(executableDataAccountInfo);
    const { space, parsed: executableData } = executableDataAccountInfo.value
      ?.data as ParsedAccountData;
    const lastDeployedSlot = executableData.info.slot;

    const lastDeployedAt = await connection.getBlockTime(lastDeployedSlot);
    const lastDeployTime = new Date(lastDeployedAt! * 1000).toUTCString();

    await say(
      `Program \`${address}\` space: ${space}, last deploy time: ${lastDeployTime}`
    );
  }

  await say(`Subscribed to \`${address}\``);
}

export async function list_handler(say: _SayFn) {
  // List all addresses being watched
}
