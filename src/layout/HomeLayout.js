import React from "react";
import { NavBar } from "../component/NavBar";
import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";

export function HomeLayout() {
  return (
    <>
      <Box mx={{ base: 0, md: 20, lg: 40 }}>
        <NavBar /> {/* 네비게이션 바 - 공통 UI */}
        <Outlet /> {/* 하위 라우터의 컴포넌트 */}
      </Box>
    </>
  );
}
