import * as ngrok from "ngrok";

export const startNgrok = async () => {
  if (process.env.USE_NGROK !== "true") return;

  try {
    const url = await ngrok.connect({
      addr: Number(process.env.PORT) || 9999,
      authtoken: process.env.NGROK_AUTH_TOKEN,
    });

    console.log("Ngrok public URL:", url);
  } catch (err: any) {
    console.error("Lỗi khởi động ngrok:", err);
  }
};
