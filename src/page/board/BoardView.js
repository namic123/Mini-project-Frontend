import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Image,
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
  Tooltip,
  Center,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
} from "@chakra-ui/react";
import { LoginContext } from "../../component/LogInProvider";
import { CommentContainer } from "../../component/CommentContainer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as fullHeart } from "@fortawesome/free-solid-svg-icons/faHeart";
import { faHeart as emptyHeart } from "@fortawesome/free-regular-svg-icons/faHeart";

/* 좋아요 컨테이너 */
function LikeContainer({ like, onClick }) {
  /* 사용자 로그인 여부를 확인하기 위함 */
  const { isAuthenticated } = useContext(LoginContext);

  /* 좋아요 정보를 불러올 때까지 로딩 */
  if (like === null) {
    return <Spinner />;
  }
  return (
    <>
      <Flex gap={2}>
        {/* 로그인 여부에 따라서, 좋아요 버튼 접근 시 메세지 출력 */}
        <Tooltip
          isDisabled={isAuthenticated()}
          hasArrow
          label={"로그인 하세요."}
        >
          <Button variant={"ghost"} size={"xl"} onClick={onClick}>
            {/* 좋아요를 누른 경우 */}
            {like.like && <FontAwesomeIcon icon={fullHeart} size="xl" />}
            {/* 좋아요를 누르지 않았거나, 비로그인인 경우 */}
            {like.like || <FontAwesomeIcon icon={emptyHeart} size="xl" />}
          </Button>
        </Tooltip>
        {/* 게시글의 총 좋아요 수 */}
        <Heading size={"lg"}>{like.countLike}</Heading>
      </Flex>
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
        <Center>
          <Card
            w={"3xl"}
            bgGradient={[
              "linear(to-tr, teal.300, yellow.400)",
              "linear(to-t, blue.200, teal.500)",
              "linear(to-b, orange.100, purple.300)",
            ]}
          >
            <CardHeader>
              <Flex justifyContent={"space-between"}>
                <Heading size={"xl"}>{board.id}글 보기</Heading>
                <LikeContainer like={like} onClick={handleLike} />
              </Flex>
            </CardHeader>
            <CardBody>
              <FormControl mb={5}>
                <FormLabel>제목</FormLabel>
                {/* 수정 불가하도록 읽기 전용 */}
                <Input value={board.title} readOnly />
              </FormControl>

              <FormControl mb={5}>
                <FormLabel>본문</FormLabel>
                <Textarea value={board.content} readOnly></Textarea>
              </FormControl>
              {/* 파일 이미지 출력 */}
              {board.files.map((file) => (
                <Card key={file.id} my={5}>
                  <CardBody>
                    <Image width="100%" src={file.url} alt={file.name} />
                  </CardBody>
                </Card>
              ))}
              <FormControl mb={5}>
                <FormLabel>작성자</FormLabel>
                <Input value={board.nickName} readOnly />
              </FormControl>
              <FormControl mb={5}>
                <FormLabel>작성일시</FormLabel>
                <Input value={board.inserted} readOnly />
              </FormControl>
            </CardBody>
            <CardFooter>
              {/* board.writer와 로그인 id와 동일할 경우에만 출력 */}
              {(hasAccess(board.writer) || isAdmin()) && (
                <Flex gap={2}>
                  <Button
                    colorScheme={"blue"}
                    onClick={() => navigate("/edit/" + id)}
                  >
                    수정
                  </Button>
                  <Button colorScheme={"red"} onClick={onOpen}>
                    삭제
                  </Button>
                </Flex>
              )}
            </CardFooter>
          </Card>
        </Center>
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
