import { useQuery } from "@tanstack/react-query";
import { getSettings } from "../../services/apiSettings";

function useSettings() {
    const { data: settings, isPending: isSettingsLoading } = useQuery({
        queryKey: ["settings"],
        queryFn: getSettings,
    })

    return { settings, isSettingsLoading }
}

export default useSettings