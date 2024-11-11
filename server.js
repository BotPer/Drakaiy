const express = require('express');
const path = require('path');
const DarkAI = require('./DarkAI');
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

app.get('/api/chat', async (req, res) => {
    const { model, message } = req.query;

    if (!message) {
        return res.status(400).json({ error: 'Message non fourni' });
    }

    try {
        const result = await darkAI.createAsyncGenerator(model, [{ text: message }]);
        res.status(200).json({ response: result });
    } catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération de la réponse de l\'IA' });
    }
});

app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
