import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * POST /api/invoice
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      type,
      isProforma,
      clientData,
      serviceData,
      items,
    } = body;

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

    // 4. Calcul simple des totaux
    let totalHT = 0;

    for (const item of items) {
      totalHT += item.total;
    }

    const totalTVA = totalHT * 0.2;
    const totalTTC = totalHT + totalTVA;

    // 5. Sauvegarder facture
    const invoice = await prisma.invoice.create({
      data: {
        type,
        sequence,
        month,
        year,
        isProforma: isProforma || false,

        clientData,
        serviceData,
        items,

        totalHT,
        totalTVA,
        totalTTC,
      },
    });

    return NextResponse.json(invoice);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur création facture" },
      { status: 500 }
    );
  }
}