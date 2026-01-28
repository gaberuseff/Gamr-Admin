import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSettings as updateSettingsApi } from "../../services/apiSettings";
import toast from "react-hot-toast";

function useUpdateSettings() {
    const queryClient = useQueryClient();

    const { mutate: updateSettings, isPending: isUpdatingSettings } = useMutation({
        mutationFn: (data) => updateSettingsApi(data),

        onSuccess: () => {
            toast.success("تم تحديث الإعدادات بنجاح");
            queryClient.invalidateQueries({ queryKey: ['settings'] });
        },
        onError: (err) => {
            console.error('Error updating settings:', err);
            toast.error(err.message || 'حدث خطأ أثناء تحديث الإعدادات');
        },
    })

    return { updateSettings, isUpdatingSettings }
}

export default useUpdateSettings