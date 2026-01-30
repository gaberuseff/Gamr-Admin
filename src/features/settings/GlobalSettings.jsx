import SettingsForm from "./SettingsForm"

function GlobalSettings() {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">الإعدادات العامة</h1>
            </div>
            <SettingsForm />
        </div>
    )
}

export default GlobalSettings
