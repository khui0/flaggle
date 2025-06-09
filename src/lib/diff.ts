import { fetchImageURL } from "./content";

interface Country {
  code: string;
  name: string;
}

export async function generateDiff(current: Country, target: Country) {
  const currentImage = await loadImage(await fetchImageURL(current.code));
  const targetImage = await loadImage(await fetchImageURL(target.code));

  const data = calculateDiff(getImageData(currentImage), getImageData(targetImage));

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = 360;
  canvas.height = 240;
  if (ctx && data) {
    ctx.putImageData(data, 0, 0);
  }

  return canvas.toDataURL();
}

function getImageData(
  image: HTMLImageElement | undefined,
  width: number = 360,
  height: number = 240,
): Uint8ClampedArray | undefined {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = width;
  canvas.height = height;

  ctx?.drawImage(image as CanvasImageSource, 0, 0);

  const data = ctx?.getImageData(0, 0, width, height).data;
  return data;
}

function calculateDiff(current?: Uint8ClampedArray, target?: Uint8ClampedArray) {
  const diffData = new ImageData(360, 240);

  if (!current || !target) return;
  for (let i = 0; i < current.length; i += 4) {
    const cur = {
      r: current[i],
      g: current[i + 1],
      b: current[i + 2],
      a: current[i + 3],
    };
    const tar = {
      r: target[i],
      g: target[i + 1],
      b: target[i + 2],
      a: target[i + 3],
    };

    const diff = delta(cur.r, cur.g, cur.b, tar.r, tar.g, tar.b);
    const threshold = 0.15;

    if (diff < threshold) {
      diffData.data[i] = 120;
      diffData.data[i + 1] = 177;
      diffData.data[i + 2] = 90;
      diffData.data[i + 3] = 255;
    } else {
      diffData.data[i] = 0;
      diffData.data[i + 1] = 0;
      diffData.data[i + 2] = 0;
      diffData.data[i + 3] = 0;
    }
  }

  return diffData;
}

function delta(r1: number, g1: number, b1: number, r2: number, g2: number, b2: number) {
  const d = Math.sqrt((r2 - r1) ** 2 + (g2 - g1) ** 2 + (b2 - b1) ** 2);
  const max = Math.sqrt(3 * 255 ** 2);
  return d / max;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
