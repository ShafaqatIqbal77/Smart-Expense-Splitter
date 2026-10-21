// =====================================================================
// config/db.js — MongoDB Connection File
// =====================================================================
//
// Yeh file sirf EK kaam karti hai: MongoDB se connect karna.
//
// mongoose.connect() ek async function hai — matlab yeh promise
// return karta hai. Agar connection successful ho toh .then() chalta
// hai, agar error ho toh .catch() chalta hai.
//
// Ham ise alag file mein isliye rakhte hain taake:
// 1. server.js clean rahe
// 2. Connection code ek jagah ho, baar baar repeat na ho
// =====================================================================

import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // process.env.MONGODB_URI = .env file se aata hai
    // Jab dotenv load hota hai, woh MONGODB_URI ko yahan inject kar deta hai
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    // conn.connection.host = MongoDB server ka address
    // Local hoga toh: localhost
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📦 Database Name: ${conn.connection.name}`);

  } catch (error) {
    // Agar kuch galat ho gaya (e.g., MongoDB chal nahi raha)
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error('💡 Check karo ke MongoDB service chal rahi hai:');
    console.error('   sudo systemctl status mongod');
    
    // process.exit(1) matlab: program band karo, error code 1 ke saath
    // (1 = error, 0 = success)
    process.exit(1);
  }
};

export default connectDB;
