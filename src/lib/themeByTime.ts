export type AppTheme = "light" | "dark";
export type ThemeMode = "auto" | "light" | "dark";

export const DEFAULT_THEME_MODE: ThemeMode = "auto";

export function getThemeByTime(date = new Date()): AppTheme {
  const hour = Number(new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Jakarta",
    hour: "2-digit",
    hourCycle: "h23",
  }).format(date));
  return hour >= 7 && hour < 18 ? "light" : "dark";
}

export const themeInitializationScript = `(()=>{try{const h=Number(new Intl.DateTimeFormat("en-US",{timeZone:"Asia/Jakarta",hour:"2-digit",hourCycle:"h23"}).format(new Date()));const t=h>=7&&h<18?"light":"dark";document.documentElement.classList.remove("light","dark");document.documentElement.classList.add(t);document.documentElement.style.colorScheme=t}catch{document.documentElement.classList.add("light")}})()`;
