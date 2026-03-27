import dotenv from "dotenv";
dotenv.config();
import { Kafka } from "kafkajs";

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