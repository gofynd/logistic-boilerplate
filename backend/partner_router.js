/**
 * This module sets up an Express router for handling partner-related routes.
 * It includes a single GET route '/test_partner_route' that retrieves courier partner accounts.
 * 
 * @module partnerRouter
 */

const express = require('express');
const partnerRouter = express.Router();
const fdkExtension = require("./fdk");
const { organizationId } = require('./constant');

/**
 * GET /test_partner_route
 * 
 * This route handler retrieves courier partner accounts using the FDK extension.
 * 
 * @async
 * @function view
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * 
 * @returns {Object} JSON response indicating success or failure.
 * 
 * @throws Will log an error and respond with a 404 status if the operation fails.
 */
partnerRouter.get('/test_partner_route', async function view(req, res, next) {
    try {
        const partnerClient = await fdkExtension.getPartnerClient('6720b51d25f94c22e87376a5');
        const response = await partnerClient.logistics.getCourierPartnerAccounts({
            "organizationId": organizationId,
            "companyId": 1,
            "pageNo": 1,
            "pageSize": 1,
            "stage": "value",
            "paymentMode": "value",
            "transportType": "value"
        });
        console.log(JSON.stringify(response))
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(404).json({ success: false });
    }
});

module.exports = partnerRouter;
