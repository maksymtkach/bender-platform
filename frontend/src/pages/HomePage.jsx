import React from 'react';
import { CarouselWithCaptions } from "@/components/CarouselWithCaptions";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

function HomePage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-10">
            <div className="max-w-2xl text-center space-y-6 mb-10">
                <h1 className="text-4xl font-bold">Bender — Modern AI Test Platform</h1>
                <p className="text-lg text-gray-300">
                    Create, import, pass and analyze tests.<br />
                    <span className="text-blue-400 font-medium">Get instant AI explanations for any question!</span>
                </p>
                <div className="flex justify-center gap-4">
                    <Link to="/create-test">
                        <Button variant="outline" className="text-lg px-6 py-3 border-blue-600 text-blue-400">Create Test</Button>
                    </Link>
                </div>
            </div>

            <div className="w-full max-w-3xl mb-8">
                <CarouselWithCaptions />
            </div>

            <div className="max-w-2xl bg-gray-800/70 rounded-xl p-6 text-left shadow-xl">
                <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                    <span role="img" aria-label="AI">💡</span>
                    What makes Bender unique?
                </h2>
                <ul className="list-disc pl-6 space-y-1 text-base text-gray-300">
                    <li>🔍 Import tests instantly from text or file</li>
                    <li>✨ Get step-by-step AI explanations for every question</li>
                    <li>📝 See detailed results: score, mistakes, tips</li>
                    <li>🖤 Designed for modern productivity & focus</li>
                </ul>
            </div>
        </div>
    );
}

export default HomePage;
