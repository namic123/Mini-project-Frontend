import { Button, Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

/* 공통 UI - 네비게이션 바 */
export function NavBar() {
  const navigate = useNavigate();

  return (
    <Flex>
      <Button onClick={() => navigate("/")}>홈</Button>
      <Button onClick={() => navigate("/write")}>글 쓰기</Button>
      <Button onClick={() => navigate("/signup")}>회원 가입</Button>
      <Button onClick={() => navigate("/member/list")}>회원 목록</Button>
    </Flex>
  );
}
