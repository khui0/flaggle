import fs from "node:fs/promises";
import sharp from "sharp";
import path from "node:path";

const HEIGHT: number = 240;
const RATIO: number = 3 / 2;
const BASE_DIR = "src/lib/flags";
const TARGET_DIR = "static/flags";
const CODES_PATH = path.join(BASE_DIR, "codes.json");

const DUPLICATES = ["bv", "hm", "mf", "sj", "um"];

interface DataJSONItem {
  code: string;
  name: string;
  duplicate?: boolean;
  us?: boolean;
}
const data: DataJSONItem[] = [];

async function fetchCodes() {
  await fs.access(CODES_PATH).catch(async () => {
    console.log("Fetching latest codes.json...");
    const res = await fetch("https://flagcdn.com/en/codes.json");
    const json = await res.json();
    console.log(CODES_PATH);
    await fs.writeFile(CODES_PATH, JSON.stringify(json, null, 2), "utf-8");
  });
}

async function process() {
  console.log("Generating flags...");

  const codes: Record<string, string> = JSON.parse(await fs.readFile(CODES_PATH, "utf-8"));
  Object.entries(codes).forEach(async ([code, name]) => {
    if (!code.startsWith("us-")) {
      generateFlag(code);
      const item: DataJSONItem = {
        code,
        name,
      };
      if (DUPLICATES.includes(code)) {
        item.duplicate = true;
      }
      if (code.startsWith("us-")) {
        item.us = true;
      }
      data.push(item);
    }
  });
}

async function generateFlag(code: string) {
  const data = await fetch(`https://flagcdn.com/${code}.svg`);
  const arrayBuffer = await data.arrayBuffer();
  const targetPath = path.join(TARGET_DIR, `${code}.png`);
  await sharp(Buffer.from(arrayBuffer))
    .resize(HEIGHT * RATIO, HEIGHT, { fit: "fill" })
    .toFile(targetPath);
  console.log(`Created ${targetPath}`);
}

await fs.mkdir(BASE_DIR, { recursive: true });
await fs.mkdir(TARGET_DIR, { recursive: true });
await fetchCodes();
await process();

console.log("Writing data.json...");
await fs.writeFile(path.join(BASE_DIR, "data.json"), JSON.stringify(data, null, 2));
