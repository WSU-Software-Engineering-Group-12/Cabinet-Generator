import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api"; // Django Backend URL

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// ***** All API methods go below here ***** \\

// API function for generating cabinet layout
export const generateWall = async (width, generation) => {
    try {
        const response = await api.post("/generate_wall/", {
            width,
            generation
        });
        return response.data;
    } catch (error) {
        console.error("API error (generateWall):", error);
        throw error;
    }
}