import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000",
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.NEXT_PUBLIC_MARKBASE_API_KEY}`,
    },
});



const getAllBlogs = async () => {
    try {
        const response = await api.get("/api/blogs");
        return response.data.data.blogs;
    } catch (error) {
        return { error: "Failed to fetch blogs" };
    }
};

const getBlogBySlug = async (slug: string) => {
    try {
        const response = await api.get(`/api/blogs/${slug}`);
        return response.data.data.blog;
    } catch (error) {
        return { error: "Failed to fetch blog" };
    }
};

export { getAllBlogs, getBlogBySlug };
