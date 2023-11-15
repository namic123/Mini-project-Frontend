import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  StackDivider,
  Text,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { DeleteIcon } from "@chakra-ui/icons";
import { LoginContext } from "./LogInProvider";

function CommentForm({ boardId, isSubmitting, onSubmit }) {
  const [comment, setComment] = useState("");

  function handleSubmit() {
    onSubmit({ boardId, comment });
  }

  return (
    <Box>
      <Textarea value={comment} onChange={(e) => setComment(e.target.value)} />
      <Button isDisabled={isSubmitting} onClick={handleSubmit}>
        쓰기
      </Button>
    </Box>
  );
}

function CommentList({ commentList, onDeleteModalOpen, isSubmitting }) {
  const { hasAccess } = useContext(LoginContext);
  return (
    <Card>
      <CardHeader>
        <Heading size="md">댓글 리스트</Heading>
      </CardHeader>
      <CardBody>
        <Stack divider={<StackDivider />} spacing="4">
          {commentList.map((comment) => (
            <Box key={comment.id}>
              <Flex justifyContent="space-between">
                <Heading size="xs">{comment.memberId}</Heading>
                <Text fontSize="xs">{comment.inserted}</Text>
              </Flex>
              <Flex justifyContent="space-between">
                <Text sx={{ whiteSpace: "pre-wrap" }} pt="2" fontSize="sm">
                  {comment.comment}
                </Text>
                {hasAccess(comment.memberId) && (
                  <Button
                    isDisabled={isSubmitting}
                    size={"xs"}
                    colorScheme="red"
                    onClick={() => onDeleteModalOpen(comment.id)}
                  >
                    <DeleteIcon />
                  </Button>
                )}
              </Flex>
            </Box>
          ))}
        </Stack>
      </CardBody>
    </Card>
  );
}

export function CommentContainer({ boardId }) {
  /* 상태 공유를 위해 상위 컴포넌트에 작성 */
  /* 제출 여부 상태 */
  const [isSubmitting, setIsSubmitting] = useState(false);
  /* 댓글 리스트 상태 */
  const [commentList, setCommentList] = useState([]);

  const [id, setId] = useState(0);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { isAuthenticated } = useContext(LoginContext);
  const toast = useToast();

  useEffect(() => {
    if (!isSubmitting) {
      const params = new URLSearchParams();
      params.set("id", boardId);

      axios
        .get("/api/comment/list?" + params)
        .then((response) => setCommentList(response.data));
    }
  }, [isSubmitting]);

  function handleSubmit(comment) {
    setIsSubmitting(true);

    axios.post("/api/comment/add", comment).finally(() => {
      setIsSubmitting(false);
    });
  }

  function handleDelete() {
    setIsSubmitting(true);

    axios
      .delete("/api/comment/remove/" + id)
      .then(
        toast({
          description: "댓글이 삭제되었습니다.",
          status: "success",
        }),
      )
      .finally(() => {
        setIsSubmitting(false);
        onClose();
      });
  }

  function handleDeleteModalOpen(id) {
    setId(id);
    onOpen();
  }
  return (
    <Box>
      {isAuthenticated() && (
        <CommentForm
          boardId={boardId}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
        />
      )}
      <CommentList
        boardId={boardId}
        isSubmitting={isSubmitting}
        commentList={commentList}
        onDeleteModalOpen={handleDeleteModalOpen}
      />
      {/* 삭제 모달 - Chackra UI */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>삭제 확인</ModalHeader>
          <ModalCloseButton></ModalCloseButton>
          <ModalBody>삭제 하시겠습니까?</ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>닫기</Button>
            <Button
              isDisabled={isSubmitting}
              onClick={handleDelete}
              colorScheme="red"
            >
              삭제하기
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
