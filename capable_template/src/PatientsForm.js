import React, { Component } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import Modal        from 'react-bootstrap/Modal'
import { Button }   from 'reactstrap';
import "./bootstrap.min.css";
import "./styles.css";

class PatientsForm extends Component {

    constructor () {
        super();
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
            therapy: "",
            other_treatments: "",
            sleep_problems: 0,
            diabetes: 0,
            hypertension: 0,
            collagen_vascular: 0,
            ibd: 0,
            prev_intestial_surgery: 0,
            phys_activity: 'None',
            diet: "",
            additional_info: ""
        };
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
            kg:                 258672001,
            years:              258707000,
            per_week:           259038000
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeBMI = this.handleChangeBMI.bind(this);
        this.handleBMI = this.handleBMI.bind(this);
        this.addNewPatient = this.addNewPatient.bind(this);
        this.createObservation = this.createObservation.bind(this);
        this.addNewPatient = this.addNewPatient.bind(this);
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
            //console.log(event.target.value);
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
                    code: obsCode
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
        console.log(this.props.client)
        this.props.client.create({resourceType: "Patient", body: entry})
                .then((resource) => {
                    console.log(resource)
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
  

    render() {
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
                    <   div className="form-row" id="section-label">Medical data</div>
                        <div className="form-row">
                            <div className="form-group col-md-6">
                            <label htmlFor="therapy">Therapy</label>
                                <input type="text" 
                                        name="therapy" 
                                        onChange={this.handleChange}
                                        id="therapy"
                                        className="form-control"
                                    />
                            </div>
                            <div className="form-group col-md-6">
                            <label htmlFor="other_treatments">Other treatments</label>
                                <input type="text" 
                                        name="other_treatments" 
                                        onChange={this.handleChange}
                                        id="other_treatments"
                                        className="form-control"
                                    />
                            </div>
                        </div>
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
                            <div className="form-group col-md-3">
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
                            <div className="form-group col-md-3">
                                <label htmlFor="diet">Diet</label>
                                <input type="text" 
                                        name="diet" 
                                        onChange={this.handleChange}
                                        id="diet"
                                        className="form-control"
                                    />
                            </div>
                            <div className="form-group col-md-3">
                                <label htmlFor="years_smoking">Years as a smoker</label>
                                <input type="number" 
                                        name="years_smoking" 
                                        onChange={this.handleChange}
                                        id="years_smoking"
                                        className="form-control"
                                    />
                            </div>
                            <div className="form-group col-md-3">
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
                <Button onClick={this.addNewPatient}>Add</Button>
                <Button onClick={this.props.onHide}>Close</Button>
            </Modal.Footer>
          </Modal>
        )
    }
}

export default PatientsForm;