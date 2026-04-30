import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import tw from "./tw";
import en from "./en";
import cn from "./cn";
import th from "./th";

const resources = {
    tw: { translation: tw },
    en: { translation: en },
    cn: { translation: cn },
    th: { translation: th },
};

i18n.use(initReactI18next).init({
    resources,
    lng: localStorage.getItem("lang") || "tw",
    fallbackLng: "tw",
    interpolation: {
        escapeValue: false,
    },
    react: {
        useSuspense: false,
    },
});

export default i18n;
