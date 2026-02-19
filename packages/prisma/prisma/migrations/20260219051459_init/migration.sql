-- CreateEnum
CREATE TYPE "ProfileVisibility" AS ENUM ('PUBLIC', 'MEMBERS_ONLY', 'PRIVATE');

-- CreateEnum
CREATE TYPE "MembershipTier" AS ENUM ('REGULAR', 'LIFE', 'HONORARY');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'REVISION_REQUESTED');

-- CreateEnum
CREATE TYPE "MembershipStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "NewsStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "VoteType" AS ENUM ('UP', 'DOWN');

-- CreateEnum
CREATE TYPE "DonationStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "JobType" AS ENUM ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'REMOTE');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('PENDING', 'PUBLISHED', 'FILLED', 'EXPIRED', 'REJECTED');

-- CreateEnum
CREATE TYPE "MentorshipRequestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('NEW_EVENT', 'JOB_POSTING', 'MEMBERSHIP_STATUS_CHANGED', 'FORUM_REPLY', 'DONATION_CAMPAIGN', 'DIRECT_MESSAGE', 'ADMIN_ANNOUNCEMENT', 'MEMBERSHIP_CARD_READY');

-- CreateTable
CREATE TABLE "permissions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_permissions" (
    "roleId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("roleId","permissionId")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedBy" TEXT,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("userId","roleId")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT,
    "googleId" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
    "isSuspended" BOOLEAN NOT NULL DEFAULT false,
    "mfaSecret" TEXT,
    "mfaEnabled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userAgent" TEXT,
    "ipAddress" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "member_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "batchYear" INTEGER,
    "jobTitle" TEXT,
    "employer" TEXT,
    "location" TEXT,
    "bio" TEXT,
    "skills" TEXT[],
    "linkedinUrl" TEXT,
    "githubUrl" TEXT,
    "websiteUrl" TEXT,
    "cvUrl" TEXT,
    "visibility" "ProfileVisibility" NOT NULL DEFAULT 'PUBLIC',
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "member_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "timeline_entries" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "timeline_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "membership_applications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "personalDetails" JSONB NOT NULL,
    "educationalDetails" JSONB NOT NULL,
    "occupationDetails" JSONB NOT NULL,
    "reviewNotes" TEXT,
    "reviewedBy" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "membership_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "memberships" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "membershipNumber" TEXT NOT NULL,
    "tier" "MembershipTier" NOT NULL,
    "status" "MembershipStatus" NOT NULL DEFAULT 'ACTIVE',
    "validFrom" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "sequence" INTEGER NOT NULL,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "memberships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT,
    "isVirtual" BOOLEAN NOT NULL DEFAULT false,
    "virtualLink" TEXT,
    "bannerUrl" TEXT,
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3),
    "seatLimit" INTEGER,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_rsvps" (
    "userId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_rsvps_pkey" PRIMARY KEY ("userId","eventId")
);

-- CreateTable
CREATE TABLE "event_photos" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "caption" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_photos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "news_articles" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "featuredImage" TEXT,
    "tags" TEXT[],
    "authorId" TEXT NOT NULL,
    "status" "NewsStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "news_articles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "news_comments" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "news_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "forum_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "forum_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "forum_threads" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "forum_threads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "forum_posts" (
    "id" TEXT NOT NULL,
    "threadId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isFlagged" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "forum_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "forum_votes" (
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "type" "VoteType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "forum_votes_pkey" PRIMARY KEY ("userId","postId")
);

-- CreateTable
CREATE TABLE "donation_campaigns" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "goalAmount" DECIMAL(12,2) NOT NULL,
    "deadline" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "donation_campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "donations" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "donorId" TEXT,
    "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
    "amount" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'BDT',
    "status" "DonationStatus" NOT NULL DEFAULT 'PENDING',
    "provider" TEXT NOT NULL,
    "transactionId" TEXT,
    "receiptSentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "donations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_postings" (
    "id" TEXT NOT NULL,
    "postedById" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "location" TEXT,
    "isRemote" BOOLEAN NOT NULL DEFAULT false,
    "jobType" "JobType" NOT NULL,
    "description" TEXT NOT NULL,
    "requirements" TEXT,
    "applicationLink" TEXT,
    "applicationEmail" TEXT,
    "status" "JobStatus" NOT NULL DEFAULT 'PENDING',
    "expiresAt" TIMESTAMP(3),
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "job_postings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mentor_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expertiseAreas" TEXT[],
    "availability" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "bio" TEXT,
    "averageRating" DECIMAL(3,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mentor_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mentorship_requests" (
    "id" TEXT NOT NULL,
    "menteeId" TEXT NOT NULL,
    "mentorId" TEXT NOT NULL,
    "message" TEXT,
    "status" "MentorshipRequestStatus" NOT NULL DEFAULT 'PENDING',
    "rating" INTEGER,
    "feedback" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mentorship_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "linkUrl" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "membership_cards" (
    "id" TEXT NOT NULL,
    "membershipNumber" TEXT NOT NULL,
    "pdfUrl" TEXT,
    "pngUrl" TEXT,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reissuedAt" TIMESTAMP(3),

    CONSTRAINT "membership_cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "before" JSONB,
    "after" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "permissions_name_key" ON "permissions"("name");

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_googleId_key" ON "users"("googleId");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_googleId_idx" ON "users"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_tokenHash_key" ON "refresh_tokens"("tokenHash");

-- CreateIndex
CREATE INDEX "refresh_tokens_userId_idx" ON "refresh_tokens"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "member_profiles_userId_key" ON "member_profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "member_profiles_username_key" ON "member_profiles"("username");

-- CreateIndex
CREATE INDEX "member_profiles_username_idx" ON "member_profiles"("username");

-- CreateIndex
CREATE INDEX "timeline_entries_profileId_idx" ON "timeline_entries"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "membership_applications_userId_key" ON "membership_applications"("userId");

-- CreateIndex
CREATE INDEX "membership_applications_status_idx" ON "membership_applications"("status");

-- CreateIndex
CREATE UNIQUE INDEX "memberships_userId_key" ON "memberships"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "memberships_membershipNumber_key" ON "memberships"("membershipNumber");

-- CreateIndex
CREATE INDEX "memberships_membershipNumber_idx" ON "memberships"("membershipNumber");

-- CreateIndex
CREATE INDEX "memberships_status_idx" ON "memberships"("status");

-- CreateIndex
CREATE INDEX "events_startAt_idx" ON "events"("startAt");

-- CreateIndex
CREATE INDEX "event_photos_eventId_idx" ON "event_photos"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "news_articles_slug_key" ON "news_articles"("slug");

-- CreateIndex
CREATE INDEX "news_articles_slug_idx" ON "news_articles"("slug");

-- CreateIndex
CREATE INDEX "news_articles_status_idx" ON "news_articles"("status");

-- CreateIndex
CREATE INDEX "news_comments_articleId_idx" ON "news_comments"("articleId");

-- CreateIndex
CREATE UNIQUE INDEX "forum_categories_name_key" ON "forum_categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "forum_categories_slug_key" ON "forum_categories"("slug");

-- CreateIndex
CREATE INDEX "forum_threads_categoryId_idx" ON "forum_threads"("categoryId");

-- CreateIndex
CREATE INDEX "forum_posts_threadId_idx" ON "forum_posts"("threadId");

-- CreateIndex
CREATE UNIQUE INDEX "donations_transactionId_key" ON "donations"("transactionId");

-- CreateIndex
CREATE INDEX "donations_campaignId_idx" ON "donations"("campaignId");

-- CreateIndex
CREATE INDEX "donations_donorId_idx" ON "donations"("donorId");

-- CreateIndex
CREATE INDEX "job_postings_status_idx" ON "job_postings"("status");

-- CreateIndex
CREATE UNIQUE INDEX "mentor_profiles_userId_key" ON "mentor_profiles"("userId");

-- CreateIndex
CREATE INDEX "mentorship_requests_menteeId_idx" ON "mentorship_requests"("menteeId");

-- CreateIndex
CREATE INDEX "mentorship_requests_mentorId_idx" ON "mentorship_requests"("mentorId");

-- CreateIndex
CREATE INDEX "notifications_userId_isRead_idx" ON "notifications"("userId", "isRead");

-- CreateIndex
CREATE UNIQUE INDEX "membership_cards_membershipNumber_key" ON "membership_cards"("membershipNumber");

-- CreateIndex
CREATE INDEX "audit_logs_actorId_idx" ON "audit_logs"("actorId");

-- CreateIndex
CREATE INDEX "audit_logs_entityType_entityId_idx" ON "audit_logs"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "audit_logs_createdAt_idx" ON "audit_logs"("createdAt");

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member_profiles" ADD CONSTRAINT "member_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timeline_entries" ADD CONSTRAINT "timeline_entries_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "member_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "membership_applications" ADD CONSTRAINT "membership_applications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_rsvps" ADD CONSTRAINT "event_rsvps_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_rsvps" ADD CONSTRAINT "event_rsvps_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_photos" ADD CONSTRAINT "event_photos_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "news_comments" ADD CONSTRAINT "news_comments_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "news_articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "news_comments" ADD CONSTRAINT "news_comments_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forum_threads" ADD CONSTRAINT "forum_threads_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "forum_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forum_threads" ADD CONSTRAINT "forum_threads_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forum_posts" ADD CONSTRAINT "forum_posts_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "forum_threads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forum_posts" ADD CONSTRAINT "forum_posts_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forum_votes" ADD CONSTRAINT "forum_votes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forum_votes" ADD CONSTRAINT "forum_votes_postId_fkey" FOREIGN KEY ("postId") REFERENCES "forum_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "donations" ADD CONSTRAINT "donations_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "donation_campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "donations" ADD CONSTRAINT "donations_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_postings" ADD CONSTRAINT "job_postings_postedById_fkey" FOREIGN KEY ("postedById") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mentor_profiles" ADD CONSTRAINT "mentor_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mentorship_requests" ADD CONSTRAINT "mentorship_requests_menteeId_fkey" FOREIGN KEY ("menteeId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mentorship_requests" ADD CONSTRAINT "mentorship_requests_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "mentor_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
