const express = require('express');
const partnerRouter = express.Router();
const fdkExtension = require("./fdk");
const { organizationId } = require('./constant');

partnerRouter.get('/', async function view(req, res, next) {
    console.log("---------------------------------------------")
    console.log("partnerRouterr.get")
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

        // const platformClient = await fdkExtension.getPlatformClient(9294);
        // let data = await platformClient.lead.getTickets();
        // // Some business logic here
        // res.json({ success: true });
        console.log(JSON.stringify(response))
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(404).json({ success: false });
    }
});

module.exports = partnerRouter;