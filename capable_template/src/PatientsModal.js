import React, { Component, useMemo, useState, useEffect }        from 'react';
import { Button }   from 'reactstrap';
import PatientsForm from './PatientsForm';
import "./styles.css";
import "./bootstrap.min.css";

export default function PatientsModal() {

    const [modalShow, setModalShow] = React.useState(false);

    return (
        <div>
        <div className="patients-top-bar">
            <div className="patients-top-bar-left">
                        
                     </div>
                     <div className="patients-top-bar-right">
                         <Button color="primary" onClick={() => setModalShow(true)}>
                             + Add a new patient
                         </Button>
                     </div>
        </div>
                 <PatientsForm
                     show={modalShow}
                     onHide={() => setModalShow(false)}
                 />
        </div>
    )
}