import express from "express";
import "dotenv/config";
import { connectDB } from "./db/conn.js";
import path from "path";
import cors from "cors";
import cineroutes from "./Routes/cineroutes.js";

const app = express();

const PORT = process.env.PORT;
const FRONTEND_URL = process.env.FRONTEND_URL;

if (!PORT || !FRONTEND_URL) {
  throw new Error("Variáveis de ambiente obrigatórias não definidas");
}

app.use(cors({
  origin: FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "DELETE"]
}));

app.use(express.json());
app.use("/uploads", express.static(path.resolve("uploads")));
app.use("/", cineroutes);

// conexão com o banco
async function startServer(){
  await connectDB();
  app.listen(PORT, () => {
    console.log("Servidor rodando na porta", PORT);
  });
}

startServer();
