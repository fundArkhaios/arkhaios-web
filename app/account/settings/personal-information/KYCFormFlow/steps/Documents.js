import { useState } from "react";
import { useKYCFlowContext } from "../KYCFlowContext";

export default function Documents({setFrontID, setBackID, frontID, backID}) {
  const { userData, setUserData } = useKYCFlowContext();
  const [ img1, setImg1 ] = useState("");
  const [ img2, setImg2 ] = useState("");

  console.log("render");
  console.log(frontID);
  const handleChange = async (e) => {
    const { name, value } = e.target;

    try {

      console.log("loading");
        const loadFile = () => new Promise((resolve, reject) => {
            const reader = new FileReader();
            const file = document.getElementById("id-front").files[0];
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
        });

        console.log("C1")
        const base64 = await loadFile();
        console.log(base64);

        console.log("c2");
        setImg1(base64);
        //setFrontID(base64);

        console.log("ok...");
    } catch(e) {}

    try {
        const loadFile = () => new Promise((resolve, reject) => {
            const reader = new FileReader();
            const file = document.getElementById("id-back").files[0];
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
        });


        const base64 = await loadFile();

        //setBackID(base64);

        setImg2(base64);

    } catch(e) {}
  };

  // A helper function to convert the boolean to a string for the select value
  const getSelectValue = (key) => {
    const value = userData[key];
    return value ? true : false;
  };

  return (
    <div className="flex justify-center w-full flex-col space-y-4">
      <label className="form-control">
        <div className="label">
          <span className="label-text">
            Please upload a front photo of your government ID
          </span>
        </div>
        <input id="id-front" type="file" onChange={handleChange} className="file-input w-full max-w-xs" />
      </label>

      <img id="id-front-img" src={img1}/>

      <label className="form-control">
        <div className="label">
          <span className="label-text">
            Please upload a back photo of your government ID
          </span>
        </div>
        <input id="id-back" type="file" onChange={handleChange} className="file-input w-full max-w-xs" />
      </label>

      <img id="id-back-img" src={img2}/>
    </div>
  );
}