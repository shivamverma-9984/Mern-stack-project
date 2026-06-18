import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const JSON_DB_PATH = path.join(__dirname, '../data/db.json');

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

// Mongoose Schemas
const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  foundedOn: { type: String, required: true },
  city: { type: String, required: true },
  logo: { type: String },
  description: { type: String }
});

const reviewSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  fullName: { type: String, required: true },
  subject: { type: String, required: true },
  reviewText: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  likes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

let CompanyModel;
let ReviewModel;
let UserModel;

// DB State
let dbMode = 'JSON'; // 'MongoDB' or 'JSON'
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/review_rating';

export const connectDB = async () => {
  try {
    // Attempt Mongoose connection with a 2-second timeout
    mongoose.set('strictQuery', false);
    const connPromise = mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2000
    });
    
    await connPromise;
    dbMode = 'MongoDB';
    CompanyModel = mongoose.model('Company', companySchema);
    ReviewModel = mongoose.model('Review', reviewSchema);
    UserModel = mongoose.model('User', userSchema);
    console.log(`🚀 Connected to MongoDB at ${mongoUri}`);
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

const readJsonDb = () => {
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

const writeJsonDb = (data) => {
  fs.writeFileSync(JSON_DB_PATH, JSON.stringify(data, null, 2));
};

// --- DATA ACCESS LAYER ---

// Get all companies with optional search, city, and average rating filters
export const getCompanies = async (search = '', city = '', rating = 0) => {
  if (dbMode === 'MongoDB') {
    let query = {};
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    if (city) {
      query.city = { $regex: city, $options: 'i' };
    }
    
    const companies = await CompanyModel.find(query).lean();
    
    // Process companies with reviews to compute average rating
    const processedCompanies = await Promise.all(companies.map(async (company) => {
      const reviews = await ReviewModel.find({ companyId: company._id }).lean();
      const avgRating = reviews.length > 0 
        ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10 
        : 0;
      return {
        ...company,
        avgRating,
        reviewCount: reviews.length
      };
    }));

    if (rating > 0) {
      return processedCompanies.filter(c => Math.round(c.avgRating) === Number(rating));
    }
    return processedCompanies;
  } else {
    // JSON MODE
    const db = readJsonDb();
    let result = db.companies;

    if (search) {
      const lowerSearch = search.toLowerCase();
      result = result.filter(c => c.name.toLowerCase().includes(lowerSearch));
    }
    if (city) {
      const lowerCity = city.toLowerCase();
      result = result.filter(c => c.city.toLowerCase().includes(lowerCity));
    }

    const processed = result.map(c => {
      const reviews = db.reviews.filter(r => r.companyId === c._id);
      const avgRating = reviews.length > 0 
        ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10 
        : 0;
      return {
        ...c,
        avgRating,
        reviewCount: reviews.length
      };
    });

    if (rating > 0) {
      return processed.filter(c => Math.round(c.avgRating) === Number(rating));
    }
    return processed;
  }
};

// Add new company
export const addCompany = async (companyData) => {
  if (dbMode === 'MongoDB') {
    const newCompany = new CompanyModel({
      name: companyData.name,
      location: companyData.location,
      foundedOn: companyData.foundedOn,
      city: companyData.city,
      logo: companyData.logo || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&h=100&fit=crop&q=80",
      description: companyData.description || "No description provided."
    });
    const saved = await newCompany.save();
    return saved.toObject();
  } else {
    // JSON MODE
    const db = readJsonDb();
    const newCompany = {
      _id: `comp_${Date.now()}`,
      name: companyData.name,
      location: companyData.location,
      foundedOn: companyData.foundedOn,
      city: companyData.city,
      logo: companyData.logo || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&h=100&fit=crop&q=80",
      description: companyData.description || "No description provided."
    };
    db.companies.push(newCompany);
    writeJsonDb(db);
    return newCompany;
  }
};

// Get single company details
export const getCompanyById = async (id) => {
  if (dbMode === 'MongoDB') {
    const company = await CompanyModel.findById(id).lean();
    if (!company) return null;
    const reviews = await ReviewModel.find({ companyId: id }).lean();
    const avgRating = reviews.length > 0 
      ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10 
      : 0;
    return {
      ...company,
      avgRating,
      reviewCount: reviews.length
    };
  } else {
    // JSON MODE
    const db = readJsonDb();
    const company = db.companies.find(c => c._id === id);
    if (!company) return null;
    const reviews = db.reviews.filter(r => r.companyId === id);
    const avgRating = reviews.length > 0 
      ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10 
      : 0;
    return {
      ...company,
      avgRating,
      reviewCount: reviews.length
    };
  }
};

// Get reviews for a company, sorted by parameter
export const getReviews = async (companyId, sortBy = 'newest') => {
  let reviews = [];
  if (dbMode === 'MongoDB') {
    reviews = await ReviewModel.find({ companyId }).lean();
  } else {
    const db = readJsonDb();
    reviews = db.reviews.filter(r => r.companyId === companyId);
  }

  // Sort reviews
  if (sortBy === 'newest') {
    reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else if (sortBy === 'rating_desc') {
    reviews.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === 'rating_asc') {
    reviews.sort((a, b) => a.rating - b.rating);
  } else if (sortBy === 'likes') {
    reviews.sort((a, b) => b.likes - a.likes);
  }

  return reviews;
};

// Add review
export const addReview = async (companyId, reviewData) => {
  if (dbMode === 'MongoDB') {
    const newReview = new ReviewModel({
      companyId,
      fullName: reviewData.fullName,
      subject: reviewData.subject,
      reviewText: reviewData.reviewText,
      rating: Number(reviewData.rating),
      likes: 0,
      createdAt: new Date()
    });
    const saved = await newReview.save();
    return saved.toObject();
  } else {
    const db = readJsonDb();
    const newReview = {
      _id: `rev_${Date.now()}`,
      companyId,
      fullName: reviewData.fullName,
      subject: reviewData.subject,
      reviewText: reviewData.reviewText,
      rating: Number(reviewData.rating),
      likes: 0,
      createdAt: new Date().toISOString()
    };
    db.reviews.push(newReview);
    writeJsonDb(db);
    return newReview;
  }
};

// Like a review
export const likeReview = async (reviewId) => {
  if (dbMode === 'MongoDB') {
    const updated = await ReviewModel.findByIdAndUpdate(
      reviewId,
      { $inc: { likes: 1 } },
      { new: true }
    ).lean();
    return updated;
  } else {
    const db = readJsonDb();
    const review = db.reviews.find(r => r._id === reviewId);
    if (!review) return null;
    review.likes = (review.likes || 0) + 1;
    writeJsonDb(db);
    return review;
  }
};

// Find user by email
export const findUserByEmail = async (email) => {
  if (dbMode === 'MongoDB') {
    return await UserModel.findOne({ email }).lean();
  } else {
    const db = readJsonDb();
    return db.users.find(u => u.email === email) || null;
  }
};

// Create a new user
export const createUser = async (userData) => {
  if (dbMode === 'MongoDB') {
    const newUser = new UserModel({
      fullName: userData.fullName,
      email: userData.email,
      password: userData.password,
      createdAt: new Date()
    });
    const saved = await newUser.save();
    return saved.toObject();
  } else {
    const db = readJsonDb();
    const newUser = {
      _id: `user_${Date.now()}`,
      fullName: userData.fullName,
      email: userData.email,
      password: userData.password,
      createdAt: new Date().toISOString()
    };
    db.users.push(newUser);
    writeJsonDb(db);
    return newUser;
  }
};
