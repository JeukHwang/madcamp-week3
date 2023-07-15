import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Ready = () => {
  const history = useNavigate();

  useEffect(() => {
    axios
      .get("https://madcamp-week3-production.up.railway.app/game/create", { withCredentials: true })
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.error("API 호출에 실패했습니다.", error.response);
        if (error.response && error.response.status === 403 && error.response.data.message.startsWith("Game exist")) {
          const userId = error.response.data.message.split(" ").pop(); // 에러 메시지에서 사용자 ID 추출
          history(`/game/update`); // 사용자 ID를 가진 게임 페이지로 이동
        } else {
          // 다른 에러 메시지인 경우나 메시지가 없는 경우에 대한 처리
          // 일반적인 에러 메시지를 표시하거나 다른 작업을 수행합니다.
        }
      });
  }, [history]);

  return (
    <div>
      <h1>깅깅깅깅</h1>
    </div>
  );
};

export default Ready;
