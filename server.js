const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json()); 

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
});

const User = mongoose.model('User', userSchema);

// Démarrage du serveur
async function start() {
    try {
        await mongoose.connect('mongodb://localhost:27017/mon-projet');
        console.log('✅ Connected to MongoDB');

        app.listen(3000, () => console.log('✅ Server started on port 3000'));
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

start();
