import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const LoginContext = createContext(null);
/* props로 App.js를 받음 */
function LogInProvider({ children }) {
  const [login, setLogin] = useState("");

  useEffect(() => {
    fetchLogin();
  }, []);

  /* 로그인된 정보를 전역에서 사용하기 위한 메서드 */
  function fetchLogin() {
    axios.get("/api/member/login").then((response) => setLogin(response.data));
  }

  /* 로그인 여부 확인 메서드 */
  function isAuthenticated() {
    return login !== "";
  }

  /* 관리자 권한 검증 여부 */
  function isAdmin() {
    /* login.auth는 객체이지만, javascript에서 객체를 조건에 사용하면 null 여부를 확인 */
    if (login.auth) {
      /* 로그인 속성 auth 객체에 name property 값이 admin인지 확인 */
      return login.auth.some((elem) => elem.name === "admin");
    }
    return false;
  }

  /* 권한 확인 메서드 */
  function hasAccess(userId) {
    return login.id === userId;
  }
  return (
    /* 하위 컴포넌트 props drilling을 위한 Context */
    <LoginContext.Provider
      value={{ login, fetchLogin, isAuthenticated, hasAccess, isAdmin }}
    >
      {children}
    </LoginContext.Provider>
  );
}

export default LogInProvider;
