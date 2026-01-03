import dotenv from "dotenv";
dotenv.config({ path: ".env.local", override: true });
dotenv.config({ path: ".env", override: true });

import { v2 as cloudinary } from "cloudinary";

import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";

// Needed in Node for Neon serverless driver (safe even if Node has WebSocket)
neonConfig.webSocketConstructor = ws;

const connectionString = process.env.DATABASE_URL!;
if (!connectionString) throw new Error("DATABASE_URL missing");

const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

const ROOT_FOLDER = process.argv[2] ?? "Cakes";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

type Folder = { name: string; path: string };
type Resource = {
  secure_url: string;
  public_id: string;
  resource_type: "image" | "video" | "raw";
  type: "upload";
  display_name?: string;
};

async function listSubfolders(parent: string): Promise<Folder[]> {
  const res = await cloudinary.api.sub_folders(parent);
  return (res.folders ?? []) as Folder[];
}

async function listResourcesByAssetFolder(assetFolder: string): Promise<Resource[]> {
  const all: Resource[] = [];
  let next_cursor: string | undefined;

  do {
    const res = await cloudinary.api.resources_by_asset_folder(assetFolder, {
      max_results: 500,
      next_cursor,
    });

    all.push(...((res.resources ?? []) as Resource[]));
    next_cursor = res.next_cursor;
  } while (next_cursor);

  return all;
}

async function walkFolders(root: string): Promise<string[]> {
  const out: string[] = [root];
  const stack: string[] = [root];

  while (stack.length) {
    const cur = stack.pop()!;
    const kids = await listSubfolders(cur);
    for (const k of kids) {
      out.push(k.path);
      stack.push(k.path);
    }
  }

  return out;
}

function categoryFromFolderPath(path: string) {
  const parts = path.split("/").filter(Boolean);
  return parts[parts.length - 1] ?? "Uncategorized";
}

// HEIC often won’t display directly in browsers; f_auto,q_auto makes Cloudinary serve a compatible format.
function deliveryUrl(secureUrl: string) {
  return secureUrl.replace("/image/upload/", "/image/upload/f_auto,q_auto/");
}

function titleFromPublicId(publicId: string) {
  const last = publicId.split("/").pop() ?? publicId;
  return last.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("Missing DATABASE_URL in .env.local (Prisma needs it)");
  }
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error("Missing Cloudinary env vars");
  }

  console.log(`Syncing Cloudinary asset folder "${ROOT_FOLDER}" -> GalleryImage table...`);

  const folders = await walkFolders(ROOT_FOLDER);
  console.log(`Found ${folders.length} folders (root + subfolders)`);

  const existing = await prisma.galleryImage.findMany({ select: { imageUrl: true } });
  const existingSet = new Set(existing.map((x) => x.imageUrl));

  let inserted = 0;

  for (const folderPath of folders) {
    const resources = await listResourcesByAssetFolder(folderPath);
    const images = resources.filter((r) => r.type === "upload" && r.resource_type === "image");

    if (images.length === 0) continue;

    const category = folderPath === ROOT_FOLDER ? "Uncategorized" : categoryFromFolderPath(folderPath);

    const data = images
      .map((r) => ({
        title: titleFromPublicId(r.public_id),
        imageUrl: deliveryUrl(r.secure_url),
        category,
      }))
      .filter((row) => !existingSet.has(row.imageUrl));

    if (data.length === 0) continue;

    await prisma.galleryImage.createMany({ data });
    data.forEach((d) => existingSet.add(d.imageUrl));
    inserted += data.length;

    console.log(`+ ${data.length} from ${folderPath} -> category "${category}"`);
  }

  console.log(`Done ✅ Inserted ${inserted} rows total.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
