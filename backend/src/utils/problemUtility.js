const axios = require("axios");

// Judge0 Language ID Mapping
// Judge0 CE Language IDs:
// C++ (GCC 9.2.0): 54
// Java (OpenJDK 13.0.1): 62
// JavaScript (Node.js 12.14.0): 63
// Python (3.8.1): 71
// C (GCC 9.2.0): 50
const getLanguageById = (lang) => {
    const language = {
        "c++": 54,
        "cpp": 54,
        "java": 62,
        "javascript": 63,
        "js": 63,
        "python": 71,
        "py": 71,
        "c": 50
    };

    return language[lang.toLowerCase()] || 63;
};

// Base URL: Defaults to public open demo API (https://ce.judge0.com)
// If running self-hosted via Docker, set JUDGE0_URL=http://localhost:2358 in .env
const getJudge0BaseUrl = () => {
    return process.env.JUDGE0_URL || "https://ce.judge0.com";
};

// Single Code Execution via Judge0 Open Public API (Synchronous with ?wait=true)
// Directly tested via Postman and verified with ce.judge0.com
async function executeCode(sourceCode, languageId = 71, stdin = "") {
    const url = `${getJudge0BaseUrl()}/submissions?wait=true`;
    
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json" 
            },
            body: JSON.stringify({
                language_id: languageId,
                source_code: sourceCode,
                stdin: stdin || ""
            })
        });

        const data = await response.json();
        
        if (data.status?.id === 3) {
            console.log("Judge0 Success Output:\n", data.stdout);
            return data;
        } else {
            console.error("Judge0 Execution Failed:", data.stderr || data.compile_output);
            return data;
        }
    } catch (error) {
        console.error("Judge0 API Error:", error);
        throw error;
    }
}

// Batch Submission (Used for running multiple test cases simultaneously)
const submitBatch = async (submissions) => {
    try {
        const response = await axios.post(
            `${getJudge0BaseUrl()}/submissions/batch`,
            {
                submissions,
            },
            {
                params: {
                    base64_encoded: false,
                },
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error("Error while submitting batch:", error.message);
        throw error;
    }
};

// Batch Result Query via Tokens
const submitToken = async (resultToken) => {
    try {
        const response = await axios.get(
            `${getJudge0BaseUrl()}/submissions/batch`,
            {
                params: {
                    tokens: resultToken.join(","),
                    base64_encoded: false,
                    fields: "*",
                },
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error("Error while fetching result:", error.message);
        throw error;
    }
};

module.exports = {
    getLanguageById,
    executeCode,
    submitBatch,
    submitToken
};