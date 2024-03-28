const alpaca = require('../external/alpaca/api');
const db = require('../../util/db');
const { RESPONSE_TYPE, SERVER_ERROR } = require('../response_type.js')

function verifyFields(data, email) {
    if(data.country !== "USA") {
        return "Only USA citizens are currently supported.";
    }

    requiredFields = [
        [email, "Email"],
        [data.phone, "Phone number"],
        [data.address, "Street address"],
        [data.city, "City"],
        [data.state, "State"],
        [data.postal_code, "Postal code"],
        [data.country, "Country"],
        [data.first_name, "First name"],
        [data.last_name, "Last name"],
        [data.dob, "Date of birth"],
        [data.ssn, "SSN"],
    ];

    for(let i = 0; i < requiredFields.length; ++i) {
        if(!requiredFields[i][0]) {
            return requiredFields[i][1] + " is required.";
        }
    }

    const funding = ["employment_income", "investments", "inheritance", 
                    "business_income", "savings", "family"];

    if(!funding.includes(data.funding_source)) {
        return "Invalid funding source.";
    }

    const booleans = [ data.is_affiliated, data.is_control_person,
                       data.is_pep, data.is_family_exposed];

    for(const i in booleans) {
        if(booleans[i] === undefined) {
            return "Disclosures must be selected.";
        }
    }
}

module.exports = {
    route: "/api/account/kyc",
    authenticate: true,
    post: async function(req, res, user) {
        const error = verifyFields(req.body, user.email);
        if(error) {
            return res.status(422).json({status: RESPONSE_TYPE.FAILED, message: error});
        } else {
            if(req.body.account_agreement != "on") {
                return res.status(422).json({status: RESPONSE_TYPE.FAILED, message: "account agreement not accepted"});
            }

            payload = {
                enabled_assets: ["us_equity"],
                "contact": {
                    "email_address": user.email,
                    "phone_number": req.body.phone,
                    "street_address": [req.body.address],
                    "unit": req.body.address_unit,
                    "city": req.body.city,
                    "state": req.body.state,
                    "postal_code": req.body.postal_code,
                    "country": req.body.country
                },
                "identity": {
                    "given_name": req.body.first_name,
                    "middle_name": req.body.middle_name ,
                    "family_name": req.body.last_name,
                    "date_of_birth": req.body.dob,
                    "tax_id": req.body.ssn,
                    "tax_id_type": "USA_SSN",
                    "country_of_citizenship": "USA",
                    "country_of_birth": "USA",
                    "country_of_tax_residence": "USA",
                    "funding_source": [req.body.funding_source]
                },
                "disclosures": {
                    "is_control_person": req.body.is_control_person,
                    "is_affiliated_exchange_or_finra": req.body.is_affiliated,
                    "is_politically_exposed": req.body.is_pep,
                    "immediate_family_exposed": req.body.is_family_exposed,
                },
                "agreements": [
                    {
                    "agreement": "customer_agreement",
                    "signed_at": (new Date()).toISOString(),
                    "ip_address": req.ip,
                    "revision": "21.2023.06"
                    }
                ]
            };

            const { response, status } = await alpaca.create_account(payload);
            if(status == 200 && response.id) {
                await db.updateUser(user, {
                    brokerageID: response.id,
                    kycVerified: true
                });

                res.status(200).json({ status: RESPONSE_TYPE.SUCCESS, message: "kyc submitted successfully" });
            } else {
                SERVER_ERROR(res)
            }
        }
    }
}