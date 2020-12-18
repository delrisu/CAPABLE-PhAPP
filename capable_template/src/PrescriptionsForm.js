import React, { Component } from 'react';
import Carousel             from 'react-bootstrap/Carousel';
import Modal                from 'react-bootstrap/Modal'
import { Button }           from 'reactstrap';
import "./bootstrap.min.css";
import "./styles.css";

class PrescriptionForm extends Component {

    constructor (props) {
        super(props);
        if (this.props.data === false) {
            this.state = {
                id:             '',
                patient:        '', //this.props.data
                medicine:       '',
                medicineCode:   '',
                from:           '',
                to:             '',
                asNeeded:       0,
                frequency:      0,
                period:         0,
                periodUnit:     '',
                doseValue:      0,
                doseUnit:       '',
                dosing:         ''
            };
        }
        else {
            this.state = {
                id:             this.props.data.id,
                patient:        this.props.data.patient,
                medicine:       this.props.data.medicine,
                medicineCode:   this.props.data.medicineCode,
                from:           this.props.data.from,
                to:             this.props.data.to,
                asNeeded:       this.props.data.asNeeded,
                frequency:      this.props.data.frequency,
                period:         this.props.data.period,
                periodUnit:     this.props.data.periodUnit,
                doseValue:      this.props.data.doseValue,
                doseUnit:       this.props.data.doseUnit,
                dosing:         this.props.data.dosing
            };
        }
        this.codes = {
            mg:             258684004,
            codeine:        387494007,
            morphine:       373529000,
            nivolumab:      704191007,
            sunitinib:      421192001,
            loperamide:     387040009,
            budesonide:     395726003,
            st_johns_wort:  412515006
        }
        this.handleChange = this.handleChange.bind(this);
        this.createPrescription = this.createPrescription.bind(this);
        this.addNewPrescription = this.addNewPrescription.bind(this);
        this.updatePrescription = this.updatePrescription.bind(this);
    }

    handleChange (event) {
        this.setState({ [event.target.name]: event.target.value });
        console.log(event.target.value);
    }

    createPrescription(obsCode, obsTypeVal, patientId, valCode, obsDisplay, valueUnit) {
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

    addNewPrescription (medCode, medDisplay) {
        let entry = {
                resourceType: "MedicationRequest",
                status: "active",
                intent: "order",
                medicationCodeableConcept: {
                    coding: [{
                        system: "http://snomed.info/sct",
                        code: medCode,
                        display: medDisplay
                    }]
                },
                subject: {
                    reference: this.state.patient
                },
                dosageIntruction: [{
                    text: this.state.dosing,
                    timing: {
                        repeat: {
                            boundsPeriod: {
                                start: this.state.begin,
                                end: this.state.end
                            },
                            frequency: this.state.frequency,
                            period: this.state.period,
                            periodUnit: this.state.periodUnit
                        }
                    },
                    asNeededBoolean: this.state.asNeeded,
                    doseAndRate: [{
                        doseQuantity: {
                            value: this.state.doseValue,
                            unit: this.state.doseUnit,
                            system: "http://snomed.info/sct",
                            code: this.codes.mg
                        }
                    }]
                }]
        }
        // console.log(this.props.client)
        this.props.client.create({resourceType: "MedicationRequest", body: entry})
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

    async updatePrescription () {
        let entry = {
            resourceType: "MedicationRequest",
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
                    Adding a new prescription ...
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <form>
                    <div className="form-controller">
                        <div className="form-row">
                            <div className="form-group col-md-3">
                                <label htmlFor="medication">Medication</label>
                                <select name="medication" 
                                        onChange={this.handleChange}
                                        id="medication"
                                        className="form-control">
                                    <option value="" selected disabled hidden>Choose...</option>
                                    <optgroup label="for cancer">
                                        <option value="codeine">Codeine</option>
                                        <option value="morphine">Morphine</option>
                                        <option value="nivolumab">Nivolumab</option>
                                        <option value="sunitinib">Sunitinib</option>
                                    </optgroup>
                                    <optgroup label="for side effects">
                                        <option value="loperamide">Loperamide</option>
                                        <option value="budesonide">Budesonide</option>
                                    </optgroup>
                                    <optgroup label="for other problems">
                                        <option value="st john's wort">St John's Wort</option>
                                    </optgroup>
                                </select>
                            </div>
                        </div>
                        <div className="form-row" id="section-label">Using period</div>
                        <div className="form-row">
                            <div className="form-group col-md-4">
                                <label htmlFor="from">Begin</label>
                                <input type="date" 
                                        name="from" 
                                        onChange={this.handleChange}
                                        id="from"
                                        className="form-control"
                                />
                            </div>
                            <div className="form-group col-md-4">
                                <label htmlFor="end">End</label>
                                <input type="date"
                                        name="end" 
                                        onChange={this.handleChange}
                                        id="end"
                                        className="form-control"
                                />
                            </div>
                        </div>                 
                        <div className="form-row">
                            <div className="form-group col-md-4">
                                <label htmlFor="asNeeded">Take as needed</label>
                                <select name="asNeeded" 
                                        onChange={this.handleChange}
                                        id="asNeeded"
                                        className="form-control">
                                    <option value="" selected disabled hidden>Choose...</option>
                                    <option value={0}>False</option>
                                    <option value={1}>True</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-row" id="section-label">Dosing</div>
                        <div className="form-row">
                            <div className="form-group col-md-2">
                                <input type="number"
                                        name="doseValue"
                                        onChange={this.handleChange}
                                        id="doseValue"
                                        className="form-control"
                                />
                            </div>
                            <div className="form-group col-md-1">
                                <select name="doseUnit"
                                        onChange={this.handleChange}
                                        id="doseUnit"
                                        className="form-control">
                                    <option value="" selected disabled hidden>Choose...</option>
                                    <option value="mg">mg</option>
                                </select>
                            </div>
                            <div className="form-group col-md-2">
                                <input type="number"
                                        name="frequency"
                                        onChange={this.handleChange}
                                        id="frequency"
                                        className="form-control"
                                />
                            </div>
                            <div className="form-group col-md-3">times every</div>
                            <div className="form-group col-md-2">
                                <input type="number"
                                        name="period"
                                        onChange={this.handleChange}
                                        id="period"
                                        className="form-control"
                                />
                            </div>
                            <div className="form-group col-md-2">
                                <select name="periodUnit" 
                                        onChange={this.handleChange}
                                        id="periodUnit"
                                        className="form-control">
                                    <option value="" selected disabled hidden>Choose...</option>
                                    <option value="min">minute(s)</option>
                                    <option value="h">hour(s)</option>
                                    <option value="d">day(s)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => {this.addNewPrescription(); this.props.onHide()}}>Add</Button>
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
                    <div className="form-controller">
                        <div className="form-row">
                            <div className="form-group col-md-4">
                                <label htmlFor="medication">Medication</label>
                                <select name="medication" 
                                        onChange={this.handleChange}
                                        id="medication"
                                        className="form-control"
                                        value={this.state.medication}
                                        disabled>
                                    <option value="" selected disabled hidden>Choose...</option>
                                    <optgroup label="for cancer">
                                        <option value="codeine">Codeine</option>
                                        <option value="morphine">Morphine</option>
                                        <option value="nivolumab">Nivolumab</option>
                                        <option value="sunitinib">Sunitinib</option>
                                    </optgroup>
                                    <optgroup label="for side effects">
                                        <option value="loperamide">Loperamide</option>
                                        <option value="budesonide">Budesonide</option>
                                    </optgroup>
                                    <optgroup label="for other problems">
                                        <option value="st john's wort">St John's Wort</option>
                                    </optgroup>
                                </select>
                            </div>
                        </div>
                        <div className="form-row" id="section-label">Using period</div>
                        <div className="form-row">
                            <div className="form-group col-md-4">
                                <label htmlFor="from">Begin</label>
                                <input type="date" 
                                        name="from" 
                                        onChange={this.handleChange}
                                        id="from"
                                        className="form-control"
                                        value={this.state.begin}
                                />
                            </div>
                            <div className="form-group col-md-4">
                                <label htmlFor="end">End</label>
                                <input type="date"
                                        name="end" 
                                        onChange={this.handleChange}
                                        id="end"
                                        className="form-control"
                                        value={this.state.end}
                                />
                            </div>
                        </div>                 
                        <div className="form-row">
                            <div className="form-group col-md-4">
                                <label htmlFor="asNeeded">Take as needed</label>
                                <select name="asNeeded" 
                                        onChange={this.handleChange}
                                        id="asNeeded"
                                        className="form-control"
                                        value={this.state.asNeeded}>
                                    <option value="" selected disabled hidden>Choose...</option>
                                    <option value={0}>False</option>
                                    <option value={1}>True</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-row" id="section-label">Dosing</div>
                        <div className="form-row">
                            <div className="form-group col-md-2">
                                <input type="number"
                                        name="doseValue"
                                        onChange={this.handleChange}
                                        id="doseValue"
                                        className="form-control"
                                        value={this.state.doseValue}
                                />
                            </div>
                            <div className="form-group col-md-1">
                                <select name="doseUnit"
                                        onChange={this.handleChange}
                                        id="doseUnit"
                                        className="form-control"
                                        value={this.state.doseUnit}>
                                    <option value="" selected disabled hidden>Choose...</option>
                                    <option value="mg">mg</option>
                                </select>
                            </div>
                            <div className="form-group col-md-2">
                                <input type="number"
                                        name="frequency"
                                        onChange={this.handleChange}
                                        id="frequency"
                                        className="form-control"
                                        value={this.state.frequency}
                                />
                            </div>
                            <div className="form-group col-md-3">times every</div>
                            <div className="form-group col-md-2">
                                <input type="number"
                                        name="period"
                                        onChange={this.handleChange}
                                        id="period"
                                        className="form-control"
                                        value={this.state.period}
                                />
                            </div>
                            <div className="form-group col-md-2">
                                <select name="periodUnit" 
                                        onChange={this.handleChange}
                                        id="periodUnit"
                                        className="form-control"
                                        value={this.state.periodUnit}>
                                    <option value="" selected disabled hidden>Choose...</option>
                                    <option value="min">minute(s)</option>
                                    <option value="h">hour(s)</option>
                                    <option value="d">day(s)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => {this.updatePrescription(); this.props.onHide()}}>Save</Button>
                    <Button onClick={this.props.onHide}>Close</Button>
                </Modal.Footer>
              </Modal>
            )
        }
    }
}

export default PrescriptionForm;