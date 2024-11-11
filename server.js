const express = require('express');
const path = require('path');
const DarkAI = require('./DarkAI'); // Assurez-vous que le nom du fichier est correct
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware pour les fichiers statiques dans le dossier 'public'
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Servir la page HTML principale
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const darkAI = new DarkAI();

// Modèle par défaut
const defaultModel = "gpt-3.5-turbo"; // Changez ce modèle par celui que vous voulez par défaut

app.get('/api/chat', async (req, res) => {
    const { model = defaultModel, message } = req.query; // Utilise un modèle par défaut si non fourni

    if (!message) {
        return res.status(400).json({ error: 'Message non fourni' });
    }

    try {
        // Utilise fetchResponse avec le modèle (par défaut ou fourni) et le message
        const result = await darkAI.fetchResponse(model, [{ text: message }], { temperature: 0.7 });
        res.status(200).json({ response: result });
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération de la réponse de l\'IA' });
    }
});

app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
