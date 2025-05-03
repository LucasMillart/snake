import { NextResponse } from 'next/server';
import connectToDatabase from '../../lib/mongodb';
import Score from '../../lib/models/Score';

// GET /api/scores - Récupérer les meilleurs scores
export async function GET() {
  try {
    await connectToDatabase();

    // Récupérer les 10 meilleurs scores triés par ordre décroissant
    const scores = await Score.find({})
      .sort({ score: -1 })
      .limit(10)
      .select('name score date');

    return NextResponse.json({ success: true, data: scores });
  } catch (error) {
    console.error('Erreur lors de la récupération des scores:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur lors de la récupération des scores' },
      { status: 500 }
    );
  }
}

// POST /api/scores - Enregistrer un nouveau score
export async function POST(request) {
  try {
    await connectToDatabase();

    // Récupérer les données du corps de la requête
    const { name, score } = await request.json();

    // Validation des données
    if (!name || !score) {
      return NextResponse.json(
        { success: false, message: 'Nom et score requis' },
        { status: 400 }
      );
    }

    // Créer un nouveau score
    const newScore = await Score.create({
      name,
      score: parseInt(score)
    });

    return NextResponse.json(
      { success: true, data: newScore },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement du score:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur lors de l\'enregistrement du score' },
      { status: 500 }
    );
  }
}