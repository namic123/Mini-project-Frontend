import React from "react";
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
import LogInProvider from "./component/LogInProvider";

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

function App(props) {
  return (
    <LogInProvider>
      <RouterProvider router={routes} />
    </LogInProvider>
  );
}

export default App;
