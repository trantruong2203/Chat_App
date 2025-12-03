import { getAllPosts, getPostById, createPost, updatePostDynamic, deletePost } from "../models/Post.model";
import { Post } from "../types/interface";

export const getAllPostsService = () => {
  return new Promise((resolve, reject) => {
        getAllPosts()
      .then((results: Post[]) => {
        resolve(results);
      })
      .catch((err: Error) => {
        reject(err);
      });
  });
};

export const getPostByIdService = async (id: number): Promise<Post[]> => {
  return new Promise((resolve, reject) => {
    getPostById(id)
      .then((results: Post[]) => {
        resolve(results);
      })
      .catch((err: Error) => {
        reject(err);
      });
  });
};

export const createPostService = async (userid: number, content: string, createdat: string, status: number): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const results = await createPost(userid, content, createdat, status);
      resolve({ message: 'Post created successfully', data: { userid, content, createdat, status, id: results.data?.[0]?.id } });
    } catch (err) {
      reject(err);
    }
  });
};

export const updatePostService = async (id: number, userid: number, content: string, status: number): Promise<any> => {
  console.log(`Updating post with ID: ${id}, Userid: ${userid}, Content: ${content}, Status: ${status}`);
  return new Promise(async (resolve, reject) => {
    try {
      await updatePostDynamic(id, { userid, content, status });
      resolve({ message: `Post updated successfully ${id}`, data: { id, userid, content, status } });
    } catch (err) {
      reject(err);
    }
  });
};

export const deletePostService = async (id: number): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      await deletePost(id);
      resolve({ message: 'Post deleted successfully', data: { id } });
    } catch (err) {
      reject(err);
    }
  });
};