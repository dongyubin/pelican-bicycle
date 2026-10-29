import fs from "node:fs";
import path from "node:path";

const data = JSON.parse(fs.readFileSync(path.join(import.meta.dirname, "models.json"), "utf8"));

export const runCount = data.models.length;

const EN_WORDS = [
  "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
  "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty",
];
const ZH_WORDS = [
  "零", "一", "两", "三", "四", "五", "六", "七", "八", "九", "十",
  "十一", "十二", "十三", "十四", "十五", "十六", "十七", "十八", "十九", "二十",
];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const numberWord = (lang, n = runCount) =>
  (lang === "zh" ? ZH_WORDS : EN_WORDS)[n] ?? String(n);

export const paddedCount = (n = runCount) => String(n).padStart(2, "0");

export const dateLabel = (iso, lang) => {
  if (lang === "zh") return iso;
  const [year, month, day] = iso.split("-");
  return `${Number(day)} ${MONTHS[Number(month) - 1]} ${year}`;
};

const dates = [...new Set(data.models.map((model) => model.testedAt || data.testedAt))].sort();

export const latestTestedAt = dates[dates.length - 1];

export const testedRange = (lang) => {
  if (dates.length === 1 || lang === "zh") {
    return dates.length === 1 ? dateLabel(dates[0], lang) : `${dates[0]} → ${dates[dates.length - 1]}`;
  }
  const [fy, fm, fd] = dates[0].split("-");
  const [ly, lm, ld] = dates[dates.length - 1].split("-");
  if (fy === ly && fm === lm) return `${Number(fd)}–${Number(ld)} ${MONTHS[Number(fm) - 1]} ${fy}`;
  return `${dateLabel(dates[0], lang)} – ${dateLabel(dates[dates.length - 1], lang)}`;
};
