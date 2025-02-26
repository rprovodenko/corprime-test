import { SyntheticTradeSender } from './synthetic-trade-sender/synthetic-trade-sender';

// TODO create config
const sender = new SyntheticTradeSender('http://localhost:3000/ingest-trade-price');


async function runSender() {
  const speedrun = process.argv[2] === "--speed-run";
  await sender.startSending(speedrun);
}

process.on('SIGINT', () => {
  console.log('Exiting');
  sender.stopSending();
  sender.close();

  process.exit();
});

runSender().catch((e) => {
  console.error(e);
  process.exit(1);
});
