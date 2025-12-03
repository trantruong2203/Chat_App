import { getAllFavoritePosts, getFavoritePostById, createFavoritePost, updateFavoritePostDynamic, deleteFavoritePost, countFavoritePost } from "../models/FavoritePost.model";
import { FavoritePost } from "../types/interface";

export const getAllFavoritePostsService = () => {
  return new Promise((resolve, reject) => {
    getAllFavoritePosts()
      .then((results: FavoritePost[]) => {
        resolve(results);
      })
      .catch((err: Error) => {
        reject(err);
      });
  });
};

export const getFavoritePostByIdService = async (id: number): Promise<FavoritePost[]> => {
  return new Promise((resolve, reject) => {
    getFavoritePostById(id)
      .then((results: FavoritePost[]) => {
        resolve(results);
      })
      .catch((err: Error) => {
        reject(err);
      });
  });
};

export const createFavoritePostService = async (userid: number, postid: number, createdat: string, iconid: number): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const results = await createFavoritePost(userid, postid, createdat, iconid);
      resolve({ message: 'Favorite post created successfully', data: { userid, postid, createdat, iconid, id: results.data?.[0]?.id } });
    } catch (err) {
      reject(err);
    }
  });
};

export const updateFavoritePostService = async (id: number, userid: number, postid: number, createdat: string, iconid: number): Promise<any> => {
  console.log(`Updating favorite post with ID: ${id}, UserID: ${userid}, PostID: ${postid}, CreatedAt: ${createdat}, IconID: ${iconid}`);
  return new Promise(async (resolve, reject) => {
    try {
      await updateFavoritePostDynamic(id, { userid, postid, createdat, iconid });
      resolve({ message: `Favorite post updated successfully ${id}`, data: { id, userid, postid, createdat, iconid } });
    } catch (err) {
      reject(err);
    }
  });
};

export const deleteFavoritePostService = async (postid: number, userid: number): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await deleteFavoritePost(postid, userid);
      resolve({ 
        message: 'Favorite post deleted successfully', 
        data: { postid, userid, deletedRows: result.data.deletedRows } 
      });
    } catch (err) {
      reject(err);
    }
  });
};

export const countFavoritePostService = async (postid: number): Promise<number> => {
  return new Promise(async (resolve, reject) => {
    try {
      const results = await countFavoritePost(postid);
      resolve(results);
    } catch (err) {
      reject(err);
    }
  });
};