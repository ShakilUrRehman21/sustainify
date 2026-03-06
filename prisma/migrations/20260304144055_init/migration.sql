-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT,
    "subcategory" TEXT,
    "seoTags" TEXT,
    "susFilters" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ai_outputs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "module" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "parsedJson" TEXT,
    "success" BOOLEAN NOT NULL DEFAULT true,
    "errorMsg" TEXT,
    "durationMs" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "productId" TEXT,
    CONSTRAINT "ai_outputs_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "b2b_proposals" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "companyName" TEXT,
    "requirements" TEXT NOT NULL,
    "budget" REAL NOT NULL,
    "productMix" TEXT NOT NULL,
    "budgetAlloc" TEXT NOT NULL,
    "costBreakdown" TEXT NOT NULL,
    "impactSummary" TEXT NOT NULL,
    "totalCost" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderNumber" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "items" TEXT NOT NULL,
    "total" REAL NOT NULL,
    "placedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "impact_reports" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "inputData" TEXT NOT NULL,
    "plasticSavedKg" REAL NOT NULL,
    "carbonAvoidedKg" REAL NOT NULL,
    "localImpactSummary" TEXT NOT NULL,
    "humanReadableStmt" TEXT NOT NULL,
    "calculationBreakdown" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "chat_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "intent" TEXT,
    "orderId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "chat_logs_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "orders_orderNumber_key" ON "orders"("orderNumber");

-- CreateIndex
CREATE INDEX "chat_logs_sessionId_idx" ON "chat_logs"("sessionId");
