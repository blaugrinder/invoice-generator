const units = [
  "zéro",
  "un",
  "deux",
  "trois",
  "quatre",
  "cinq",
  "six",
  "sept",
  "huit",
  "neuf",
  "dix",
  "onze",
  "douze",
  "treize",
  "quatorze",
  "quinze",
  "seize",
];

const tens = [
  "",
  "",
  "vingt",
  "trente",
  "quarante",
  "cinquante",
  "soixante",
];

function convertBelowHundred(n: number): string {
  if (n < 17) return units[n];

  if (n < 20) return "dix-" + units[n - 10];

  if (n < 70) {
    const ten = Math.floor(n / 10);
    const unit = n % 10;

    return (
      tens[ten] +
      (unit === 1 ? " et un" : unit > 0 ? "-" + units[unit] : "")
    );
  }

  if (n < 80) {
    return "soixante-" + convertBelowHundred(n - 60);
  }

  if (n < 100) {
    return "quatre-vingt" + (n === 80 ? "s" : "-" + convertBelowHundred(n - 80));
  }

  return "";
}

function convertBelowThousand(n: number): string {
  if (n < 100) return convertBelowHundred(n);

  const hundred = Math.floor(n / 100);
  const rest = n % 100;

  let result = "";

  if (hundred === 1) {
    result = "cent";
  } else {
    result = units[hundred] + " cent";
  }

  if (rest === 0 && hundred > 1) {
    result += "s";
  } else if (rest > 0) {
    result += " " + convertBelowHundred(rest);
  }

  return result;
}

export function amountToWords(amount: number): string {
  if (amount === 0) return "ZÉRO ARIARY";

  let words = "";

  const millions = Math.floor(amount / 1_000_000);
  const thousands = Math.floor((amount % 1_000_000) / 1000);
  const rest = amount % 1000;

  if (millions > 0) {
    words +=
      (millions === 1
        ? "un million"
        : convertBelowThousand(millions) + " millions") + " ";
  }

  if (thousands > 0) {
    if (thousands === 1) {
      words += "mille ";
    } else {
      words += convertBelowThousand(thousands) + " mille ";
    }
  }

  if (rest > 0) {
    words += convertBelowThousand(rest);
  }

  return words.trim().toUpperCase() + " ARIARY";
}