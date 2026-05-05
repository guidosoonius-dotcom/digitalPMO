-- CreateTable
CREATE TABLE "Phase" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "startWeek" INTEGER NOT NULL,
    "startYear" INTEGER NOT NULL,
    "endWeek" INTEGER NOT NULL,
    "endYear" INTEGER NOT NULL,
    "color" TEXT NOT NULL,
    "order" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectNumber" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "owner" TEXT NOT NULL DEFAULT '',
    "phaseId" TEXT,
    "isGroupRow" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'not_started',
    "barType" TEXT NOT NULL DEFAULT 'task',
    "startWeek" INTEGER NOT NULL DEFAULT 0,
    "startYear" INTEGER NOT NULL DEFAULT 2026,
    "endWeek" INTEGER NOT NULL DEFAULT 0,
    "endYear" INTEGER NOT NULL DEFAULT 2026,
    "isMilestone" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" DATETIME NOT NULL,
    "updatedBy" TEXT,
    CONSTRAINT "Task_phaseId_fkey" FOREIGN KEY ("phaseId") REFERENCES "Phase" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TaskBar" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "taskId" TEXT NOT NULL,
    "startWeek" INTEGER NOT NULL,
    "startYear" INTEGER NOT NULL,
    "endWeek" INTEGER NOT NULL,
    "endYear" INTEGER NOT NULL,
    "barType" TEXT NOT NULL DEFAULT 'task',
    CONSTRAINT "TaskBar_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "taskId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Comment_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
