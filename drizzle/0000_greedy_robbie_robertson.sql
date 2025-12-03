CREATE TABLE "chatgroup" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"avatar" varchar(512),
	"creatorid" integer NOT NULL,
	"createdat" timestamp DEFAULT now(),
	"status" integer DEFAULT 1
);
--> statement-breakpoint
CREATE TABLE "comment" (
	"id" serial PRIMARY KEY NOT NULL,
	"userid" integer NOT NULL,
	"postid" integer NOT NULL,
	"content" text NOT NULL,
	"iconid" integer,
	"imgurl" varchar(1024),
	"commentid" integer,
	"createdat" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "favoritepost" (
	"id" serial PRIMARY KEY NOT NULL,
	"userid" integer NOT NULL,
	"postid" integer NOT NULL,
	"createdat" timestamp DEFAULT now(),
	"iconid" integer
);
--> statement-breakpoint
CREATE TABLE "friendship" (
	"id" serial PRIMARY KEY NOT NULL,
	"userid" integer NOT NULL,
	"sentat" timestamp DEFAULT now(),
	"status" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "groupmember" (
	"id" serial PRIMARY KEY NOT NULL,
	"groupid" integer NOT NULL,
	"userid" integer NOT NULL,
	"joinedat" timestamp DEFAULT now(),
	"roleid" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "icon" (
	"id" serial PRIMARY KEY NOT NULL,
	"icon" varchar(255) NOT NULL,
	"status" integer DEFAULT 1
);
--> statement-breakpoint
CREATE TABLE "messageimg" (
	"id" serial PRIMARY KEY NOT NULL,
	"imgurl" varchar(1024) NOT NULL,
	"messageid" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "message" (
	"id" serial PRIMARY KEY NOT NULL,
	"senderid" integer NOT NULL,
	"receiverid" integer NOT NULL,
	"groupid" integer,
	"content" text NOT NULL,
	"sentat" timestamp DEFAULT now(),
	"status" integer DEFAULT 0,
	"messageid" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "postimage" (
	"id" serial PRIMARY KEY NOT NULL,
	"postid" integer NOT NULL,
	"imgurl" varchar(1024) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "post" (
	"id" serial PRIMARY KEY NOT NULL,
	"userid" integer NOT NULL,
	"content" text NOT NULL,
	"createdat" timestamp DEFAULT now(),
	"status" integer DEFAULT 1
);
--> statement-breakpoint
CREATE TABLE "role" (
	"id" serial PRIMARY KEY NOT NULL,
	"role" varchar(64) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"birthday" timestamp,
	"gender" varchar(16) DEFAULT 'other',
	"phone" varchar(32),
	"avatar" varchar(512),
	"email" varchar(255) NOT NULL,
	"createat" timestamp DEFAULT now(),
	"status" integer DEFAULT 1,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
