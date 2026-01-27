import Movie from "../Model/movies.js";

export default class cinecontroller {

  // =========================
  // LISTAR FILMES
  // =========================
  static async getMovies(req, res){
  try {
    const movies = await Movie.find();
    res.status(200).json(movies);
  } catch (error) {
    console.error("ERRO REAL GETMOVIES:", error);
    res.status(500).json({ error: error.message });
  }
}


  // =========================
  // ADICIONAR FILME
  // =========================
  static async addMovie(req, res){
    try{
      const { name, description } = req.body;
      const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

      if (!name || !imagePath) {
        return res.status(400).json({ error: "Nome e imagem são obrigatórios" });
      }

      const newMovie = new Movie({ 
        name,
        image: imagePath,
        description
      });

      await newMovie.save();
      
      res.status(201).json({
        message: "Filme adicionado com sucesso!",
        movie: newMovie
      });

    } catch(error){
      res.status(500).json({
        message: "Erro na função addMovie",
        error: error.message
      });
    }
  }

  // =========================
  // BUSCAR FILME (EDIÇÃO)
  // =========================
  static async getEditMovie(req, res){
    try{
      const {id} = req.params;
      const themovie = await Movie.findById(id);    

      if (!themovie) {
        return res.status(404).json({ error: "Filme não encontrado" });
      }

      res.status(200).json(themovie);
    } catch(error){
      res.status(500).json({error: error.message});
    }
  }

  // =========================
  // EDITAR FILME
  // =========================
  static async editMovie(req, res){
    try{
      const {id} = req.params;
      const {name, description} = req.body;

      let updateData = { name, description };

      if (req.file) {
        updateData.image = `/uploads/${req.file.filename}`;
      }

      const updated = await Movie.updateOne({_id: id}, updateData);

      if (updated.matchedCount === 0) {
        return res.status(404).json({ error: "Filme não encontrado" });
      }

      res.status(200).json({message: "Filme atualizado com sucesso!"});
    } catch(error){
      res.status(500).json({error: error.message});
    }
  }

  // =========================
  // DELETAR FILME
  // =========================
  static async deleteMovie(req, res){
    try{
      const {id} = req.params;

      const deleted = await Movie.deleteOne({ _id: id});

      if (deleted.deletedCount === 0) {
        return res.status(404).json({ error: "Filme não encontrado" });
      }

      res.status(200).json({message: "Apagado com sucesso!"});
    } catch(error){
      res.status(500).json({error: error.message});
    }
  }

  // =========================
  // VER FILME
  // =========================
  static async viewMovie(req, res){
    try{
      const {id} = req.params;
      const themovie = await Movie.findById(id);        

      if (!themovie) {
        return res.status(404).json({ error: "Filme não encontrado" });
      }

      res.status(200).json(themovie);
    } catch(error){
      res.status(500).json({error: error.message});
    }
  }

  // =========================
  // COMENTAR + AVALIAR
  // =========================
  static async commentAndRate(req, res){
    try {
      const { id } = req.params;
      const { text, rating, authorName } = req.body;

      // validações
      if (!authorName || authorName.trim() === "") {
        return res.status(400).json({ error: "Nome do autor é obrigatório" });
      }

      if (!text || text.trim() === "") {
        return res.status(400).json({ error: "Comentário é obrigatório" });
      }

      if (rating === undefined || rating === null) {
        return res.status(400).json({ error: "Avaliação é obrigatória" });
      }

      if (rating < 0 || rating > 5) {
        return res.status(400).json({ error: "Avaliação inválida (0 a 5)" });
      }

      const movie = await Movie.findById(id);
      if (!movie) {
        return res.status(404).json({ error: "Filme não encontrado!" });
      }

      // salva comentário completo
      movie.comments.push({
        authorName,
        text,
        rating
      });

      // salva rating global
      movie.ratings.push({ value: rating });

      // recalcula média
      movie.calculateAverageratings();

      await movie.save();

      res.status(200).json({
        message: "Comentário e avaliação enviados com sucesso",
        averageratings: movie.averageratings,
        totalratings: movie.ratings.length,
        totalComments: movie.comments.length,
        comments: movie.comments
      });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
