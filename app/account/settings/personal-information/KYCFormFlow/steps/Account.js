import { useKYCFlowContext } from "../KYCFlowContext";
import { useContext } from "react";
import "./../kycFlow.css";
import UserContext from "../../../../../UserContext";
import "../../../../../../output.css";

export default function Account() {
  const { userData, setUserData } = useKYCFlowContext();

  const { user } = useContext(UserContext);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUserData((prevState) => {
      const newData = { ...prevState, [name]: value };
      return newData;
    });
  };

  const fundingSources = [
    { name: "Employment Income", abbreviation: "employment_income" },
    { name: "Investments", abbreviation: "investments" },
    { name: "Inheritance", abbreviation: "inheritance" },
    { name: "Business Income", abbreviation: "business_income"},
    { name: "Savings", abbreviation: "savings"},
    { name: "Family", abbreviation: "family"},
  ];

  return (
    <div className="flex justify-start flex-col space-y-3">
      <div className="flex space-x-4">
        <div className="form-control">
          <label className="label" htmlFor="first_name">
            <span className="label-text">First Name</span>
          </label>
          <input
            type="text"
            name="first_name"
            onChange={handleChange}
            value={userData["first_name"]}
            placeholder={user.firstName}
            className="input input-bordered [&:user-invalid]:input-warning [&:user-valid]:input-success"
            required
            id="first_name"
            title="Your legal first name."
          />
        </div>

        <div className="form-control">
          <label className="label" htmlFor="middleName">
            <span className="label-text">Middle Name</span>
          </label>
          <input
            type="text"
            name="middle_name"
            onChange={handleChange}
            value={userData["middle_name"]}
            placeholder=""
            className="input input-bordered [&:user-invalid]:input-warning [&:user-valid]:input-success"
            id="middleName"
            title="Your legal middle name. If you have one it is required to enter."
          />
        </div>

        <div className="form-control">
          <label className="label" htmlFor="lastName">
            <span className="label-text">Last Name</span>
          </label>
          <input
            type="text"
            name="last_name"
            onChange={handleChange}
            value={userData["last_name"]}
            placeholder={user.lastName}
            className="input input-bordered [&:user-invalid]:input-warning [&:user-valid]:input-success"
            id="lastName"
            title="Your legal last name."
          />
        </div>
      </div>
      <div className="flex space-x-4">
        <div className="form-control">
          <label className="label" htmlFor="dob">
            <span className="label-text">Date of Birth</span>
            <span className="label-text-alt">YYYY-MM-DD</span>
          </label>
          <input
            type="text"
            name="dob"
            id="dob"
            onChange={handleChange}
            value={userData["dob"]}
            className="input input-bordered [&:user-invalid]:input-warning [&:user-valid]:input-success"
            required
            pattern="\d{4}-\d{2}-\d{2}"
            title="Enter your date of birth in YYYY-MM-DD format (e.g., 1998-07-01)"
          />
        </div>

        <div className="form-control">
          <label className="label" htmlFor="usa_ssn">
            <span className="label-text">SSN</span>
            <span className="label-text-alt">123-45-6789</span>
          </label>
          <input
            type="password"
            name="ssn"
            id="usa_ssn"
            onChange={handleChange}
            value={userData["ssn"]}
            className="input input-bordered [&:user-invalid]:input-warning [&:user-valid]:input-success"
            required
            pattern="\d{3}-\d{2}-\d{4}"
            title="Enter your SSN in the format XXX-XX-XXXX (e.g., 666-55-4321)"
          />
        </div>

        <div className="form-control">
          <label className="form-control max-w-md">
            <div className="label">
              <span className="label-text">Funding Source</span>
            </div>
            <select
              name="funding_source"
              onChange={handleChange}
              value={userData["funding_source"] || ""}
              className="select select-bordered"
            >
              <option disabled selected>
                Pick one
              </option>
              {fundingSources.map((sources) => (
                <option key={sources.abbreviation} value={sources.abbreviation}>
                  {sources.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="flex space-x-4">
        <div className="form-control">
          <label className="label" htmlFor="countryOfCitizenship">
            <span className="label-text">Country of Citizenship</span>
          </label>
          <input
            type="text"
            name="country"
            onClick={handleChange}
            id="countryOfCitizenship"
            placeholder="USA"
            className="input input-bordered [&:user-invalid]:input-warning [&:user-valid]:input-success"
            required
            pattern="^[A-Za-zÀ-ÖØ-öø-ÿ\s.'-]+$"
            title="Enter your country of citizenship (e.g., United States)"
            disabled
          />
        </div>

        <div className="form-control">
          <label className="label" htmlFor="country_of_tax_residence">
            <span className="label-text">Country of Tax Residence</span>
          </label>
          <input
            type="text"
            id="country_of_tax_residence"
            placeholder="USA"
            className="input input-bordered [&:user-invalid]:input-warning [&:user-valid]:input-success"
            required
            pattern="^[A-Za-z0-9\s\-\/]+"
            title="We only support USA"
            disabled
          />
        </div>
      </div>
      <p className="text-yellow-50">
        You must be a USA citizen and USA must be your Country of Tax Residence
        to continue.
      </p>
    </div>
  );
}
