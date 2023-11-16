import { Button, Flex, useToast } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useContext, useEffect } from "react";
import { LoginContext } from "./LogInProvider";

/* 공통 UI - 네비게이션 바 */
export function NavBar() {
  const { fetchLogin, login, isAuthenticated, isAdmin } =
    useContext(LoginContext);
  const toast = useToast();
  const navigate = useNavigate();

  const urlParams = new URLSearchParams();

  const location = useLocation();

  useEffect(() => {
    fetchLogin();
  }, [location]);

  if (login !== "") {
    urlParams.set("id", login.id);
  }
  function handleLogout() {
    // TODO: 로그아웃 후 할 일 추가
    axios.post("/api/member/logout").then(() => {
      toast({
        description: "로그아웃 되었습니다.",
        status: "info",
      });
      navigate("/");
    });
  }

  return (
    <Flex>
      {/* 로그인 상태에 따른 버튼 출력 */}
      {/* 로그인 상태 isAuthenticated() && */}
      {/* 비로그인 상태 isAuthenticated() || */}
      <Button onClick={() => navigate("/")}>홈</Button>

      {/* 글 쓰기 */}
      {isAuthenticated() && (
        <Button onClick={() => navigate("/write")}>글 쓰기</Button>
      )}
      {/* 회원 가입 */}
      {isAuthenticated() || (
        <Button onClick={() => navigate("/signup")}>회원 가입</Button>
      )}
      {/* 관리자 권한이 있을 경우 */}
      {isAdmin() && (
        <Button onClick={() => navigate("/member/list")}>회원 목록</Button>
      )}
      {/* 로그인 계정의 회원 정보 경로 */}
      {isAuthenticated() && (
        <Button onClick={() => navigate("/member?" + urlParams.toString())}>
          회원 정보
        </Button>
      )}
      {/* 로그인 */}
      {isAuthenticated() || (
        <Button onClick={() => navigate("/login")}>로그인</Button>
      )}
      {/* 로그아웃 */}
      {isAuthenticated() && <Button onClick={handleLogout}>로그아웃</Button>}
    </Flex>
  );
}
