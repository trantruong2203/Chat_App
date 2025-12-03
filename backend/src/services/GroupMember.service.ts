import { getAllGroupMembers, getGroupMemberById, createGroupMember, updateGroupMemberDynamic, deleteGroupMember } from "../models/GroupMember.model";
import { GroupMember } from "../types/interface";

export const getAllGroupMembersService = () => {
    return new Promise((resolve, reject) => {
      getAllGroupMembers()
        .then((results: GroupMember[]) => {
          resolve(results);
        })
        .catch((err: Error) => {
          reject(err);
        });
    });
  };

export const getGroupMemberByIdService = async (id: number): Promise<GroupMember[]> => {
    return new Promise((resolve, reject) => {
        getGroupMemberById(id)
          .then((results: GroupMember[]) => {
            resolve(results);
          })
          .catch((err: Error) => {
            reject(err);
          });
      });
};

export const createGroupMemberService = async (groupid: number, userid: number, joinedat: Date, roleid: number): Promise<any> => {
    return new Promise(async (resolve, reject) => {
       try {
        const results = await createGroupMember(groupid, userid, joinedat, roleid);
        resolve({message: 'Group member created successfully', data: {groupid, userid, joinedat, roleid, id: results.data?.[0]?.id}});
       } catch (err) {
        reject(err);
       }
      });
};

export const updateGroupMemberService = async (id: number, groupid: number, userid: number, joinedat: Date, roleid: number): Promise<any> => {
  console.log(`Updating group member with ID: ${id}, Group ID: ${groupid}, User ID: ${userid}, Joined At: ${joinedat}, Role ID: ${roleid}`);
    return new Promise(async (resolve, reject) => {
       try {
          await updateGroupMemberDynamic(id, {groupid, userid, joinedat, roleid});
        resolve({message: `Group member updated successfully ${id}`, data : {id, groupid, userid, joinedat, roleid }});
       } catch (err) {
        reject(err);
       }
      });
};

export const deleteGroupMemberService = async (id: number): Promise<any> => {
    return new Promise(async (resolve, reject) => {
       try {
        await deleteGroupMember(id);
        resolve({message: 'Group member deleted successfully', data: {id}});
       } catch (err) {
        reject(err);
       }
      });
};