-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "customNumber" TEXT,
    "sequence" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "isProforma" BOOLEAN NOT NULL DEFAULT false,
    "clientData" JSONB NOT NULL,
    "serviceData" JSONB NOT NULL,
    "items" JSONB NOT NULL,
    "totalHT" DOUBLE PRECISION NOT NULL,
    "totalTVA" DOUBLE PRECISION NOT NULL,
    "totalTTC" DOUBLE PRECISION NOT NULL,
    "signatureName" TEXT,
    "signatureImage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvoiceCounter" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "count" INTEGER NOT NULL,

    CONSTRAINT "InvoiceCounter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InvoiceCounter_type_month_year_key" ON "InvoiceCounter"("type", "month", "year");
