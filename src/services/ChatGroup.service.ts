import { getAllChatGroups, getChatGroupById, createChatGroup, updateChatGroupDynamic, deleteChatGroup } from "../models/ChatGroup.modle";
import { ChatGroup } from "../types/interface";

export const getAllChatGroupsService = () => {
  return new Promise((resolve, reject) => {
    getAllChatGroups()
      .then((results: ChatGroup[]) => {
        resolve(results);
      })
      .catch((err: Error) => {
        reject(err);
      });
  });
};

export const getChatGroupByIdService = async (id: number): Promise<ChatGroup[]> => {
  return new Promise((resolve, reject) => {
    getChatGroupById(id)
      .then((results: ChatGroup[]) => {
        resolve(results);
      })
      .catch((err: Error) => {
        reject(err);
      });
  });
};

export const createChatGroupService = async (name: string, avatar: string, creatorid: number, createdat: string, status: number): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const results = await createChatGroup(name, avatar, creatorid, createdat, status);
      resolve({ message: 'Chat group created successfully', data: { name, avatar, creatorid, createdat, status, id: results.data?.[0]?.id } });
    } catch (err) {
      reject(err);
    }
  });
};

export const updateChatGroupService = async (id: number, name: string, avatar: string, status: number): Promise<any> => {
  console.log(`Updating chat group with ID: ${id}, Name: ${name}, Avatar: ${avatar}, Status: ${status}`);
  return new Promise(async (resolve, reject) => {
    try {
      await updateChatGroupDynamic(id, { name, avatar, status });
      resolve({ message: `Chat group updated successfully ${id}`, data: { id, name, avatar, status } });
    } catch (err) {
      reject(err);
    }
  });
};

export const deleteChatGroupService = async (id: number): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      await deleteChatGroup(id);
      resolve({ message: 'Chat group deleted successfully', data: { id } });
    } catch (err) {
      reject(err);
    }
  });
};