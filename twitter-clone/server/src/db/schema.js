const{
    pgTable,
    index,
    serial,
    varchar,
    text,
    integer,
    timestamp,
    boolean
} = require("drizzle-orm/pg-core");

//USER TABLE
const users = pgTable("users", {
    // Primary key with auto-incrementing ID
    id: serial("id").primaryKey(),
    // User's full name
    name: varchar("name", {
        length: 255
    }).notNull(),
    // User's username
    username: varchar("username", {
        length: 255
    }).unique().notNull(),
    // User's email address
    email: varchar("email", {
        length: 255
    }).unique().notNull(),
    // User's password
    password: text("password").notNull(),
    // User's bio
    bio: text("bio"),
    // User's profile image
    profileImage: text("profile_image"),
    // Timestamp for when the user was created
    createdAt: timestamp("created_at").defaultNow()
});


//TWEETS TABLE 
const tweets = pgTable(
    "tweets",
    {   
        id: serial("id").primaryKey(), // Primary key with auto-incrementing ID
        content: text("content").notNull(), // Content of the tweet
        userId: integer("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }), // Foreign key referencing the user who created the tweet
        createdAt: timestamp("created_at").defaultNow().notNull(), // Timestamp for when the tweet was created
        updatedAt: timestamp("updated_at").defaultNow().notNull() // Timestamp for when the tweet was last updated
    },
    (table) => ({
        userIdIdx: index("tweets_user_id_idx").on(table.userId),
        createdAtIdx: index("tweets_created_at_idx").on(table.createdAt),
    })
);


//LIKES TABLE
const likes=pgTable("likes",{
    id: serial("id").primaryKey(),
    tweet_id: integer("tweet_id").references(()=>tweets.id,{onDelete:"cascade"}).notNull(),
    user_id: integer("user_id").references(()=>users.id,{onDelete:"cascade"}).notNull(),
    createdAt:timestamp("created_at").defaultNow().notNull()
});



//FOLOWS TABLE
const follows = pgTable("follows", {
    // Primary key with auto-incrementing ID
    id: serial("id").primaryKey(),  
    // Foreign key referencing the user who is following
    followerId: integer("follower_id").references(() => users.id,{onDelete: "cascade"}).notNull(),
    // Foreign key referencing the user being followed
    followingId: integer("following_id").references(() => users.id,{onDelete: "cascade"}).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull() // Timestamp for when the follow relationship was created
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



//COMMENT TABLE
const comments=pgTable("comments",{
    id: serial("id").primaryKey(),
    tweet_id: integer("tweet_id").references(()=>tweets.id,{onDelete:"cascade"}).notNull(),
    user_id: integer("user_id").references(()=>users.id,{onDelete:"cascade"}).notNull(),
    content: text("content").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull()
});

module.exports = {
    users,
    tweets,
    likes,
    follows,
    notifications,
    comments
};