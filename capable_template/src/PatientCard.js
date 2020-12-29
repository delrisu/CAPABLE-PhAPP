import { Modal, Row } from "react-bootstrap";
import "./bootstrap.min.css";
import "./styles.css";

function convertToBool(input) {
    if (input === 0) {
        return "False"
    }
    else {
        return "True"
    }
} 

export default function PatientCard({show, onHide, data}) {
    return (
        <Modal
            //{...this.props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            show={show}
            onHide={onHide}
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                        Patient's card
                </Modal.Title>
            </Modal.Header>
                <Modal.Body>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            First name: 
                        </div>
                        <div className="form-group col-md-6">
                            <b><i>{data.fname}</i></b>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            Second name: 
                        </div>
                        <div className="form-group col-md-6">
                            <b><i>{data.sname}</i></b>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            Date of birth: 
                        </div>
                        <div className="form-group col-md-6">
                            <b><i>{data.birthDate}</i></b>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            Gender: 
                        </div>
                        <div className="form-group col-md-6">
                            <b><i>{data.gender}</i></b>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            Weight: 
                        </div>
                        <div className="form-group col-md-6">
                            <b><i>{data.weight} kg</i></b>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            Height: 
                        </div>
                        <div className="form-group col-md-6">
                            <b><i>{data.height} cm</i></b>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            BMI: 
                        </div>
                        <div className="form-group col-md-6">
                            <b><i>{data.bmi}</i></b>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            Years smoking: 
                        </div>
                        <div className="form-group col-md-6">
                            <b><i>{data.yearsSmoking}</i></b>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            Years drinking: 
                        </div>
                        <div className="form-group col-md-6">
                            <b><i>{data.yearsDrinking}</i></b>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            Dyssomnia: 
                        </div>
                        <div className="form-group col-md-6">
                            <b><i>{convertToBool(data.dyssomnia)}</i></b>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            Diabetes mellitus: 
                        </div>
                        <div className="form-group col-md-6">
                            <b><i>{convertToBool(data.diabetes)}</i></b>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            Hypertension: 
                        </div>
                        <div className="form-group col-md-6">
                            <b><i>{convertToBool(data.hypertension)}</i></b>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            Collagen vascular: 
                        </div>
                        <div className="form-group col-md-6">
                            <b><i>{convertToBool(data.collagenVascular)}</i></b>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            IBD: 
                        </div>
                        <div className="form-group col-md-6">
                            <b><i>{convertToBool(data.ibd)}</i></b>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            Recent gastro operation: 
                        </div>
                        <div className="form-group col-md-6">
                            <b><i>{convertToBool(data.gastroOperation)}</i></b>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            Physical activity (average): 
                        </div>
                        <div className="form-group col-md-6">
                            <b><i>{data.physicalActivity}x per week</i></b>
                        </div>
                    </div>
                </Modal.Body>
            <Modal.Footer>

            </Modal.Footer>
        </Modal>
    )
}