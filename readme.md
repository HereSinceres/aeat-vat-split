aeat-vat-split

Advanced AEAT-compliant VAT split engine for Spain (21%, 10%, 4%, 0%).
Fully compatible with VeriFactu / TicketBAI / FacturaE and POS systems.

✨ Features

✔ 100% AEAT-compliant VAT calculation
✔ Multi-rate VAT splitting: 21%,10%,4%,0%
✔ Automatic “penny adjustment” (Regla de Prorrateo AEAT)
✔ Three fallback mechanisms:

Gross redistribution

Merge VAT groups

Collapse to 0% VAT (AEAT-legal)

✔ Guaranteed solvable — never throws
✔ CJS + ESM + TypeScript types
✔ 95%+ test coverage

📦 Installation
npm install aeat-vat-split

🧠 Usage
import { aeatSplit } from "aeat-vat-split";

const result = aeatSplit([
{ gross: 60, vat_percent: 0.21 },
{ gross: 40, vat_percent: 0.10 },
]);

console.log(result);
/_
[
{ net: 49.59, vat: 10.41, gross: 60, vat_percent: 0.21 },
{ net: 36.36, vat: 3.64, gross: 40, vat_percent: 0.10 }
]
_/

🧪 Testing
npm test

📘 API
aeatSplit(lines: LineInput[]): LineOutput[]
field description
gross Input line total (with VAT)
vat_percent 0.21, 0.10, 0.04, 0.00
net Net amount (2 decimals)
vat VAT (int, AEAT-compliant)
🛠 Internals

Automatic VAT jump detection

Rounding control

Penny adjustment rules

Mathematical fallback algorithm

0% final fallback

📄 License

MIT
