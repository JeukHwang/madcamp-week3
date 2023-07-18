import React, { useEffect, useState } from "react";
import axios from "axios";
import Area from "../../atoms/containers/area/Area";
import Background from "../../atoms/containers/background/background";
import Font from "../../styles/font";
import Text from "../../atoms/containers/text/text";
import "../../atoms/containers/background/macTerminal.css";
//import { Item } from "react-bootstrap/lib/Breadcrumb";


interface User {
  id: string;
  name: string;
  score: number;
  photo: string;
}

const LeaderBoard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    axios
      .get<User[]>("https://madcamp-week3-production.up.railway.app/user/leaderboard", { withCredentials: true })
      .then(response => {
        console.log(response);
        const userData = response.data.map((item:any) => ({
          id: item.user.id,
          name: item.user.name,
          score: item.score || 0,
          photo: item.user.photo
        }));
        setUsers(userData);
        console.log(userData);
      })
      .catch(error => {
        console.error("API 호출에 실패했습니다.", error);
      });
  }, []);

  return (
    <Area>
    <Background  color={"black"} style={{ padding: "50px" }}>
    <div id="bar2">
            <div id="red">
            </div>
            <div id="yellow">
            </div>
            <div id="green">
            </div>
    </div>
    <div id="screen2" style={{font:"Font.Regular",color:"white"}}>
    <div className="leaderboard">
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "0px" }} className="leaderboard__title">
  <Text size="3.0rem" color="white" font={Font.Bold} style={{ alignItems: "center", padding: "30px" }} dangerouslySetInnerHTML={{ __html: "&lt;랭킹보드/&gt;" }} />
</div>
<div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "15px" }} className="leaderboard__table">
      <table style={{gap:"10px", padding:"15px",width:"400px",fontFamily: "DungGeunMo" }}>
          <thead>
            <tr>
              <th>랭킹</th>
              <th>이름</th>
              <th>점수</th>
              <th>사진</th>
            </tr>
          </thead>
          <tbody style={{  fontSize:"1.3rem",justifyContent: "center", alignItems: "center"}}>
            {users.map((user, index) => (
              <tr key={user.id}>
              <td style={{ textAlign: "center" }}>{index + 1}</td>
              <td style={{ textAlign: "center" }}>{user.name}</td>
              <td style={{ textAlign: "center" }}>{user.score}</td>
              <td style={{ textAlign: "center" }}>
                  <img style={{width:"80px", borderRadius: "50%"}} src={user.photo} alt="User" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
    </Background>
    </Area>
  );
};

export default LeaderBoard;
