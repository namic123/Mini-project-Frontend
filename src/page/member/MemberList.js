import { useEffect, useState } from "react";
import {
  Box,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import axios from "axios";

export function MemberList() {
  /* 회원 리스트 상태 */
  const [memberList, setMemberList] = useState(null);

  /* 리스트 요청 */
  useEffect(() => {
    axios
      .get("/api/member/list")
      .then((response) => setMemberList(response.data));
  }, []);

  /* 회원 목록이 비어 있는 경우 로딩 */
  if (memberList === null) {
    return <Spinner />;
  }
  return (
    <>
      <Box>
        <Table>
          <Thead>
            <Tr>
              <Th>id</Th>
              <Th>pw</Th>
              <Th>email</Th>
              <Th>inserted</Th>
            </Tr>
          </Thead>
          <Tbody>
            {/* 회원 목록 출력 */}
            {memberList.map((member) => (
              <Tr key={member.id}>
                <Td>{member.id}</Td>
                <Td>{member.password}</Td>
                <Td>{member.email}</Td>
                <Td>{member.inserted}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </>
  );
}
