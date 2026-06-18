import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dns from 'dns';

dns.setServers(['8.8.8.8', '1.1.1.1']);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const JSON_DB_PATH = path.join(__dirname, '../data/db.json');
import dotenv from "dotenv";
dotenv.config();

// Ensure directory exists
const dataDir = path.dirname(JSON_DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initial Data
const initialCompanies = [
  {
    _id: "comp_1",
    name: "TechCorp Solutions",
    location: "California, US",
    foundedOn: "2015-06-12",
    city: "San Francisco",
    logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&h=100&fit=crop&q=80",
    description: "A leading provider of cloud infrastructure and enterprise software tools, empowering businesses worldwide."
  },
  {
    _id: "comp_2",
    name: "Creatives Studio",
    location: "New York, US",
    foundedOn: "2018-09-01",
    city: "New York City",
    logo: "https://images.unsplash.com/photo-1561070791-26c113006238?w=100&h=100&fit=crop&q=80",
    description: "Award-winning design and marketing agency helping brands connect with their audiences through digital storytelling."
  },
  {
    _id: "comp_3",
    name: "Apex Logistics",
    location: "Illinois, US",
    foundedOn: "2012-04-18",
    city: "Chicago",
    logo: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=100&h=100&fit=crop&q=80",
    description: "Global supply chain and distribution network delivering seamless shipping solutions across North America."
  }
];

const initialReviews = [
  {
    _id: "rev_1",
    companyId: "comp_1",
    fullName: "Sarah Jenkins",
    subject: "Exceptional Work Culture and Tech Stack",
    reviewText: "I've been working at TechCorp for over 2 years now. The engineering culture is phenomenal and we get to work with cutting edge technologies. The management really cares about work-life balance.",
    rating: 5,
    likes: 8,
    createdAt: new Date("2026-02-15T09:30:00Z").toISOString()
  },
  {
    _id: "rev_2",
    companyId: "comp_1",
    fullName: "Michael Chang",
    subject: "Great benefits but slow promotions",
    reviewText: "The salary and perks are excellent. Health insurance, wellness allowance, and free lunches are great. However, climbing the ladder can be slow and bureaucratic.",
    rating: 3,
    likes: 3,
    createdAt: new Date("2026-03-10T14:45:00Z").toISOString()
  },
  {
    _id: "rev_3",
    companyId: "comp_2",
    fullName: "Emily Davis",
    subject: "Very creative environment, fast-paced",
    reviewText: "Creatives Studio is a fun place to work if you love fast pacing and client-facing designs. Work is exciting but can sometimes lead to overtime. Overall, amazing team spirit!",
    rating: 4,
    likes: 12,
    createdAt: new Date("2026-05-01T11:00:00Z").toISOString()
  }
];

// DB State
let dbMode = 'JSON'; // 'MongoDB' or 'JSON'
const mongoUri = process.env.MONGODB_URI;

export const getDbMode = () => dbMode;

export const connectDB = async () => {
  try {
    // Attempt Mongoose connection with a 2-second timeout
    mongoose.set('strictQuery', false);
    const connPromise = mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2000
    });
    
    await connPromise;
    dbMode = 'MongoDB';
    console.log(`🚀 Connected to MongoDB at ${mongoose.connection.host}`);
  } catch (error) {
    console.warn(`⚠️ Could not connect to MongoDB: ${error.message}`);
    console.warn(`📁 Falling back to local JSON database: ${JSON_DB_PATH}`);
    dbMode = 'JSON';
    initializeJsonDb();
  }
};

// JSON Database Helper Utilities
const initializeJsonDb = () => {
  if (!fs.existsSync(JSON_DB_PATH)) {
    const defaultData = {
      companies: initialCompanies,
      reviews: initialReviews,
      users: []
    };
    fs.writeFileSync(JSON_DB_PATH, JSON.stringify(defaultData, null, 2));
    console.log(`Initialized database file with mock data.`);
  }
};

export const readJsonDb = () => {
  initializeJsonDb();
  try {
    const fileContent = fs.readFileSync(JSON_DB_PATH, 'utf-8');
    const parsed = JSON.parse(fileContent);
    if (!parsed.users) {
      parsed.users = [];
      fs.writeFileSync(JSON_DB_PATH, JSON.stringify(parsed, null, 2));
    }
    return parsed;
  } catch (e) {
    console.error("Error reading JSON database, resetting file:", e);
    const defaultData = { companies: initialCompanies, reviews: initialReviews, users: [] };
    fs.writeFileSync(JSON_DB_PATH, JSON.stringify(defaultData, null, 2));
    return defaultData;
  }
};

export const writeJsonDb = (data) => {
  fs.writeFileSync(JSON_DB_PATH, JSON.stringify(data, null, 2));
};
