import { Button, Flex, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useContext } from "react";
import { LoginContext } from "./LogInProvider";

/* 공통 UI - 네비게이션 바 */
export function NavBar() {
  const { fetchLogin, login, isAuthenticated, isAdmin } =
    useContext(LoginContext);
  const toast = useToast();
  const navigate = useNavigate();

  function handleLogout() {
    // TODO: 로그아웃 후 할 일 추가
    axios
      .post("/api/member/logout")
      .then(() => {
        toast({
          description: "로그아웃 되었습니다.",
          status: "info",
        });
        navigate("/");
      })
      .finally(() => fetchLogin());
  }

  return (
    <Flex>
      {/* 로그인 상태에 따른 버튼 출력 */}
      {/* 로그인 상태 isAuthenticated() && */}
      {/* 비로그인 상태 isAuthenticated() || */}
      <Button onClick={() => navigate("/")}>홈</Button>
      {isAuthenticated() && (
        <Button onClick={() => navigate("/write")}>글 쓰기</Button>
      )}
      {isAuthenticated() || (
        <Button onClick={() => navigate("/signup")}>회원 가입</Button>
      )}
      {/* 관리자 권한이 있을 경우 */}
      {isAdmin() && (
        <Button onClick={() => navigate("/member/list")}>회원 목록</Button>
      )}
      {isAuthenticated() || (
        <Button onClick={() => navigate("/login")}>로그인</Button>
      )}
      {isAuthenticated() && <Button onClick={handleLogout}>로그아웃</Button>}
    </Flex>
  );
}
