import React from 'react';
import {LoginForm} from "@/components/auth/LoginForm.jsx";

const LoginPage = () => (
    <div className="flex flex-1 w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
            <LoginForm />
        </div>
    </div>
);

export default LoginPage;