async function courierPartnerAsignHandler (event_name, request_body, company_id, application_id) {
    console.log(JSON.stringify(request_body))
    console.log(event_name)
    console.log(company_id)
    console.log(application_id)
}

async function courierPartnerCancelHandler (event_name, request_body, company_id, application_id) {
    console.log(JSON.stringify(request_body))
    console.log(event_name)
    console.log(company_id)
    console.log(application_id)
}

module.exports = {
    courierPartnerAsign: courierPartnerAsignHandler,
    courierPartnerCancel: courierPartnerCancelHandler
};