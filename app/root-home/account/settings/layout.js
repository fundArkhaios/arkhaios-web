import SettingsHeader from "./settingsHeader"

export default function RootLayout ({ children }) {

    return (
        <div className = "grid grid-cols-3 gap-4">
            <SettingsHeader/>
            <div className ="col-span-2">
            {children}
            </div>
            

        </div>
    )

}