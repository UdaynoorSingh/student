import fs from "node:fs";
import path from "node:path";
import mongoose from "mongoose";

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const text = fs.readFileSync(filePath, "utf8");
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eqIndex = line.indexOf("=");
    if (eqIndex <= 0) continue;

    const key = line.slice(0, eqIndex).trim();
    if (!key || process.env[key] !== undefined) continue;

    let value = line.slice(eqIndex + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  }
}

const root = process.cwd();
loadEnvFile(path.join(root, ".env"));
loadEnvFile(path.join(root, ".env.local"));

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("MONGODB_URI is missing. Set it in .env or .env.local.");
  process.exit(1);
}

const colleges = [
  { name: "Harvard University", code: "HARVARD", description: "Cambridge, MA" },
  { name: "Stanford University", code: "STANFORD", description: "Stanford, CA" },
  { name: "Massachusetts Institute of Technology", code: "MIT", description: "Cambridge, MA" },
  { name: "University of California, Berkeley", code: "UCB", description: "Berkeley, CA" },
  { name: "California Institute of Technology", code: "CALTECH", description: "Pasadena, CA" },
  { name: "Princeton University", code: "PRINCETON", description: "Princeton, NJ" },
  { name: "Yale University", code: "YALE", description: "New Haven, CT" },
  { name: "Columbia University", code: "COLUMBIA", description: "New York, NY" },
  { name: "University of Chicago", code: "UCHICAGO", description: "Chicago, IL" },
  { name: "University of Pennsylvania", code: "UPENN", description: "Philadelphia, PA" }
];

async function run() {
  await mongoose.connect(MONGODB_URI, { dbName: "sluglime-web" });
  const collection = mongoose.connection.collection("colleges");

  let inserted = 0;
  let updated = 0;

  for (const college of colleges) {
    const result = await collection.updateOne(
      { code: college.code },
      {
        $set: {
          name: college.name,
          code: college.code,
          description: college.description,
          updatedAt: new Date()
        },
        $setOnInsert: { createdAt: new Date() }
      },
      { upsert: true }
    );

    inserted += result.upsertedCount ?? 0;
    updated += result.matchedCount ?? 0;
  }

  console.log(`Colleges seeded. Inserted: ${inserted}, Updated: ${updated}`);
}

run()
  .catch((err) => {
    console.error("Failed to seed colleges:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
