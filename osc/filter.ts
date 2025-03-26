import fs from "fs";

// This script will create a new file called filteredUrls.txt
// It will contain only the URLs whose ID is in the validIDs.txt file

// File paths
const urlsFilePath = "fullUrls.txt";
const idsFilePath = "validIDs.txt";
const outputFilePath = "filteredUrls.txt";

// Read IDs from validIDs.txt
const validIds: Set<string> = new Set(
  fs
    .readFileSync(idsFilePath, "utf8")
    .split(/\r?\n/) // Split by line
    .map((id) => id.trim().toLocaleLowerCase()) // Remove extra spaces
    .filter((id) => id.length > 0) // Remove empty lines
);

// Read URLs from fullUrls.txt
const urls: string[] = fs
  .readFileSync(urlsFilePath, "utf8")
  .split(/\r?\n/) // Split by line
  .map((url) => url.trim().toLocaleLowerCase()) // Remove extra spaces
  .filter((url) => url.length > 0); // Remove empty lines

// Filter URLs whose ID is in the validIds set
const filteredUrls: string[] = urls.filter((url) => {
  const firstDashIndex = url.indexOf("-");
  if (firstDashIndex === -1) return false; // No dash found
  const idEndIndex = url.indexOf("/", firstDashIndex + 1);

  if (idEndIndex === -1) return false; // No slash found

  const id = url.substring(firstDashIndex + 1, idEndIndex);
  return validIds.has(id);
});

// Write filtered URLs to a new file
fs.writeFileSync(outputFilePath, filteredUrls.join("\n"), "utf8");

console.log(`Filtered URLs saved to ${outputFilePath}`);
