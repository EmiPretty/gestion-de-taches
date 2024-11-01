const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Modele de tache
const tacheSchema = new mongoose.Schema({
    titre: { type: String, required: true },
    description: { type: String },
    statut: { type: String, enum: ['en cours', 'termine'], default: 'en cours' },
    dateCreation: { type: Date, default: Date.now },
    utilisateurId: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur' }
});

const Tache = mongoose.model('Tache', tacheSchema);

// Modele d'utilisateur
const utilisateurSchema = new mongoose.Schema({
    nom: { type: String, required: true }
});

const Utilisateur = mongoose.model('Utilisateur', utilisateurSchema);

// Fonctionnalites CRUD pour les taches
// Lister toutes les taches
app.get('/taches', async (req, res) => {
    try {
        const taches = await Tache.find();
        res.send(taches);
    } catch (error) {
        res.status(500).send({ message: 'Erreur lors de la recuperation des taches.' });
    }
});

// Creer une nouvelle tache
app.post('/taches', async (req, res) => {
    try {
        const tache = await Tache.create(req.body);
        res.status(201).send(tache);
    } catch (error) {
        res.status(400).send({ message: 'Erreur lors de la creation de la tache.', error: error.message });
    }
});

// Lire une tache par ID
app.get('/taches/:id', async (req, res) => {
    try {
        const tache = await Tache.findById(req.params.id).populate('utilisateurId');
        if (!tache) {
            return res.status(404).send({ message: 'Tache non trouvee.' });
        }
        res.send(tache);
    } catch (error) {
        res.status(500).send({ message: 'Erreur lors de la recuperation de la tache.' });
    }
});

// Mettre a jour une tache par ID
app.put('/taches/:id', async (req, res) => {
    try {
        const tache = await Tache.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!tache) {
            return res.status(404).send({ message: 'Tache non trouvee.' });
        }
        res.send(tache);
    } catch (error) {
        res.status(400).send({ message: 'Erreur lors de la mise a jour de la tache.', error: error.message });
    }
});

// Supprimer une tache par ID
app.delete('/taches/:id', async (req, res) => {
    try {
        const tache = await Tache.findByIdAndDelete(req.params.id);
        if (!tache) {
            return res.status(404).send({ message: 'Tache non trouvee.' });
        }
        res.send(tache);
    } catch (error) {
        res.status(500).send({ message: 'Erreur lors de la suppression de la tache.' });
    }
});

// Filtrer les taches par statut
app.get('/taches/statut/:statut', async (req, res) => {
    try {
        const statut = req.params.statut;
        const taches = await Tache.find({ statut });
        res.send(taches);
    } catch (error) {
        res.status(500).send({ message: 'Erreur lors de la recuperation des taches par statut.' });
    }
});

// Filtrer les taches par date de creation
app.get('/taches/date/:date', async (req, res) => {
    try {
        const date = new Date(req.params.date);
        const taches = await Tache.find({ dateCreation: { $gte: date } });
        res.send(taches);
    } catch (error) {
        res.status(500).send({ message: 'Erreur lors de la recuperation des taches par date.' });
    }
});

// Fonctionnalites CRUD pour les utilisateurs
// Creer un nouvel utilisateur
app.post('/utilisateurs', async (req, res) => {
    try {
        const utilisateur = await Utilisateur.create(req.body);
        res.status(201).send(utilisateur);
    } catch (error) {
        res.status(400).send({ message: 'Erreur lors de la creation de l\'utilisateur.', error: error.message });
    }
});

// Lister tous les utilisateurs
app.get('/utilisateurs', async (req, res) => {
    try {
        const utilisateurs = await Utilisateur.find();
        res.send(utilisateurs);
    } catch (error) {
        res.status(500).send({ message: 'Erreur lors de la recuperation des utilisateurs.' });
    }
});

// Lire un utilisateur par ID
app.get('/utilisateurs/:id', async (req, res) => {
    try {
        const utilisateur = await Utilisateur.findById(req.params.id);
        if (!utilisateur) {
            return res.status(404).send({ message: 'Utilisateur non trouve.' });
        }
        res.send(utilisateur);
    } catch (error) {
        res.status(500).send({ message: 'Erreur lors de la recuperation de l\'utilisateur.' });
    }
});

// Mettre a jour un utilisateur par ID
app.put('/utilisateurs/:id', async (req, res) => {
    try {
        const utilisateur = await Utilisateur.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!utilisateur) {
            return res.status(404).send({ message: 'Utilisateur non trouve.' });
        }
        res.send(utilisateur);
    } catch (error) {
        res.status(400).send({ message: 'Erreur lors de la mise a jour de l\'utilisateur.', error: error.message });
    }
});

// Supprimer un utilisateur par ID
app.delete('/utilisateurs/:id', async (req, res) => {
    try {
        const utilisateur = await Utilisateur.findByIdAndDelete(req.params.id);
        if (!utilisateur) {
            return res.status(404).send({ message: 'Utilisateur non trouve.' });
        }
        res.send(utilisateur);
    } catch (error) {
        res.status(500).send({ message: 'Erreur lors de la suppression de l\'utilisateur.' });
    }
});

// Voir les taches assignees a un utilisateur
app.get('/utilisateurs/:id/taches', async (req, res) => {
    try {
        const taches = await Tache.find({ utilisateurId: req.params.id });
        res.send(taches);
    } catch (error) {
        res.status(500).send({ message: 'Erreur lors de la recuperation des taches assignees.' });
    }
});

async function start() {
    try {
        await mongoose.connect('mongodb://localhost:27017/gestion-de-taches');
        console.log('✅ Connexion etablie avec la base de donnee');
        app.listen(3000, () => console.log('✅ Serveur est demarre sur le port 3000'));
    } catch (error) {
        console.error('❌ Erreur de connexion ou de demarrage du serveur');
        process.exit(1);
    }
}

start();
