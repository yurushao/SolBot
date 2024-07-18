import * as anchor from "@coral-xyz/anchor";
import { Connection, PublicKey } from "@solana/web3.js";

const connection = new Connection(
  process.env.SOLANA_RPC || "https://api.mainnet-beta.solana.com"
);
const provider = new anchor.AnchorProvider(connection, {} as anchor.Wallet);
anchor.setProvider(provider);

export async function balance_handler(address: string, say: any) {
  const accountInfo = await connection.getAccountInfo(new PublicKey(address));

  await say(`\`${address}\` balance: ${accountInfo!.lamports / 1e9} SOL`);
}

export async function subscribe_handler(address: string, say: any) {}
