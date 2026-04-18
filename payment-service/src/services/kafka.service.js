import dotenv from 'dotenv';
dotenv.config();
import { Kafka } from 'kafkajs';

// --- RETRY LOGIC (The "Fix") ---
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const connectWithRetry = async (fn, retries = 10, delay = 5000) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      console.error(`[Kafka] Connection failed (Attempt ${i + 1}/${retries}). Retrying in ${delay/1000}s...`);
      if (i === retries - 1) throw err; // Only crash after 10 failed attempts
      await sleep(delay);
    }
  }
};
// ------------------------------

const kafka = new Kafka({
  clientId: 'payment-service',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
});

const producer = kafka.producer();

export const connectProducer = async () => {
  await producer.connect();
  console.log('Successfully connected Kafka Producer');
};

export const emitPaymentEvent = async (topic, payload) => {
  try {
    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(payload) }],
    });
  } catch (error) {
    console.error('Error sending Kafka message:', error);
  }
};