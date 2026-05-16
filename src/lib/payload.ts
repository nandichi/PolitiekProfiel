import "server-only";

import { getPayload } from "payload";
import config from "@payload-config";

export async function payload() {
  return getPayload({ config });
}
