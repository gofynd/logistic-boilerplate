const { confirmationText } = require('./constant');
const { sendWhatsAppMessage } = require('./utils');
// const fdkExtension = require("./fdk");

async function orderPlacedNotificationHandler (event_name, request_body, company_id, application_id) {
    console.log("---------------------------------------------")
    console.log("orderPlacedNotificationHandler")
    console.log(request_body)
    const order = request_body.payload.order
    const order_id = order.order_id
    const product_name = order.shipments[0].bags[0].item.name
  
    // Avoid sending message for anonymous users
    if (order.user.is_anonymous_user) {
        console.log('Anonymous user: no notification sent for order: ', order_id)
        return false
    }
    console.log('Non Anonymous user', order_id)
    const country_phone_code = order.user.meta.country_phone_code
    const mobile = order.user.mobile
    const first_name = order.user.first_name
  
    // const platformClient = await fdkExtension.getPlatformClient(company_id)
    // const resp = await platformClient.application(application_id).configuration.getDomains({
    //     companyId: company_id,
    //     applicationId: application_id,
    // })
    const url = `https://<test>/order-tracking/${order_id}`
    console.log('Non Anonymous user url', url)
  
    const phone_number = country_phone_code + mobile
    console.log('Non Anonymous user phone number', phone_number)
    const text = confirmationText(first_name, product_name, order_id, url)
  
    sendWhatsAppMessage(phone_number, text)
}

async function courierPartnerAsignHandler (event_name, request_body, company_id, application_id) {
    console.log("---------------------------------------------")
    console.log("courierPartnerAsignHandler")
    console.log(JSON.stringify(request_body))
    console.log("----------")
    console.log(event_name)
    console.log("----------")
    console.log(company_id)
    console.log("----------")
    console.log(application_id)
}

async function courierPartnerCancelHandler (event_name, request_body, company_id, application_id) {
    console.log("---------------------------------------------")
    console.log("courierPartnerCancelHandler")
    console.log(JSON.stringify(request_body))
    console.log("----------")
    console.log(event_name)
    console.log("----------")
    console.log(company_id)
    console.log("----------")
    console.log(application_id)
}

module.exports = {
    orderPlacedNotification: orderPlacedNotificationHandler,
    courierPartnerAsign: courierPartnerAsignHandler,
    courierPartnerCancel: courierPartnerCancelHandler
};