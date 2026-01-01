import { v4 as uuidv4 } from "uuid";

const DEVICE_KEY = "runtime_ctx";

export function getDeviceId() {
  let deviceId = localStorage.getItem(DEVICE_KEY);

  if (!deviceId) {
    deviceId = uuidv4();
    localStorage.setItem(DEVICE_KEY, deviceId);
  }

  return deviceId;
}