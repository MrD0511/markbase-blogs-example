import axios from "axios";

const backendUrl = process.env.BACKEND_URL || "http://localhost:8000";

const api = axios.create({
    baseURL: backendUrl,
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.NEXT_PUBLIC_MARKBASE_API_KEY}`,
    },
});

export default api;