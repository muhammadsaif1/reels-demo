import mongoose from "mongoose";

const mongoString = process.env.MONGODB_URL!;

if (!mongoString) throw new Error("Please check Mongo Url");

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: true,
      maxPoolSize: 10,
    };

    cached.promise = mongoose
      .connect(mongoString, opts)
      .then(() => mongoose.connection);
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    console.error(error);
    throw new Error("Check Database file");
  }
  return cached.conn;
}
