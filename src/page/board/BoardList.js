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
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { ChatIcon } from "@chakra-ui/icons";
import { faHeart as fullHeart } from "@fortawesome/free-solid-svg-icons/faHeart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";

/* 페이징을 위한 컴포넌트 */
function Pagination({ pageInfo }) {
  /* 페이지 그룹에 속한 페이지 번호를 배열에 담는다 */
  const pageNumbers = [];
  const navigate = useNavigate();
  // 예시: startPageNumber = 11, endPageNumber = 20
  // 11~20 사이 정수값이 배열에 저장
  for (let i = pageInfo.startPageNumber; i <= pageInfo.endPageNumber; i++) {
    pageNumbers.push(i);
  }

  return (
    <>
      <Box>
        {/* 이전 페이지 그룹이 있을 때만 출력 */}
        {pageInfo.prevPageNumber && (
          <Button
            variant="ghost"
            onClick={() => navigate("/?pg=" + pageInfo.prevPageNumber)}
          >
            <FontAwesomeIcon icon={faAngleLeft} />
          </Button>
        )}

        {/* 위 pageNumbers 배열에 저장된 번호를 map을 이용해 각각 UI를 그려주고 navigate 값을 설정한다. */}
        {pageNumbers.map((pageNumber) => (
          <Button
            key={pageNumber}
            // 현재페이지와 pageNumber요소가 일치할 경우 색 변경
            variant={
              pageNumber === pageInfo.currentPageNumber ? "solid" : "ghost"
            }
            onClick={() => navigate("/?pg=" + pageNumber)}
          >
            {pageNumber}
          </Button>
        ))}
        {/* 이후 페이지 그룹이 있을 때만 출력 */}
        {pageInfo.nextPageNumber && (
          <Button
            variant="ghost"
            onClick={() => navigate("/?pg=" + pageInfo.nextPageNumber)}
          >
            <FontAwesomeIcon icon={faAngleRight} />
          </Button>
        )}
      </Box>
    </>
  );
}

/* 게시판 리스트 컴포넌트 */
export function BoardList() {
  /* 게시글 리스트의 상태 */
  const [boardList, setBoardList] = useState(null);
  const [pageInfo, setPageInfo] = useState(null);

  /* 페이징 처리, page 쿼리 스트링을 받기 위함 */
  const [params] = useSearchParams();
  /* Chakra UI */
  const navigate = useNavigate();
  const location = useLocation();

  /* 게시글 리스트 요청 */
  useEffect(() => {
    axios.get("/api/board/list?" + params).then((response) => {
      // 현재 페이지의 게시글 10개를 저장
      setBoardList(response.data.boardList);
      // 페이지 그룹에 대한 정보를 저장, 예: 11~20
      setPageInfo(response.data.pageInfo);
    }); // 리스트 상태 업데이트
  }, [
    location,
  ]); /* 페이지가 이동할 때, 즉 경로가 이동될 때 dependency를 location으로 설정하는 것이 권장된다. */

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
      {/* 페이징을 위한 컴포넌트 */}
      <Pagination pageInfo={pageInfo} />
    </Box>
  );
}
