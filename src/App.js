import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { BoardWrite } from "./page/BoardWrite";
import { BoardList } from "./page/BoardList";
import { HomeLayout } from "./layout/HomeLayout";
import { BoardView } from "./page/BoardView";
import { BoardEdit } from "./page/BoardEdit";

const routes = createBrowserRouter(
  createRoutesFromElements(
    /* 공통 UI */
    <Route path="/" element={<HomeLayout />}>
      <Route index element={<BoardList />} /> {/* 게시판 목록 */}
      <Route path="write" element={<BoardWrite />} /> {/* 글 작성 컴포넌트 */}
      {/* 글 보기 컴포넌트 */}
      <Route path="board/:id" element={<BoardView />} />{" "}
      <Route path="edit/:id" element={<BoardEdit />}></Route>
    </Route>,
  ),
);

function App(props) {
  return <RouterProvider router={routes} />;
}

export default App;
