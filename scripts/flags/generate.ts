import fs from "node:fs/promises";
import sharp from "sharp";
import path from "node:path";

const HEIGHT: number = 240;
const RATIO: number = 3 / 2;
const BASE_DIR = "src/lib/flags";
const CODES_PATH = path.join(BASE_DIR, "codes.json");

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
  Object.keys(codes).forEach((code) => {
    generateFlag(code);
  });
}

async function generateFlag(code: string) {
  const data = await fetch(`https://flagcdn.com/${code}.svg`);
  const arrayBuffer = await data.arrayBuffer();
  const targetPath = path.join(BASE_DIR, "png", `${code}.png`);
  await sharp(Buffer.from(arrayBuffer))
    .resize(HEIGHT * RATIO, HEIGHT, { fit: "fill" })
    .toFile(targetPath);
  console.log(`Created ${targetPath}`);
}

await fs.mkdir(path.join(BASE_DIR, "png"), { recursive: true });
await fetchCodes();
await process();
