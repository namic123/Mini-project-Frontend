import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
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
  useDisclosure,
  useToast,
} from "@chakra-ui/react";

export function BoardView() {
  const [board, setBoard] = useState(null); // board 상태 관리

  const { isOpen, onOpen, onClose } = useDisclosure(); // 모달 사용 함수

  const { id } = useParams();
  let toast = useToast();
  let navigate = useNavigate();

  // Board id로 해당 레코드 요청
  useEffect(() => {
    axios
      .get("/api/board/id/" + id)
      .then((response) => setBoard(response.data)); // Board의 상태 업데이트
  }, []);

  // 게시물을 가지고 오지 못한 경우, 로딩
  if (board === null) {
    return <Spinner />;
  }

  // 삭제 요청 메서드
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

  return (
    <>
      <Box>
        <h1>글 보기</h1>
        <FormControl>
          <FormLabel>제목</FormLabel>
          <Input value={board.title} readOnly />
        </FormControl>

        <FormControl>
          <FormLabel>본문</FormLabel>
          <Textarea value={board.content} readOnly></Textarea>
        </FormControl>
        <FormControl>
          <FormLabel>작성자</FormLabel>
          <Input value={board.writer} readOnly />
        </FormControl>
        <FormControl>
          <FormLabel>작성일시</FormLabel>
          <Input value={board.inserted} readOnly />
        </FormControl>

        <Button colorScheme={"blue"}>수정</Button>

        <Button colorScheme={"red"} onClick={onOpen}>
          삭제
        </Button>

        {/*삭제 모달 - Chackra UI*/}

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
      </Box>
    </>
  );
}
