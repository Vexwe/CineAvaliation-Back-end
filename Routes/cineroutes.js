import { Router } from "express";
import cinecontroller from "../Controller/cinecontroller.js";
import { upload } from "../config/upload.js";

const router = Router();

// rotas
router.get("/", cinecontroller.getMovies);

// upload de imagem
router.post("/addmovie", upload.single("image"), cinecontroller.addMovie);

router.get("/movie/:id", cinecontroller.viewMovie);

router.post("/movie/:id/commentandrate", cinecontroller.commentAndRate);

router.get("/edit/:id", cinecontroller.getEditMovie);

// edição com upload opcional
router.put("/edit/:id", upload.single("image"), cinecontroller.editMovie);

router.delete("/edit/:id", cinecontroller.deleteMovie);

export default router;
