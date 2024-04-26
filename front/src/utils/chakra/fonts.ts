import { Rubik } from "next/font/google";

/*TODO
- 시스템 폰트 고려하기
  https://www.peterkimzz.com/how-to-pick-web-font-and-size/
*/
const rubik = Rubik({
  subsets: ["latin"],
  variable: "--font-rubik",
  weight: "800",
});

export const fonts = {
  rubik,
};

export const basicFontSize = {
  sm: "1rem",
  md: "1.25rem",
  lg: "1.5rem",
  xl: "1.75rem",
  "2xl": "2rem",
};

export const mdFontSize = {
  sm: "0.75rem",
  md: "0.875rem",
  lg: "1rem",
  xl: "1.25rem",
  "2xl": "1.5rem",
};
