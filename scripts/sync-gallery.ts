import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import { prisma } from "../lib/prisma";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

const folder = process.argv[2] ?? "gallery"; // default: gallery

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error("Missing Cloudinary env vars (CLOUDINARY_CLOUD_NAME / API_KEY / API_SECRET)");
}

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

type CloudinaryResource = {
    public_id: string;
    secure_url: string;
    created_at: string;
};

function titleFromPublicId(publicId: string) {
    const last = publicId.split("/").pop() ?? publicId;
    return last
        .replace(/[-_]+/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
}

function categoryFromPublicId(publicId: string) {
    const prefix = folder.replace(/\/+$/, ""); // remove trailing slash

    // Only handle items inside the folder
    if (!publicId.startsWith(prefix + "/")) return "Uncategorized";

    // Get the part after the folder
    const rest = publicId.slice(prefix.length + 1); // after "folder/"
    const [firstSegment] = rest.split("/");

    // If you have subfolders, firstSegment is the category
    // If images are directly inside the folder, it will be a filename -> fallback
    return firstSegment && rest.includes("/") ? firstSegment.trim() : "Uncategorized";
}

async function listAllResources(prefix: string) {
    const all: CloudinaryResource[] = [];
    let next_cursor: string | undefined = undefined;

    do {
        const res = await cloudinary.api.resources({
            type: "upload",
            resource_type: "image",
            prefix,
            max_results: 500,
            next_cursor,
        });

        const resources = (res.resources ?? []) as CloudinaryResource[];
        all.push(...resources);
        next_cursor = res.next_cursor;
    } while (next_cursor);

    return all;
}

async function main() {
    console.log(`Syncing Cloudinary folder "${folder}" -> GalleryImage table...`);

    // 1) Pull Cloudinary assets
    const resources = await listAllResources(folder);
    console.log(`Found ${resources.length} Cloudinary assets under "${folder}"`);

    // 2) Get existing imageUrls from DB (to avoid duplicates)
    const existing = await prisma.galleryImage.findMany({
        select: { imageUrl: true },
    });
    const existingSet = new Set(existing.map((x) => x.imageUrl));

    // 3) Build rows
    const toCreate = resources
        .filter((r) => !existingSet.has(r.secure_url))
        .map((r) => ({
            title: titleFromPublicId(r.public_id),
            imageUrl: r.secure_url,
            category: categoryFromPublicId(r.public_id),
            // createdAt will default in DB; you can also set it if you want:
            // createdAt: new Date(r.created_at),
        }));

    console.log(`New rows to insert: ${toCreate.length}`);

    if (toCreate.length === 0) {
        console.log("Nothing to insert. Done.");
        return;
    }

    // 4) Insert
    // Prisma createMany is fast. (No skipDuplicates unless you add a unique constraint.)
    await prisma.galleryImage.createMany({ data: toCreate });

    console.log("Inserted successfully.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
