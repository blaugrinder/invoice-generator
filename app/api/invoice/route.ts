import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { formatInvoiceNumber } from "@/lib/formatInvoiceNumber";
import { amountToWords } from "@/lib/amountToWords";

/**
 * POST /api/invoice
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      type,
      isProforma = false,
      clientData,
      serviceData,
      items = [],
    } = body;

    // 🛑 VALIDATION MINIMALE
    if (!type) {
      return NextResponse.json(
        { error: "Le type de facture est requis" },
        { status: 400 }
      );
    }

    // 1. Date actuelle
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    // 2. Récupérer compteur
    let counter = await prisma.invoiceCounter.findUnique({
      where: {
        type_month_year: {
          type,
          month,
          year,
        },
      },
    });

    // 3. Créer ou incrémenter compteur
    if (!counter) {
      counter = await prisma.invoiceCounter.create({
        data: {
          type,
          month,
          year,
          count: 1,
        },
      });
    } else {
      counter = await prisma.invoiceCounter.update({
        where: { id: counter.id },
        data: {
          count: counter.count + 1,
        },
      });
    }

    const sequence = counter.count;

    // 4. Calcul des totaux
    let totalHT = 0;

    for (const item of items) {
      const value = Number(item.total) || 0;
      totalHT += value;
    }

    const totalTVA = totalHT * 0.2;
    const totalTTC = totalHT + totalTVA;
    const totalInWords = amountToWords(totalTTC);

    // 5. Sauvegarder facture
    const invoice = await prisma.invoice.create({
      data: {
        type,
        sequence,
        month,
        year,
        isProforma,

        clientData,
        serviceData,
        items,

        totalHT,
        totalTVA,
        totalTTC,
      },
    });

    // 6. Générer numéro formaté
    const formattedNumber = formatInvoiceNumber({
      type,
      sequence,
      month,
      year,
      isProforma,
    });

    // 7. Retour API enrichi
    return NextResponse.json({
      ...invoice,
      formattedNumber,
      totalInWords,
    });

  } catch (error) {
    console.error("Erreur création facture:", error);

    return NextResponse.json(
      { error: "Erreur création facture" },
      { status: 500 }
    );
  }
}