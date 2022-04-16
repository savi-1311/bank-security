import React from 'react';
import {Link} from "react-router-dom";
import './styles.css';
import aws from "../../images/aws.svg"

export default function PluginCard(props)
{
    const [showResourceModal, setShowResourceModal] = React.useState("none");

    function openResourceModal()
    {
        setShowResourceModal("flex");
    }

    function closeResourceModal()
    {
        setShowResourceModal("none");
    }


    return(
        <>
            <div className="modal" style={{display: showResourceModal}}>
                <div className="plugin-form">
                    <div className="p-title">
                        <div className="title-text">{props.pluginMetaData.name}</div>
                        <div className="explore-button close" onClick={closeResourceModal} style={{"backgroundColor": "rgb(32, 188, 249)"}}>Close</div>
                    </div>
                    <div className="description-text">
                        <b>Description:</b><br/>
                        {props.pluginMetaData.description}
                    </div>

                    <div className="description-text">
                        <b>Remediation Steps:</b><br/>
                        {props.pluginMetaData.remediation}
                    </div>

                    {
                        (props.issue.data.affectedResources.length===0)
                            ?
                            <div className="description-text">
                                <b>No Affected Resources</b>
                            </div>
                            :
                            <div className="description-text">
                                <b>Affected Resources:</b><br/>
                                <div className="affected-table">
                                    {props.issue.data.affectedResources.map(plugin => (
                                        <div className="plugin-row">
                                            <div className="plugin-identifier" style={{"width": "100%", "justifyContent": "flex-start"}}>
                                                <div className="circle" style={{"backgroundColor": "#E40A2D", "width": "27px"}}></div>
                                                <div className="plugin-identifier-text">{plugin}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                    }

                    {
                        (props.issue.data.exposedPorts.length===0)
                            ?
                            <div className="description-text"></div>
                            :
                            <div className="description-text">
                                <b>Open Ports:</b><br/>
                                <div className="affected-table">
                                    {props.issue.data.exposedPorts.map(plugin => (
                                        <div className="plugin-row">
                                        <div className="plugin-identifier" style={{"width": "100%", "justifyContent": "flex-start"}}>
                                            <div className="circle" style={{"backgroundColor": "#E40A2D", "width": "27px"}}></div>
                                            <div className="plugin-identifier-text">{plugin}</div>
                                        </div>
                                        </div>
                                    ))}
                                </div>
                        </div>
                    }

                    <div className="description-text">
                        <b>Compliances Covered:</b><br/>
                        <div className="affected-table">
                            {props.pluginMetaData.compliance.map(plugin => (
                                <div className="plugin-row">
                                    <div className="plugin-identifier" style={{"width": "100%", "justifyContent": "flex-start"}}>
                                        <div className="circle" style={{"backgroundColor": "#cccccc", "width": "27px"}}></div>
                                        <div className="plugin-identifier-text">{plugin}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>

            <div className="plugin-row">
                <div className="plugin-row-left">
                    <div className="plugin-identifier">
                        {
                            (props.issue.data.affectedResources.length===0)
                                ?
                                <>
                                    <div className="circle" style={{"backgroundColor": "#cccccc"}}></div>
                                    <div className="plugin-identifier-text">SAFE</div>
                                </>
                                :
                                <>
                                    <div className="circle" style={{"backgroundColor": "#E40A2D"}}></div>
                                    <div className="plugin-identifier-text">ISSUE</div>
                                </>
                        }
                    </div>
                    <div className="plugin-title">
                        <img src={aws} alt="aws-logo"/>{props.pluginMetaData.name}
                    </div>
                </div>
                <div className="plugin-row-right">
                    {
                        (props.issue.data.affectedResources.length===0)
                            ?
                            <div className="resources-button" onClick={() => openResourceModal()}>Read More</div>
                            :
                            <div className="resources-button" onClick={() => openResourceModal()}>Affected Resources</div>
                    }
                </div>
            </div>
        </>
    )
}


// <div className="explore-button close" onClick={closeResourceModal}>Close</div>