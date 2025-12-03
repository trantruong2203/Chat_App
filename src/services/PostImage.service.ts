import { getPostImages, createPostImage, deletePostImage, updatePostImage, deletePostImageByPostId } from "../models/PostImage.model";
import { PostImage } from "../types/interface";

export const getPostImagesService = (postid: number) => {
  return new Promise((resolve, reject) => {
    getPostImages(postid)
      .then((results: PostImage[]) => {
        resolve(results);
      })
      .catch((err: Error) => {
        reject(err);
      });
  });
};

export const getPostImageByIdService = async (id: number): Promise<PostImage[]> => {
  return new Promise((resolve, reject) => {
    getPostImages(id)
      .then((results: PostImage[]) => {
        resolve(results);
      })
      .catch((err: Error) => {
        reject(err);
      });
  });
};

export const createPostImageService = async (postid: number, imgurl: string): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const results = await createPostImage(postid, imgurl);
      resolve({ message: 'Post image created successfully', data: { postid, imgurl, id: results[0].id } });
    } catch (err) {
      reject(err);
    }
  });
};

export const updatePostImageService = async (id: number, postid: number, imgurl: string): Promise<any> => {
  console.log(`Updating post image with ID: ${id}, Post ID: ${postid}, Image: ${imgurl}`);
  return new Promise(async (resolve, reject) => {
    try {
      await updatePostImage(id, { postid, imgurl });
      resolve({ message: `Post image updated successfully ${id}`, data: { id, postid, imgurl } });
    } catch (err) {
      reject(err);
    }
  });
};

export const deletePostImageService = async (id: number): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      await deletePostImage(id);
      resolve({ message: 'Post image deleted successfully', data: { id } });
    } catch (err) {
      reject(err);
    }
  });
};