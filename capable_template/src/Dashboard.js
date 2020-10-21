import React from 'react'
import "./bootstrap.min.css";
import "./styles.css";


export default function Dashboard() {
    return (
        <div className="content-main">
           <h1><span className="badge badge-dark">Dashboard</span></h1>
           <div className="dash-container">
               <div className="row">
                    <div className="col">
                        <div className="dash-box-small">
                            <div className="dashbox-title">

                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="dash-box-small">
                            <div className="dashbox-title">

                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="dash-box-small">
                            <div className="dashbox-title">

                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="dash-box-small">
                            <div className="dashbox-title">

                            </div>
                        </div>
                    </div>
               </div>
               <div className="row">
                    <div className="col">
                        <div className="dash-box">
                            <div className="dashbox-title">

                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="dash-box">
                            <div className="dashbox-title">

                            </div>
                        </div>
                    </div>
               </div>
           </div>
        </div>
    )
}
