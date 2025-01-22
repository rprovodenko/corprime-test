import { SyntheticTradeSender } from './synthetic-trade-sender/synthetic-trade-sender';

const sender = new SyntheticTradeSender('http://localhost:3000/ingest-trade-price');

async function runSender() {
  await sender.startSending();
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
