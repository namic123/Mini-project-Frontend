import React, { useEffect, useState } from "react";
import {
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
              <Th>id</Th>
              <Th>title</Th>
              <Th>by</Th>
              <Th>at</Th>
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
                onClick={() => navigate("/board/" + board.id)} // 게시글 선택 시 해당 글의 VIEW로 이동
              >
                <Td>{board.id}</Td>
                <Td>{board.title}</Td>
                <Td>{board.writer}</Td>
                <Td>{board.inserted}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
}
