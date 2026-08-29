import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  memServer?: any;
  seeded?: boolean;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 3000,
    };

    cached.promise = (async () => {
      if (MONGODB_URI) {
        try {
          const m = await mongoose.connect(MONGODB_URI, opts);
          console.log(" Connected to MongoDB Atlas URI");
          return m;
        } catch (atlasErr: unknown) {
          const err = atlasErr as Error;
          console.warn("⚠️ MongoDB Atlas connection error:", err.message);
          console.log("⚡ Falling back to high-performance local in-memory Mongo Engine...");
        }
      }

      // Fallback to in-memory Mongo server for robust standalone development
      try {
        if (!cached.memServer) {
          const { MongoMemoryServer } = await import("mongodb-memory-server");
          cached.memServer = await MongoMemoryServer.create();
        }
        const memUri = cached.memServer.getUri();
        const m = await mongoose.connect(memUri, { bufferCommands: false });
        console.log("✅ Connected to High-Performance In-Memory Mongo Engine at", memUri);

        // Auto-seed on first in-memory connection
        if (!cached.seeded) {
          cached.seeded = true;
          setTimeout(async () => {
            try {
              const { seedDatabase } = await import("./seed");
              await seedDatabase();
            } catch (seedErr) {
              console.warn("Auto-seed info:", seedErr);
            }
          }, 100);
        }

        return m;
      } catch (memErr) {
        console.error("Critical database initialization error:", memErr);
        throw memErr;
      }
    })();
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
