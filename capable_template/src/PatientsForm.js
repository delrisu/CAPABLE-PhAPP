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
                f_name: "",
                s_name: "",
                born: "",
                gender: "",
                weight: 0,
                height: 0,
                bmi: 0,
                years_smoking: "",
                years_drinking: "",
                sleep_problems: 0,
                diabetes: 0,
                hypertension: 0,
                collagen_vascular: 0,
                ibd: 0,
                prev_intestial_surgery: 0,
                phys_activity: 'None',
                additional_info: "",
                beganEdit: false
            };
        }
        else {
            this.state = {
                f_name: this.props.data.fname,
                s_name: this.props.data.sname,
                born: this.props.data.birthDate,
                gender: this.props.data.gender,
                weight: this.props.data.weight,
                height: this.props.data.height,
                bmi: this.props.data.bmi,
                years_smoking: this.props.data.yearsSmoking,
                years_drinking: this.props.data.yearsDrinking,
                sleep_problems: this.props.data.dyssomnia,
                diabetes: this.props.data.diabetes,
                hypertension: this.props.data.hypertension,
                collagen_vascular: this.props.data.collagen_vascular,
                ibd: this.props.data.ibd,
                prev_intestial_surgery: this.props.data.gastroOperation,
                phys_activity: this.props.data.physical_activity,
                additional_info: "",
                beganEdit: true
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
            collagen_vascular:  398049005,
            ibd:                24526004,
            physical_activity:  68130003,
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

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
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

    addNewPatient () {
        let entry = {
                resourceType: "Patient",
                name: [ 
                    {
                        family: this.state.s_name,
                        given: [
                            this.state.f_name
                        ]
                    }],
                gender: this.state.gender,
                birthDate: this.state.born
        }
        // console.log(this.props.client)
        this.props.client.create({resourceType: "Patient", body: entry})
            .then((resource) => {
                // console.log(resource)
                let entryObs = this.createObservation(this.codes.height, this.state.height, resource.id, this.codes.cm, "Body height measure", "Centimeter");
                this.props.client.create({resourceType: "Observation", body: entryObs}); // height
                entryObs = this.createObservation(this.codes.weight, this.state.weight, resource.id, this.codes.kg, "Body weight", "Kg");
                this.props.client.create({resourceType: "Observation", body: entryObs});// weight
                entryObs = this.createObservation(this.codes.bmi, this.state.bmi, resource.id, 0, "Body mass index", null);
                this.props.client.create({resourceType: "Observation", body: entryObs}); // bmi
                entryObs = this.createObservation(this.codes.smoker, this.state.years_smoking, resource.id, this.codes.years, "Smoker", "years");
                this.props.client.create({resourceType: "Observation", body: entryObs}); // smoker
                entryObs = this.createObservation(this.codes.drinker, this.state.years_drinking, resource.id, this.codes.years, "Drinker", "years");
                this.props.client.create({resourceType: "Observation", body: entryObs}); // drinker
                entryObs = this.createObservation(this.codes.dyssomnia, this.state.sleep_problems, resource.id, 0, "Dyssomnia", null);
                this.props.client.create({resourceType: "Observation", body: entryObs}); // dyssomnia
                entryObs = this.createObservation(this.codes.diabetes_mellitus, this.state.diabetes, resource.id, 0, "Diabetes mellitus", null);
                this.props.client.create({resourceType: "Observation", body: entryObs}); // diabetes mellitus
                entryObs = this.createObservation(this.codes.hypertension, this.state.hypertension, resource.id, 0, "Hypertensive disorder", null);
                this.props.client.create({resourceType: "Observation", body: entryObs}); // hypertension
                entryObs = this.createObservation(this.codes.collagen_vascular, this.state.collagen_vascular, resource.id, 0, "Collagen vascular", null);
                this.props.client.create({resourceType: "Observation", body: entryObs}); // collagen vascular
                entryObs = this.createObservation(this.codes.ibd, this.state.ibd, resource.id, 0, "Inflammatory bowel disease", null);
                this.props.client.create({resourceType: "Observation", body: entryObs}); // ibd
                entryObs = this.createObservation(this.codes.physical_activity, this.state.phys_activity, resource.id, this.codes.per_week, "Physical activity", "per week");
                this.props.client.create({resourceType: "Observation", body: entryObs}); // physical activity
            }) 
    }

    async updatePatient () {
        let entry = {
            resourceType: "Patient",
            name: [ 
                {
                    family: this.state.s_name,
                    given: [
                        this.state.f_name
                    ]
                }],
            gender: this.state.gender,
            birthDate: this.state.born
        };

        let entryObs;
        const resource = await this.props.client.update({resourceType: "Patient", id: this.props.data.id, body: entry})
        console.log("Update response:")
        console.log(resource)
        if (this.state.height !== this.props.data.height) {
            entryObs = this.createObservation(this.codes.height, this.state.height, this.props.data.id, this.codes.cm, "Body height measure", "Centimeter");
            await this.props.client.update({resourceType: "Observation", id: this.props.data.heightID, body: entryObs}); // height
        }
        if (this.state.weight !== this.props.data.weight) {
            entryObs = this.createObservation(this.codes.weight, this.state.weight, this.props.data.id, this.codes.kg, "Body weight", "Kg");
            this.props.client.update({resourceType: "Observation", id: this.props.data.weightID, body: entryObs});// weight
        }
        if (this.state.bmi !== this.props.data.bmi) {
            entryObs = this.createObservation(this.codes.bmi, this.state.bmi, this.props.data.id, 0, "Body mass index", null);
            this.props.client.update({resourceType: "Observation", id: this.props.data.bmiID, body: entryObs}); // bmi
        }
        if (this.state.years_smoking !== this.props.data.yearsSmoking) {
            entryObs = this.createObservation(this.codes.smoker, this.state.years_smoking, this.props.data.id, this.codes.years, "Smoker", "years");
            this.props.client.update({resourceType: "Observation", id: this.props.data.yearsSmokingID, body: entryObs}); // smoker
        }
        if (this.state.years_drinking !== this.props.data.yearsDrinking) {
            entryObs = this.createObservation(this.codes.drinker, this.state.years_drinking, this.props.data.id, this.codes.years, "Drinker", "years");
            this.props.client.update({resourceType: "Observation", id: this.props.data.yearsDrinkingID, body: entryObs}); // drinker
        }
        if (this.state.sleep_problems !== this.props.data.dyssomnia) {
            entryObs = this.createObservation(this.codes.dyssomnia, this.state.sleep_problems, this.props.data.id, 0, "Dyssomnia", null);
            this.props.client.update({resourceType: "Observation", id: this.props.data.dyssomniaID, body: entryObs}); // dyssomnia
        }
        if (this.state.diabetes !== this.props.data.diabetes) {
            entryObs = this.createObservation(this.codes.diabetes_mellitus, this.state.diabetes, this.props.data.id, 0, "Diabetes mellitus", null);
            this.props.client.update({resourceType: "Observation", id: this.props.data.diabetesID, body: entryObs}); // diabetes mellitus
        }
        if (this.state.hypertension !== this.props.data.hypertension) {
            entryObs = this.createObservation(this.codes.hypertension, this.state.hypertension, this.props.data.id, 0, "Hypertensive disorder", null);
            this.props.client.update({resourceType: "Observation", id: this.props.data.hypertensionID, body: entryObs}); // hypertension
        }
        if (this.state.collagen_vascular !== this.props.data.collagen_vascular) {
            entryObs = this.createObservation(this.codes.collagen_vascular, this.state.collagen_vascular, this.props.data.id, 0, "Collagen vascular", null);
            this.props.client.update({resourceType: "Observation", id: this.props.data.collagen_vascularID, body: entryObs}); // collagen vascular
        }
        if (this.state.ibd !== this.props.data.ibd) {
            entryObs = this.createObservation(this.codes.ibd, this.state.ibd, this.props.data.id, 0, "Inflammatory bowel disease", null);
            this.props.client.update({resourceType: "Observation", id: this.props.data.ibdID, body: entryObs}); // ibd
        }
        if (this.state.phys_activity !== this.props.data.physical_activity) {
            entryObs = this.createObservation(this.codes.physical_activity, this.state.phys_activity, this.props.data.id, this.codes.per_week, "Physical activity", "per week");
            this.props.client.update({resourceType: "Observation", id: this.props.data.physical_activityID, body: entryObs}); // physical activity
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
                                    <label htmlFor="f_name">First name</label>
                                    <input type="text" 
                                            name="f_name" 
                                            onChange={this.handleChange}
                                            id="f_name"
                                            className="form-control"
                                    />
                                </div>
                                <div className="form-group col-md-3">
                                    <label htmlFor="s_name">Last name</label>
                                    <input type="text" 
                                            name="s_name" 
                                            onChange={this.handleChange}
                                            id="s_name"
                                            className="form-control"
                                    />
                                </div>
                                <div className="form-group col-md-3">
                                    <label htmlFor="born">Date of birth</label>
                                    <input type="date" 
                                            name="born" 
                                            onChange={this.handleChange}
                                            id="born"
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
                                    <label htmlFor="collagen_vascular">Collagen vascular</label>
                                    <select name="collagen_vascular" 
                                            onChange={this.handleChange}
                                            id="collagen_vascular"
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
                                    <label htmlFor="prev_intestial_surgery">Previous intestial surgery</label>
                                    <select name="prev_intestial_surgery" 
                                            onChange={this.handleChange}
                                            id="prev_intestial_surgery"
                                            className="form-control">
                                        <option value="" selected disabled hidden>Choose...</option>
                                        <option value={0}>False</option>
                                        <option value={1}>True</option>
                                    </select>
                                </div>
                                <div className="form-group col-md-4">
                                    <label htmlFor="phys_activity">Physical activity</label>
                                    <select name="phys_activity" 
                                            onChange={this.handleChange}
                                            id="phys_activity"
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
                                    <label htmlFor="sleep_problems">Sleeping problems</label>
                                    <select name="sleep_problems" 
                                            onChange={this.handleChange}
                                            id="sleep_problems"
                                            className="form-control">
                                        <option value="" selected disabled hidden>Choose...</option>
                                        <option value={0}>False</option>
                                        <option value={1}>True</option>
                                    </select>
                                </div>
                                <div className="form-group col-md-4">
                                    <label htmlFor="years_smoking">Years as a smoker</label>
                                    <input type="number" 
                                            name="years_smoking" 
                                            onChange={this.handleChange}
                                            id="years_smoking"
                                            className="form-control"
                                        />
                                </div>
                                <div className="form-group col-md-4">
                                    <label htmlFor="years_drinking">Years as a drinker</label>
                                    <input type="number"
                                            name="years_drinking" 
                                            onChange={this.handleChange}
                                            id="years_drinking"
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
                                    <label htmlFor="f_name">First name</label>
                                    <input type="text" 
                                            name="f_name" 
                                            onChange={this.handleChange}
                                            id="f_name"
                                            className="form-control"
                                            value={this.props.data.fname}
                                            disabled={true}
                                    />
                                </div>
                                <div className="form-group col-md-3">
                                    <label htmlFor="s_name">Last name</label>
                                    <input type="text" 
                                            name="s_name" 
                                            onChange={this.handleChange}
                                            id="s_name"
                                            className="form-control"
                                            value={this.props.data.sname}
                                            disabled={true}
                                    />
                                </div>
                                <div className="form-group col-md-3">
                                    <label htmlFor="born">Date of birth</label>
                                    <input type="text" 
                                            name="born" 
                                            onChange={this.handleChange}
                                            id="born"
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
                                    <label htmlFor="collagen_vascular">Collagen vascular</label>
                                    <select name="collagen_vascular" 
                                            onChange={this.handleChange}
                                            id="collagen_vascular"
                                            className="form-control"
                                            value={this.state.collagen_vascular}>
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
                                    <label htmlFor="prev_intestial_surgery">Previous intestial surgery</label>
                                    <select name="prev_intestial_surgery" 
                                            onChange={this.handleChange}
                                            id="prev_intestial_surgery"
                                            className="form-control"
                                            value={this.state.prev_intestial_surgery}>
                                        <option value="" selected disabled hidden>Choose...</option>
                                        <option value={0}>False</option>
                                        <option value={1}>True</option>
                                    </select>
                                </div>
                                <div className="form-group col-md-4">
                                    <label htmlFor="phys_activity">Physical activity</label>
                                    <select name="phys_activity" 
                                            onChange={this.handleChange}
                                            id="phys_activity"
                                            className="form-control"
                                            value={this.state.phys_activity}>
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
                                    <label htmlFor="sleep_problems">Sleeping problems</label>
                                    <select name="sleep_problems" 
                                            onChange={this.handleChange}
                                            id="sleep_problems"
                                            className="form-control"
                                            value={this.state.sleep_problems}>
                                        <option value="" selected disabled hidden>Choose...</option>
                                        <option value={0}>False</option>
                                        <option value={1}>True</option>
                                    </select>
                                </div>
                                <div className="form-group col-md-4">
                                    <label htmlFor="years_smoking">Years as a smoker</label>
                                    <input type="number" 
                                            name="years_smoking" 
                                            onChange={this.handleChange}
                                            id="years_smoking"
                                            className="form-control"
                                            value={this.state.years_smoking}
                                        />
                                </div>
                                <div className="form-group col-md-4">
                                    <label htmlFor="years_drinking">Years as a drinker</label>
                                    <input type="number"
                                            name="years_drinking" 
                                            onChange={this.handleChange}
                                            id="years_drinking"
                                            className="form-control"
                                            value={this.state.years_drinking}
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