import { Button, Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export function NavBar() {
  /* 공통 UI - 네비게이션 바 */
  const navigate = useNavigate();
  return (
    <>
      <Flex>
        <Button onClick={() => navigate("/")}>home</Button>{" "}
        {/*메인 경로로 이동*/}
        <Button onClick={() => navigate("/write")}>write</Button>{" "}
        {/*게시물 작성으로 이동 */}
      </Flex>
    </>
  );
}
