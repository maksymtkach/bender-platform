import React from 'react';
import {LoginForm} from "@/components/auth/LoginForm.jsx";
import {RegisterForm} from "@/components/auth/RegisterForm.jsx";

const RegisterPage = () => (
    <div className="flex flex-1 w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
            <RegisterForm />
        </div>
    </div>
);

export default RegisterPage;