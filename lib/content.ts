// All site copy lives here. Edit freely. `content` is the same in every language, `copy` is per language (lib/i18n.ts).
import { href, polishYears, type Lang } from "./i18n";

const YEARS = new Date().getFullYear() - 2021; // first dev job

export const isModel = (shape: string) => /\.gltf?$|\.glb$/.test(shape);

export const content = {
  name: "Maciej Koch",
  role: "Software Engineer",
  years: YEARS, // also the level shown by the hidden XP bar in Exp
  title: "Maciej Koch · Software Engineer",
  links: [
    { label: "GitHub", url: "https://github.com/maciej-koch" },
    { label: "LinkedIn", url: "https://www.linkedin.com/in/maciej-koch/" },
    { label: "Email", url: "mailto:maciej.k00h@gmail.com" },
    { label: "CV", url: "/cv.pdf" },
  ],
  sections: [
    { id: "me", label: "Me", shape: "/models/me.glb" },
    { id: "exp", label: "Exp", shape: "potion" },
    { id: "stack", label: "Stack", shape: "stack" },
  ],
  stack: [
    "Next.js",
    "React",
    "TypeScript",
    "MUI",
    "Tailwind",
    "Node.js",
    "Express",
    "Python",
    "SQL",
    "three.js",
    "React Three Fiber",
    "Git",
    "Figma",
  ],
};

const studio = (lang: Lang) => ({
  role: "Founder",
  org: "koch&code",
  url: href(lang, "/kochandcode"),
  period: "",
});

export const copy = {
  en: {
    lang: "en" as Lang,
    description:
      "Maciej Koch, software engineer based near Cieszyn, Poland, building web applications with Next.js, React, TypeScript and Node.js.",
    intro: `Software engineer with ${YEARS}+ years of experience building web applications. Based near Cieszyn, Poland.`,
    introLink: {
      word: "Cieszyn",
      url: "https://en.wikipedia.org/wiki/Cieszyn",
    },
    about:
      "I like solving problems and turning messy ones into simple, maintainable software. Off the keyboard: runner and LOTR fan.",
    aboutTip: { word: "fan", tip: "speak, friend, and enter" },
    workTitle: "Work",
    educationTitle: "Education",
    work: [
      {
        role: "Fullstack Developer",
        org: "Software Mind",
        url: "https://softwaremind.com/",
        period: "2022 – now",
      },

      {
        role: "Frontend Developer",
        org: "Ultimate Systems",
        url: "",
        period: "2021",
      },
      studio("en"),
    ],
    education: [
      {
        role: "CS, MSc",
        org: "University of Silesia",
        url: "https://us.edu.pl/",
        period: "2022 – 2023",
      },
      {
        role: "CS, BSc (Eng.)",
        org: "AGH University",
        url: "https://www.agh.edu.pl/",
        period: "2018 – 2022",
      },
    ],
    other: { label: "PL", name: "Polski", url: "/pl" }, // the language switch
  },
  pl: {
    lang: "pl" as Lang,
    description:
      "Maciej Koch, programista spod Cieszyna, tworzy aplikacje webowe w Next.js, React, TypeScript i Node.js.",
    intro: `Programista z ${YEARS}+ ${polishYears(YEARS)} doświadczenia w tworzeniu aplikacji webowych. Mieszkam pod Cieszynem.`,
    introLink: {
      word: "Cieszynem",
      url: "https://pl.wikipedia.org/wiki/Cieszyn",
    },
    about:
      "Lubię rozwiązywać problemy i zamieniać zagmatwane w proste, łatwe w utrzymaniu oprogramowanie. Poza klawiaturą: biegacz i fan LOTR.",
    aboutTip: { word: "fan", tip: "powiedz, przyjacielu, i wejdź" },
    workTitle: "Praca",
    educationTitle: "Edukacja",
    work: [
      {
        role: "Fullstack Developer",
        org: "Software Mind",
        url: "https://softwaremind.com/",
        period: "2022 – obecnie",
      },

      {
        role: "Frontend Developer",
        org: "Ultimate Systems",
        url: "",
        period: "2021",
      },
      studio("pl"),
    ],
    education: [
      {
        role: "Informatyka, mgr",
        org: "Uniwersytet Śląski",
        url: "https://us.edu.pl/",
        period: "2022 – 2023",
      },
      {
        role: "Informatyka, inż.",
        org: "AGH",
        url: "https://www.agh.edu.pl/",
        period: "2018 – 2022",
      },
    ],
    other: { label: "EN", name: "English", url: "/" },
  },
};
export type Copy = (typeof copy)["en"];
