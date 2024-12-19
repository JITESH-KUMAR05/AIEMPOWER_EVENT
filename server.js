const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

// Middleware to parse JSON data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection URL
const url = 'mongodb://127.0.0.1:27017';
const dbName = 'mydb';

// Connect to MongoDB
MongoClient.connect(url, (err, client) => {
    if (err) {
        console.error("Failed to connect to MongoDB:", err);
        return;
    }
    console.log('Connected to MongoDB');
    const db = client.db(dbName);
    const userCollection = db.collection('users');

    // Handle form submission
    app.post('/register', (req, res) => {
        const { username, email, password, confirmPassword } = req.body;
        if (password !== confirmPassword) {
            res.status(400).send('Passwords do not match');
            return;
        }
        userCollection.insertOne({ username, email, password }, (err, result) => {
            if (err) {
                console.error("Error inserting document:", err);
                res.status(500).send("Failed to register");
                return;
            }
            res.status(200).send('Registered successfully!');
        });
    });

    // Start the server
    app.listen(port, (listenErr) => {
        if (listenErr) {
            console.error('Failed to start the server:', listenErr);
        } else {
            console.log(`Server is running on port ${port}`);
        }
    });
});