import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Switch,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useImmer } from "use-immer";
import axios from "axios";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons/faTrashCan";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/* 게시글 수정 컴포넌트 */
export function BoardEdit() {
  /* board의 상태 */
  const [board, updateBoard] = useImmer(null);
  const [removeFileIds, setRemoveFileIds] = useState([]);
  const [uploadFiles, setUploadFiles] = useState(null);
  /* react-router-dom, 다른 페이지로 이동 시키는 훅 */
  const navigate = useNavigate();

  /* url에 지정된 매개변수의 값을 추출
  예: http://localhost:3000/edit/13 -> 13을 추출
  path에는 edit/:id, 이와 같이 선언되어 있어야 한다. */
  const { id } = useParams();

  /* Chakra UI의 메서드 */
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  /* board 엔티티의 값 요청
  수정할 글의 저장된 값을 불러오기 위함 */
  useEffect(() => {
    axios
      .get("/api/board/id/" + id)
      .then((response) => updateBoard(response.data));
  }, []);

  /* board가 비어있는 경우, 로딩 화면 */
  if (board === null) {
    return <Spinner />;
  }

  /* 게시글 수정 제출 */
  function handleSubmit() {
    /* 게시글 수정 요청 */
    axios
      .putForm("/api/board/edit", {
        id: board.id,
        title: board.title,
        content: board.content,
        removeFileIds,
        uploadFiles,
      })
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

  function handleRemoveFileSwitch(e) {
    if (e.target.checked) {
      // removeFileIds 에 추가
      setRemoveFileIds([...removeFileIds, e.target.value]);
    } else {
      // removeFileIds 에서 삭제
      setRemoveFileIds(removeFileIds.filter((item) => item !== e.target.value));
    }
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
      {/* 이미지 출력 */}
      {board.files.length > 0 &&
        board.files.map((file) => (
          <Box key={file.id} my="5px" border="3px solid black">
            <FormControl display="flex" alignItems="center">
              <FormLabel>
                <FontAwesomeIcon color="red" icon={faTrashCan} />
              </FormLabel>
              <Switch
                value={file.id}
                colorScheme="red"
                onChange={handleRemoveFileSwitch}
              />
            </FormControl>
            <Box>
              <Image src={file.url} alt={file.name} width="100%" />
            </Box>
          </Box>
        ))}
      {/* 추가할 파일 선택 */}
      <FormControl>
        <FormLabel>이미지</FormLabel>
        <Input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setUploadFiles(e.target.files)}
        />
        <FormHelperText>
          한 개 파일은 1MB 이내, 총 용량은 10MB 이내로 첨부하세요.
        </FormHelperText>
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
