import React from 'react';
import './styles.css';
import SquareCard from "../../components/squareCard/index"
import { toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import loggedInUser from "../../services/auth.service"
import {Link} from "react-router-dom";

export default function Account()
{
    const user = loggedInUser();
    const [showRegister, setShowRegister] = React.useState("none");
    const [registerName, setRegisterName] = React.useState("");
    const [registerEmail, setRegisterEmail] = React.useState("");
    const [registerPassword, setRegisterPassword] = React.useState("");
    const [userAccounts,setUserAccounts] = React.useState([]);
    const [pluginMetadata,setPluginMetaData] = React.useState({});
    const [isLoaded, setIsLoaded] = React.useState(false);

    React.useEffect(() => {
        if(loggedInUser())
        {
            (async () => {
                const headers={
                    "Authorization": user.token
                }
                const requestData = {
                    userId: user.id
                }
                const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/listAccounts`, requestData, {"headers": headers});
                if(response.status==200)
                {
                    console.log(response.data);
                    setUserAccounts(response.data.accounts);
                    setPluginMetaData(response.data.plugins);
                }
                else
                {
                    toast.error("Error occured. Please try again by refreshing the page.");
                }
                setIsLoaded(true);
            })()
        }
    }, [isLoaded])

    function openRegisterModal(){
        setShowRegister("flex");
    }

    async function onRegisterSubmit(){

        const headers={
            "Authorization": user.token
        }

        var registerObject = {
            "name": registerName,
            "accessKey": registerEmail,
            "secret": registerPassword,
            "userId": user.id
        }
        const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/registerAccount`, registerObject, {"headers": headers});
        console.log(response);
        if(response.status==200)
        {
            toast.success(response.data.msg);
        }
        setShowRegister("none");
        window.location.reload();
    }

    function closeModal(){
        setShowRegister("none");
    }

    return(
        <>
            <div className="modal" style={{display: showRegister}}>
                <div className="form" style={{"height": "auto"}}>
                    <div className="form-title" style={{"textAlign":"center", "width": "100%"}}>Add Your AWS Account</div>
                    <div className="extra-line">For detailed onboarding steps refer the <Link to="/onboarding">onboarding</Link> article.</div>
                    <br></br>
                    <div className="form-content">
                        <label>Account Name:</label>
                        <input type="text" placeholder="Give the account a name" onChange={(e) => {e.preventDefault();setRegisterName(e.target.value);}}  value={registerName}></input>
                        <label>Access Token:</label>
                        <input type="text" placeholder="Type in the access key" onChange={(e) => {e.preventDefault();setRegisterEmail(e.target.value);}} value={registerEmail}></input>
                        <label>Secret:</label>
                        <input type="text" placeholder="Type in the secret key" onChange={(e) => {e.preventDefault();setRegisterPassword(e.target.value);}} value={registerPassword}></input>
                    </div>
                    <div className="buttons">
                        <div className="explore-button" onClick={() => onRegisterSubmit()}>Add Account</div>
                        <div className="explore-button close" onClick={closeModal}>Close</div>
                    </div>
                </div>
            </div>

            <div className="center-container-row">
                <div className="heading-text">Your Accounts</div>
                <div className="center-container-column" style={{"width": "1000px"}}>
                    {userAccounts.map(account => (
                        <>
                            <SquareCard account={account} pluginMetadata={pluginMetadata}/>
                        </>
                    ))}
                    <div className="square-card" style={{"justifyContent":"center"}} onClick={() => openRegisterModal()}>Add Account</div>
                </div>
            </div>

        </>
    );
}