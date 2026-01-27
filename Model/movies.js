import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
{
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },

  image: {
    type: String,
    required: true,
    match: [/^\/uploads\/.+\.(jpg|jpeg|png|webp)$/i, "Formato de imagem inválido"]
  },

  description: {
    type: String,
    default: ""
  },

  // =========================
  // RATINGS GLOBAIS
  // =========================
  ratings: [{
    value: {
      type: Number,
      min: 0,
      max: 5,
      required: true
    }
  }],

  averageratings: {
    type: Number,
    default: 0
  },

  // =========================
  // COMENTÁRIOS
  // =========================
  comments: [{
    authorName: {
      type: String,
      required: true,
      trim: true
    },

    text: {
      type: String,
      required: true,
      trim: true
    },

    rating: {
      type: Number,
      min: 0,
      max: 5,
      required: true
    },

    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
},
{
  timestamps: true,
  collection: "movies"
});

// =========================
// MÉDIA DE AVALIAÇÕES
// =========================
movieSchema.methods.calculateAverageratings = function (){
  if (!this.ratings || this.ratings.length === 0) {
    this.averageratings = 0;
    return;
  }

  const sum = this.ratings.reduce((acc, r) => acc + r.value, 0);
  this.averageratings = sum / this.ratings.length;
};

export default mongoose.model("Movie", movieSchema);
    