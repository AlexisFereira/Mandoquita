import { randomBytes, randomInt } from "node:crypto";

import { hashProductAdminCode } from "../src/server/productAdminSecurity";

const prohibited = new Set([
  "000000", "111111", "222222", "333333", "444444", "555555", "666666", "777777", "888888", "999999",
  "012345", "123456", "234567", "345678", "456789", "987654", "876543", "765432", "654321", "543210",
]);

function generateCode() {
  while (true) {
    const code = String(randomInt(0, 1_000_000)).padStart(6, "0");
    if (!prohibited.has(code) && new Set(code).size >= 4) return code;
  }
}

async function main() {
  const code = generateCode();
  const hash = await hashProductAdminCode(code);
  console.log("Store the code with the Business Representative; it will not be recoverable from the hash.");
  console.log(`PRODUCT_ADMIN_CODE=${code}`);
  console.log(`PRODUCT_ADMIN_CODE_HASH=${hash}`);
  console.log(`PRODUCT_ADMIN_SESSION_SECRET=${randomBytes(48).toString("base64url")}`);
  console.log(`PRODUCT_ADMIN_EDGE_SECRET=${randomBytes(48).toString("base64url")}`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
