import { Button, Flex, useToast } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useContext, useEffect } from "react";
import { LoginContext } from "./LogInProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faPen } from "@fortawesome/free-solid-svg-icons";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons/faUserPlus";
import { faRightToBracket } from "@fortawesome/free-solid-svg-icons/faRightToBracket";
import { faUser } from "@fortawesome/free-solid-svg-icons/faUser";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons/faCircleUser";
import { faUsers } from "@fortawesome/free-solid-svg-icons/faUsers";

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
      <Button
        leftIcon={<FontAwesomeIcon icon={faHouse} />}
        onClick={() => navigate("/")}
      ></Button>

      {/* 글 쓰기 */}
      {isAuthenticated() && (
        <Button
          leftIcon={<FontAwesomeIcon icon={faPen} />}
          onClick={() => navigate("/write")}
        >
          작성
        </Button>
      )}
      {/* 회원 가입 */}
      {isAuthenticated() || (
        <Button
          leftIcon={<FontAwesomeIcon icon={faUserPlus} />}
          onClick={() => navigate("/signup")}
        >
          회원가입
        </Button>
      )}
      {/* 관리자 권한이 있을 경우 */}
      {isAdmin() && (
        <Button
          leftIcon={<FontAwesomeIcon icon={faUsers} />}
          onClick={() => navigate("/member/list")}
        >
          회원목록
        </Button>
      )}
      {/* 로그인 계정의 회원 정보 경로 */}
      {isAuthenticated() && (
        <Button
          leftIcon={<FontAwesomeIcon icon={faCircleUser} />}
          onClick={() => navigate("/member?" + urlParams.toString())}
        >
          {login.nickName}
        </Button>
      )}
      {/* 로그인 */}
      {isAuthenticated() || (
        <Button
          leftIcon={<FontAwesomeIcon icon={faUser} />}
          onClick={() => navigate("/login")}
        >
          로그인
        </Button>
      )}
      {/* 로그아웃 */}
      {isAuthenticated() && (
        <Button
          leftIcon={<FontAwesomeIcon icon={faRightToBracket} />}
          onClick={handleLogout}
        >
          로그아웃
        </Button>
      )}
    </Flex>
  );
}
