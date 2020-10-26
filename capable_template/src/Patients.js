import React        from 'react';
import { Button }   from 'reactstrap';
import Modal        from 'react-bootstrap/Modal'
import ModalHeader  from 'react-bootstrap/ModalHeader';
import ModalTitle   from 'react-bootstrap/ModalTitle';
import ModalBody    from 'react-bootstrap/ModalBody'
import ModalFooter  from 'react-bootstrap/ModalFooter'
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

    return (
        <div className="content-main">
            <h1><span className="badge badge-dark">Patients</span></h1>
            <div className="content-whiteboard">
                <div className="patients-top-bar">
                    <div className="patients-top-bar-left">
                        
                    </div>
                    <div className="patients-top-bar-right">
                        <Button color="primary" onClick={() => setModalShow(true)}>
                            + Add new patient
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
