import React, { createContext, useEffect, useState } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { BoardWrite } from "./page/board/BoardWrite";
import { BoardList } from "./page/board/BoardList";
import { HomeLayout } from "./layout/HomeLayout";
import { BoardView } from "./page/board/BoardView";
import { BoardEdit } from "./page/board/BoardEdit";
import { MemberSignup } from "./page/member/MemberSignup";
import { MemberList } from "./page/member/MemberList";
import { MemberView } from "./page/member/MemberView";
import { MemberEdit } from "./page/member/MemberEdit";
import { MemberLogin } from "./page/member/MemberLogin";
import axios from "axios";

const routes = createBrowserRouter(
  createRoutesFromElements(
    /* 공통 UI */
    <Route path="/" element={<HomeLayout />}>
      {/* 게시판 라우터 */}
      {/* 게시판 목록 */}
      <Route index element={<BoardList />} />
      {/* 게시글 작성 컴포넌트 */}
      <Route path="write" element={<BoardWrite />} />{" "}
      {/* 게시글 보기 컴포넌트 */}
      <Route path="board/:id" element={<BoardView />} />
      {/* 게시글 수정 컴포넌트 */}
      <Route path="edit/:id" element={<BoardEdit />}></Route>{" "}
      {/* 회원관리 라우터 */}
      {/* 회원 가입 컴포넌트 */}
      <Route path="signup" element={<MemberSignup />} />{" "}
      {/* 회원 목록 컴포넌트 */}
      <Route path="member/list" element={<MemberList />} />{" "}
      {/* 회원 보기 컴포넌트 */}
      <Route path="member" element={<MemberView />} />
      {/* 회원 수정 컴포넌트 */}
      <Route path="member/edit" element={<MemberEdit />} />
      {/* 로그인 컴포넌트 */}
      <Route path="login" element={<MemberLogin />}></Route>
    </Route>,
  ),
);

export const LoginContext = createContext(null);

function App(props) {
  const [login, setLogin] = useState("");

  useEffect(() => {
    fetchLogin();
  }, []);

  /* 로그인된 정보를 전역에서 사용하기 위한 메서드 */
  function fetchLogin() {
    axios.get("/api/member/login").then((response) => setLogin(response.data));
  }

  console.log(login);

  /* 로그인 여부 확인 메서드 */
  function isAuthenticated() {
    return login !== "";
  }

  /* 관리자 권한 검증 여부 */
  function isAdmin() {
    /* login.auth는 객체이지만, 조건에 사용하면 null 여부를 확인 */
    if (login.auth) {
      /* 로그인 속성 auth 객체에 name property 값이 admin인지 확인 */
      return login.auth.some((elem) => elem.name === "admin");
    }
    return false;
  }

  /* 권한 확인 메서드 */
  function hasAccess(userId) {
    return login.id === userId;
  }
  return (
    /* 하위 컴포넌트 props drilling을 위한 Context */
    <LoginContext.Provider
      value={{ login, fetchLogin, isAuthenticated, hasAccess, isAdmin }}
    >
      <RouterProvider router={routes} />;
    </LoginContext.Provider>
  );
}

export default App;
