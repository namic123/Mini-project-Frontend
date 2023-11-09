import React, { useEffect, useState } from "react";
import { Box, Spinner, Table, Td, Th, Thead, Tr } from "@chakra-ui/react";
import axios from "axios";

export function BoardList() {
  /* 게시판 리스트 컴포넌트 - 메인 경로 */
  const [boardList, setBoardList] = useState(null); // 게시판 글 리스트 상태

  // 리스트 요청 코드
  useEffect(() => {
    axios.get("api/board/list").then((response) => setBoardList(response.data));
  }, []);
  return (
    <>
      <Box>
        <h1>게시판 목록</h1>
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
          </Table>
          {boardList || <Spinner />}
          {boardList &&
            boardList.map((board) => {
              <Tr>
                <Td>{board.id}</Td>
                <Td>{board.title}</Td>
                <Td>{board.writer}</Td>
                <Td>{board.inserted}</Td>
              </Tr>;
            })}
        </Box>
      </Box>
    </>
  );
}
