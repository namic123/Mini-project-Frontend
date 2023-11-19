import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Textarea,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { LoginContext } from "../../component/LogInProvider";
import { CommentContainer } from "../../component/CommentContainer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons/faThumbsUp";
import * as PropTypes from "prop-types";
import { faHeart } from "@fortawesome/free-solid-svg-icons/faHeart";

/* 좋아요 컨테이너 */
function LikeContainer({ like, onClick }) {
  /* 좋아요 정보를 불러올 때까지 로딩 */
  if (like === null) {
    return <Spinner />;
  }
  return (
    <>
      <Button variant={"ghost"} size={"xl"} onClick={onClick}>
        <FontAwesomeIcon icon={faHeart} size="xl" />
        {/* 좋아요를 누른 경우 */}
        {like.like && <Text>꽉찬 하트</Text>}
        {/* 좋아요를 누르지 않았거나, 비로그인인 경우 */}
        {like.like || <Text>빈 하트</Text>}
        <Text>{like.countLike}</Text>
      </Button>
    </>
  );
}

/* 게시글 보기 컴포넌트 */
export function BoardView() {
  /* 게시글 상태 */
  const [board, setBoard] = useState(null);
  /* 좋아요 상태 */
  const [like, setLike] = useState(null);

  /* 모달 창 사용을 위한 함수 */
  const { isOpen, onOpen, onClose } = useDisclosure();

  /* url에 지정된 매개변수의 값을 추출 */
  /* 예: http://localhost:3000/board/id" id -> 13을 추출 */
  /* path에는 board/:id 이와 같이 선언되어 있어야 한다. */
  const { id } = useParams();

  /* 권한 여부 확인 메서드, prop drilling */
  const { hasAccess, isAdmin } = useContext(LoginContext);

  /* Chakra UI */
  let toast = useToast();
  let navigate = useNavigate();

  /* 게시물 관련 기능 */

  /* 해당 board의 내용을 불러오는 요청  */
  useEffect(() => {
    axios
      .get("/api/board/id/" + id)
      /* 요청 성공 */
      .then((response) => setBoard(response.data));
  }, []);
  /* 해당 board가 가진 좋아요 총 개수 요청 */
  useEffect(() => {
    axios
      .get("/api/like/board/" + id)
      .then((response) => setLike(response.data));
  }, []);

  /* 게시물을 가지고 오지 못한 경우, 로딩 */
  if (board === null) {
    return <Spinner />;
  }

  /* 게시글 삭제 요청 메서드 */
  function handleDelete() {
    axios
      .delete("/api/board/remove/" + id)
      .then((response) => {
        toast({
          // 성공한 경우
          description: id + "번 게시물이 삭제되었습니다.",
          status: "success",
        });
        navigate("/"); // 경로 이동 - 메인 페이지
      })
      .catch((error) => {
        // 오류가 발생한 경우
        toast({
          description: "삭제 중 문제가 발생하였습니다.",
          status: "error",
        });
      })
      .finally(() => onClose()); // 최종적으로 모달 창 닫기
  }

  /* 좋아요 등록 요청 */
  function handleLike() {
    axios
      .post("/api/like", { boardId: board.id })
      .then((response) => setLike(response.data))
      .catch(() => console.log("bad"))
      .finally(() => console.log("done"));
  }

  return (
    <>
      <Box>
        <Flex justifyContent={"space-between"}>
          <Heading size={"xl"}>{board.id}글 보기</Heading>
          <LikeContainer like={like} onClick={handleLike} />
        </Flex>
        <FormControl>
          <FormLabel>제목</FormLabel>
          {/* 수정 불가하도록 읽기 전용 */}
          <Input value={board.title} readOnly />
        </FormControl>

        <FormControl>
          <FormLabel>본문</FormLabel>
          <Textarea value={board.content} readOnly></Textarea>
        </FormControl>
        <FormControl>
          <FormLabel>작성자</FormLabel>
          <Input value={board.nickName} readOnly />
        </FormControl>
        <FormControl>
          <FormLabel>작성일시</FormLabel>
          <Input value={board.inserted} readOnly />
        </FormControl>

        {/* board.writer와 로그인 id와 동일할 경우에만 출력 */}
        {(hasAccess(board.writer) || isAdmin()) && (
          <Box>
            <Button
              colorScheme={"blue"}
              onClick={() => navigate("/edit/" + id)}
            >
              수정
            </Button>
            <Button colorScheme={"red"} onClick={onOpen}>
              삭제
            </Button>
          </Box>
        )}
        {/* 삭제 모달 - Chackra UI */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>삭제 확인</ModalHeader>
            <ModalCloseButton></ModalCloseButton>
            <ModalBody>삭제 하시겠습니까?</ModalBody>
            <ModalFooter>
              <Button onClick={onClose}>닫기</Button>
              <Button onClick={handleDelete} colorScheme="red">
                삭제하기
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        {/* 댓글 */}
        <CommentContainer boardId={id} />
      </Box>
    </>
  );
}
