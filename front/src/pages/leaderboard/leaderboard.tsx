import React, { useEffect, useState } from "react";
import axios from "axios";
import Area from "../../atoms/containers/area/Area";
import Background from "../../atoms/containers/background/background";
import Font from "../../styles/font";
import Text from "../../atoms/containers/text/text";
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
        const userData = response.data.map(user => ({
          id: user.id,
          name: user.name,
          score: user.score || 0,
          photo: user.photo
        }));
        setUsers(userData);
      })
      .catch(error => {
        console.error("API 호출에 실패했습니다.", error);
      });
  }, []);

  return (
    <Area>
    <Background  color={"white"} style={{ padding: "50px" }}>
    <div className="leaderboard">
      <div className="leaderboard__title">
        <Text size={"3.0rem"} font={Font.Bold}>냠냠냠</Text>
      </div>
      <div className="leaderboard__table">
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Username</th>
              <th>Score</th>
              <th>Photo</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.score}</td>
                <td>
                  <img src={user.photo} alt="User" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </Background>
    </Area>
  );
};

export default LeaderBoard;
