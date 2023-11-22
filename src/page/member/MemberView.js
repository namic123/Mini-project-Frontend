import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
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
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";

/* 회원 정보보기 컴포넌트 */
export function MemberView() {
  /* 해당 Member의 상태 */
  const [member, setMember] = useState(null);
  /* 쿼리 스트링의 key 값만 구조분해 할당으로 받음 */
  const [params] = useSearchParams();

  /* 모달 창 사용을 위한 함수 */
  const { isOpen, onOpen, onClose } = useDisclosure();

  /* 이동 경로 메서드 */
  const navigate = useNavigate();

  /* ChakraUI 팝업 UI */
  const toast = useToast();

  /* Member 정보 요청 */
  useEffect(() => {
    axios
      /* /api/member?id=*/
      .get("/api/member?" + params.toString())
      .then((response) => setMember(response.data))
      .catch((error) => {
        toast({
          description: "권한이 없습니다.",
          status: "warning",
        });
        navigate("/login");
      });
  }, []);

  /* member 객체가 비어있는 경우 */
  if (member === null) {
    return <Spinner />;
  }

  /* 회원 탈티 요청 */
  /* 홈 화면 경로 이동 */
  function handleDelete() {
    axios
      .delete("/api/member?" + params.toString())
      .then(() => {
        /* 성공 값 */
        toast({
          description: "회원이 탈퇴되었습니다.",
          status: "success",
        });
        /* 홈으로 이동 */
        navigate("/");
        // TODO: 로그아웃 기능 추가하기
      })
      .catch((error) => {
        /* 권한이 없는 경우 */
        if (error.response.status === 401 || error.response.status === 403) {
          toast({
            description: "권한이 없습니다.",
            status: "error",
          });
        } else {
          /* 서버 에러 */
          toast({
            description: "탈퇴 처리 중에 문제가 발생하였습니다.",
            status: "error",
          });
        }
      }) /* 모달창 닫기 */
      .finally(() => onClose());
  }

  return (
    <>
      <Center marginTop={"130px"}>
        <Card width={"lg"}>
          <CardHeader>
            <Heading>{member.id}님 정보</Heading>
          </CardHeader>
          <CardBody>
            {/* 닉네임 폼 */}
            <FormControl>
              <FormLabel>닉네임</FormLabel>
              <Input value={member.nickName} readOnly />
            </FormControl>
            {/* 비밀번호 폼 */}
            <FormControl>
              <FormLabel>비밀번호</FormLabel>
              <Input type={"text"} value={member.password} readOnly />
            </FormControl>
            {/* 이메일 폼 */}
            <FormControl>
              <FormLabel>이메일</FormLabel>
              <Input value={member.email} readOnly />
            </FormControl>
          </CardBody>
          <CardFooter>
            {/* 회원 수정 경로로 이동 */}
            <Flex gap={2}>
              <Button
                colorScheme="blue"
                onClick={() => {
                  navigate("/member/edit?" + params.toString());
                }}
              >
                수정
              </Button>
              <Button colorScheme="red" onClick={onOpen}>
                탈퇴
              </Button>
            </Flex>
          </CardFooter>
        </Card>
        {/* 탈퇴 모달 - Chackra UI */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>탈퇴 확인</ModalHeader>
            <ModalCloseButton />
            <ModalBody>탈퇴 하시겠습니까?</ModalBody>

            <ModalFooter>
              <Button onClick={onClose}>닫기</Button>
              {/* 회원 탈퇴 버튼 */}
              <Button onClick={handleDelete} colorScheme="red">
                탈퇴
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Center>
    </>
  );
}
