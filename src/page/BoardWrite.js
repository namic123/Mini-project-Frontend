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

export function BoardWrite() {
  /* 게시물 작성 컴포넌트*/
  const [title, setTitle] = useState(""); // 제목 상태
  const [content, setContent] = useState(""); // 본문 상태
  const [writer, setWriter] = useState(""); // 작성자 상태
  const [isSubmitting, setIsSubmitting] = useState(false); // 버튼 로딩 상태

  const toast = useToast(); // 게시물 저장 팝업 ㅊ

  function handleSubmit() {
    setIsSubmitting(true); // 버튼 로딩, 값이 true인 동안 로딩

    // /api/board/add로 post 전송
    axios
      .post("/api/board/add", {
        title,
        content,
        writer,
      })
      .then(() => {
        toast({ description: "새 글이 저장되었습니다.", status: "success" }); // 글 저장이 성공한 경우 반환
      })
      .catch((error) => {
        // 실패한 경우 응답 코드 및 메세지 toast
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
            {/* 작성자 폼 */}
            <FormLabel>작성자</FormLabel>
            {/* 작성자 상태 저장 */}
            <Input
              value={writer}
              onChange={(e) => setWriter(e.target.value)}
            ></Input>
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
