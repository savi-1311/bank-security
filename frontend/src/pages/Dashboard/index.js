import React from 'react';
import TawkTo from 'tawkto-react'
import './styles.css';
import PluginCard from "../../components/pluginCard/index"
import { toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import loggedInUser from "../../services/auth.service";
import { useLocation } from "react-router-dom"

export default function Dashboard(props)
{
    const m = new Map();
    const location = useLocation();
    const user = loggedInUser();
    const [pluginDetails,setPluginDetails] = React.useState([]);
    const [pluginMetadata,setPluginMetaData] = React.useState(m);
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [loader, setLoader] = React.useState(false);


    React.useEffect((key, value) => {
        if(loggedInUser())
        {
            console.log(location);
            setPluginDetails(location.state.account.scanStatus);
            setPluginMetaData(location.state.pluginsMetadata);
            setIsLoaded(true);
        }

        var tawk = new TawkTo(process.env.REACT_APP_TAWK_ID, "default")

        tawk.onStatusChange((status) =>
        {
            console.log(status);
        })

    }, [isLoaded])

    async function rescan(){

        const headers={
            "Authorization": user.token
        }

        var scanObject = {
            "userId": user.id,
            "accountId": location.state.account._id
        }
        setLoader(true);
        const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/scanAll`, scanObject, {"headers": headers});
        setLoader(false);
        if(response.status==200)
        {
            toast.success("Scanned Successfully");
            console.log(response.data);
            setPluginDetails(response.data.accounts[0].scanStatus);
        }
        else
        {
            toast.danger(response.data.msg);
        }
    }

    return(
        <>
        <div className="center-container-row">
            <div className="heading-text">{location.state.account.name}</div>
            <div className="dashboard">
                <div className="resources-button" onClick={() => rescan()}>Rescan</div>
            </div>
            <div className="center-container-column" style={{"width": "1000px", "flexDirection": "column" }}>
                {
                    (loader)
                        ?
                        <div className="lds-ring">
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                        :
                        <>
                            {pluginDetails.map(plugin => (
                                <PluginCard pluginMetaData={pluginMetadata[plugin.pluginId]} issue={plugin}/>
                            ))}
                        </>
                }
            </div>
        </div>
        </>
    );
}