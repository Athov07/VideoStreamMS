import dotenv from 'dotenv';
dotenv.config();
import { Kafka } from 'kafkajs';

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