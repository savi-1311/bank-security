import React from 'react';
import Header from '../../components/header/index.js';
import axios from 'axios';
import './styles.css';
import {Link} from "react-router-dom";
import { toast } from 'react-toastify';
import loggedInUser from "../../services/auth.service"
import 'react-toastify/dist/ReactToastify.css';
let images = require.context('../../images', true);

/*****************************************************************************/

export default function Home()
{
    const [currIndex, setCurrIndex] = React.useState(0);
    const [showLogin, setShowLogin] = React.useState("none");
    const [showRegister, setShowRegister] = React.useState("none");
    const [registerName, setRegisterName] = React.useState("");
    const [registerEmail, setRegisterEmail] = React.useState("");
    const [registerPassword, setRegisterPassword] = React.useState("");
    const [loginEmail, setLoginEmail] = React.useState("");
    const [loginPassword, setLoginPassword] = React.useState("");
    const user = loggedInUser();

    function increase(){
        let temp = currIndex;
        temp++;
        if(temp==3)
            temp = 0;
        setCurrIndex(temp);
    }

    function decrease(){
        let temp = currIndex;
        temp--;
        if(temp ==-1)
            temp = 2;
        setCurrIndex(temp);
    }

    function openLoginModal(){
        setShowRegister("none");
        setShowLogin("flex");
    }

    function openRegisterModal(){
        setShowLogin("none");
        setShowRegister("flex");
    }

    async function onLoginSubmit(){
        var loginObject = {
            "email": loginEmail,
            "password": loginPassword
        }
        const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/login`, loginObject);
        if(response.status==200)
        {
            toast.success(response.data.msg);
            setShowLogin("none");
            localStorage.setItem('user', JSON.stringify({"name": response.data.fullname, "id": response.data._id, "token": response.data.token}));
            window.location.reload(false);
        }
        else
        {
            toast.danger(response.data.msg);
        }
    }

    React.useEffect(() => {
        setTimeout(function(){
            increase();
        }, 10000);
    }, [currIndex])

    async function onRegisterSubmit(){
        var registerObject = {
            "fullname": registerName,
            "email": registerEmail,
            "password": registerPassword
        }
        const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/register`, registerObject);
        console.log(response);
        if(response.status==200)
        {
            toast.success(response.data.msg);
        }
        setShowRegister("none");
    }

    function closeModal(){
        setShowLogin("none");
        setShowRegister("none");
    }

    const content = [
        {
            title: "Secure Your Cloud",
            description: "Go beyond traditional CSPM tools by using agentless analysis of company assets, and vulnerability metrics across containers.",
            image: "security2.webp"
        },
        {
            title: "Adhere to Compliances",
            description: "Monitor against real-time gaps in compliance. SecuriCash supports all the major standards including PCI-DSS and RBI Compliance.",
            image: "security3.webp"
        },
        {
            title: "Reduce Data Breaches",
            description: "Get live visibility into leakage of third-party secret tokens.",
            image: "security1.jpg"
        }
    ]
    return(
        <div className="root">
            <Header/>

            <div className="home-container">
                <div className="flip-card">
                    <div className="flip-card-inner">
                        <div className="flip-card-front">
                            <img src={images("./security2.webp")} alt="Avatar"/>
                            <div className="text">Secure Your Cloud</div>
                        </div>
                        <div className="flip-card-back">
                            <h1>Secure Your Cloud</h1>
                            <p>Go beyond traditional CSPM tools by using agentless analysis of company assets, and vulnerability metrics across containers.</p>
                            {
                                (user)
                                    ?
                                    <Link to="/account" className="button">Dashboard</Link>
                                    :
                                    <div className="button" onClick={() => openRegisterModal()}>Register</div>
                            }
                        </div>
                    </div>
                </div>

                <div className="flip-card">
                    <div className="flip-card-inner">
                        <div className="flip-card-front">
                            <img src={images("./security3.webp")} alt="Avatar"/>
                            <div className="text">Adhere to Compliances</div>
                        </div>
                        <div className="flip-card-back">
                            <h1>Adhere to Compliances</h1>
                            <p>Monitor against real-time gaps in compliance. SecuriCash supports all the major standards including PCI-DSS and RBI Compliance.</p>
                            {
                                (user)
                                    ?
                                    <Link to="/account" className="button">Dashboard</Link>
                                    :
                                    <div className="button" onClick={() => openRegisterModal()}>Register</div>
                            }
                        </div>
                    </div>
                </div>

                <div className="flip-card">
                    <div className="flip-card-inner">
                        <div className="flip-card-front">
                            <img src={images("./security1.jpg")} alt="Avatar"/>
                            <div className="text">Reduce Data Breaches</div>
                        </div>
                        <div className="flip-card-back">
                            <h1>Reduce Data Breaches</h1>
                            <p>Get live visibility into leakage of third-party secret tokens.</p>
                            {
                                (user)
                                    ?
                                    <Link to="/account" className="button">Dashboard</Link>
                                    :
                                    <div className="button" onClick={() => openRegisterModal()}>Register</div>
                            }
                        </div>
                    </div>
                </div>


            </div>

            <div className="modal" style={{display: showLogin}}>
                <div className="form">
                    <div className="form-title" style={{"textAlign":"center", "width": "100%"}}>Welcome Back!</div>
                    <div className="form-content">
                        <label>Email:</label>
                        <input type="email" placeholder="Type in your registered email" onChange={(e) => {e.preventDefault();setLoginEmail(e.target.value);}}  value={loginEmail}></input>
                        <label>Password:</label>
                        <input type="password" placeholder="Type in your password" onChange={(e) => {e.preventDefault();setLoginPassword(e.target.value);}}  value={loginPassword}></input>
                    </div>
                    <div className="buttons">
                        <div className="explore-button" onClick={onLoginSubmit}>Login</div>
                        <div className="explore-button close" onClick={closeModal}>Close</div>
                    </div>
                    <div className="extra-line" onClick={() => openRegisterModal()}>New to SecuriCash? Sign Up</div>
                </div>
            </div>

            <div className="modal" style={{display: showRegister}}>
                <div className="form">
                    <div className="form-title" style={{"textAlign":"center", "width": "100%"}}>Welcome to SecuriCash 🔐</div>
                    <div className="extra-line">Detect Cloud Security Threats</div>
                    <div className="form-content">
                        <label>Name:</label>
                        <input type="text" placeholder="Type in your full name" onChange={(e) => {e.preventDefault();setRegisterName(e.target.value);}}  value={registerName}></input>
                        <label>Email:</label>
                        <input type="email" placeholder="Type in your registered email" onChange={(e) => {e.preventDefault();setRegisterEmail(e.target.value);}} value={registerEmail}></input>
                        <label>Password:</label>
                        <input type="password" placeholder="Type in your password" onChange={(e) => {e.preventDefault();setRegisterPassword(e.target.value);}} value={registerPassword}></input>
                    </div>
                    <div className="buttons">
                        <div className="explore-button" onClick={() => onRegisterSubmit()}>Register</div>
                        <div className="explore-button close" onClick={closeModal}>Close</div>
                    </div>
                    <div className="extra-line" onClick={() => openLoginModal()}>Already a member? Log in</div>
                </div>
            </div>

        </div>
    );
}