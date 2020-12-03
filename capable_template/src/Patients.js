import React        from 'react';
import { Button }   from 'reactstrap';
import Modal        from 'react-bootstrap/Modal'
import PatientsForm from './PatientsForm';
import "./styles.css";
import "./bootstrap.min.css";


function MyVerticallyCenteredModal(props) {
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Adding a new patient ...
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <PatientsForm />
        </Modal.Body>
        <Modal.Footer>
            <Button onClick={props.onHide}>Add</Button>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }

export default function Patients() {

    const [modalShow, setModalShow] = React.useState(false);
    
        const { FHIRClient } = require('fhir-crud-client');

    const BASE_URL = 'http://10.131.46.196:8080/baseR4/';
    const HEADERS = {
      Accept: 'application/json',
    };
 
    const client = new FHIRClient(BASE_URL, HEADERS);
    
    client.read({ resourceType: 'Patient', id: '1/_history/1' })
      .then((resource) => {
      console.log(resource);
    });

    return (
        <div className="content-main">
            <h1><span className="badge badge-dark">Patients</span></h1>
            <div className="content-whiteboard">
                <div className="patients-top-bar">
                    <div className="patients-top-bar-left">
                        
                    </div>
                    <div className="patients-top-bar-right">
                        <Button color="primary" onClick={() => setModalShow(true)}>
                            + Add a new patient
                        </Button>
                    </div>
                </div>
                <MyVerticallyCenteredModal
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                />
            </div>
        </div>
    )
}
