const express = require('express');

const NewsletterController = require('../controllers/newsletter');

const api = express.Router();

api.post("/subscribe-newsletter/:email", NewsletterController.subscribeEmail);

module.exports = api;