import React from 'react';
import {AccordionDemo} from "@/components/AccordionDemo.jsx";
import {CarouselPlugin} from "@/components/CarouselPlugin.jsx";

function HomePage() {
    return (
        <div className="flex flex-1 w-full justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <CarouselPlugin />
            </div>
        </div>
    );
}

export default HomePage;