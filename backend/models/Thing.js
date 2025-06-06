const mongoose = require('mongoose');

//création d'un schema de données
const thingShema = mongoose.Schema({
    title: { type: String, required: true},
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    userId: { type: String, required: true },
    price: { type: Number, required: true },
});

module.exports = mongoose.model('thing', thingShema);