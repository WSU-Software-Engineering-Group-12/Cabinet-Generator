import axios from "axios";

// Define the base URL for the API. This is the URL for the Django backend.
const API_BASE_URL = "http://127.0.0.1:8000/api"; // Django Backend URL

// Create an axios instance with the base URL and default headers.
const api = axios.create({
    baseURL: API_BASE_URL, // Set the base URL for the API
    headers: {
        "Content-Type": "application/json", // Set the content type to JSON for all requests
    },
});

// ***** All API methods go below here ***** \\

// API function for generating a wall layout based on width and orientation
/**
 * Generates a wall layout with the specified width and orientation.
 *
 * @param {number} width - The width of the wall.
 * @param {string} orientation - The orientation of the wall (e.g., "left", "right", etc.).
 * @returns {Promise<Object>} - The response data from the API containing the generated wall layout.
 */
export const generateWall = async (width, orientation) => {
    try {
        // Send a POST request to the "/generate_wall/" endpoint with width and orientation
        const response = await api.post("/generate_wall/", {
            width,
            orientation
        });
        return response.data; // Return the data from the API response
    } catch (error) {
        // Log any errors that occur during the API request
        console.error("API error (generateWall):", error);
        throw error; // Rethrow the error to be handled by the caller
    }
}

// API function for placing a cabinet at a specified location
/**
 * Places a cabinet at a specific (x, y) coordinate on the wall.
 *
 * @param {string} name - The name of the cabinet.
 * @param {number} width - The width of the cabinet.
 * @param {number} height - The height of the cabinet.
 * @param {number} depth - The depth of the cabinet.
 * @param {number} x - The x-coordinate where the cabinet should be placed.
 * @param {number} y - The y-coordinate where the cabinet should be placed.
 * @returns {Promise<Object>} - The response data from the API containing the status of the placement.
 */
export const placeCabinet = async (name, width, height, depth, x, y) => {
    try {
        // Send a POST request to the "/place_cabinet/" endpoint with cabinet details and placement coordinates
        const response = await api.post("/place_cabinet/", {
            cabinet: {
                name,
                width,
                height,
                depth
            },
            x,
            y
        });

        return response.data; // Return the data from the API response
    } catch (error) {
        // Log any errors that occur during the API request
        console.error("API error (placeCabinet):", error);
        throw error; // Rethrow the error to be handled by the caller
    }
}
