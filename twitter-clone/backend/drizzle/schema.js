const{
    pgTable,
    serial,
    text,
    integer,
    timestamp,
    index,
    uniqueIndex,
    varchar,
    boolean
}=require("drizzle-orm/pg-core")


const users = pgTable(
    "users",
    {
        id: serial("id").primaryKey(),
        name: text("name").notNull(),
        username: text("username").notNull(),
        email: text("email").notNull(),
        password: text("password").notNull(),
        bio: text("bio"),
        profileImage: text("profile_image"),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at").defaultNow().notNull()
    },
    (table) => ({
        usernameIdx: uniqueIndex("users_username_unique_idx").on(table.username),
        emailIdx: uniqueIndex("users_email_unique_idx").on(table.email),
    })
);

// Tweets table
const tweets = pgTable(
    "tweets",
    {
        id: serial("id").primaryKey(),
        content: text("content").notNull(),
        userId: integer("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt:timestamp("updated_at").defaultNow().notNull()
    },
    (table) => ({
        userIdIdx: index("tweets_user_id_idx").on(table.userId),
        createdAtIdx: index("tweets_created_at_idx").on(table.createdAt),
    })
);

//FOLOWS TABLE
const follows = pgTable("follows", {
    // Primary key with auto-incrementing ID
    id: serial("id").primaryKey(),  

    // Foreign key referencing the user who is following
    followerId: integer("follower_id").references(() => users.id).notNull(),

    // Foreign key referencing the user being followed
    followingId: integer("following_id").references(() => users.id).notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull()
});

const likes=pgTable("likes",{
    id: serial("id").primaryKey(),
    tweet_id: integer("tweet_id").references(()=>tweets.id,{onDelete:"cascade"}).notNull(),
    user_id: integer("user_id").references(()=>users.id,{onDelete:"cascade"}).notNull(),
    createdAt:timestamp("created_at").defaultNow().notNull()
});

const comments=pgTable("comments",{
    id: serial("id").primaryKey(),
    tweet_id: integer("tweet_id").references(()=>tweets.id,{onDelete:"cascade"}).notNull(),
    user_id: integer("user_id").references(()=>users.id,{onDelete:"cascade"}).notNull(),
    content: text("content").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull()
});

//NOTIFICATIONS TABLE
const notifications= pgTable("notifications", {
    id: serial("id").primaryKey(), // Primary key with auto-incrementing ID
    recipientId: integer("recipient_id").notNull(), // Foreign key referencing the user who receives the notification
    senderId: integer("sender_id").notNull(), // Foreign key referencing the user who triggered the notification
    type: varchar("type", { length: 50 }).notNull(), // Type of notification (e.g., "like", "follow", "mention")
    tweetId: integer("tweet_id"),// Foreign key referencing the related tweet (if applicable)
    isRead: boolean("is_read").default(false),
    createdAt: timestamp("create_at").defaultNow().notNull() // Timestamp for when the notification was created
})

module.exports={
    users,tweets,follows,comments,likes,notifications
}