import dotenv from "dotenv";
dotenv.config();
import { Kafka } from "kafkajs";
import { Video } from "../models/video.model.js";

// --- RETRY UTILITY ---
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const connectWithRetry = async (fn, retries = 10, delay = 5000) => {
    for (let i = 0; i < retries; i++) {
        try {
            return await fn();
        } catch (err) {
            console.error(`Video Service: Kafka connection failed (Attempt ${i + 1}/${retries}). Retrying in ${delay / 1000}s...`);
            if (i === retries - 1) throw err;
            await sleep(delay);
        }
    }
};
// ---------------------

const kafka = new Kafka({
    clientId: "video-service",
    brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: "video-service-group" });

export const connectKafka = async () => {
    // Connect both Producer and Consumer
    await producer.connect();
    await consumer.connect();
    console.log("Video Service: Kafka Producer & Consumer Connected");

    // Subscribe to Interaction Events
    await consumer.subscribe({ topic: "interaction-events", fromBeginning: false });

    await consumer.run({
        eachMessage: async ({ message }) => {
            try {
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
            } catch (err) {
                console.error("Error processing Kafka message:", err.message);
            }
        },
    });
};

export const emitVideoEvent = async (data) => {
    try {
        await producer.send({
            topic: "video-events",
            messages: [{ value: JSON.stringify(data) }],
        });
    } catch (error) {
        console.error("Kafka Emit Error:", error);
    }
};