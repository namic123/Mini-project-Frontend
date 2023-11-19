import React, { useEffect, useState } from "react";
import {
  Badge,
  Box,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ChatIcon } from "@chakra-ui/icons";
import { faHeart as fullHeart } from "@fortawesome/free-solid-svg-icons/faHeart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/* 게시판 리스트 컴포넌트 */
export function BoardList() {
  /* 게시글 리스트의 상태 */
  const [boardList, setBoardList] = useState(null);

  /* Chakra UI */
  const navigate = useNavigate();

  /* 게시글 리스트 요청 */
  useEffect(() => {
    axios
      .get("/api/board/list")
      .then((response) => setBoardList(response.data)); // 리스트 상태 업데이트
  }, []);

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
    </Box>
  );
}
