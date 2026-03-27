import dotenv from "dotenv";
dotenv.config();
import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "auth-service",
  brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
});

const producer = kafka.producer();

export const connectProducer = async () => {
  try {
    await producer.connect();
    console.log("Auth Service: Kafka Producer Connected");
  } catch (error) {
    console.error("Kafka Connection Error:", error);
  }
};

export const emitAuthEvent = async (event, data) => {
  try {
    await producer.send({
      topic: "auth-events",
      messages: [
        { 
          key: data.userId.toString(), 
          value: JSON.stringify({ event, data, timestamp: new Date() }) 
        }
      ],
    });
  } catch (error) {
    console.error("Kafka Emit Error:", error);
  }
};