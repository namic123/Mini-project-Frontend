import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Spinner,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useImmer } from "use-immer";
import axios from "axios";

/* 게시글 수정 컴포넌트 */
export function BoardEdit() {
  /* board의 상태 */
  const [board, updateBoard] = useImmer(null);

  /* react-router-dom, 다른 페이지로 이동 시키는 훅 */
  const navigate = useNavigate();

  /* url에 지정된 매개변수의 값을 추출 */
  /* 예: http://localhost:3000/edit/13 -> 13을 추출 */
  /* path에는 edit/:id, 이와 같이 선언되어 있어야 한다. */
  const { id } = useParams();

  /* Chakra UI의 메서드 */
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  /* board 엔티티의 값 요청 */
  /* 수정할 글의 저장된 값을 불러오기 위함 */
  useEffect(() => {
    axios
      .get("/api/board/id/" + id)
      .then((response) => updateBoard(response.data));
  }, []);

  /* board가 비어있는 경우, 로딩 화면 */
  if (board === null) {
    return <Spinner />;
  }

  /* 제출 메서드 */
  function handleSubmit() {
    /* 게시글 수정 요청 */
    axios
      .put("/api/board/edit", board)
      /* 성공 값 */
      .then(() => {
        toast({
          description: "수정된 글이 저장되었습니다.",
          status: "success",
        });
        /* 성공한 경우, 홈 화면으로 이동 */
        navigate("/");
      })
      /* 실패 값 */
      .catch((error) => {
        if (error.response.status === 400) {
          toast({
            description: "클라이언트 오류가 발생했습니다.",
            status: error,
          });
        } else {
          toast({
            description: "서버 오류가 발생했습니다",
            status: "error",
          });
        }
      })
      /* 응답 완료 */
      .finally(() => {
        /* 모달창 닫기 */
        onClose();
      });
  }

  return (
    <Box>
      <h1>{id}번 글 수정</h1>
      {/* 제목 폼 */}
      <FormControl>
        <FormLabel>제목</FormLabel>
        <Input
          value={board.title}
          onChange={(e) =>
            updateBoard((draft) => {
              draft.title = e.target.value;
            })
          }
        />
      </FormControl>
      {/* 본문 폼 */}
      <FormControl>
        <FormLabel>본문</FormLabel>
        <Textarea
          value={board.content}
          onChange={(e) =>
            updateBoard((draft) => {
              draft.content = e.target.value;
            })
          }
        />
      </FormControl>
      {/* 작성자 폼 */}
      <FormControl>
        <FormLabel>작성자</FormLabel>
        <Input
          value={board.writer}
          onChange={(e) =>
            updateBoard((draft) => {
              draft.writer = e.target.value;
            })
          }
        />
      </FormControl>

      {/* 게시물 수정 모달창 팝업 버튼*/}
      <Button colorScheme={"blue"} onClick={onOpen}>
        저장
      </Button>
      {/* navigate(-1) : 이전 경로로 이동 */}
      <Button onClick={() => navigate(-1)}>취소</Button>

      {/* 수정 버튼 클릭 시 팝업 모달창 */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>게시글 수정</ModalHeader>
          <ModalCloseButton />
          <ModalBody>게시글을 수정하시겠습니까?</ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSubmit}>
              수정
            </Button>

            <Button colorScheme="red" mr={3} onClick={onClose}>
              닫기
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
