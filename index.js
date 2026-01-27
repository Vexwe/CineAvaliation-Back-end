import express from "express";
import { connectDB } from "./db/conn.js";
import path from "path";
import cors from "cors";
import cineroutes from "./Routes/cineroutes.js";

const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"]
}));

// JSON apenas para rotas sem upload
app.use(express.json());

// servir uploads
app.use("/uploads", express.static(path.resolve("uploads")));

app.use("/", cineroutes);

// conexão com o banco
async function startServer(){
  await connectDB();
}

app.listen(4242, ()=>{
  console.log("Servidor funcionando em http://localhost:4242");
});

startServer();
