import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  FormControl,
  FormLabel,
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
import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
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

function CommentList({
  commentList,
  onEditModalOpen,
  onDeleteModalOpen,
  isSubmitting,
}) {
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
                  <Flex>
                    <Button
                      isDisabled={isSubmitting}
                      colorScheme="blue"
                      size={"xs"}
                      onClick={() => onEditModalOpen(comment.id)}
                    >
                      <EditIcon />
                    </Button>
                    <Button
                      isDisabled={isSubmitting}
                      size={"xs"}
                      colorScheme="red"
                      onClick={() => onDeleteModalOpen(comment.id)}
                    >
                      <DeleteIcon />
                    </Button>
                  </Flex>
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
  const [commentContent, setCommentContent] = useState("");
  /* Chakra UI */
  const { isOpen, onClose, onOpen } = useDisclosure();
  const updateOpen = useDisclosure();
  const toast = useToast();

  /* 로그인 여부 Context */
  const { isAuthenticated } = useContext(LoginContext);
  // const [id, setId] = useState(0);

  /* 댓글 id(PK) 참조 */
  const commentIdRef = useRef(0);

  /* 댓글 리스트 요청 */
  useEffect(() => {
    if (!isSubmitting) {
      const params = new URLSearchParams();
      params.set("id", boardId);

      axios
        .get("/api/comment/list?" + params)
        .then((response) => setCommentList(response.data));
    }
  }, [isSubmitting]);

  /* 댓글 등록 */
  function handleSubmit(comment) {
    setIsSubmitting(true);

    axios
      .post("/api/comment/add", comment)
      .then(() => {
        toast({
          description: "댓글이 등록되었습니다.",
          status: "success",
        });
      })
      .catch((error) => {
        toast({
          description: "댓글 등록 중 오류가 발생하였습니다.",
          status: "error",
        });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  function handleDelete() {
    setIsSubmitting(true);

    axios
      .delete("/api/comment/remove/" + commentIdRef.current)
      .then(
        toast({
          description: "댓글이 삭제되었습니다.",
          status: "success",
        }),
      )
      .catch((error) => {
        if (error.response.status === 401 || error.response.status === 403) {
          toast({
            description: "권한이 없습니다.",
            status: "warning",
          });
        } else {
          toast({
            description: "댓글 삭제 중 문제가 발생했습니다.",
            status: "error",
          });
        }
      })
      .finally(() => {
        setIsSubmitting(false);
        onClose();
      });
  }
  function handleUpdate() {
    setIsSubmitting(true);
    axios
      .put(
        "/api/comment/edit/" +
          commentIdRef.current +
          "/content/" +
          commentContent,
      )
      .then(() => {
        toast({
          description: "댓글이 수정되었습니다.",
          status: "success",
        });
      })
      .finally(() => {
        setIsSubmitting(false);
        updateOpen.onClose();
      });
  }
  function handleDeleteModalOpen(id) {
    // setId(id);
    // useRef : 컴포넌트에서 임시로 값을 저장하는 용도로 사용
    commentIdRef.current = id;
    onOpen();
  }

  function handleEditModalOpen(id) {
    commentIdRef.current = id;
    updateOpen.onOpen();
  }

  return (
    <Box>
      {/* 댓글 입력 폼 */}
      {/* 로그인 상태인 경우에만 활성화 */}
      {isAuthenticated() && (
        <CommentForm
          boardId={boardId}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
        />
      )}

      {/* 댓글 리스트 */}
      <CommentList
        boardId={boardId}
        isSubmitting={isSubmitting}
        commentList={commentList}
        onDeleteModalOpen={handleDeleteModalOpen}
        onEditModalOpen={handleEditModalOpen}
      />
      {/* 수정 모달 - Chackra UI */}
      <Modal isOpen={updateOpen.isOpen} onClose={updateOpen.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>댓글 수정</ModalHeader>
          <ModalCloseButton></ModalCloseButton>
          <ModalBody>
            <FormControl>
              <FormLabel>수정할 내용</FormLabel>
              <textarea
                onChange={(e) => {
                  setCommentContent(e.target.value);
                }}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              isDisabled={isSubmitting}
              onClick={handleUpdate}
              colorScheme="blue"
            >
              수정하기
            </Button>
            <Button onClick={onClose}>닫기</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
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
