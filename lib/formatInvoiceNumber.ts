export function formatInvoiceNumber({
  type,
  sequence,
  month,
  year,
  isProforma,
}: {
  type: string;
  sequence: number;
  month: number;
  year: number;
  isProforma: boolean;
}) {
  // format 01, 02, 03...
  const paddedSequence = String(sequence).padStart(2, "0");

  // format mois 04, 11...
  const paddedMonth = String(month).padStart(2, "0");

  // année courte 2026 → 26
  const shortYear = String(year).slice(-2);

  const base = `N° ${type} ${paddedSequence} - ${paddedMonth} / ${shortYear}`;

  if (isProforma) {
    return `FACTURE PROFORMA ${base}`;
  }

  return `FACTURE ${base}`;
}