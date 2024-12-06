const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require("path");
const serveStatic = require("serve-static");
const { readFileSync } = require('fs');

require('dotenv').config()
const fdkExtension = require("./backend/fdk");
const platformRouter = require('./backend/platform_router');
const partnerRouter = require('./backend/partner_router');
const basicRouter = require('./backend/basic_router');


const STATIC_PATH = process.env.NODE_ENV === 'production'
    ? path.join(process.cwd(), 'frontend', 'public' , 'dist')
    : path.join(process.cwd(), 'frontend');
    
const app = express();


// Middleware to parse cookies with a secret key
app.use(cookieParser("ext.session"));
// Middleware to parse JSON bodies with a size limit of 2mb
app.use(bodyParser.json({limit: '2mb'}));
// Serve static files from the React dist directory
app.use(serveStatic(STATIC_PATH, { index: false }));

// FDK extension handler and API routes (extension launch routes)
app.use("/", fdkExtension.fdkHandler);

// Route to handle webhook events and process it.
app.use('/api/webhook-events', async function(req, res) {
    try {
      console.log(`Webhook Event: ${req.body.event} received`)
      await fdkExtension.webhookRegistry.processWebhook(req);
      return res.status(200).json({"success": true});
    } catch(err) {
      console.log(`Error Processing ${req.body.event} Webhook`);
      return res.status(500).json({"success": false});
    }
})

const platformApiRoutes = fdkExtension.platformApiRoutes;
const partnerApiRoutes = fdkExtension.partnerApiRoutes;

// If you are adding routes outside of the /api path, 
// remember to also add a proxy rule for them in /frontend/vite.config.js
app.use('/api', platformApiRoutes);
app.use('/apipartner', partnerApiRoutes);
app.use('/apibasic', basicRouter);

partnerApiRoutes.use('/', partnerRouter);
platformApiRoutes.use('/products', platformRouter);

// Serve the React app for all other routes
app.get('*', (req, res) => {
    return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(path.join(STATIC_PATH, "index.html")));
});

module.exports = app;
