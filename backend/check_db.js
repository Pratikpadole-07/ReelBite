const mongoose = require('mongoose');
require('dotenv').config();

async function checkDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const foods = await mongoose.connection.db.collection('foods').find({}).toArray();
        console.log('Food items count:', foods.length);
        foods.forEach(doc => console.log('Name:', doc.name, 'Video:', doc.video));

        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

checkDB();
