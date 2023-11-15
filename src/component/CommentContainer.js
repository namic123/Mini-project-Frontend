import { Box, Button, Textarea } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function CommentForm(props) {
  const [comment, setComment] = useState("");
  function handleSubmit() {
    axios.post("/api/comment/add", {
      boardId: props.boardId,
      comment: comment,
    });
  }

  return (
    <>
      <Box>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <Button onClick={handleSubmit}>쓰기</Button>
      </Box>
    </>
  );
}

function CommentList(props) {
  const [commentList, setCommentList] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("id", props.boardId);
    axios
      .get("/api/comment/list?" + params)
      .then((response) => setCommentList(response.data));
  }, []);

  return (
    <>
      <Box>댓글 리스트</Box>
    </>
  );
}

export function CommentContainer(props) {
  return (
    <>
      <Box>
        <CommentForm boardId={props.boardId} />
        <CommentList boardId={props.boardId} />
      </Box>
    </>
  );
}
