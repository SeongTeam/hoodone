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
