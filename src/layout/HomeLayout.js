import React from "react";
import { NavBar } from "./NavBar";

export function HomeLayout() {
  return (
    <>
      <Box>
        <NavBar />
        <Outlet /> {/* 하위 라우터의 컴포넌트 */}
      </Box>
    </>
  );
}
