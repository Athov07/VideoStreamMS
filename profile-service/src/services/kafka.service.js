import dotenv from "dotenv";
dotenv.config();
import { Kafka } from "kafkajs";

// Helper function to wait between retries
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Reusable retry wrapper to handle Kafka's slow startup in Docker
 */
export const connectWithRetry = async (fn, retries = 10, delay = 5000) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      console.error(
        `Profile Service: Kafka connection failed (Attempt ${i + 1}/${retries}). Retrying in ${delay / 1000}s...`
      );
      if (i === retries - 1) throw err;
      await sleep(delay);
    }
  }
};

const kafka = new Kafka({
  clientId: "profile-service",
  brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
});

const producer = kafka.producer();

export const connectProducer = async () => {
  await producer.connect();
  console.log("Profile Service: Kafka Producer Connected");
};

export const emitProfileEvent = async (topic, data) => {
  try {
    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(data) }],
    });
  } catch (error) {
    console.error("Kafka Emit Error:", error);
  }
};