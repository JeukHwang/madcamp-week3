import axios from "axios";


const Ready = () => {
    axios.get('https://madcamp-week3-production.up.railway.app/game/create', { withCredentials: true })
    .then(response => {
        // API 호출에 성공한 경우 실행될 로직을 작성합니다.
        
        console.log(response);
    })
    .catch(error => {
        // API 호출에 실패한 경우 실행될 로직을 작성합니다.
        console.error('API 호출에 실패했습니다.', error);
    }); 
    
    return(
        <div>
            <h1>깅깅깅깅</h1>
        </div>
    )
}
export default Ready;