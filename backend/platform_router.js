/**
 * This module sets up an Express router to handle HTTP GET requests for retrieving product information.
 * It provides two endpoints: one for fetching all products and another for fetching products specific to an application.
 */

const express = require('express');
const platformRouter = express.Router();
const fdkExtension = require("./fdk");

/**
 * GET /
 * Retrieves a list of all products.
 * 
 * @param {Object} req - The request object, expected to contain a `platformClient` with a `catalog` property.
 * @param {Object} res - The response object used to send back the JSON data.
 * @param {Function} next - The next middleware function in the stack.
 * 
 * @returns {Promise<void>} - Sends a JSON response containing the list of products.
 * 
 * @throws Will pass any errors to the next middleware function.
 */
platformRouter.get('/', async function view(req, res, next) {
    try {
        const { platformClient } = req;
        const data = await platformClient.catalog.getProducts();
        return res.json(data);
    } catch (err) {
        next(err);
    }
});

/**
 * GET /application/:application_id
 * Retrieves a list of products for a specific application.
 * 
 * @param {Object} req - The request object, expected to contain a `platformClient` and a `params` object with `application_id`.
 * @param {Object} res - The response object used to send back the JSON data.
 * @param {Function} next - The next middleware function in the stack.
 * 
 * @returns {Promise<void>} - Sends a JSON response containing the list of products for the specified application.
 * 
 * @throws Will pass any errors to the next middleware function.
 */
platformRouter.get('/application/:application_id', async function view(req, res, next) {
    try {
        const { platformClient } = req;
        const { application_id } = req.params;
        const data = await platformClient.application(application_id).catalog.getAppProducts();
        return res.json(data);
    } catch (err) {
        next(err);
    }
});

module.exports = platformRouter;
