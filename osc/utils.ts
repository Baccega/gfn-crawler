import fs from "fs";
import readline from "readline";

export function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function readUrlsFromFile(filePath: string): Promise<string[]> {
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const urls: string[] = [];
  for await (const line of rl) {
    urls.push(line.trim()); // Store URLs in an array
  }
  return urls;
}
