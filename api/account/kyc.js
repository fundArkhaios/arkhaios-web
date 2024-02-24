const alpaca = require('../external/alpaca/api');
const db = require('../../util/db');
const authenticate = require('../../util/authenticate');
const cookieParser = require('cookie-parser');


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
        [data.dob_year, "Date of birth year"],
        [data.dob_month, "Date of birth month"],
        [data.dob_day, "Date of birth day"],
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
                       data.is_pep, data.family_exposed];

    for(const i in booleans) {
        if(booleans[i] === undefined) {
            return "Disclosures must be selected.";
        }
    }
}

module.exports = {
    route: "/api/kyc",
    authenticate: true,
    post: async function(req, res, user) {

        // const cookies = cookieParser();

        const error = verifyFields(req.body, user.email);
        if(error) {
            res.status(422).json({error: error});
        } else {
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
                    "date_of_birth": `${req.body.dob_year}-${req.body.dob_month}-${req.body.dob_day}`,
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
                    "immediate_family_exposed": req.body.family_exposed,
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

            // TODO: need to check for Alpaca 200 responses and respond accordingly
            const response = await alpaca.create_account(payload);
            if(response.id) {
                db.updateUser(user, {
                    brokerageID: response.id
                });
            
                res.status(200).json({ status: "kyc submitted successfully" });
            } else {
                res.status(502).json({ error: "server error" });
            }
        }
    }
}