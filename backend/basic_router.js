const express = require('express');
const basicRouter = express.Router();
const fdkExtension = require("./fdk");
const { uploadFileToStorage } = require('./utils');
const path = require('path');
const { organizationId } = require('./constant');

basicRouter.get('/', async function view(req, res, next) {
    console.log("---------------------------------------------")
    console.log("basicRouterr.get")
    try {
        const partnerClient = await fdkExtension.getPartnerClient(organizationId);
        const response = await partnerClient.logistics.getCourierPartnerSchemes({
            "organizationId": organizationId,
          });
        console.log(JSON.stringify(response))
        res.json(response);
    } catch (err) {
        console.error(err);
        res.status(404).json({ success: false });
    }
});

basicRouter.post('/scheme', async function view(req, res, next) {
    console.log("---------------------------------------------")
    console.log("basicRouterr.post.scheme")
    try {
        const partnerClient = await fdkExtension.getPartnerClient('6720b51d25f94c22e87376a5');
        const response = await partnerClient.logistics.createCourierPartnerScheme({
            "organizationId": organizationId,
            "body": {
                "extension_id": process.env.EXTENSION_API_KEY,
                "scheme_id": "Scheme_id_4",
                "name": "Scheme_name_4",
                "weight": {
                    "lt": 10,
                    "gt": 1
                },
                "volumetric_weight": {
                    "lt": 10,
                    "gt": 1
                },
                "transport_type": "surface",
                "region": "intra-city",
                "delivery_type": "one-day",
                "payment_mode": [
                    "COD",
                    "PREPAID"
                ],
                "stage": "enabled",
                "status_updates": "real-time",
                "ndr_attempts": 1,
                "qc_shipment_item_quantity": 1,
                "non_qc_shipment_item_quantity": 1,
                "feature": {
                    "doorstep_qc": false,
                    "qr": false,
                    "mps": false,
                    "ndr": false,
                    "dangerous_goods": false,
                    "fragile_goods": false,
                    "restricted_goods": false,
                    "cold_storage_goods": false,
                    "doorstep_exchange": false,
                    "doorstep_return": false,
                    "product_installation": false,
                    "openbox_delivery": false,
                    "multi_pick_single_drop": false,
                    "single_pick_multi_drop": false,
                    "multi_pick_multi_drop": false,
                    "ewaybill": false
                }
            }
        });
        console.log(JSON.stringify(response))
        res.json(response);
    } catch (err) {
        console.error(err);
        console.log(JSON.stringify(err))
        res.status(404).json({ success: false });
    }
});

basicRouter.get('/countries', async function view(req, res, next) {
    console.log("---------------------------------------------")
    console.log("basicRouterr.get.countries")
    try {
        const partnerClient = await fdkExtension.getPartnerClient('6720b51d25f94c22e87376a5');
        const response = await partnerClient.logistics.getCountries({
            "organizationId": organizationId,
            "onboarding": true,
            "q": "india"
        });
        console.log(JSON.stringify(response))
        res.json(response);
    } catch (err) {
        console.error(err);
        console.log(JSON.stringify(err))
        res.status(404).json({ success: false });
    }
});

basicRouter.get('/sample_serv_tat_file', async function view(req, res, next) {
    console.log("---------------------------------------------")
    console.log("basicRouterr.get.sample_serv_tat_file")
    try {
        const partnerClient = await fdkExtension.getPartnerClient('6720b51d25f94c22e87376a5');
        const response = await partnerClient.logistics.sampleFileServiceability({
            "organizationId": organizationId,
            "body": {
                "country": "INDIA",
                "region": "pincode",
                "type": "serviceability"
            }
        });
        console.log(JSON.stringify(response))
        console.log("---------------------------------------------")
        const response_tat = await partnerClient.logistics.sampleFileServiceability({
            "organizationId": organizationId,
            "body": {
                "country": "INDIA",
                "region": "city",
                "type": "tat"
            }
        });
        console.log(response_tat)
        res.json(response_tat);
    } catch (err) {
        console.error(err);
        console.log(JSON.stringify(err))
        res.status(404).json({ success: false });
    }
});

basicRouter.get('/sample_serv_tat_file_status', async function view(req, res, next) {
    console.log("---------------------------------------------")
    console.log("basicRouterr.get.sample_serv_tat_file_status")
    try {
        const partnerClient = await fdkExtension.getPartnerClient('6720b51d25f94c22e87376a5');
        // batch_id for servicability:
        // batch_id for pincode: 674d953ce8850ed0d9dc82a4, 674ea5d6b5a6b6b1e4c8c689
        // batch_id for state: 674d98cce24df6bf60ef2e3f
        // batch_id for city: 674d98db2b5e4850a182ac24
        // batch_id for tat:
        // batch_id for pincode: 674edebd25db8c267fc6feab
        const response = await partnerClient.logistics.getSampleFileServiceabilityStatus({
            "organizationId": organizationId,
            "batchId": "674edebd25db8c267fc6feab"
          });
        console.log(JSON.stringify(response))
        res.json(response);
    } catch (err) {
        console.error(err);
        console.log(JSON.stringify(err))
        res.status(404).json({ success: false });
    }
});

basicRouter.post('/start_and_complete_upload_servicability', async function view(req, res, next) {
    console.log("---------------------------------------------")
    console.log("basicRouterr.post.start_and_complete_upload_servicability")
    try {
        const partnerClient = await fdkExtension.getPartnerClient('6720b51d25f94c22e87376a5');
        const response = await partnerClient.fileStorage.startUpload({
            "namespace": "test",
            "organizationId": organizationId,
            "body": {
                "file_name": "sample_serv_file.csv",
                "content_type": "text/csv",
                "size": 500,
                "tags": [
                    "servicability",
                ],
                "params": {
                    "subpath": "test"
                }
            }
        });
        console.log(JSON.stringify(response))

        const uploadUrl = response.upload.url;
        // Replace with the path to your local file
        const filePath = path.resolve(__dirname, '../sample_serv_file.csv');
        // Replace with your file's MIME type
        const mimeType = "text/csv";
        console.log("---------------------------------------------")
        console.log(uploadUrl, filePath)
        await uploadFileToStorage(uploadUrl, filePath, mimeType);

        const response_complte = await partnerClient.fileStorage.completeUpload({
            "namespace": "test",
            "organizationId": organizationId,
            "body": {
                "file_name": response.file_name,
                "file_path": response.file_path,
                "content_type": response.content_type,
                "method": response.method,
                "namespace": response.namespace,
                "operation": response.operation,
                "size": response.size,
                "upload": {
                    "expiry": response.upload.expiry,
                    "url": response.upload.url
                },
                "tags": response.tags
            }
        });
        console.log("---------------------------------------------")
        console.log(response_complte)

        res.json(response_complte);
    } catch (err) {
        console.error(err);
        console.log(JSON.stringify(err))
        res.status(404).json({ success: false });
    }
});

basicRouter.post('/start_and_complete_upload_tat', async function view(req, res, next) {
    console.log("---------------------------------------------")
    console.log("basicRouterr.post.start_and_complete_upload_tat")
    try {
        const partnerClient = await fdkExtension.getPartnerClient('6720b51d25f94c22e87376a5');
        const response = await partnerClient.fileStorage.startUpload({
            "namespace": "test",
            "organizationId": organizationId,
            "body": {
                "file_name": "sample_tat_file.csv",
                "content_type": "text/csv",
                "size": 500,
                "tags": [
                    "tat",
                ],
                "params": {
                    "subpath": "test"
                }
            }
        });
        console.log(JSON.stringify(response))

        const uploadUrl = response.upload.url;
        // Replace with the path to your local file
        const filePath = path.resolve(__dirname, '../sample_tat_file.csv');
        // Replace with your file's MIME type
        const mimeType = "text/csv";
        console.log("---------------------------------------------")
        console.log(uploadUrl, filePath)
        await uploadFileToStorage(uploadUrl, filePath, mimeType);

        const response_complte = await partnerClient.fileStorage.completeUpload({
            "namespace": "test",
            "organizationId": organizationId,
            "body": {
                "file_name": response.file_name,
                "file_path": response.file_path,
                "content_type": response.content_type,
                "method": response.method,
                "namespace": response.namespace,
                "operation": response.operation,
                "size": response.size,
                "upload": {
                    "expiry": response.upload.expiry,
                    "url": response.upload.url
                },
                "tags": response.tags
            }
        });
        console.log("---------------------------------------------")
        console.log(response_complte)

        res.json(response_complte);
    } catch (err) {
        console.error(err);
        console.log(JSON.stringify(err))
        res.status(404).json({ success: false });
    }
});

basicRouter.post('/upload_scheme_servicability', async function view(req, res, next) {
    console.log("---------------------------------------------")
    console.log("basicRouterr.post.upload_scheme_servicability")
    try {
        const partnerClient = await fdkExtension.getPartnerClient('6720b51d25f94c22e87376a5');
        const response = await partnerClient.logistics.bulkServiceability({
            "organizationId": organizationId,
            "extensionId": process.env.EXTENSION_API_KEY,
            "schemeId": "Scheme_id_3",
            "body": {
                "file_path": "https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyprod/wrkr/test/general/free/original/sample_serv_file.csv",
                "country": "India",
                "action": "import",
                "region": "Pincode"
            }
        });
        console.log(JSON.stringify(response))
        res.json(response);
    } catch (err) {
        console.error(err);
        console.log(JSON.stringify(err))
        res.status(404).json({ success: false });
    }
});

basicRouter.post('/upload_scheme_tat', async function view(req, res, next) {
    console.log("---------------------------------------------")
    console.log("basicRouterr.post.upload_scheme_tat")
    try {
        const partnerClient = await fdkExtension.getPartnerClient('6720b51d25f94c22e87376a5');
        const response = await partnerClient.logistics.bulkTat({
            "organizationId": organizationId,
            "extensionId": process.env.EXTENSION_API_KEY,
            "schemeId": "Scheme_id_3",
            "body": {
                "file_path": "https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyprod/wrkr/test/general/free/original/sample_tat_file.csv",
                "country": "India",
                "action": "import",
                "region": "City"
            }
        });
        console.log(JSON.stringify(response))
        res.json(response);
    } catch (err) {
        console.error(err);
        console.log(JSON.stringify(err))
        res.status(404).json({ success: false });
    }
});

basicRouter.get('/scheme_servicability_history', async function view(req, res, next) {
    console.log("---------------------------------------------")
    console.log("basicRouterr.get.scheme_servicability_history")
    try {
        const partnerClient = await fdkExtension.getPartnerClient('6720b51d25f94c22e87376a5');
        const response = await partnerClient.logistics.getBulkServiceability({
            "organizationId": organizationId,
            "extensionId": process.env.EXTENSION_API_KEY,
            "schemeId": "Scheme_id_3",
            // "batchId": "674eda8262b934d3a7c31f22",
            // "action": "import",
            // "status": "processing",
            // "country": "India",
            // "region": "Pincode",
            // "startDate": "2024-12-01T18:30:00Z",
            // "endDate": "2024-12-04T18:30:00Z"
        });
        console.log(JSON.stringify(response))
        res.json(response);
    } catch (err) {
        console.error(err);
        console.log(JSON.stringify(err))
        res.status(404).json({ success: false });
    }
});

basicRouter.get('/scheme_tat_history', async function view(req, res, next) {
    console.log("---------------------------------------------")
    console.log("basicRouterr.get.scheme_tat_history")
    try {
        const partnerClient = await fdkExtension.getPartnerClient('6720b51d25f94c22e87376a5');
        const response = await partnerClient.logistics.getBulkTat({
            "organizationId": organizationId,
            "extensionId": process.env.EXTENSION_API_KEY,
            "schemeId": "Scheme_id_3",
            // "batchId": "674eda8262b934d3a7c31f22",
            // "action": "import",
            // "status": "processing",
            // "country": "India",
            // "region": "Pincode",
            // "startDate": "2024-12-01T18:30:00Z",
            // "endDate": "2024-12-04T18:30:00Z"
        });
        console.log(JSON.stringify(response))
        res.json(response);
    } catch (err) {
        console.error(err);
        console.log(JSON.stringify(err))
        res.status(404).json({ success: false });
    }
});

basicRouter.post('/create_seller_account', async function view(req, res, next) {
    console.log("---------------------------------------------")
    console.log("basicRouterr.post.create_seller_account")
    try {
        const partnerClient = await fdkExtension.getPartnerClient('6720b51d25f94c22e87376a5');
        const response = await partnerClient.logistics.createCourierPartnerAccount({
            "organizationId": organizationId,
            "companyId": 9294,
            "body": {
              "extension_id": process.env.EXTENSION_API_KEY,
              "account_id": "Scheme_id_3_company_id_9294",
              "scheme_id": "Scheme_id_3",
              "is_self_ship": false,
              "stage": "enabled",
              "is_own_account": true
            }
          });
        console.log(JSON.stringify(response))
        res.json(response);
    } catch (err) {
        console.error(err);
        console.log(JSON.stringify(err))
        res.status(404).json({ success: false });
    }
});

basicRouter.post('/update_shipment_status', async function view(req, res, next) {
    console.log("---------------------------------------------")
    console.log("basicRouterr.post.update_shipment_status")
    try {
        const platformClient = await fdkExtension.getPlatformClient(9294);
        const response = await platformClient.order.updateShipmentStatus({
            "body": {
                "task": false,
                "force_transition": false,
                "lock_after_transition": false,
                "unlock_before_transition": false,
                "resume_tasks_after_unlock": false,
                "statuses": [
                  {
                    "shipments": [
                      {
                        "identifier": "17334083479041568015",
                        "products": [],
                        "data_updates": {
                          "entities": [
                            {
                              "filters": [],
                              "data": {
                                "meta": {
                                  "courier_partner_extension_id": process.env.EXTENSION_API_KEY,
                                  "courier_partner_scheme_id": "Scheme_id_3",
                                  "sort_code": "1129",
                                  "ewaybill_info": {
                                    "success": true
                                  },
                                  "waybill": [
                                    "6806010004126"
                                  ],
                                  "tracking_url": "https://www.test.com/track/package/6806010004126",
                                  "courier_partner_shipper_name": "Test",
                                  "logistics_meta": {
                                    "remark": "NAN"
                                  },
                                  "is_own_account": true,
                                  "shipping_label_provided": false,
                                  "estimated_delivery_date": null,
                                  "promised_delivery_date": null,
                                  "rider_details": {
                                    "name": "Paras",
                                    "phone": "+9967539854"
                                  },
                                  "label": "https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyprod/wrkr/documents/label/PDFs/17291005908611498449.pdf",
                                  "courier_partner_name": "Test Partner Name"
                                },
                                "delivery_awb_number": "6806010004126",
                                "pdf_links": {
                                  "label": "https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyprod/wrkr/documents/label/PDFs/17291005908611498449.pdf"
                                }
                              }
                            }
                          ],
                          "products": [
                            {
                              "filters": [],
                              "data": {
                                "meta": {
                                  "courier_partner_extension_id": process.env.EXTENSION_API_KEY,
                                  "courier_partner_scheme_id": "Scheme_id_3",
                                  "sort_code": "1129",
                                  "ewaybill_info": {
                                    "success": true
                                  },
                                  "waybill": [
                                    "6806010004126"
                                  ],
                                  "tracking_url": "https://www.test.com/track/package/6806010004126",
                                  "courier_partner_shipper_name": "Test",
                                  "is_own_account": true,
                                  "estimated_delivery_date": null,
                                  "promised_delivery_date": null,
                                  "rider_details": {
                                    "name": "Paras",
                                    "phone": "+9967539854"
                                  },
                                  "label": "https://cdn.fynd.com/v2/falling-surf-7c8bb8/fyprod/wrkr/documents/label/PDFs/17291005908611498449.pdf",
                                  "courier_partner_name": "Test Partner Name"
                                },
                                "delivery_awb_number": "6806010004126"
                              }
                            }
                          ],
                          "order_item_status": [
                            {
                              "filters": [],
                              "data": {
                                "meta": {
                                  "courier_partner_details": {
                                    "courier_partner_extension_id": process.env.EXTENSION_API_KEY,
                                    "courier_partner_scheme_id": "Scheme_id_3",
                                    "courier_partner_name": "Test Partner Name",
                                    "is_own_account": true,
                                    "courier_partner_shipper_name": "Test"
                                  }
                                }
                              }
                            }
                          ]
                        }
                      }
                    ],
                    "status": "dp_assigned",
                    "exclude_bags_next_state": "",
                    "split_shipment": false
                  }
                ]
              }
            });
        console.log(JSON.stringify(response))
        res.json(response);
    } catch (err) {
        console.error(err);
        console.log(JSON.stringify(err))
        res.status(404).json({ success: false });
    }
});


basicRouter.post('/update_shipment_tracking', async function view(req, res, next) {
    console.log("---------------------------------------------")
    console.log("basicRouterr.post.update_shipment_tracking")
    try {
        const platformClient = await fdkExtension.getPlatformClient(9294);
        const response = await platformClient.order.updateShipmentTracking({
            "body": {
                "awb": "6806010004126",
                "dp_location": "Mumbai",
                "dp_name": "Test bluedart",
                "dp_status": "out_for_delivery",
                "dp_status_updated_at": "2024-12-06T10:15:30Z",
                "estimated_delivery_date": "2024-12-10T10:15:30Z",
                "journey": "forward",
                "meta": {},
                "operational_status": "great",
                "promised_delivery_date": "2024-12-10T10:15:30Z",
                "remark": "Not Applicable",
                "shipment_id": "17334083479041568015"
            }
        });
        console.log(JSON.stringify(response))
        res.json(response);
    } catch (err) {
        console.error(err);
        console.log(JSON.stringify(err))
        res.status(404).json({ success: false });
    }
});


module.exports = basicRouter;