import { useKYCFlowContext } from "../KYCFlowContext";

export default function Funding() {
  const { userData, setUserData } = useKYCFlowContext();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUserData((prevState) => {
      const newData = { ...prevState, [name]: value };
      console.log(newData);
      return newData;
    });
  };

  // A helper function to convert the boolean to a string for the select value
  const getSelectValue = (key) => {
    const value = userData[key];
    return value ? "true" : "false";
  };

  return (
    <div className="flex justify-center w-full flex-col space-y-4">
      <label className="form-control">
        <div className="label">
          <span className="label-text">
            Do you own a controlling position in a publicly traded company?
          </span>
        </div>
        <select
          name="is_control_person"
          onChange={handleChange}
          className="select select-bordered"
        >
          <option disabled selected>
            Pick one
          </option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </label>

      <label className="form-control">
        <div className="label">
          <span className="label-text">
            Are you affiliated with FINRA or a market exchange?
          </span>
        </div>
        <select
          name="is_affiliated"
          onChange={handleChange}
          className="select select-bordered"
        >
          <option disabled selected>
            Pick one
          </option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </label>

      <label className="form-control">
        <div className="label">
          <span className="label-text">
            Are you politically exposed in any way?
          </span>
        </div>
        <select
          name="is_pep"
          onChange={handleChange}
          className="select select-bordered"
        >
          <option disabled selected>
            Pick one
          </option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </label>

      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">
            Is anyone from your immediate family exposed politically or holds a
            controlling position in a publicly traded company?
          </span>
        </div>
        <select
          name="is_family_exposed"
          onChange={handleChange}
          className="select select-bordered"
        >
          <option disabled selected>
            Pick one
          </option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </label>
    </div>
  );
}
