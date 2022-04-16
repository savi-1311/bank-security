import React from 'react';
import {Link} from "react-router-dom";
import './styles.css';
import aws from "../../images/aws.svg"

export default function SquareCard(props)
{
    return(
        <div className="square-card">
            <img src={aws} alt={"aws-logo"}/>
            <br/>
            <Link to={"/dashboard"} className="link label" state={{account: props.account, pluginsMetadata: props.pluginMetadata}}> {props.account.name}</Link>
        </div>
    )
}