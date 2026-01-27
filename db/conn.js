import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

export async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Conectado ao banco CineAvaliation!");
  } catch (error) {
    console.error("Erro ao conectar no MongoDB:", error);
    process.exit(1);
  }
}
