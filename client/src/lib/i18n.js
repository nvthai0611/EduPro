import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  vi: {
    translation: {
      home: "Trang chủ",
      about: "Về SpaConnect",
      // shop: "SpaConnect Shop",
      search: "Tìm cơ sở gần anh",
      franchise: "Nhượng quyền",
      partners: "Đối tác",
      smile: "Nụ cười DV",
      login: "Đăng nhập",
      language: "Ngôn ngữ",
    },
  },
  en: {
    translation: {
      home: "Home",
      about: "About SpaConnect",
      // shop: "SpaConnect Shop",
      search: "Find nearest SpaConnect",
      franchise: "Franchise",
      partners: "Partners",
      smile: "Wedding Smile",
      login: "Login with Google",
      language: "Language",
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "vi",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
