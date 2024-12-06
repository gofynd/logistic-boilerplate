const express = require('express');
const platformRouter = express.Router();
const fdkExtension = require("./fdk");

platformRouter.get('/', async function view(req, res, next) {
    console.log("---------------------------------------------")
    console.log("platformRouter.get")
    try {
        const {
            platformClient
        } = req;
        const data = await platformClient.catalog.getProducts()
        return res.json(data);
    } catch (err) {
        next(err);
    }
});

// Get products list for application
platformRouter.get('/application/:application_id', async function view(req, res, next) {
    console.log("---------------------------------------------")
    console.log("platformRouter.get.application")
    try {
        const {
            platformClient
        } = req;
        const { application_id } = req.params;
        const data = await platformClient.application(application_id).catalog.getAppProducts()
        return res.json(data);
    } catch (err) {
        next(err);
    }
});

module.exports = platformRouter;