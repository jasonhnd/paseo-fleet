// Development-only input for the committed Node client bundle. The plugin compiler
// consumes the generated server module without requiring the SDK in a Git checkout.
import { createPaseoClient as createSdkClient } from "@getpaseo/client";
import type { createPaseoClient as createBundledClient } from "../server/paseo-client.bundle.mjs";

// Type-check the handwritten production declaration against the pinned SDK.
export const createPaseoClient: typeof createBundledClient = createSdkClient;
