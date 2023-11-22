import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Center,
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
import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { DeleteIcon, EditIcon, NotAllowedIcon } from "@chakra-ui/icons";
import { LoginContext } from "./LogInProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments } from "@fortawesome/free-solid-svg-icons";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons/faPaperPlane";

/* 댓글 입력 폼 */
function CommentForm({ boardId, isSubmitting, onSubmit }) {
  const [comment, setComment] = useState("");

  function handleSubmit() {
    onSubmit({ boardId, comment });
  }

  return (
    <Box mt={5} mb={7}>
      <Flex>
        <Textarea
          placeholder="댓글 쓰기"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <Center isDisabled={isSubmitting} onClick={handleSubmit}>
          <Button
            h={"full"}
            size={"lg"}
            bgGradient={[
              "linear(to-tr, teal.300, yellow.400)",
              "linear(to-t, blue.200, teal.500)",
              "linear(to-b, orange.100, purple.300)",
            ]}
          >
            <FontAwesomeIcon icon={faPaperPlane} />
          </Button>
        </Center>
      </Flex>
    </Box>
  );
}

/* 댓글 리스트의 각 요소 */
function CommentItem({
  comment,
  onDeleteModalOpen,
  setIsSubmitting,
  isSubmitting,
}) {
  /* 수정 버튼 클릭 시 text area 활성화 상태 */
  const [isEditing, setIsEditing] = useState(false);
  /* 댓글 상태 관리 */
  const [commentEdited, setCommentEdited] = useState(comment.comment);
  /* 권한 여부 Context */
  const { hasAccess } = useContext(LoginContext);

  const toast = useToast();

  /* 수정 요청 */
  function handleSubmit() {
    /* 상태 업데이트를 위함 */
    setIsSubmitting(true);

    axios
      .put("/api/comment/edit", { id: comment.id, comment: commentEdited })
      .then(() => {
        toast({
          description: "댓글이 수정되었습니다.",
          status: "success",
        });
      })
      .catch((error) => {
        if (error.response.status === 401 || error.response.status === 403) {
          toast({
            description: "권한이 없습니다.",
            status: "warning",
          });
        }
        if (error.response.status === 400) {
          toast({
            description: "입력값을 확인해주세요",
            status: "warning",
          });
        }
      })
      .finally(() => {
        /* 컴포넌트 상태 업데이트 */
        setIsSubmitting(false);
        /* 댓글 수정 text area 닫기 */
        setIsEditing(false);
      });
  }

  return (
    <Box>
      <Flex justifyContent="space-between">
        <Heading size="xs">{comment.nickName}</Heading>
        <Text fontSize="xs">{comment.ago}</Text>
      </Flex>
      <Flex justifyContent="space-between" alignItems="center">
        <Box flex={1}>
          <Text sx={{ whiteSpace: "pre-wrap" }} pt="2" fontSize="sm">
            {comment.comment}
          </Text>
          {/*  */}
          {isEditing && (
            <Box>
              <Textarea
                value={commentEdited}
                onChange={(e) => setCommentEdited(e.target.value)}
              />
              <Button
                isDisabled={isSubmitting}
                colorScheme={"blue"}
                onClick={handleSubmit}
              >
                저장
              </Button>
            </Box>
          )}
        </Box>

        {hasAccess(comment.memberId) && (
          <Box>
            {isEditing || (
              <Button
                size="xs"
                colorScheme="purple"
                onClick={() => setIsEditing(true)}
              >
                <EditIcon />
              </Button>
            )}
            {isEditing && (
              <Button
                size="xs"
                colorScheme="gray"
                onClick={() => setIsEditing(false)}
              >
                <NotAllowedIcon />
              </Button>
            )}
            <Button
              onClick={() => onDeleteModalOpen(comment.id)}
              size="xs"
              colorScheme="red"
            >
              <DeleteIcon />
            </Button>
          </Box>
        )}
      </Flex>
    </Box>
  );
}

function CommentList({
  commentList,
  onDeleteModalOpen,
  isSubmitting,
  setIsSubmitting,
}) {
  const { hasAccess } = useContext(LoginContext);

  return (
    <Center>
      <Card
        w={"80%"}
        bgGradient={[
          "linear(to-tr, teal.300, yellow.400)",
          "linear(to-t, blue.200, teal.500)",
          "linear(to-b, orange.100, purple.300)",
        ]}
      >
        <CardHeader>
          <Heading size="md">댓글 리스트</Heading>
        </CardHeader>
        <CardBody>
          <Stack divider={<StackDivider />} spacing="4">
            {commentList.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                setIsSubmitting={setIsSubmitting}
                isSubmitting={isSubmitting}
                onDeleteModalOpen={onDeleteModalOpen}
              />
            ))}
          </Stack>
        </CardBody>
      </Card>
    </Center>
  );
}

/* 댓글 컴포넌트 컨테이너(최상위) */
export function CommentContainer({ boardId }) {
  /* 요청 데이터를 서버에 전송하는 과정 진행 여부를 확인하기 위한 상태 */
  const [isSubmitting, setIsSubmitting] = useState(false);
  /* 댓글 리스트 */
  const [commentList, setCommentList] = useState([]);

  // const [id, setId] = useState(0);
  // useRef : 컴포넌트에서 임시로 값을 저장하는 용도로 사용

  /* useState와 유사 */
  /* 차이는 useRef는 상태 변경으로 인한 렌더링을 유발하지 않음 */
  /* 즉, useRef의 값을 담은 .current 속성을 수정해도 렌더링을 트리거하지 않는다. */
  const commentIdRef = useRef(0);

  /* 로그인 상태 여부 체크 */
  const { isAuthenticated } = useContext(LoginContext);

  /* ChakraUi */
  const { isOpen, onClose, onOpen } = useDisclosure();
  const toast = useToast();

  /* 댓글 목록 요청 */
  useEffect(() => {
    if (!isSubmitting) {
      const params = new URLSearchParams();
      params.set("id", boardId);

      axios.get("/api/comment/list?" + params).then((response) => {
        setCommentList(response.data);
        console.log(response.data);
      });
    }
  }, [isSubmitting]); // 제출 상태를 지속적으로 추적하여 상태를 업데이트한다.

  /* 댓글 관련 요청 */
  function handleSubmit(comment) {
    /* 제출 중 버튼 비활성화 처리를 위함  */
    setIsSubmitting(true);

    /* 댓글 등록 요청 */
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
          description: "댓글 등록 중 문제가 발생하였습니다.",
          status: "error",
        });
      })
      .finally(() => setIsSubmitting(false));
  }

  /* 댓글 삭제 요청 */
  function handleDelete() {
    setIsSubmitting(true);
    axios
      .delete("/api/comment/remove/" + commentIdRef.current)
      .then(() => {
        toast({
          description: "댓글이 삭제되었습니다.",
          status: "success",
        });
      })
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
        onClose();
        setIsSubmitting(false);
      });
  }

  /* 댓글 삭제 모달을 키고, 해당 댓글이 포함된 board의 id를 넘겨주는 메서드 */
  function handleDeleteModalOpen(id) {
    // id 를 어딘가 저장
    // setId(id);
    commentIdRef.current = id;
    // 모달 열기
    onOpen();
  }
  return (
    <Box>
      {isAuthenticated() && (
        <Center mt={"10px"}>
          <Box w={"3xl"}>
            <CommentForm
              boardId={boardId}
              isSubmitting={isSubmitting}
              onSubmit={handleSubmit}
            />
          </Box>
        </Center>
      )}
      <CommentList
        boardId={boardId}
        isSubmitting={isSubmitting}
        setIsSubmitting={setIsSubmitting}
        commentList={commentList}
        onDeleteModalOpen={handleDeleteModalOpen}
      />

      {/* 삭제 모달 */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>삭제 확인</ModalHeader>
          <ModalCloseButton />
          <ModalBody>삭제 하시겠습니까?</ModalBody>

          <ModalFooter>
            <Button onClick={onClose}>닫기</Button>
            <Button
              isDisabled={isSubmitting}
              onClick={handleDelete}
              colorScheme="red"
            >
              삭제
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
