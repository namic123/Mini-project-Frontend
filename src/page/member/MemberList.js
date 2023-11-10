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
  const [memberList, setMemberList] = useState(null);
  useEffect(() => {
    axios
      .get("/api/member/list")
      .then((response) => setMemberList(response.data))
      .catch((error) => console.log(error));
  }, []);
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
            </Tr>
          </Thead>
          <Tbody>
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
