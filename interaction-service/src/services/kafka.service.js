import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "interaction-service",
  brokers: ["localhost:9092"],
});

const producer = kafka.producer();

export const connectProducer = async () => {
  await producer.connect();
  console.log("Interaction Service: Kafka Producer Connected");
};

export const emitInteractionEvent = async (data) => {
  try {
    await producer.send({
      topic: "interaction-events",
      messages: [{ value: JSON.stringify(data) }],
    });
  } catch (error) {
    console.error("Kafka Emit Error:", error);
  }
};