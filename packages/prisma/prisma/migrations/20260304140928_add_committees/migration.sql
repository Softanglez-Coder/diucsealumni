-- CreateTable
CREATE TABLE "committees" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "termLabel" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "committees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "committee_members" (
    "id" TEXT NOT NULL,
    "committeeId" TEXT NOT NULL,
    "userId" TEXT,
    "slug" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "designation" TEXT NOT NULL,
    "designationShort" TEXT,
    "batchYear" TEXT,
    "jobTitle" TEXT,
    "employer" TEXT,
    "avatarColor" TEXT,
    "isKeyMember" BOOLEAN NOT NULL DEFAULT false,
    "rank" INTEGER NOT NULL DEFAULT 99,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "committee_members_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "committees_isActive_idx" ON "committees"("isActive");

-- CreateIndex
CREATE INDEX "committee_members_committeeId_idx" ON "committee_members"("committeeId");

-- CreateIndex
CREATE INDEX "committee_members_isKeyMember_idx" ON "committee_members"("isKeyMember");

-- AddForeignKey
ALTER TABLE "committee_members" ADD CONSTRAINT "committee_members_committeeId_fkey" FOREIGN KEY ("committeeId") REFERENCES "committees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "committee_members" ADD CONSTRAINT "committee_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
