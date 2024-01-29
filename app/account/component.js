'use client';

import {useState} from 'react';
import Settings from './settings';

export default function Account() {
    const options = ["Investing", "Transfers", "Reports & Statements", "Settings", "Help"];
    const [selected, setSelected] = useState("Investing");

    let optionSelection = (<>
        { options.map((option) =>
        <p onClick={() => setSelected(option)}
        className = {selected == option ? "text-white cursor-pointer" : "cursor-pointer"}>{option}</p>) }
        </>);

    const components = {
        "Investing": () => <></>,
        "Transfers": () => <></>,
        "Reports & Statements": () => <></>,
        "Settings": () => <Settings/>,
        "Help": () => <></>,
    };
    
    return (<>
        <div className = "flex col-1 px-10 pt-5 justify-center space-x-16 text-xl">
            {optionSelection}
        </div>

        <div className = "mt-5">
            {components[selected]()}
        </div>
    </>);
}