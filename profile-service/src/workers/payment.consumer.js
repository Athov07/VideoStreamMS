import dotenv from 'dotenv';
dotenv.config();
import { Kafka } from 'kafkajs';
import { Profile } from '../models/profile.model.js'; // Ensure the .js extension

const kafka = new Kafka({
  clientId: 'profile-service',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
});

const consumer = kafka.consumer({ groupId: 'profile-service-group' });

export const initPaymentConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'payment-events', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const payload = JSON.parse(message.value.toString());
      console.log('Received Payment Event:', payload);

      if (payload.status === 'success') {
        // Find John Doe by the ID sent in the message and upgrade him
        await Profile.findOneAndUpdate(
          { userId: payload.userId },
          { $set: { isPremium: true } }
        );
        console.log(`Profile for ${payload.userId} upgraded to Premium!`);
      }
    },
  });
};