ALTER TABLE "notifications" DROP CONSTRAINT "notifications_recipient_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_sender_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_tweet_id_tweets_id_fk";
--> statement-breakpoint
ALTER TABLE "tweets" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;