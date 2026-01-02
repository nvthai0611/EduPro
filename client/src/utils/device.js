import { v4 as uuidv4 } from "uuid";
import CryptoJS from "crypto-js";

const REGISTRY_KEY = "frame_registry";
const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY;

/* ---------- crypto ---------- */

const encrypt = (obj) => {
  const text = JSON.stringify(obj);
  return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
};

const decrypt = (cipher) => {
  try {
    const bytes = CryptoJS.AES.decrypt(cipher, ENCRYPTION_KEY);
    const text = bytes.toString(CryptoJS.enc.Utf8);
    return text ? JSON.parse(text) : null;
  } catch {
    return null;
  }
};

/* ---------- config ---------- */

const prefixes = [
  "layout_snapshot",
  "render_state",
  "surface_ctx",
  "view_state",
  "frame_ctx"
];

/* ---------- utils ---------- */

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const randomKeyName = () =>
  prefixes[randomInt(0, prefixes.length - 1)];

/* ---------- main ---------- */

export function getDeviceId() {
  let registryRaw = localStorage.getItem(REGISTRY_KEY);
  let registry = registryRaw ? decrypt(registryRaw) : null;

  if (!registry || !registry.device) {
    registry = {
      device: randomKeyName(),
      ts: Date.now()
    };
    localStorage.setItem(REGISTRY_KEY, encrypt(registry));
  }

  let deviceId = localStorage.getItem(registry.device);

  if (!deviceId) {
    deviceId = encrypt(uuidv4());
    localStorage.setItem(registry.device, deviceId);
  }

  /* ---- noise keys ---- */
  const mainPrefix = registry.device;

  for (let i = 0; i < prefixes.length; i++) {
    if (i !== prefixes.indexOf(mainPrefix)) {
      const otherKey = prefixes[i];
      localStorage.setItem(otherKey, encrypt(uuidv4()));
    }
  }

  return decrypt(deviceId);
}