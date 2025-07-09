import React, {useContext} from 'react';
import {AccordionDemo} from "@/components/AccordionDemo.jsx";
import {UserContext} from "@/contexts/UserContext.js";

function InfoPage() {
    const { user } = useContext(UserContext);

    return (
        <div className="flex flex-col flex-1 w-full items-center justify-center p-6 md:p-10">
            <h1>Hello, {user.name} ({user.age})</h1>
            <div className="w-full max-w-sm">
                <AccordionDemo />
            </div>
        </div>
    );
}

export default InfoPage;