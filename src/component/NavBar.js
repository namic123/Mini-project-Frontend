import { Button, Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

/* 공통 UI - 네비게이션 바 */
export function NavBar() {
  const navigate = useNavigate();

  function handleLogout() {
    // TODO: 로그아웃 후 할 일 추가
    axios.post("/api/member/logout").then(() => console.log("로그아웃 성공"));
  }

  return (
    <Flex>
      <Button onClick={() => navigate("/")}>홈</Button>
      <Button onClick={() => navigate("/write")}>글 쓰기</Button>
      <Button onClick={() => navigate("/signup")}>회원 가입</Button>
      <Button onClick={() => navigate("/member/list")}>회원 목록</Button>
      <Button onClick={() => navigate("/login")}>로그인</Button>
      <Button onClick={handleLogout}>로그아웃</Button>
    </Flex>
  );
}
