import React from "react";
import { NavBar } from "../component/NavBar";
import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";

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
