import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function BoardWrite() {
  /* 게시물 작성 컴포넌트*/
  const [title, setTitle] = useState(""); // 제목 상태
  const [content, setContent] = useState(""); // 본문 상태
  const [files, setFiles] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // 버튼 로딩 상태

  /* Chakra UI */
  const toast = useToast();
  const navigate = useNavigate();

  /* 게시글 작성 컴포넌트 */
  function handleSubmit() {
    /* 버튼 로딩, 값이 true인 동안 로딩 */
    setIsSubmitting(true);

    /* 저장 요청 */
    axios
      /* axios.post를 사용하여 FormData 객체를 전송하는 방식 */
      /* 주로 파일 업로드나 enctype="multipart/form-data"를 요구하는 서버에 데이터를 전송할 때 사용 */
      /* FormData 객체를 사용하여 폼 데이터를 구성하고, 이를 axios.post를 통해 전송 */
      /* Content-Type 헤더는 자동으로 multipart/form-data로 설정 */
      .postForm("/api/board/add", {
        title,
        content,
        files,
      })
      .then(() => {
        toast({ description: "새 글이 저장되었습니다.", status: "success" });
        /* 성공 후, 홈 화면으로 이동 */
        navigate("/");
      })
      .catch((error) => {
        if (error.response.status === 400) {
          // 400번오류
          toast({
            description: "작성한 내용을 확인해주세요.",
            status: "error",
          });
        } else {
          toast({
            description: "저장 중에 문제가 발생하였습니다.",
            status: "error",
          });
        }
      })
      /* 로딩 상태 해제 */
      .finally(() => setIsSubmitting(false));
  }

  return (
    <>
      <Box>
        <h1>게시물 작성</h1>
        <Box>
          <FormControl>
            {/* 제목 폼*/}
            <FormLabel>제목</FormLabel>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />{" "}
            {/* 제목 상태 저장 */}
          </FormControl>
          <FormControl>
            {/* 본문 폼 */}
            <FormLabel>본문</FormLabel>
            {/* 본문 상태 저장 */}
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
            ></Textarea>
          </FormControl>
          <FormControl>
            <FormLabel>이미지</FormLabel>
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setFiles(e.target.files)}
            />
          </FormControl>
          <Button
            isDisabled={isSubmitting}
            onClick={handleSubmit}
            colorScheme={"blue"}
          >
            {" "}
            {/* Submit post 전송 */}
            저장
          </Button>
        </Box>
      </Box>
    </>
  );
}
