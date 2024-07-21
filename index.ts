import { App, SlackCommandMiddlewareArgs } from "@slack/bolt";
import { balance_handler, subscribe_handler } from "./handlers";

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: ".env.local", override: true });
}

const SUB_COMMANDS = ["balance", "subscribe", "list"];

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
  // Socket Mode doesn't listen on a port, but in case you want your app to respond to OAuth,
  // you still need to listen on some port!
  port: 3000,
});

app.command(
  "/solana",
  async ({ payload, ack, say }: SlackCommandMiddlewareArgs) => {
    console.log("payload", payload);
    await ack();

    const [subcommand, address] = payload.text.split(" ");
    if (!SUB_COMMANDS.includes(subcommand)) {
      await say(`Unrecognized subcommand: ${subcommand}`);
    }

    switch (subcommand) {
      case "balance": {
        return await balance_handler(address, say);
      }
      case "subscribe": {
        return await subscribe_handler(address, say);
      }
      case "list": {
        return await list_handler(say);
      }
    }

    await say(`ack: ${payload.text}`);
  }
);

// Listens to incoming messages that contain "hello"
// app.message("hello", async ({ message, say }) => {
//   console.log("message", message);

//   const account = new PublicKey("gLJHKPrZLGBiBZ33hFgZh6YnsEhTVxuRT17UCqNp6ff");
//   const balance = await connection.getBalance(account);

//   await say(`${account.toBase58()} balance: ${balance / 1e9} SOL`);
// });

(async () => {
  // Start your app
  await app.start();

  console.log("✅ Bolt app is running!");
})();
