const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const path = require("path");
const dns = require("dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

// Load env variables relative to this script
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const userModel = require("../src/models/user.model");
const interviewReportModel = require("../src/models/interviewReport.model");

const seedData = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            console.error("Error: MONGO_URI is not set in the .env file.");
            process.exit(1);
        }

        console.log("Connecting to MongoDB...");
        await mongoose.connect(mongoUri);
        console.log("Connected successfully.");

        // Clear existing data (optional, but clean for seeding)
        console.log("Clearing existing users and reports...");
        await userModel.deleteMany({});
        await interviewReportModel.deleteMany({});

        // Create Seed User
        console.log("Creating seed user...");
        const hashedPassword = await bcrypt.hash("password123", 10);
        const user = await userModel.create({
            username: "john_doe",
            email: "john@example.com",
            password: hashedPassword
        });
        console.log(`User created: ${user.username} (ID: ${user._id})`);

        // Create Sample Interview Reports
        console.log("Creating sample interview reports...");
        const reports = [
            {
                title: "Software Engineer",
                jobDescription: "Looking for a software engineer skilled in Node.js, Express, React, and MongoDB.",
                resume: "John Doe - Resume\nSkills: React, Node.js, JavaScript, Express, MongoDB\nExperience: 2 years building full-stack web apps.",
                selfDescription: "Passionate full-stack developer with experience building responsive web applications using React and Node.js.",
                matchScore: 85,
                technicalQuestions: [
                    {
                        question: "What is the event loop in Node.js?",
                        intention: "To test the candidate's understanding of asynchronous architecture in Node.js.",
                        answer: "The event loop allows Node.js to perform non-blocking I/O operations despite JavaScript being single-threaded by offloading operations to the system kernel whenever possible."
                    },
                    {
                        question: "Explain the difference between SQL and NoSQL databases.",
                        intention: "To gauge the candidate's core database concepts and schema designs.",
                        answer: "SQL databases are relational, table-based, and have predefined schemas. NoSQL databases are non-relational, document or key-value based, and have dynamic schemas."
                    }
                ],
                behavioralQuestions: [
                    {
                        question: "Tell me about a time you faced a difficult bug and how you resolved it.",
                        intention: "To evaluate debugging strategy, problem-solving, and resilience.",
                        answer: "I encountered a memory leak in a production server. I used Chrome DevTools memory allocation timeline profiles to locate the leaking closure and fixed it."
                    }
                ],
                skillGaps: [
                    {
                        skill: "Docker",
                        severity: "medium"
                    },
                    {
                        skill: "Unit Testing (Jest)",
                        severity: "low"
                    }
                ],
                preparationPlan: [
                    {
                        day: 1,
                        focus: "Docker Core Concepts",
                        tasks: [
                            "Read Docker documentation on containers and images",
                            "Build a Dockerfile for a Node.js Express server"
                        ]
                    },
                    {
                        day: 2,
                        focus: "Testing with Jest",
                        tasks: [
                            "Learn basics of unit testing in Javascript using Jest",
                            "Write unit tests for authentication helpers"
                        ]
                    }
                ],
                user: user._id
            },
            {
                title: "Frontend Developer",
                jobDescription: "Hiring a frontend developer with experience in React, TypeScript, and modern CSS/Sass.",
                resume: "John Doe - Resume\nSkills: React, Redux, Sass, CSS Grid, HTML5\nExperience: Experienced in crafting beautiful interfaces.",
                selfDescription: "Detail-oriented frontend engineer obsessed with crafting high-performance, beautiful user interfaces.",
                matchScore: 90,
                technicalQuestions: [
                    {
                        question: "What is virtual DOM in React?",
                        intention: "To test core understanding of React rendering optimization.",
                        answer: "The Virtual DOM is a programming concept where a virtual representation of the UI is kept in memory and synced with the real DOM by a library like ReactDOM."
                    }
                ],
                behavioralQuestions: [
                    {
                        question: "How do you handle conflict in a team?",
                        intention: "To test collaboration, empathy, and professional communication.",
                        answer: "I approach conflicts by active listening, understanding the other person's perspective, and focusing on data/solutions rather than personal views."
                    }
                ],
                skillGaps: [
                    {
                        skill: "TypeScript",
                        severity: "high"
                    }
                ],
                preparationPlan: [
                    {
                        day: 1,
                        focus: "TypeScript Fundamentals",
                        tasks: [
                            "Understand types, interfaces, and generics in TypeScript",
                            "Convert a simple React component from JS to TS"
                        ]
                    }
                ],
                user: user._id
            }
        ];

        await interviewReportModel.insertMany(reports);
        console.log("Seeding complete! Successfully created test user and 2 reports.");
        mongoose.connection.close();
    } catch (err) {
        console.error("Seeding failed:", err);
        mongoose.connection.close();
        process.exit(1);
    }
};

seedData();
