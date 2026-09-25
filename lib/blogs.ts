import api from "./axios";



const getAllBlogs = async () => {
  try {
    const response = await api.get("/api/contents");
    return response.data.data.contents;
  } catch (error) {
    console.error("getAllBlogs failed:", error);
    throw error;
  }
};

const getBlogBySlug = async (slug: string) => {
    try {
        const response = await api.get(`/api/contents/${slug}`);
        return response.data.data.content;
    } catch (error) {
        console.error(`getBlogBySlug failed for slug "${slug}":`, error);
        throw error;
    }
};

export { getAllBlogs, getBlogBySlug };
