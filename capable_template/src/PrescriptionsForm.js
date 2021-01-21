import React, { Component } from 'react';
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
                patient:        this.props.patient, //this.props.data
                medicine:       '',
                medicineCode:   '',
                from:           '',
                to:             '',
                asNeeded:       false,
                frequency:      0,
                period:         0,
                periodUnit:     '',
                doseValue:      0,
                doseUnit:       'mg',
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
        this.codesRev = {
            258684004:  "mg",
            387494007:  "Codeine",
            373529000:  "Morphine",
            704191007:  "Nivolumab",
            421192001:  "Sunitinib",
            387040009:  "Loperamide",
            395726003:  "Budesonide",
            412515006:  "St John's Wort"
        }
        this.handleChange = this.handleChange.bind(this);
        this.addNewPrescription = this.addNewPrescription.bind(this);
        this.updatePrescription = this.updatePrescription.bind(this);
    }

    handleChange (event) {
        this.setState({ [event.target.name]: event.target.value });
        console.log(event.target.value);
    }

    async addNewPrescription () {
        let tmpStr = this.state.frequency + "x " + this.state.doseValue + this.state.doseUnit + " every " + this.state.period + " " + this.state.periodUnit
        this.state.dosing = tmpStr;
        console.log("Dosing:")
        console.log(this.state.dosing)
        switch(this.state.medicine) {
            case "Nivolumab":
                this.state.medicineCode = this.codes.nivolumab;
                break;
            case "Codeine":
                this.state.medicineCode = this.codes.codeine;
                break;
            case "Morphine":
                this.state.medicineCode = this.codes.morphine;
                break;
            case "Sunitinib":
                this.state.medicineCode = this.codes.sunitinib;
                break;
            case "Loperamide":
                this.state.medicineCode = this.codes.loperamide;
                break;
            case "Budesonide":
                this.state.medicineCode = this.codes.budesonide;
                break;
            case "St John's Wort":
                this.state.medicineCode = this.codes.st_johns_wort;
                break;
            default:
                break;
        }
        
        let entry = {
                resourceType: "MedicationRequest",
                status: "active",
                intent: "order",
                medicationCodeableConcept: {
                    coding: [{
                        system: "http://snomed.info/sct",
                        code: this.state.medicineCode,
                        display: this.state.medicine
                    }]
                },
                subject: {
                    reference: "Patient/" + this.state.patient
                },
                dosageInstruction: [{
                    text: this.state.dosing,
                    timing: {
                        repeat: {
                            boundsPeriod: {
                                start: this.state.from,
                                end: this.state.to
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
        let response = await this.props.client.create({resourceType: "MedicationRequest", body: entry})
            .then((resource) => {
                let entryComm = {
                    resourceType: "Communication",
                    status: "in-progress",
                    payload: [
                        {
                            contentReference: {
                                reference: "MedicationRequest/" + resource.id,
                                type: "MedicationRequest",
                                identifier: {
                                    value: resource.id
                                }
                            }
                        }
                    ]
                }

                this.props.client.create({resourceType: "Communication", body: entryComm});
            })
    }

    async updatePrescription () {
        let tmpStr = this.state.frequency + "x " + this.state.doseValue + this.state.doseUnit + " every " + this.state.period + " " + this.state.periodUnit
        this.state.dosing = tmpStr;
        let entry = {
            resourceType: "MedicationRequest",
            id: this.state.id,
            status: "active",
            intent: "order",
            dosageInstruction: [{
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
    let response = await this.props.client.update({resourceType: "MedicationRequest", id: this.state.id, body: entry})
    }

    render() {

        if (this.props.data === false) {
            console.log("State: " + this.state.patient)
            console.log("Props: " + this.props.patient)
            console.log("Full state:")
            console.log(this.state)
            return (
                <Modal
                    //{...this.props}
                    size="xl"
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
                                <label htmlFor="medicine">Medicine</label>
                                <select name="medicine" 
                                        onChange={this.handleChange}
                                        id="medicine"
                                        className="form-control">
                                    <option value="" selected disabled hidden>Choose...</option>
                                    <optgroup label="for cancer">
                                        <option value="Codeine">Codeine</option>
                                        <option value="Morphine">Morphine</option>
                                        <option value="Nivolumab">Nivolumab</option>
                                        <option value="Sunitinib">Sunitinib</option>
                                    </optgroup>
                                    <optgroup label="for side effects">
                                        <option value="Loperamide">Loperamide</option>
                                        <option value="Budesonide">Budesonide</option>
                                    </optgroup>
                                    <optgroup label="for other problems">
                                        <option value="St John's Wort">St John's Wort</option>
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
                                <label htmlFor="to">End</label>
                                <input type="date"
                                        name="to" 
                                        onChange={this.handleChange}
                                        id="to"
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
                                    <option value={false}>False</option>
                                    <option value={true}>True</option>
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
                            <div className="form-group col-md-2">
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
                            <div className="form-group col-md-2">times every</div>
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
                                    <option value="w">week(s)</option>
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
            console.log("State: " + this.state.patient)
            console.log("Props: " + this.props.patient)
            console.log("Full state:")
            console.log(this.state)
            return (
                <Modal
                    size="xl"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    show={this.props.show}
                    onHide={this.props.onHide}
                >
                <Modal.Header closeButton>
                  <Modal.Title id="contained-modal-title-vcenter">
                    Editing a prescription ...
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <form>
                    <div className="form-controller">
                        <div className="form-row">
                            <div className="form-group col-md-4">
                                <label htmlFor="medicine">medicine</label>
                                <select name="medicine" 
                                        onChange={this.handleChange}
                                        id="medicine"
                                        className="form-control"
                                        value={this.state.medicine}
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
                                        disabled
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
                            <div className="form-group col-md-2">
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
                            <div className="form-group col-md-2">times every</div>
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
                                    <option value="w">week(s)</option>
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