const express = require('express');
const mongoose = require('mongoose');

const Things = require('./models/Thing');

mongoose.connect('mongodb+srv://gigi:Belgrand90@cluster0.bpmol2e.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    { useNewUrlParser: true,
        useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.post('/api/stuff', (req, res, next) => {
    // Suppession du faux id envoyer envoyé par le frontend ou encore retire le champs avant de copier l'objet car id est génerer automatiquemet
    delete req.body._id;
    const thing = new Thing({
        ...req.body
    });
    thing.save()                        // Interaction avec la BD pour enregistrer cet objet
        .then(() => res.status(201).json({message: 'Objet enregistré !'})) // Même si tt se passe bien, Dans le then il faut envoyé une reponse à la frontend sinon on vas avoir une expiration de la requete
        .catch(error => res.status(400).json({ error }));
});

app.put('/api/stuff/:id', (req, res, next) => {
    Things.updateOne({ _id: req.params.id}, { ...req.body, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet modifié !'}))
        .catch(error => res.status(400).json({ error}));
});


app.delete('/api/stuff/:id', (req, res, next) => {
    Things.deleteOne({ _id: req.params.id})
        .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
        .catch(error => res.status(400).json({ error}));
})

app.get('/api/stuff/:id', (req, res, next) => {
    Things.findOne({ id: req.params.id})
        .then(thing => res.status(200).json(thing))
        .catch(error => res.satus(404).json({ error}))
});

app.get('/api/stuff', (req, res, next) => {
    Things.find()
        .then(things => res.status(200).json(things))
        .catch(error => res.status(400).json({ error }))

});

module.exports = app;