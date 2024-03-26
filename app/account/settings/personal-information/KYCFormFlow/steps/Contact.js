import { useKYCFlowContext } from "../KYCFlowContext";
import { useContext } from "react";
import UserContext from "../../../../../UserContext";

export default function Contact() {
  const { userData, setUserData } = useKYCFlowContext();

  const { user } = useContext(UserContext);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUserData(prevState => {
        const newData = { ...prevState, [name]: value};
        console.log(newData);
        return newData;
    })
  };

  const states = [
    { name: "Alabama", abbreviation: "AL" },
    { name: "Alaska", abbreviation: "AK" },
    { name: "Arizona", abbreviation: "AZ" },
    { name: "Arkansas", abbreviation: "AR" },
    { name: "California", abbreviation: "CA" },
    { name: "Colorado", abbreviation: "CO" },
    { name: "Connecticut", abbreviation: "CT" },
    { name: "Delaware", abbreviation: "DE" },
    { name: "Florida", abbreviation: "FL" },
    { name: "Georgia", abbreviation: "GA" },
    { name: "Hawaii", abbreviation: "HI" },
    { name: "Idaho", abbreviation: "ID" },
    { name: "Illinois", abbreviation: "IL" },
    { name: "Indiana", abbreviation: "IN" },
    { name: "Iowa", abbreviation: "IA" },
    { name: "Kansas", abbreviation: "KS" },
    { name: "Kentucky", abbreviation: "KY" },
    { name: "Louisiana", abbreviation: "LA" },
    { name: "Maine", abbreviation: "ME" },
    { name: "Maryland", abbreviation: "MD" },
    { name: "Massachusetts", abbreviation: "MA" },
    { name: "Michigan", abbreviation: "MI" },
    { name: "Minnesota", abbreviation: "MN" },
    { name: "Mississippi", abbreviation: "MS" },
    { name: "Missouri", abbreviation: "MO" },
    { name: "Montana", abbreviation: "MT" },
    { name: "Nebraska", abbreviation: "NE" },
    { name: "Nevada", abbreviation: "NV" },
    { name: "New Hampshire", abbreviation: "NH" },
    { name: "New Jersey", abbreviation: "NJ" },
    { name: "New Mexico", abbreviation: "NM" },
    { name: "New York", abbreviation: "NY" },
    { name: "North Carolina", abbreviation: "NC" },
    { name: "North Dakota", abbreviation: "ND" },
    { name: "Ohio", abbreviation: "OH" },
    { name: "Oklahoma", abbreviation: "OK" },
    { name: "Oregon", abbreviation: "OR" },
    { name: "Pennsylvania", abbreviation: "PA" },
    { name: "Rhode Island", abbreviation: "RI" },
    { name: "South Carolina", abbreviation: "SC" },
    { name: "South Dakota", abbreviation: "SD" },
    { name: "Tennessee", abbreviation: "TN" },
    { name: "Texas", abbreviation: "TX" },
    { name: "Utah", abbreviation: "UT" },
    { name: "Vermont", abbreviation: "VT" },
    { name: "Virginia", abbreviation: "VA" },
    { name: "Washington", abbreviation: "WA" },
    { name: "West Virginia", abbreviation: "WV" },
    { name: "Wisconsin", abbreviation: "WI" },
    { name: "Wyoming", abbreviation: "WY" },
  ];

  return (
    <div className="flex justify-start flex-col space-y-3">
      <div className="form-control max-w-sm">
        <label className="label" htmlFor="phoneNumber">
          <span className="label-text">Phone Number</span>
        </label>
        <input
          type="text"
          name="phone"
          onChange={handleChange}
          value={userData["phone"] || ""}
          id="phoneNumber"
          placeholder="3051234567"
          className="input input-bordered [&:user-invalid]:input-warning [&:user-valid]:input-success"
          pattern="\d{10}"
          title="Phone number must be 10 digits"
          required
        />
      </div>
      <div className="flex space-x-4">
        <div className="form-control">
          <label className="label" htmlFor="streetAddress">
            <span className="label-text">Street Address</span>
          </label>
          <input
            type="text"
            name="address"
            onChange={handleChange}
            value={userData["address"] || ""}
            id="streetAddress"
            placeholder="42 Wallaby Way"
            className="input input-bordered [&:user-invalid]:input-warning [&:user-valid]:input-success"
            required
            pattern="^[0-9]+\s[A-Za-z0-9\s]+"
            title="Enter a street number followed by the street name (e.g., 42 Wallaby Way)"
          />
        </div>

        <div className="form-control">
          <label className="label" htmlFor="unitAddress">
            <span className="label-text">Unit Address</span>
          </label>
          <input
            type="text"
            name="address_unit"
            onChange={handleChange}
            value={userData["address_unit"]}
            id="unitAddress"
            placeholder="APT 413"
            className="input input-bordered [&:user-invalid]:input-warning [&:user-valid]:input-success"
            pattern="^[A-Za-z0-9\s\-\/]+"
            title="Enter the unit number (e.g., Apt 413 or Suite B)"
          />
        </div>

        <div className="form-control">
          <label className="label" htmlFor="postalCode">
            <span className="label-text">Postal Code</span>
          </label>
          <input
            type="text"
            name="postal_code"
            onChange={handleChange}
            value={userData["postal_code"] || ""}
            id="postalCode"
            placeholder="33193"
            className="input input-bordered [&:user-invalid]:input-warning [&:user-valid]:input-success"
            required
            pattern="^[A-Za-z0-9\s\-\/]+"
            title="Enter your Postal Code"
          />
        </div>
      </div>

      <div className="flex space-x-4">
        <label className="form-control max-w-md">
          <div className="label">
            <span className="label-text">Select your State</span>
          </div>
          <select name="state" onChange={handleChange} value={userData["state"] || ""} className="select select-bordered">
            <option disabled selected>
              Pick one
            </option>
            {states.map((state) => (
              <option key={state.abbreviation} value={state.abbreviation}>
                {state.name}
              </option>
            ))}
          </select>
        </label>

        <div className="form-control">
          <label className="label" htmlFor="city">
            <span className="label-text">City</span>
          </label>
          <input
            type="text"
            name="city"
            onChange={handleChange}
            value={userData["city"]}
            id="city"
            placeholder="San Mateo"
            className="input input-bordered [&:user-invalid]:input-warning [&:user-valid]:input-success"
            required
            pattern="^[A-Za-z]{2}|[A-Za-z]+(?: [A-Za-z]+)?$"
            title="A city in your state."
          />
        </div>
      </div>
    </div>
  );
}
