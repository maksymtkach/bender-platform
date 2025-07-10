export function parseQuestionsFromText(text) {
    const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
    const questions = [];
    let current = null;

    for (const line of lines) {
        if (line.startsWith("?")) {
            if (current) questions.push(current);
            current = {
                question: line.slice(1).trim(),
                options: [],
                correct: [],
            };
        } else if (line.startsWith("/")) {
            const isCorrect = line.endsWith("*");
            const option = isCorrect ? line.slice(1, -1).trim() : line.slice(1).trim();
            current?.options.push(option);
            if (isCorrect) current.correct.push(current.options.length - 1);
        }
    }
    if (current) questions.push(current);
    return questions;
}
