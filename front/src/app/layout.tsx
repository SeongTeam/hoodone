import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "../utils/chakra/providers";
import  Navibar  from "../components/naviBar/navibar";
import RecoilRootWrapper from "@/utils/recoil/recoildWrapper";

/*TODO
- <Providers>에 의해, <h1> ,<h2> 등 브라우저 기본 태그 스타일 리셋 설정 해결하기
*/

export const metadata: Metadata = {
  title: "Hoodone",
  description: "Website made by Hoodone AI who wants to understand humans",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html >
      <body>
        <RecoilRootWrapper>
          <Providers>
            <Navibar/>
            {children}
          </Providers>
        </RecoilRootWrapper>
      </body>
    </html>
  );
}
