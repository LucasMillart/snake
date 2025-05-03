import mongoose from 'mongoose';

// Vérifier si le modèle existe déjà pour éviter les erreurs de redéfinition
const Score = mongoose.models.Score || mongoose.model('Score', new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Veuillez fournir un nom'],
    trim: true,
    maxlength: [20, 'Le nom ne peut pas dépasser 20 caractères']
  },
  score: {
    type: Number,
    required: [true, 'Veuillez fournir un score'],
    min: [0, 'Le score ne peut pas être négatif']
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
}));

export default Score;