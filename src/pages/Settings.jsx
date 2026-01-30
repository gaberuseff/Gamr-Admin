import DiscountCodes from "../features/settings/DiscountCodes"
import GlobalSettings from "../features/settings/GlobalSettings"

function Settings() {
    return <div className="flex flex-col gap-4">
        <GlobalSettings />
        <DiscountCodes />
    </div>
}

export default Settings
