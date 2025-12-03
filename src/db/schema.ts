import { pgTable, serial, integer, varchar, text, timestamp } from 'drizzle-orm/pg-core';

export const userTable = pgTable('user', {
	id: serial('id').primaryKey(),
	username: varchar('username', { length: 255 }).notNull(),
	password: varchar('password', { length: 255 }).notNull(),
	birthday: timestamp('birthday', { withTimezone: false }),
	gender: varchar('gender', { length: 16 }).default('other'),
	phone: varchar('phone', { length: 32 }),
	avatar: varchar('avatar', { length: 512 }),
	email: varchar('email', { length: 255 }).notNull().unique(),
	createat: timestamp('createat', { withTimezone: false }).defaultNow(),
	status: integer('status').default(1),
});

export const postTable = pgTable('post', {
	id: serial('id').primaryKey(),
	userid: integer('userid').notNull().references(() => userTable.id),
	content: text('content').notNull(),
	createdat: timestamp('createdat', { withTimezone: false }).defaultNow(),
	status: integer('status').default(1),
});

export const commentTable = pgTable('comment', {
	id: serial('id').primaryKey(),
	userid: integer('userid').notNull().references(() => userTable.id),
	postid: integer('postid').notNull().references(() => postTable.id),
	content: text('content').notNull(),
	iconid: integer('iconid').references(() => iconTable.id),
	imgurl: varchar('imgurl', { length: 1024 }),
	commentid: integer('commentid'),
	createdat: timestamp('createdat', { withTimezone: false }).defaultNow(),
});

export const messageTable = pgTable('message', {
	id: serial('id').primaryKey(),
	senderid: integer('senderid').notNull().references(() => userTable.id),
	receiverid: integer('receiverid').references(() => userTable.id),
	groupid: integer('groupid').references(() => chatGroupTable.id),
	content: text('content').notNull(),
	sentat: timestamp('sentat', { withTimezone: false }).defaultNow(),
	status: integer('status').default(0),
	messageid: integer('messageid'),
});

export const chatGroupTable = pgTable('chatgroup', {
	id: serial('id').primaryKey(),
	name: varchar('name', { length: 255 }).notNull(),
	avatar: varchar('avatar', { length: 512 }),
	creatorid: integer('creatorid').notNull().references(() => userTable.id),
	createdat: timestamp('createdat', { withTimezone: false }).defaultNow(),
	status: integer('status').default(1),
});

export const groupMemberTable = pgTable('groupmember', {
	id: serial('id').primaryKey(),
	groupid: integer('groupid').notNull().references(() => chatGroupTable.id),
	userid: integer('userid').notNull().references(() => userTable.id),
	joinedat: timestamp('joinedat', { withTimezone: false }).defaultNow(),
	roleid: integer('roleid').default(0),
});

export const friendShipTable = pgTable('friendship', {
	id: serial('id').primaryKey(),
	userid: integer('userid').notNull().references(() => userTable.id),
	sentat: varchar('sentat', { length: 255 }).notNull(),
	status: integer('status').default(0),
});

export const favoritePostTable = pgTable('favoritepost', {
	id: serial('id').primaryKey(),
	userid: integer('userid').notNull().references(() => userTable.id),
	postid: integer('postid').notNull().references(() => postTable.id),
	createdat: timestamp('createdat', { withTimezone: false }).defaultNow(),
	iconid: integer('iconid'),
});

export const postImageTable = pgTable('postimage', {
	id: serial('id').primaryKey(),
	postid: integer('postid').notNull().references(() => postTable.id),
	imgurl: varchar('imgurl', { length: 1024 }).notNull(),
});

export const messageImgTable = pgTable('messageimg', {
	id: serial('id').primaryKey(),
	imgurl: varchar('imgurl', { length: 1024 }).notNull(),
	messageid: integer('messageid').notNull().references(() => messageTable.id),
});

export const iconTable = pgTable('icon', {
	id: serial('id').primaryKey(),
	icon: varchar('icon', { length: 255 }).notNull(),
	status: integer('status').default(1),
});

export const roleTable = pgTable('role', {
	id: serial('id').primaryKey(),
	role: varchar('role', { length: 64 }).notNull(),
}); 