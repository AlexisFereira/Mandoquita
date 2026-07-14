import { randomBytes } from "node:crypto";

async function main() {
  console.log(`PRODUCT_ADMIN_SESSION_SECRET=${randomBytes(48).toString("base64url")}`);
  console.log(`PRODUCT_ADMIN_PASSWORD_PEPPER=${randomBytes(48).toString("base64url")}`);
  console.log(`PRODUCT_ADMIN_EDGE_SECRET=${randomBytes(48).toString("base64url")}`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
