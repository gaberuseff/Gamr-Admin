import { Form, Input, Button, Checkbox, Spinner } from "@heroui/react";
import { useState } from "react";
import useSettings from "./useSettings";
import Center from "../../ui/Center";
import useUpdateSettings from "./useUpdateSettings";

function SettingsForm() {
    const [action, setAction] = useState(null);
    const [isWorking, setIsWorking] = useState(false);
    const { settings, isSettingsLoading } = useSettings();
    const { updateSettings, isUpdatingSettings } = useUpdateSettings();

    function handleSubmit(e) {
        e.preventDefault();
        let data = Object.fromEntries(new FormData(e.currentTarget));

        data.shipping_price = Number(data.shipping_price);
        data.free_shipping = Number(data.free_shipping);
        data.is_working = isWorking;

        updateSettings(data);
    }

    if (isSettingsLoading) return <Center><Spinner /></Center>

    const { shipping_price, free_shipping, is_working } = settings;

    return (
        <div className="p-4">
            <Form
                className="w-full max-w-md flex flex-col gap-4 "
                onReset={() => setAction("reset")}
                onSubmit={handleSubmit}
            >
                <Input
                    isRequired
                    errorMessage="سعر الشحن"
                    label="سعر الشحن"
                    labelPlacement="outside"
                    name="shipping_price"
                    placeholder="أدخل سعر الشحن"
                    type="number"
                    defaultValue={shipping_price}
                />
                <Input
                    isRequired
                    errorMessage="شحن مجانى"
                    label="شحن مجانى"
                    labelPlacement="outside"
                    name="free_shipping"
                    placeholder="مبلغ الشحن المجانى"
                    type="number"
                    defaultValue={free_shipping}
                />

                <Checkbox
                    onValueChange={setIsWorking}
                    name="is_working"
                    defaultSelected={is_working}
                >
                    هل يعمل؟
                </Checkbox>
                <div className="flex gap-2">
                    <Button color="primary" type="submit" isLoading={isUpdatingSettings}>
                        حفظ
                    </Button>
                    <Button type="reset" variant="flat">
                        تراجع
                    </Button>
                </div>
            </Form>
        </div>
    )
}

export default SettingsForm
