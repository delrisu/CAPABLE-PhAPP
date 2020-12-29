import MaterialTable        from 'material-table';
import React, { useState } from 'react';
import Modal                from 'react-bootstrap/Modal'
import { Button }           from 'reactstrap';
import PrescriptionsForm    from './PrescriptionsForm'
import "./bootstrap.min.css";
import "./styles.css";

const codes = {
    codeine:        387494007,
    morphine:       373529000,
    nivolumab:      704191007,
    sunitinib:      421192001,
    loperamide:     387040009,
    budesonide:     395726003,
    st_johns_wort:  412515006
}

const columns = [
    {
        title: "Medicine",
        field: "medicine",
    },
    {
        title: "Using from",
        field: "from"
    },
    {
        title: "Using to",
        field: "to"
    },
    {
        title: "Take as needed",
        field: "asNeeded"
    },
    {
        title: "Dosing",
        field: "dosing"
    }
]

export default function Prescriptions({client, data, show, onHide, patientRef}) {
    const [prescEditShow, setPrescEditShow] = useState(false);
    const [prescFormEditData, setPrescFormEditData] = useState({});
    const [prescNewShow, setPrescNewShow] = useState(false);
    // const [prescFormEditData, setPrescFormEditData] = useState({});
    function convertRowData () {
        let rowData = data;
        let i;
        let medications = []
        for (i = 0; i < rowData.length; i++) {
            let medData = {
                id:             rowData[i].resource.id,
                patient:        rowData[i].resource.subject.reference,
                medicine:       rowData[i].resource.medicationCodeableConcept.coding[0].display,
                medicineCode:   rowData[i].resource.medicationCodeableConcept.coding[0].code,
                from:           rowData[i].resource.dosageInstruction[0].timing.repeat.boundsPeriod.start,
                to:             rowData[i].resource.dosageInstruction[0].timing.repeat.boundsPeriod.end,
                asNeeded:       rowData[i].resource.dosageInstruction[0].asNeededBoolean,
                frequency:      rowData[i].resource.dosageInstruction[0].timing.repeat.frequency,
                period:         rowData[i].resource.dosageInstruction[0].timing.repeat.period,
                periodUnit:     rowData[i].resource.dosageInstruction[0].timing.repeat.periodUnit,
                doseValue:      rowData[i].resource.dosageInstruction[0].doseAndRate[0].doseQuantity.value,
                doseUnit:       rowData[i].resource.dosageInstruction[0].doseAndRate[0].doseQuantity.unit,
                dosing:         ""
                // () => {
                //                     console.log(this.frequency + "x " + this.doseValue + this.doseUnit + " every " + this.period + " " + this.periodUnit)
                //                     return this.frequency + "x " + this.doseValue + this.doseUnit + " every " + this.period + " " + this.periodUnit;
                //                 }
            }
            // console.log(medData.frequency)
            // console.log(medData.doseValue)
            medData.dosing = medData.frequency + "x " + medData.doseValue + medData.doseUnit + " every " + medData.period + " " + medData.periodUnit;
            medications.push(medData);
        }
        return medications;
    }

    const medicationsData = convertRowData();

    return (
        <div>
            <Modal
                size="xl"
                // dialogClassName="modal-90w"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                show={show}
                onHide={onHide}
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Prescriptions
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <MaterialTable
                        columns={columns}
                        data={medicationsData}
                        title=""
                        actions={[
                            {
                                icon: 'add',
                                tooltip: 'Add a new prescription',
                                isFreeAction: true,
                                onClick: (event, rowData) => {
                                    setPrescNewShow(true);
                                }
                            },
                            {
                                icon: 'delete',
                                tooltip: 'Remove this prescription',
                                onClick: (event, rowData) => {
                                    client.delete({resourceType: 'MedicationRequest', id: rowData.id});
                                }
                            },
                            {
                                icon: 'edit',
                                tooltip: 'Edit prescription',
                                onClick: (event, rowData) => {
                                    setPrescEditShow(true);
                                    setPrescFormEditData(rowData);
                                }
                            }
                        ]}
                        options={
                            {
                                pageSize: 5
                            },
                            {
                                searchFieldAlignment: 'left'
                            }
                        }
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={onHide}>Close</Button>
                </Modal.Footer>
            </Modal>
            {prescNewShow===true &&
                <PrescriptionsForm
                    show={prescNewShow}
                    onHide={() => setPrescNewShow(false)}
                    client={client}
                    data={false}
                    patient={patientRef.id}
                />
            }
            {prescEditShow===true &&
                <PrescriptionsForm
                    show={prescEditShow}
                    onHide={() => setPrescEditShow(false)}
                    client={client}
                    data={prescFormEditData}
                    patient={patientRef.id}
                />
            }
            {

            }
        </div>
    )
}