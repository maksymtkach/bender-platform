import React, { useState } from "react";

const images = [
    {
        src: "/screenshots/features.png",
        caption: "Flexible test creation",
    },
    {
        src: "/screenshots/validation.png",
        caption: "Click 💡 to get an instant AI explanation for any question!",
    },
    {
        src: "/screenshots/duplicates.png",
        caption: "Duplicate questions",
    },
];

export function CarouselWithCaptions() {
    const [current, setCurrent] = useState(0);

    const next = () => setCurrent((c) => (c + 1) % images.length);
    const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length);

    return (
        <div className="relative w-full max-w-2xl mx-auto rounded-xl overflow-hidden shadow-lg bg-gray-900">
            <img
                src={images[current].src}
                alt={`Slide ${current + 1}`}
                className="w-full object-contain max-h-[320px] bg-black"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-gray-100 py-3 px-4 text-center text-base font-medium">
                {images[current].caption}
            </div>
            <button
                className="absolute top-1/2 left-3 -translate-y-1/2 bg-black/40 hover:bg-black/80 rounded-full p-2"
                onClick={prev}
                aria-label="Previous"
            >
                <span className="text-lg">&lt;</span>
            </button>
            <button
                className="absolute top-1/2 right-3 -translate-y-1/2 bg-black/40 hover:bg-black/80 rounded-full p-2"
                onClick={next}
                aria-label="Next"
            >
                <span className="text-lg">&gt;</span>
            </button>
            <div className="absolute bottom-3 right-4 flex gap-1">
                {images.map((_, i) => (
                    <span
                        key={i}
                        className={`inline-block w-2 h-2 rounded-full ${i === current ? "bg-blue-400" : "bg-gray-500/50"}`}
                    />
                ))}
            </div>
        </div>
    );
}
