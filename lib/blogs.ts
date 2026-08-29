import api from "./axios";



const getAllBlogs = async () => {
  try {
    const response = await api.get("/api/blogs");
    return response.data.data.blogs;
  } catch (error) {
    console.error("getAllBlogs failed:", error);
    throw error;
  }
};

const getBlogBySlug = async (slug: string) => {
    try {
        const response = await api.get(`/api/blogs/${slug}`);
        return response.data.data.blog;
    } catch (error) {
        console.error(`getBlogBySlug failed for slug "${slug}":`, error);
        throw error;
    }
};

export { getAllBlogs, getBlogBySlug };
