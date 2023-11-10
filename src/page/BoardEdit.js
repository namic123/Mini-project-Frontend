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

export function BoardEdit() {
  const [board, updateBoard] = useImmer(null);
  const navigate = useNavigate();
  // /edit/:id
  const { id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  useEffect(() => {
    axios
      .get("/api/board/id/" + id)
      .then((response) => updateBoard(response.data));
  }, []);

  if (board === null) {
    return <Spinner />;
  }

  function handleSubmit() {
    setIsSubmitting(true);
    // 저장 버튼 클릭 시
    // PUT -> /api/board/edit
    // board
    axios
      .put("/api/board/edit", board)
      .then(() => {
        toast({
          description: "수정된 글이 저장되었습니다.",
          status: "success",
        }); // 글 수정이 성공한 경우 반환
        navigate("/");
      })
      .catch((error) => {
        if (error.response.status === 400) {
          //400번 오류
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
      .finally(() => setIsSubmitting(true));
  }

  return (
    <Box>
      <h1>{id}번 글 수정</h1>
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

      {/*게시물 수정 버튼*/}
      {/* 요청이 완료되기 전까지 로딩 */}
      {isSubmitting === true ? (
        <Spinner />
      ) : (
        <Button isDisabled={isSubmitting} colorScheme={"blue"} onClick={onOpen}>
          저장
        </Button>
      )}
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
      <Button onClick={() => navigate(-1)}>취소</Button>
    </Box>
  );
}
