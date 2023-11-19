import React, { useEffect, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChatIcon } from "@chakra-ui/icons";
import { faHeart as fullHeart } from "@fortawesome/free-solid-svg-icons/faHeart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/* 게시판 리스트 컴포넌트 */
export function BoardList() {
  /* 게시글 리스트의 상태 */
  const [boardList, setBoardList] = useState(null);
  const [pageInfo, setPageInfo] = useState(null);

  /* 페이징 처리, page 쿼리 스트링을 받기 위함 */
  const [params] = useSearchParams();
  /* Chakra UI */
  const navigate = useNavigate();

  /* 게시글 리스트 요청 */
  useEffect(() => {
    axios.get("/api/board/list?" + params).then((response) => {
      // 현재 페이지의 게시글 10개를 저장
      setBoardList(response.data.boardList);
      // 페이지 그룹에 대한 정보를 저장, 예: 11~20
      setPageInfo(response.data.pageInfo);
    }); // 리스트 상태 업데이트
  }, [params]); /* 페이지 이동 시 상태 변화 감지를 위해 params를 넣어준다. */

  /* 게시글 리스트 값이 비어있는 경우 로딩 화면 */
  if (boardList === null) {
    return <Spinner />;
  }
  return (
    <Box>
      <h1>게시물 목록</h1>
      <Box>
        <Table>
          <Thead>
            <Tr>
              <Th>아이디</Th>
              <Th>제목</Th>
              <Th>작성자</Th>
              <Th>생성날짜</Th>
              <Th>댓글 개수</Th>
              <Th>좋아요 개수</Th>
            </Tr>
          </Thead>
          <Tbody>
            {/* 게시글 리스트 출력 */}
            {boardList.map((board) => (
              <Tr
                _hover={{
                  cursor: "pointer",
                }}
                key={board.id}
                onClick={() => navigate("/board/" + board.id)}
              >
                <Td>{board.id}</Td>
                <Td>{board.title}</Td>
                <Td>{board.nickName}</Td>
                <Td>{board.ago}</Td>
                <Td>
                  {board.commentNum > 0 && (
                    <Badge>
                      <ChatIcon /> {board.commentNum}
                    </Badge>
                  )}
                </Td>
                <Td>
                  {board.countLike > 0 && (
                    <Badge>
                      {board.countLike}
                      <FontAwesomeIcon icon={fullHeart} size="sm" />{" "}
                    </Badge>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      <Box>
        <Button onClick={() => navigate("/?pg=1")}>1</Button>
        <Button onClick={() => navigate("/?pg=2")}>2</Button>
        <Button onClick={() => navigate("/?pg=3")}>3</Button>
        <Button onClick={() => navigate("/?pg=4")}>4</Button>
        <Button onClick={() => navigate("/?pg=5")}>5</Button>
        <Button onClick={() => navigate("/?pg=6")}>6</Button>
        <Button onClick={() => navigate("/?pg=7")}>7</Button>
        <Button onClick={() => navigate("/?pg=8")}>8</Button>
        <Button onClick={() => navigate("/?pg=9")}>9</Button>
        <Button onClick={() => navigate("/?pg=10")}>10</Button>
      </Box>
    </Box>
  );
}
