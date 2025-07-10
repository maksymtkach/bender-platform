import React from 'react';
import {CarouselPlugin} from "@/components/CarouselPlugin.jsx";
import TestBuilder from "@/components/test-builder/TestBuilder.jsx";

function CreateTestPage() {
    return (
        <div className="flex flex-1 w-full justify-center p-6 md:p-10">
            <div className="w-full">
                <TestBuilder />
            </div>
        </div>
    );
}

export default CreateTestPage;