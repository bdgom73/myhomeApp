import axios from 'axios';

import { useCookies } from 'react-cookie';

import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import useTitle from '../../customState/useTitle';
import { toast } from 'react-toastify';
import publicIp  from "public-ip";
import { useEffect } from 'react';
import moment from 'moment';
function clientIP(){
    return publicIp.v4();
  }

export default function Login(){

    useTitle(`MYDOMUS | LOGIN`);
    const history = useHistory();
    const [cookies , setCookies] = useCookies();


    function onSubmitHandler(e){
        const {target} = e;
        e.preventDefault();
       
        const fd = new FormData();
        fd.append("email",target[0].value);
        fd.append("password",target[1].value);
        clientIP().then(result=>{
            axios.get(`/openapi/whois.jsp?query=${result}&key=${process.env.REACT_APP_WHOIS_KR_KEY}&answer=json`).then(res => {
                fd.append("ip",result);
                fd.append("countryCode",res.data.whois.countryCode);
                fd.append("ipv",res.data.whois.queryType);
                axios.post("/myApi/member/login",fd)
                .then(response=>{
                    setCookies("SESSION_UID",response.data,{path : "/"});
                    toast.success(`${result} ${res.data.whois.countryCode} ${moment().format("YY-MM-DD HH:mm")} 로그인`);
                    history.push("/");   
                }).catch(e=>{
                    toast.error(e.response.data.message ? e.response.data.message : "로그인에 실패했습니다.")
                })    
            })
        })
    }
    return(
        <>
        <div className="write_wrap write_board2">
            <div className="sub_header">
                <div className="title">로그인</div>
            </div>  
            <form onSubmit={onSubmitHandler}>
                <div className="label_wrap">
                    <label htmlFor="email">이메일</label>
                    <input type="email" required name="email" />
                </div>
                <div className="label_wrap">
                    <label htmlFor="password">비밀번호</label>
                    <input type="password" required name="password" />
                </div>           
                <input type="submit" value="로그인"/>      
            </form>
            <p>계정이 없으신가요 ? <small><Link to="/register">회원가입</Link></small></p>
            <p>
                비밀번호를 잊으셨나요 ? <small><Link to="/">비밀번호 찾기</Link></small>
            </p>          
        </div>
        </>
    );
}