import dotenv from "dotenv";
dotenv.config();
import { Kafka } from "kafkajs";
import { Video } from "../models/video.model.js";

const kafka = new Kafka({
    clientId: "video-service",
    brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: "video-service-group" });

export const connectKafka = async () => {
    await producer.connect();
    await consumer.connect();
    console.log("Video Service: Kafka Connected");

    // Subscribe to Interaction Events (Likes/Comments)
    await consumer.subscribe({ topic: "interaction-events", fromBeginning: false });

    await consumer.run({
        eachMessage: async ({ message }) => {
            const { videoId, type, action } = JSON.parse(message.value.toString());

            let updateField = "";
            if (type === "like") updateField = "likesCount";
            if (type === "comment") updateField = "commentsCount";

            if (updateField) {
                const change = action === "added" ? 1 : -1;
                await Video.findByIdAndUpdate(videoId, { 
                    $inc: { [updateField]: change } 
                });
                console.log(`Updated ${updateField} for ${videoId} by ${change}`);
            }
        },
    });
};

export const emitVideoEvent = async (data) => {
    await producer.send({
        topic: "video-events",
        messages: [{ value: JSON.stringify(data) }],
    });
};