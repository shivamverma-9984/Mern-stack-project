import mongoose from 'mongoose';
import dns from 'dns';
import dotenv from "dotenv";

// Prioritize IPv4 to prevent connection timeouts/issues on systems where IPv6 isn't supported/configured
dns.setDefaultResultOrder('ipv4first');

// Force public DNS resolution for Atlas SRV records
dns.setServers(['8.8.8.8', '1.1.1.1']);

dotenv.config();

const mongoUri = process.env.MONGODB_URI;

export const connectDB = async () => {
  try {
    mongoose.set('strictQuery', false);
    // Added tlsAllowInvalidCertificates to resolve certificate validation/trust store issues on Windows local environments
    const connPromise = mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      tlsAllowInvalidCertificates: true
    });
    
    await connPromise;
    console.log(`🚀 Connected to MongoDB at ${mongoose.connection.host}`);
  } catch (error) {
    console.error(`❌ Could not connect to MongoDB: ${error.message}`);
    process.exit(1);
  }
};
