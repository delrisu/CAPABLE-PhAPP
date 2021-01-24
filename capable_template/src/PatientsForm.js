import React, { Component } from 'react';
import Carousel             from 'react-bootstrap/Carousel';
import Modal                from 'react-bootstrap/Modal'
import { Button }           from 'reactstrap';
import "./bootstrap.min.css";
import "./styles.css";

class PatientsForm extends Component {

    constructor (props) {
        super(props);
        if (this.props.data === false) {
            this.state = {
                fname: "",
                sname: "",
                birthDate: "",
                gender: "",
                weight: 0,
                height: 0,
                bmi: 0,
                yearsSmoking: 0,
                yearsDrinking: 0,
                dyssomnia: 0,
                diabetes: 0,
                hypertension: 0,
                collagenVascular: 0,
                ibd: 0,
                gastroOperation: 0,
                physicalActivity: 'None',
                additional_info: ""
            };
        }
        else {
            this.state = {
                fname: this.props.data.fname,
                sname: this.props.data.sname,
                birthDate: this.props.data.birthDate,
                gender: this.props.data.gender,
                weight: this.props.data.weight,
                height: this.props.data.height,
                bmi: this.props.data.bmi,
                yearsSmoking: this.props.data.yearsSmoking,
                yearsDrinking: this.props.data.yearsDrinking,
                dyssomnia: this.props.data.dyssomnia,
                diabetes: this.props.data.diabetes,
                hypertension: this.props.data.hypertension,
                collagenVascular: this.props.data.collagenVascular,
                ibd: this.props.data.ibd,
                gastroOperation: this.props.data.gastroOperation,
                physicalActivity: this.props.data.physicalActivity,
                additional_info: ""
            };
        }
        this.codes = {
            weight:             27113001,
            height:             50373000,
            bmi:                60621009,
            smoker:             77176002,
            drinker:            219006,
            dyssomnia:          44186003,
            diabetes_mellitus:  73211009,
            hypertension:       38341003,
            collagenVascular:   398049005,
            ibd:                24526004,
            physicalActivity:   68130003,
            gastro_operation:   386621005,
            diet:               230125005,
            cm:                 258672001,
            kg:                 258683005,
            years:              258707000,
            per_week:           259038000
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeBMI = this.handleChangeBMI.bind(this);
        this.handleBMI = this.handleBMI.bind(this);
        this.addNewPatient = this.addNewPatient.bind(this);
        this.createObservation = this.createObservation.bind(this);
        this.addNewPatient = this.addNewPatient.bind(this);
        this.updatePatient = this.updatePatient.bind(this);
        this.createCommunication = this.createCommunication.bind(this);
    }

    handleChange (event) {
        this.setState({ [event.target.name]: event.target.value });
        console.log(event.target.value);
    }

    handleBMI () {
        (this.state.weight !== 0 && this.state.height !== 0) ? this.setState({bmi: parseFloat(this.state.weight/Math.pow(this.state.height/100,2)).toFixed(2)}) : this.setState({bmi: 0})
        console.log(this.state.bmi)
    }

    handleChangeBMI (event) {
        this.setState({ [event.target.name]: event.target.value},() => {
            this.handleBMI();
        });
    }

    createObservation(obsCode, obsTypeVal, patientId, valCode, obsDisplay, valueUnit) {
        if (valCode === 0) {
            return {
                resourceType: "Observation",
                status: "final",
                code: {
                    coding: [{
                        system: "http://snomed.info/sct",
                        code: obsCode,
                        display: obsDisplay
                    } ]
                },
                subject: {
                    reference: "Patient/" + patientId
                },
                valueQuantity: {
                    value: obsTypeVal
                }
            }
        }
        else {
            return {
                resourceType: "Observation",
                status: "final",
                code: {
                    coding: [{
                        system: "http://snomed.info/sct",
                        code: obsCode,
                        display: obsDisplay
                    } ]
                },
                subject: {
                    reference: "Patient/" + patientId
                },
                valueQuantity: {
                    value: obsTypeVal,
                    unit: valueUnit,
                    system: "http://snomed.info/sct",
                    code: valCode
                }
            }
        }
    }

    createCommunication(type, resourceId, obsArray) {
        if (type === "Patient") {
            return {
                resourceType: "Communication",
                status: "completed",
                payload: [
                    {
                        contentReference: {
                            reference: "Patient/" + resourceId,
                            type: "Patient",
                            identifier: {
                                value: resourceId.toString()
                            }
                        }
                    }
                ]
            }
        }
        else if (type === "Single Communication") {
            return {
                resourceType: "Communication",
                status: "in-progress",
                payload: [
                    {
                        contentReference: {
                            reference: "Observation" + resourceId,
                            type: "Observation",
                            identifier: {
                                value: resourceId.toString()
                            }
                        }
                    }
                ]
            }
        }
        else {
            return {
                resourceType: "Communication",
                status: "in-progress",
                payload: [
                    {
                        contentReference: {
                            reference: "Observation/" + obsArray[0],
                            type: "Observation",
                            identifier: {
                                value: obsArray[0]
                            }
                        }
                    },
                    {
                        contentReference: {
                            reference: "Observation/" + obsArray[1],
                            type: "Observation",
                            identifier: {
                                value: obsArray[1]
                            }
                        }
                    },
                    {
                        contentReference: {
                            reference: "Observation/" + obsArray[2],
                            type: "Observation",
                            identifier: {
                                value: obsArray[2]
                            }
                        }
                    },
                    {
                        contentReference: {
                            reference: "Observation/" + obsArray[3],
                            type: "Observation",
                            identifier: {
                                value: obsArray[3]
                            }
                        }
                    },
                    {
                        contentReference: {
                            reference: "Observation/" + obsArray[4],
                            type: "Observation",
                            identifier: {
                                value: obsArray[4]
                            }
                        }
                    },
                    {
                        contentReference: {
                            reference: "Observation/" + obsArray[5],
                            type: "Observation",
                            identifier: {
                                value: obsArray[5]
                            }
                        }
                    },
                    {
                        contentReference: {
                            reference: "Observation/" + obsArray[6],
                            type: "Observation",
                            identifier: {
                                value: obsArray[6]
                            }
                        }
                    },
                    {
                        contentReference: {
                            reference: "Observation/" + obsArray[7],
                            type: "Observation",
                            identifier: {
                                value: obsArray[7]
                            }
                        }
                    },
                    {
                        contentReference: {
                            reference: "Observation/" + obsArray[8],
                            type: "Observation",
                            identifier: {
                                value: obsArray[8]
                            }
                        }
                    },
                    {
                        contentReference: {
                            reference: "Observation/" + obsArray[9],
                            type: "Observation",
                            identifier: {
                                value: obsArray[9]
                            }
                        }
                    },
                    {
                        contentReference: {
                            reference: "Observation/" + obsArray[10],
                            type: "Observation",
                            identifier: {
                                value: obsArray[10]
                            }
                        }
                    }
                ]
            }
        }
    }
    async addNewPatient () {
        let allObservations = [];
        let entry = {
                resourceType: "Patient",
                name: [ 
                    {
                        family: this.state.sname,
                        given: [
                            this.state.fname
                        ]
                    }],
                gender: this.state.gender,
                birthDate: this.state.birthDate
        }

        let resource = await this.props.client.create({resourceType: "Patient", body: entry})

        // let entryPatient = this.createCommunication("Patient", resource.id, null);
        // this.props.client.create({resourceType: "Communication", body: entryPatient});

        let entryObs = this.createObservation(this.codes.height, this.state.height, resource.id, this.codes.cm, "Body height measure", "Centimeter");
        await this.props.client.create({resourceType: "Observation", body: entryObs}) // height
            .then((resource2) => {
                allObservations.push(resource2.id)
            })
        entryObs = this.createObservation(this.codes.weight, this.state.weight, resource.id, this.codes.kg, "Body weight", "Kg");
        await this.props.client.create({resourceType: "Observation", body: entryObs}) // weight
            .then((resource2) => {
                allObservations.push(resource2.id)
            })
        entryObs = this.createObservation(this.codes.bmi, this.state.bmi, resource.id, 0, "Body mass index", null);
        await this.props.client.create({resourceType: "Observation", body: entryObs}) // bmi
            .then((resource2) => {
                allObservations.push(resource2.id)
            })
        entryObs = this.createObservation(this.codes.smoker, this.state.yearsSmoking, resource.id, this.codes.years, "Smoker", "years");
        await this.props.client.create({resourceType: "Observation", body: entryObs}) // smoker
            .then((resource2) => {
                allObservations.push(resource2.id)
            })
        entryObs = this.createObservation(this.codes.drinker, this.state.yearsDrinking, resource.id, this.codes.years, "Drinker", "years");
        await this.props.client.create({resourceType: "Observation", body: entryObs}) // drinker
            .then((resource2) => {
                allObservations.push(resource2.id)
            })
        entryObs = this.createObservation(this.codes.dyssomnia, this.state.dyssomnia, resource.id, 0, "Dyssomnia", null);
        await this.props.client.create({resourceType: "Observation", body: entryObs}) // dyssomnia
            .then((resource2) => {
                allObservations.push(resource2.id)
            })
        entryObs = this.createObservation(this.codes.diabetes_mellitus, this.state.diabetes, resource.id, 0, "Diabetes mellitus", null);
        await this.props.client.create({resourceType: "Observation", body: entryObs}) // diabetes mellitus
            .then((resource2) => {
                allObservations.push(resource2.id)
            })
        entryObs = this.createObservation(this.codes.hypertension, this.state.hypertension, resource.id, 0, "Hypertensive disorder", null);
        await this.props.client.create({resourceType: "Observation", body: entryObs}) // hypertension
            .then((resource2) => {
                allObservations.push(resource2.id)
            })
        entryObs = this.createObservation(this.codes.collagenVascular, this.state.collagenVascular, resource.id, 0, "Collagen vascular", null);
        await this.props.client.create({resourceType: "Observation", body: entryObs}) // collagen vascular
            .then((resource2) => {
                allObservations.push(resource2.id)
            })
        entryObs = this.createObservation(this.codes.ibd, this.state.ibd, resource.id, 0, "Inflammatory bowel disease", null);
        await this.props.client.create({resourceType: "Observation", body: entryObs}) // ibd
            .then((resource2) => {
                allObservations.push(resource2.id)
            })
        entryObs = this.createObservation(this.codes.physicalActivity, this.state.physicalActivity, resource.id, this.codes.per_week, "Physical activity", "per week");
        await this.props.client.create({resourceType: "Observation", body: entryObs}) // physical activity
            .then((resource2) => {
                allObservations.push(resource2.id)
            })

        let entryComm = this.createCommunication("Communication", null, allObservations);
        await this.props.client.create({resourceType: "Communication", body: entryComm});
        window.location.reload(false);
    }

    async updatePatient () {
        let entryObs, entryComm;
        let entry = {
            resourceType: "Patient",
            name: [ 
                {
                    family: this.state.sname,
                    given: [
                        this.state.fname
                    ]
                }],
            gender: this.state.gender,
            birthDate: this.state.birthDate
        };

        const resource = await this.props.client.update({resourceType: "Patient", id: this.props.data.id, body: entry})
        console.log("Update response:")
        console.log(resource)
        if (this.state.height !== this.props.data.height) { // height
            entryObs = this.createObservation(this.codes.height, this.state.height, this.props.data.id, this.codes.cm, "Body height measure", "Centimeter");
            this.props.client.update({resourceType: "Observation", id: this.props.data.heightID, body: entryObs});
            entryComm = this.createCommunication("Communication", this.props.data.heightID, null);
            this.props.client.create({resourceType: "Communication", body: entryComm});
        }
        if (this.state.weight !== this.props.data.weight) {// weight
            entryObs = this.createObservation(this.codes.weight, this.state.weight, this.props.data.id, this.codes.kg, "Body weight", "Kg");
            this.props.client.update({resourceType: "Observation", id: this.props.data.weightID, body: entryObs});
            entryComm = this.createCommunication("Communication", this.props.data.weightID, null);
            this.props.client.create({resourceType: "Communication", body: entryComm});
        }
        if (this.state.bmi !== this.props.data.bmi) { // bmi
            entryObs = this.createObservation(this.codes.bmi, this.state.bmi, this.props.data.id, 0, "Body mass index", null);
            this.props.client.update({resourceType: "Observation", id: this.props.data.bmiID, body: entryObs});
            entryComm = this.createCommunication("Communication", this.props.data.bmiID, null);
            this.props.client.create({resourceType: "Communication", body: entryComm});
        }
        if (this.state.yearsSmoking !== this.props.data.yearsSmoking) { // smoker
            entryObs = this.createObservation(this.codes.smoker, this.state.yearsSmoking, this.props.data.id, this.codes.years, "Smoker", "years");
            this.props.client.update({resourceType: "Observation", id: this.props.data.yearsSmokingID, body: entryObs});
            entryComm = this.createCommunication("Communication", this.props.data.yearsSmokingID, null);
            this.props.client.create({resourceType: "Communication", body: entryComm});
        }
        if (this.state.yearsDrinking !== this.props.data.yearsDrinking) { // drinker
            entryObs = this.createObservation(this.codes.drinker, this.state.yearsDrinking, this.props.data.id, this.codes.years, "Drinker", "years");
            this.props.client.update({resourceType: "Observation", id: this.props.data.yearsDrinkingID, body: entryObs});
            entryComm = this.createCommunication("Communication", this.props.data.yearsDrinkingID, null);
            this.props.client.create({resourceType: "Communication", body: entryComm});
        }
        if (this.state.dyssomnia !== this.props.data.dyssomnia) { // dyssomnia
            entryObs = this.createObservation(this.codes.dyssomnia, this.state.dyssomnia, this.props.data.id, 0, "Dyssomnia", null);
            this.props.client.update({resourceType: "Observation", id: this.props.data.dyssomniaID, body: entryObs});
            entryComm = this.createCommunication("Communication", this.props.data.dyssomniaID, null);
            this.props.client.create({resourceType: "Communication", body: entryComm});
        }
        if (this.state.diabetes !== this.props.data.diabetes) { // diabetes mellitus
            entryObs = this.createObservation(this.codes.diabetes_mellitus, this.state.diabetes, this.props.data.id, 0, "Diabetes mellitus", null);
            this.props.client.update({resourceType: "Observation", id: this.props.data.diabetesID, body: entryObs});
            entryComm = this.createCommunication("Communication", this.props.data.diabetesID, null);
            this.props.client.create({resourceType: "Communication", body: entryComm});
        }
        if (this.state.hypertension !== this.props.data.hypertension) { // hypertension
            entryObs = this.createObservation(this.codes.hypertension, this.state.hypertension, this.props.data.id, 0, "Hypertensive disorder", null);
            this.props.client.update({resourceType: "Observation", id: this.props.data.hypertensionID, body: entryObs});
            entryComm = this.createCommunication("Communication", this.props.data.hypertensionID, null);
            this.props.client.create({resourceType: "Communication", body: entryComm});
        }
        if (this.state.collagenVascular !== this.props.data.collagenVascular) { // collagen vascular
            entryObs = this.createObservation(this.codes.collagenVascular, this.state.collagenVascular, this.props.data.id, 0, "Collagen vascular", null);
            this.props.client.update({resourceType: "Observation", id: this.props.data.collagen_vascularID, body: entryObs});
            entryComm = this.createCommunication("Communication", this.props.data.collagen_vascularID, null);
            this.props.client.create({resourceType: "Communication", body: entryComm});
        }
        if (this.state.ibd !== this.props.data.ibd) { // ibd
            entryObs = this.createObservation(this.codes.ibd, this.state.ibd, this.props.data.id, 0, "Inflammatory bowel disease", null);
            this.props.client.update({resourceType: "Observation", id: this.props.data.ibdID, body: entryObs});
            entryComm = this.createCommunication("Communication", this.props.data.ibdID, null);
            this.props.client.create({resourceType: "Communication", body: entryComm});
        }
        if (this.state.physicalActivity !== this.props.data.physicalActivity) { // physical activity
            entryObs = this.createObservation(this.codes.physicalActivity, this.state.physicalActivity, this.props.data.id, this.codes.per_week, "Physical activity", "per week");
            this.props.client.update({resourceType: "Observation", id: this.props.data.physical_activityID, body: entryObs}); 
            entryComm = this.createCommunication("Communication", this.props.data.physical_activityID, null);
            this.props.client.create({resourceType: "Communication", body: entryComm});
        }
    }

    render() {

        if (this.props.data === false) {
            return (
                <Modal
                    //{...this.props}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    show={this.props.show}
                    onHide={this.props.onHide}
                >
                <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Adding a new patient ...
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <form>
                <Carousel interval={null} wrap={false}>
                    <Carousel.Item>
                        <div className="form-controller">
                            <div className="form-row" id="section-label">Personal data</div>
                            <div className="form-row">
                                <div className="form-group col-md-3">
                                    <label htmlFor="fname">First name</label>
                                    <input type="text" 
                                            name="fname" 
                                            onChange={this.handleChange}
                                            id="fname"
                                            className="form-control"
                                    />
                                </div>
                                <div className="form-group col-md-3">
                                    <label htmlFor="sname">Last name</label>
                                    <input type="text" 
                                            name="sname" 
                                            onChange={this.handleChange}
                                            id="sname"
                                            className="form-control"
                                    />
                                </div>
                                <div className="form-group col-md-3">
                                    <label htmlFor="birthDate">Date of birth</label>
                                    <input type="date" 
                                            name="birthDate" 
                                            onChange={this.handleChange}
                                            id="birthDate"
                                            className="form-control"
                                    />
                                </div>
                                <div className="form-group col-md-3">
                                    <label htmlFor="gender">Gender</label>
                                    <select name="gender" 
                                            onChange={this.handleChange}
                                            id="gender"
                                            className="form-control">
                                        <option value="" selected disabled hidden>Choose...</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col-md-2">
                                    <label htmlFor="height">Height [cm]</label>
                                    <input type="number" 
                                            name="height" 
                                            onChange={this.handleChangeBMI}
                                            id="height"
                                            className="form-control"
                                    />
                                </div>
                                <div className="form-group col-md-2">
                                    <label htmlFor="weight">Weight [kg]</label>
                                    <input type="number"
                                            name="weight" 
                                            onChange={this.handleChangeBMI}
                                            id="weight"
                                            className="form-control"
                                    />
                                </div>
                                <div className="form-group col-md-2">
                                    <label htmlFor="bmi">BMI</label>
                                    <input type="number" 
                                            name="bmi" 
                                            value={this.state.bmi}
                                            id="bmi"
                                            className="form-control"
                                            disabled
                                    />
                                </div>
                            </div>                 
                        </div>
                    </Carousel.Item>
                    <Carousel.Item>
                        <div className="form-controller">
                        <div className="form-row" id="section-label">Medical data</div>
                            <div className="form-row">
                                <div className="form-group col-md-4">
                                    <label htmlFor="diabetes">Diabetes</label>
                                    <select name="diabetes" 
                                            onChange={this.handleChange}
                                            id="diabetes"
                                            className="form-control">
                                        <option value="" selected disabled hidden>Choose...</option>
                                        <option value={0}>False</option>
                                        <option value={1}>True</option>
                                    </select>
                                </div>
                                <div className="form-group col-md-4">
                                    <label htmlFor="hypertension">Hypertension</label>
                                    <select name="hypertension" 
                                            onChange={this.handleChange}
                                            id="hypertension"
                                            className="form-control">
                                        <option value="" selected disabled hidden>Choose...</option>
                                        <option value={0}>False</option>
                                        <option value={1}>True</option>
                                    </select>
                                </div>
                                <div className="form-group col-md-4">
                                    <label htmlFor="collagenVascular">Collagen vascular</label>
                                    <select name="collagenVascular" 
                                            onChange={this.handleChange}
                                            id="collagenVascular"
                                            className="form-control">
                                        <option value="" selected disabled hidden>Choose...</option>
                                        <option value={0}>False</option>
                                        <option value={1}>True</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col-md-4">
                                    <label htmlFor="ibd">IBD</label>
                                    <select name="ibd" 
                                            onChange={this.handleChange}
                                            id="ibd"
                                            className="form-control">
                                        <option value="" selected disabled hidden>Choose...</option>
                                        <option value={0}>False</option>
                                        <option value={1}>True</option>
                                    </select>
                                </div>
                                <div className="form-group col-md-4">
                                    <label htmlFor="gastroOperation">Previous intestial surgery</label>
                                    <select name="gastroOperation" 
                                            onChange={this.handleChange}
                                            id="gastroOperation"
                                            className="form-control">
                                        <option value="" selected disabled hidden>Choose...</option>
                                        <option value={0}>False</option>
                                        <option value={1}>True</option>
                                    </select>
                                </div>
                                <div className="form-group col-md-4">
                                    <label htmlFor="physicalActivity">Physical activity</label>
                                    <select name="physicalActivity" 
                                            onChange={this.handleChange}
                                            id="physicalActivity"
                                            className="form-control">
                                        <option value="" selected disabled hidden>Choose...</option>
                                        <option value={0}>Practically none</option>
                                        <option value={0.5}>On average once per 2 weeks</option>
                                        <option value={1}>On average once a week</option>
                                        <option value={2}>On average twice a week</option>
                                        <option value={3}>At least 3 times a week</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col-md-4">
                                    <label htmlFor="dyssomnia">Sleeping problems</label>
                                    <select name="dyssomnia" 
                                            onChange={this.handleChange}
                                            id="dyssomnia"
                                            className="form-control">
                                        <option value="" selected disabled hidden>Choose...</option>
                                        <option value={0}>False</option>
                                        <option value={1}>True</option>
                                    </select>
                                </div>
                                <div className="form-group col-md-4">
                                    <label htmlFor="yearsSmoking">Years as a smoker</label>
                                    <input type="number" 
                                            name="yearsSmoking" 
                                            onChange={this.handleChange}
                                            id="yearsSmoking"
                                            className="form-control"
                                        />
                                </div>
                                <div className="form-group col-md-4">
                                    <label htmlFor="yearsDrinking">Years as a drinker</label>
                                    <input type="number"
                                            name="yearsDrinking" 
                                            onChange={this.handleChange}
                                            id="yearsDrinking"
                                            className="form-control"
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col-md-12">
                                <label htmlFor="additional_info">Additional info</label>
                                    <textarea
                                            name="additional_info" 
                                            onChange={this.handleChange}
                                            id="additional_info"
                                            className="form-control textarea"
                                        ></textarea>
                                </div>
                            </div>   
                        </div>
                    </Carousel.Item>
                </Carousel>
                </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => {this.addNewPatient(); this.props.onHide()}}>Add</Button>
                    <Button onClick={this.props.onHide}>Close</Button>
                </Modal.Footer>
            </Modal>
            )
        }
        else {
            return (
                <Modal
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    show={this.props.show}
                    onHide={this.props.onHide}
                >
                <Modal.Header closeButton>
                  <Modal.Title id="contained-modal-title-vcenter">
                    Editing patient's data ...
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <form>
                <Carousel interval={null} wrap={false}>
                    <Carousel.Item>
                        <div className="form-controller">
                            <div className="form-row" id="section-label">Personal data</div>
                            <div className="form-row">
                                <div className="form-group col-md-3">
                                    <label htmlFor="fname">First name</label>
                                    <input type="text" 
                                            name="fname" 
                                            onChange={this.handleChange}
                                            id="fname"
                                            className="form-control"
                                            value={this.props.data.fname}
                                            disabled={true}
                                    />
                                </div>
                                <div className="form-group col-md-3">
                                    <label htmlFor="sname">Last name</label>
                                    <input type="text" 
                                            name="sname" 
                                            onChange={this.handleChange}
                                            id="sname"
                                            className="form-control"
                                            value={this.props.data.sname}
                                            disabled={true}
                                    />
                                </div>
                                <div className="form-group col-md-3">
                                    <label htmlFor="birthDate">Date of birth</label>
                                    <input type="text" 
                                            name="birthDate" 
                                            onChange={this.handleChange}
                                            id="birthDate"
                                            className="form-control"
                                            value={this.props.data.birthDate}
                                            disabled={true}
                                    />
                                </div>
                                <div className="form-group col-md-3">
                                    <label htmlFor="gender">Gender</label>
                                    <select name="gender" 
                                            onChange={this.handleChange}
                                            id="gender"
                                            className="form-control"
                                            value={this.state.gender}>
                                        <option value="" selected disabled hidden>Choose...</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col-md-2">
                                    <label htmlFor="height">Height [cm]</label>
                                    <input type="number" 
                                            name="height" 
                                            onChange={this.handleChangeBMI}
                                            id="height"
                                            className="form-control"
                                            value={this.state.height}
                                    />
                                </div>
                                <div className="form-group col-md-2">
                                    <label htmlFor="weight">Weight [kg]</label>
                                    <input type="number"
                                            name="weight" 
                                            onChange={this.handleChangeBMI}
                                            id="weight"
                                            className="form-control"
                                            value={this.state.weight}
                                    />
                                </div>
                                <div className="form-group col-md-2">
                                    <label htmlFor="bmi">BMI</label>
                                    <input type="number" 
                                            name="bmi" 
                                            value={this.state.bmi}
                                            id="bmi"
                                            className="form-control"
                                            //value={this.props.data.bmi}
                                            disabled
                                    />
                                </div>
                            </div>                 
                        </div>
                    </Carousel.Item>
                    <Carousel.Item>
                        <div className="form-controller">
                        <div className="form-row" id="section-label">Medical data</div>
                            <div className="form-row">
                                <div className="form-group col-md-4">
                                    <label htmlFor="diabetes">Diabetes</label>
                                    <select name="diabetes" 
                                            onChange={this.handleChange}
                                            id="diabetes"
                                            className="form-control"
                                            value={this.state.diabetes}>
                                        <option value="" selected disabled hidden>Choose...</option>
                                        <option value={0}>False</option>
                                        <option value={1}>True</option>
                                    </select>
                                </div>
                                <div className="form-group col-md-4">
                                    <label htmlFor="hypertension">Hypertension</label>
                                    <select name="hypertension" 
                                            onChange={this.handleChange}
                                            id="hypertension"
                                            className="form-control"
                                            value={this.state.hypertension}>
                                        <option value="" selected disabled hidden>Choose...</option>
                                        <option value={0}>False</option>
                                        <option value={1}>True</option>
                                    </select>
                                </div>
                                <div className="form-group col-md-4">
                                    <label htmlFor="collagenVascular">Collagen vascular</label>
                                    <select name="collagenVascular" 
                                            onChange={this.handleChange}
                                            id="collagenVascular"
                                            className="form-control"
                                            value={this.state.collagenVascular}>
                                        <option value="" selected disabled hidden>Choose...</option>
                                        <option value={0}>False</option>
                                        <option value={1}>True</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col-md-4">
                                    <label htmlFor="ibd">IBD</label>
                                    <select name="ibd" 
                                            onChange={this.handleChange}
                                            id="ibd"
                                            className="form-control"
                                            value={this.state.ibd}>
                                        <option value="" selected disabled hidden>Choose...</option>
                                        <option value={0}>False</option>
                                        <option value={1}>True</option>
                                    </select>
                                </div>
                                <div className="form-group col-md-4">
                                    <label htmlFor="gastroOperation">Previous intestial surgery</label>
                                    <select name="gastroOperation" 
                                            onChange={this.handleChange}
                                            id="gastroOperation"
                                            className="form-control"
                                            value={this.state.gastroOperation}>
                                        <option value="" selected disabled hidden>Choose...</option>
                                        <option value={0}>False</option>
                                        <option value={1}>True</option>
                                    </select>
                                </div>
                                <div className="form-group col-md-4">
                                    <label htmlFor="physicalActivity">Physical activity</label>
                                    <select name="physicalActivity" 
                                            onChange={this.handleChange}
                                            id="physicalActivity"
                                            className="form-control"
                                            value={this.state.physicalActivity}>
                                        <option value="" selected disabled hidden>Choose...</option>
                                        <option value={0}>Practically none</option>
                                        <option value={0.5}>On average once per 2 weeks</option>
                                        <option value={1}>On average once a week</option>
                                        <option value={2}>On average twice a week</option>
                                        <option value={3}>At least 3 times a week</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col-md-4">
                                    <label htmlFor="dyssomnia">Sleeping problems</label>
                                    <select name="dyssomnia" 
                                            onChange={this.handleChange}
                                            id="dyssomnia"
                                            className="form-control"
                                            value={this.state.dyssomnia}>
                                        <option value="" selected disabled hidden>Choose...</option>
                                        <option value={0}>False</option>
                                        <option value={1}>True</option>
                                    </select>
                                </div>
                                <div className="form-group col-md-4">
                                    <label htmlFor="yearsSmoking">Years as a smoker</label>
                                    <input type="number" 
                                            name="yearsSmoking" 
                                            onChange={this.handleChange}
                                            id="yearsSmoking"
                                            className="form-control"
                                            value={this.state.yearsSmoking}
                                        />
                                </div>
                                <div className="form-group col-md-4">
                                    <label htmlFor="yearsDrinking">Years as a drinker</label>
                                    <input type="number"
                                            name="yearsDrinking" 
                                            onChange={this.handleChange}
                                            id="yearsDrinking"
                                            className="form-control"
                                            value={this.state.yearsDrinking}
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col-md-12">
                                <label htmlFor="additional_info">Additional info</label>
                                    <textarea
                                            name="additional_info" 
                                            onChange={this.handleChange}
                                            id="additional_info"
                                            className="form-control textarea"
                                        ></textarea>
                                </div>
                            </div>   
                        </div>
                    </Carousel.Item>
                </Carousel>
                </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => {this.updatePatient(); this.props.onHide()}}>Save</Button>
                    <Button onClick={this.props.onHide}>Close</Button>
                </Modal.Footer>
              </Modal>
            )
        }
    }
}

export default PatientsForm;