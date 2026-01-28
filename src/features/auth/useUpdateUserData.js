import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserData as updateUserDataApi, uploadAvatar } from "../../services/apiAuth";
import toast from "react-hot-toast";

function useUpdateUserData() {
    const queryClient = useQueryClient();

    const { mutateAsync: updateUser, isPending: isUpdating } = useMutation({
        mutationFn: async ({ name, avatarFile }) => {
            let avatarUrl = null;

            // Upload avatar if provided
            if (avatarFile && avatarFile.size > 0) {
                avatarUrl = await uploadAvatar(avatarFile);
            }

            // Prepare user data
            const userData = {
                name,
                ...(avatarUrl && { avatar_url: avatarUrl })
            };

            return await updateUserDataApi(userData);
        },

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user"] });
            toast.success("تم تحديث بيانات المستخدم بنجاح");
        },
        onError: (error) => {
            console.error(error);
            toast.error(error.message || "حدث خطأ أثناء التحديث");
        },
    });

    return { updateUser, isUpdating };
}

export default useUpdateUserData;