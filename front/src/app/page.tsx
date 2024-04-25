"use client";

import Link from "next/link";
import { Box, Input } from "@chakra-ui/react";
import { useState } from "react";
/* TODO
- style 적용 불가 원인 분석 및 해결
- Home page 디자인
  - NaviBar 디자인
  - Auth 로직 구현  
*/
export default function Home() {
  const [ value, setValue ] = useState("");
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  }
  return (
    <>
      <main>
        <Box bg="bg.200">
          <h1>Title</h1>
          <p><Link href={"/hello"}>Hello</Link></p>
        </Box>
        <Box w="50%" m ="10px">
        </Box>

      </main>
    </>
  );
}
