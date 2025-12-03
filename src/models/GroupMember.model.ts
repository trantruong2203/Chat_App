import { db } from "../config/db";
import { GroupMember } from "../types/interface";



export const getAllGroupMembers = async (): Promise<GroupMember[]> => {
	const [results] = await db.query('SELECT id, groupid, userid, joinedat, roleid::int as roleid FROM groupmember');
	return results as GroupMember[];
};

export const getGroupMemberById = async (id: number): Promise<GroupMember[]> => {
	const [results] = await db.query('SELECT id, groupid, userid, joinedat, roleid::int as roleid FROM groupmember WHERE id = $1', [id]);
	return results as GroupMember[];
};

export const createGroupMember = async (groupid: number, userid: number, joinedat: Date, roleid: number): Promise<any> => {
	const [results] = await db.query('INSERT INTO groupmember (groupid, userid, joinedat, roleid) VALUES ($1, $2, $3, $4) RETURNING *', [groupid, userid, joinedat, roleid]);
	return {
		success: true,
		message: 'Group member created successfully',
		data: results
	};
};

export const updateGroupMemberDynamic = async (id: number, fieldsToUpdate: Partial<{ 
	groupid: number, 
	userid: number,
	joinedat: Date,
	roleid: number
  }>) => {
	const keys = Object.keys(fieldsToUpdate);
	if (keys.length === 0) {
	  throw new Error('Không có thông tin nào để cập nhật');
	}
  
	const setClause = keys.map((key, idx) => `${key} = $${idx + 1}`).join(', ');
	const values = keys.map(key => (fieldsToUpdate as any)[key]);
  
	const query = `UPDATE groupmember SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`;
	const [result] = await db.query(query, [...values, id]);
  
	return result;
  };

  
export const deleteGroupMember = async (id: number): Promise<any> => {
	const [results] = await db.query('DELETE FROM groupmember WHERE id = $1 RETURNING *', [id]);
	return {
		success: true,
		message: 'Group member deleted successfully',
		data: results
	};
};


