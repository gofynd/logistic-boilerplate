const sqlite3 = require('sqlite3').verbose();
const { setupFdk } = require("@gofynd/fdk-extension-javascript/express");
const { SQLiteStorage } = require("@gofynd/fdk-extension-javascript/express/storage");
const sqliteInstance = new sqlite3.Database('session_storage.db');
const webhookHandler = require('./webhook_routes');

/**
 * This module sets up an FDK (Fynd Development Kit) extension using the `setupFdk` function from the 
 * `@gofynd/fdk-extension-javascript/express` package. It configures the extension with necessary 
 * credentials, storage, and webhook handlers.
 *
 * Parameters:
 * - `api_key` (string): The API key for the extension, retrieved from environment variables.
 * - `api_secret` (string): The API secret for the extension, retrieved from environment variables.
 * - `base_url` (string): The base URL for the extension, retrieved from environment variables.
 * - `cluster` (string): The domain for the Fynd Platform API, retrieved from environment variables.
 * - `callbacks` (object): Contains callback functions for `auth` and `uninstall` events.
 *   - `auth` (function): Asynchronous function that returns the initial launch URL after the authentication process.
 *     - `req` (object): The request object containing query parameters.
 *   - `uninstall` (function): Asynchronous function to clean up data related to the extension.
 *     - `req` (object): The request object.
 * - `storage` (SQLiteStorage): An instance of `SQLiteStorage` for session storage, initialized with a SQLite database.
 * - `access_mode` (string): The access mode for the extension, set to "offline".
 * - `webhook_config` (object): Configuration for handling webhooks.
 *   - `api_path` (string): The API path for webhook events.
 *   - `notification_email` (string): Email for notifications.
 *   - `event_map` (object): Maps events to their respective handlers and versions.
 *     - `application/courier-partner/assign` (object): Handler and version for the assign event.
 *     - `application/courier-partner/cancel` (object): Handler and version for the cancel event.
 *
 * Returns:
 * - `fdkExtension` (object): The configured FDK extension instance.
 *
 * Exceptions:
 * - Any errors related to database connection or invalid configuration will be raised during setup.
 */
const fdkExtension = setupFdk({
    api_key: process.env.EXTENSION_API_KEY,
    api_secret: process.env.EXTENSION_API_SECRET,
    base_url: process.env.EXTENSION_BASE_URL,
    cluster: process.env.FP_API_DOMAIN,
    callbacks: {
        auth: async (req) => {
            // Write you code here to return initial launch url after auth process complete
            if (req.query.application_id)
                return `${req.extension.base_url}/company/${req.query['company_id']}/application/${req.query.application_id}`;
            else
                return `${req.extension.base_url}/company/${req.query['company_id']}`;
        },
        
        uninstall: async (req) => {
            // Write your code here to cleanup data related to extension
            // If task is time taking then process it async on other process.
        }
    },
    storage: new SQLiteStorage(sqliteInstance,"exapmple-fynd-platform-extension"), // add your prefix
    access_mode: "offline",
    webhook_config: {
        api_path: "/api/webhook-events",
        notification_email: "parasjain@gofynd.com",
        event_map: {
            'application/courier-partner/assign': {
                handler: webhookHandler.courierPartnerAsign,
                version: '1',
            },
            'application/courier-partner/cancel': {
                handler: webhookHandler.courierPartnerCancel,
                version: '1',
            }
        }
    },
});

module.exports = fdkExtension;