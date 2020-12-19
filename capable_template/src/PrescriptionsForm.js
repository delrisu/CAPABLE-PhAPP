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
        this.addNewPrescription = this.addNewPrescription.bind(this);
        this.updatePrescription = this.updatePrescription.bind(this);
    }

    handleChange (event) {
        this.setState({ [event.target.name]: event.target.value });
        console.log(event.target.value);
    }

    async addNewPrescription (medCode, medDisplay) {
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
        let response = await this.props.client.create({resourceType: "MedicationRequest", body: entry})
    }

    async updatePrescription (medCode, medDisplay) {
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
    let response = await this.props.client.update({resourceType: "MedicationRequest", id: this.state.id, body: entry})
    }

    render() {

        if (this.props.data === false) {
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
                    size="xl"
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