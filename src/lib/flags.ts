const COUNTRY_TO_CODE: Record<string, string> = {
  "Australia": "AU",
  "Austria": "AT",
  "Brazil": "BR",
  "Canada": "CA",
  "Chile": "CL",
  "China": "CN",
  "Colombia": "CO",
  "Cyprus": "CY",
  "Czech Republic": "CZ",
  "Denmark": "DK",
  "Egypt": "EG",
  "Eswatini": "SZ",
  "France": "FR",
  "Germany": "DE",
  "Hong Kong": "HK",
  "India": "IN",
  "Indonesia": "ID",
  "Ireland": "IE",
  "Israel": "IL",
  "Italy": "IT",
  "Japan": "JP",
  "Malaysia": "MY",
  "Mexico": "MX",
  "Netherlands": "NL",
  "New Zealand": "NZ",
  "Nigeria": "NG",
  "Norway": "NO",
  "Philippines": "PH",
  "Russia": "RU",
  "Saudi Arabia": "SA",
  "Singapore": "SG",
  "South Africa": "ZA",
  "South Korea": "KR",
  "Spain": "ES",
  "Sweden": "SE",
  "Switzerland": "CH",
  "Taiwan": "TW",
  "Thailand": "TH",
  "Turkey": "TR",
  "United Arab Emirates": "AE",
  "United Kingdom": "GB",
  "United States": "US",
  "Venezuela": "VE",
  "Vietnam": "VN",
};

export function countryToFlag(country: string): string {
  const code = COUNTRY_TO_CODE[country];
  if (!code) return "";
  return code
    .toUpperCase()
    .split("")
    .map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
    .join("");
}
