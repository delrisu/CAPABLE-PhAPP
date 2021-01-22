import MaterialTable        from 'material-table';
import React, { useState } from 'react';
import Modal                from 'react-bootstrap/Modal'
import { Button }           from 'reactstrap';
import PrescriptionsForm    from './PrescriptionsForm'
import status_tick from     './images/status_tick.png';
import status_x from        './images/status_x.png';
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
        field: "medicine"
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
    },
    {
        title: "Status",
        field: "status",
        render: rowData => <img src={rowData.status} style={{width: 20, borderRadius: '50%'}}/>
    }
]

export default function Prescriptions({client, data, comms, commIDs, drafts, show, onHide, patientRef}) {
    const [prescEditShow, setPrescEditShow] = useState(false);
    const [prescFormEditData, setPrescFormEditData] = useState({});
    const [prescNewShow, setPrescNewShow] = useState(false);
    // const [prescFormEditData, setPrescFormEditData] = useState({});
    function convertRowData () {
        let rowData = data;
        let i, j;
        let medications = []
        console.log("In prescs:")
        console.log(rowData.length)
        // for (i=0; i<4; i++) {
        //     console.log(rowData[i].resource.id)
        // }
        
        for (i = 0; i < rowData.length; i++) {
            console.log(rowData[i].resource.id)
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
                dosing:         "",
                status:         comms.includes(rowData[i].resource.id) ? status_x : status_tick,
                draft:          null,
                attachedCommID:   null
            }

            drafts.forEach(element => {
                if (medData.medicineCode === element.medicationCodeableConcept.coding[0].code) {
                    medData.draft = element
                }    
            });
            commIDs.forEach(element => {
                if (element[1] === medData.id) {
                    medData.attachedCommID = element[0]
                }
            })

            medData.dosing = medData.frequency + "x " + medData.doseValue + medData.doseUnit + " every " + medData.period + " " + medData.periodUnit;
            medications.push(medData);
        }
        return medications;
    }

    const medicationsData = convertRowData();
    console.log("MedData:")
    console.log(medicationsData)
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
                        onRowClick={(event, rowData) => {
                            if (rowData.status === status_x) {
                                console.log(rowData.draft)
                                let tempDraft = {
                                    id:             rowData.draft.resource.id,
                                    patient:        rowData.draft.resource.subject.reference,
                                    medicine:       rowData.draft.resource.medicationCodeableConcept.coding[0].display,
                                    medicineCode:   rowData.draft.resource.medicationCodeableConcept.coding[0].code,
                                    from:           rowData.draft.resource.dosageInstruction[0].timing.repeat.boundsPeriod.start,
                                    to:             rowData.draft.resource.dosageInstruction[0].timing.repeat.boundsPeriod.end,
                                    asNeeded:       rowData.draft.resource.dosageInstruction[0].asNeededBoolean,
                                    frequency:      rowData.draft.resource.dosageInstruction[0].timing.repeat.frequency,
                                    period:         rowData.draft.resource.dosageInstruction[0].timing.repeat.period,
                                    periodUnit:     rowData.draft.resource.dosageInstruction[0].timing.repeat.periodUnit,
                                    doseValue:      rowData.draft.resource.dosageInstruction[0].doseAndRate[0].doseQuantity.value,
                                    doseUnit:       rowData.draft.resource.dosageInstruction[0].doseAndRate[0].doseQuantity.unit,
                                    dosing:         ""
                                }
                                tempDraft.dosing = tempDraft.frequency + "x " + tempDraft.doseValue + tempDraft.doseUnit + " every " + tempDraft.period + " " + tempDraft.periodUnit;
                                let confirmMsg = ''
                                confirmMsg = rowData.from !== tempDraft.from && confirmMsg.concat(tempDraft.from + '\n')
                                confirmMsg = rowData.to !== tempDraft.to && confirmMsg.concat(tempDraft.to + '\n')
                                confirmMsg = rowData.asNeeded !== tempDraft.asNeeded && confirmMsg.concat(tempDraft.asNeeded + '\n')
                                if (rowData.frequency !== tempDraft.frequency || rowData.period !== tempDraft.period || rowData.periodUnit !== tempDraft.periodUnit || rowData.doseValue !== tempDraft.doseValue || rowData.doseUnit !== tempDraft.doseUnit) {
                                    confirmMsg = confirmMsg.concat(tempDraft.dosing)
                                }
                                // confirmMsg = rowData.frequency !== tempDraft.frequency && confirmMsg.concat(tempDraft.frequency + '\n')
                                // confirmMsg = rowData.period !== tempDraft.period && confirmMsg.concat(tempDraft.period + '\n')
                                // confirmMsg = rowData.periodUnit !== tempDraft.periodUnit && confirmMsg.concat(tempDraft.periodUnit + '\n')
                                // confirmMsg = rowData.doseValue !== tempDraft.doseValue && confirmMsg.concat(tempDraft.doseValue + '\n')
                                // confirmMsg = rowData.doseUnit !== tempDraft.doseUnit && confirmMsg.concat(tempDraft.to + '\n')

                                if (window.confirm('Do you wish to accept these suggested changes?\n' + confirmMsg)) {
                                    let entryOld = {
                                        resourceType: "MedicationRequest",
                                        status: "canceled",
                                        intent: "order",
                                        medicationCodeableConcept: {
                                            coding: [{
                                                system: "http://snomed.info/sct",
                                                code: rowData.medicineCode,
                                                display: rowData.medicine
                                            }]
                                        },
                                        subject: {
                                            reference: "Patient/" + rowData.patient
                                        },
                                        dosageInstruction: [{
                                            text: rowData.dosing,
                                            timing: {
                                                repeat: {
                                                    boundsPeriod: {
                                                        start: rowData.from,
                                                        end: rowData.to
                                                    },
                                                    frequency: rowData.frequency,
                                                    period: rowData.period,
                                                    periodUnit: rowData.periodUnit
                                                }
                                            },
                                            asNeededBoolean: rowData.asNeeded,
                                            doseAndRate: [{
                                                doseQuantity: {
                                                    value: rowData.doseValue,
                                                    unit: rowData.doseUnit,
                                                    system: "http://snomed.info/sct",
                                                    code: 258684004
                                                }
                                            }]
                                        }]
                                    }
                                    client.update({resourceType: 'MedicationRequest', id: rowData.id, body: entryOld})

                                    let entryNew = {
                                        resourceType: "MedicationRequest",
                                        status: "active",
                                        intent: "order",
                                        medicationCodeableConcept: {
                                            coding: [{
                                                system: "http://snomed.info/sct",
                                                code: tempDraft.medicineCode,
                                                display: tempDraft.medicine
                                            }]
                                        },
                                        subject: {
                                            reference: "Patient/" + tempDraft.patient
                                        },
                                        dosageInstruction: [{
                                            text: tempDraft.dosing,
                                            timing: {
                                                repeat: {
                                                    boundsPeriod: {
                                                        start: tempDraft.from,
                                                        end: tempDraft.to
                                                    },
                                                    frequency: tempDraft.frequency,
                                                    period: tempDraft.period,
                                                    periodUnit: tempDraft.periodUnit
                                                }
                                            },
                                            asNeededBoolean: tempDraft.asNeeded,
                                            doseAndRate: [{
                                                doseQuantity: {
                                                    value: tempDraft.doseValue,
                                                    unit: tempDraft.doseUnit,
                                                    system: "http://snomed.info/sct",
                                                    code: 258684004
                                                }
                                            }]
                                        }]
                                    }
                                    client.update({resourceType: 'MedicationRequest', id: rowData.id, body: entryNew})

                                    let entryComm = {
                                        resourceType: "Communication",
                                        status: "in-progress"
                                    }
                                    client.update({resourceType: 'Communication', id: rowData.attachedCommID, body: entryComm})
                                    window.location.reload(false);
                                }
                                else {
                                    alert("Rejected suggested changes!")
                                }
                            }
                            else {
                                alert("This prescription does not require any action to be taken!")
                                // window.location.reload(false);
                            }
                        }}
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