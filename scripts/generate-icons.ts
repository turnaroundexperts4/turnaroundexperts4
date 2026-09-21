import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const source = path.join(root, "public", "images", "tae-logo.png");
const favicon = path.join(root, "public", "favicon.png");
const appleTouchIcon = path.join(root, "public", "apple-touch-icon.png");

async function generateIcons() {
  try {
    await sharp(source)
      .resize(48, 48, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(favicon);
    console.log(`Generated ${favicon}`);
  } catch (error) {
    console.error("Failed to generate favicon.png:", error);
    throw error;
  }

  try {
    await sharp(source)
      .resize(180, 180, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } })
      .png()
      .toFile(appleTouchIcon);
    console.log(`Generated ${appleTouchIcon}`);
  } catch (error) {
    console.error("Failed to generate apple-touch-icon.png:", error);
    throw error;
  }
}

void generateIcons();
