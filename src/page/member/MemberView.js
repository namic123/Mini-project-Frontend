import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
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
      .then((response) => setMember(response.data));
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
      <Box>
        <h1>{member.id}님 정보</h1>
        <FormControl>
          <FormLabel>password</FormLabel>
          <Input type={"text"} value={member.password} readOnly />
        </FormControl>
        <FormControl>
          <FormLabel>email</FormLabel>
          <Input value={member.email} readOnly />
        </FormControl>
        {/* 회원 수정 경로로 이동 */}
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

        {/* 탈퇴 모달 - Chackra UI */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>탈퇴 확인</ModalHeader>
            <ModalCloseButton />
            <ModalBody>탈퇴 하시겠습니까?</ModalBody>

            <ModalFooter>
              <Button onClick={onClose}>닫기</Button>
              <Button onClick={handleDelete} colorScheme="red">
                탈퇴
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </>
  );
}
