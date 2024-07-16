import { App } from "@slack/bolt";
import * as anchor from "@coral-xyz/anchor";
import { Connection, PublicKey } from "@solana/web3.js";

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: ".env.local", override: true });
}

const connection = new Connection(
  process.env.SOLANA_RPC || "https://api.mainnet-beta.solana.com"
);
const provider = new anchor.AnchorProvider(connection, {} as anchor.Wallet);
anchor.setProvider(provider);

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
  // Socket Mode doesn't listen on a port, but in case you want your app to respond to OAuth,
  // you still need to listen on some port!
  port: 3000,
});

// Listens to incoming messages that contain "hello"
app.message("", async ({ message, say }) => {
  // say() sends a message to the channel where the event was triggered

  const account = new PublicKey("gLJHKPrZLGBiBZ33hFgZh6YnsEhTVxuRT17UCqNp6ff");
  const balance = await connection.getBalance(account);

  await say(`${account.toBase58()} balance: ${balance / 1e9} SOL`);
});

(async () => {
  // Start your app
  await app.start();

  console.log("✅ Bolt app is running!");
})();
