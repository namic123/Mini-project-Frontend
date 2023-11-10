import { Button, Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export function NavBar() {
  const navigate = useNavigate();

  return (
    <Flex>
      <Button onClick={() => navigate("/")}>홈</Button>
      <Button onClick={() => navigate("/write")}>글 쓰기</Button>
      <Button onClick={() => navigate("/signup")}>회원 가입</Button>
    </Flex>
  );
}
