// seedUsers.js
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

const usersToSeed = [
    {
        firstName: "Alice",
        lastName: "Example",
        email: "alice@example.com",
        password: "password123",
        occupation: "Engineer",
        location: "New York",
    },
    {
        firstName: "Bob",
        lastName: "Example",
        email: "bob@example.com",
        password: "password123",
        occupation: "Designer",
        location: "Los Angeles",
    },
];

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB Atlas");

        for (const u of usersToSeed) {
            const existing = await User.findOne({ email: u.email });
            if (existing) {
                console.log(`User ${u.email} already exists, skipping`);
                continue;
            }

            const hashedPassword = await bcrypt.hash(u.password, 10);
            const user = new User({
                name: `${u.firstName} ${u.lastName}`,
                firstName: u.firstName,
                lastName: u.lastName,
                email: u.email,
                password: hashedPassword,
                occupation: u.occupation,
                location: u.location,
                avatar: "/default-avatar.png",
            });

            await user.save();
            console.log(`Created user: ${u.email}`);
        }

        console.log("Seeding complete!");
        mongoose.disconnect();
    } catch (err) {
        console.error("Error seeding users:", err);
        mongoose.disconnect();
    }
}

seed();
