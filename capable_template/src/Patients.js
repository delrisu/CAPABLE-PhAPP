import React from 'react'
import "./styles.css";
import "./bootstrap.min.css";

export default function Page1() {
    return (
        <div className="content-main">
            <h1><span className="badge badge-dark">Patients</span></h1>
            <div className="content-whiteboard">
                <div className="patients-top-bar">
                    <div className="patients-top-bar-left">
                        
                    </div>
                    <div className="patients-top-bar-right">
                        <button type="button" class="btn btn-primary">+ Add new patient</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
