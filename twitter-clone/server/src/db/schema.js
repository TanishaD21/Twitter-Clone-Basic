const{
    pgTable,
    index,
    serial,
    varchar,
    text,
    integer,
    timestamp
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
    },
    (table) => ({
        userIdIdx: index("tweets_user_id_idx").on(table.userId),
        createdAtIdx: index("tweets_created_at_idx").on(table.createdAt),
    })
);


//LIKES TABLE
const likes = pgTable("like", {
    // Primary key with auto-incrementing ID
    id: serial("id").primaryKey(),

    // Foreign key referencing the user who liked the tweet
    userId: integer("user_id").references(() => users.id).notNull(),

    // Foreign key referencing the liked tweet
    tweetId: integer("tweet_id").references(() => tweets.id).notNull()

});



//FOLOWS TABLE
const follows = pgTable("follows", {
    // Primary key with auto-incrementing ID
    id: serial("id").primaryKey(),  

    // Foreign key referencing the user who is following
    followerId: integer("follower_id").references(() => users.id).notNull(),

    // Foreign key referencing the user being followed
    followingId: integer("following_id").references(() => users.id).notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull() // Timestamp for when the follow relationship was created
});

module.exports = {
    users,
    tweets,
    likes,
    follows
};