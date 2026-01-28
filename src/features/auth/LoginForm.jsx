import { Button, Form, Input } from "@heroui/react";
import { useState } from "react";
import useLogin from "./useLogin";

function LoginForm() {
    const [action, setAction] = useState(null);
    const { login, isLoginPending } = useLogin();

    function handleLogin(e) {
        e.preventDefault();
        let data = Object.fromEntries(new FormData(e.currentTarget));

        login(data);
    }

    return (
        <div className="flex flex-col justify-center items-center h-screen">
            <h1 className="text-2xl font-bold mb-6">تسجيل الدخول إلى جمر</h1>

            <Form
                className="w-full max-w-md flex flex-col gap-4 bg-white p-4 rounded-lg py-12 px-6"
                onReset={() => setAction("reset")}
                onSubmit={handleLogin}
            >
                <Input
                    isRequired
                    errorMessage="ادخل الايميل الخاص بك"
                    label="الايميل"
                    labelPlacement="outside"
                    name="email"
                    placeholder="ادخل الايميل الخاص بك"
                    type="email"
                    disabled={isLoginPending}
                    defaultValue="test@example.com"
                />

                <Input
                    isRequired
                    errorMessage="ادخل كلمة المرور الخاصة بك"
                    label="كلمة المرور"
                    labelPlacement="outside"
                    name="password"
                    placeholder="ادخل كلمة المرور الخاصة بك"
                    type="password"
                    disabled={isLoginPending}
                    defaultValue="123456"
                />
                <div className="flex gap-2 mt-6 w-full">
                    <Button color="primary" type="submit" className="w-full" isLoading={isLoginPending}>
                        تسجيل الدخول
                    </Button>
                </div>
            </Form>
        </div>
    )
}

export default LoginForm
