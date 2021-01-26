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

export default function Prescriptions({client, data, comms, commIDs, drafts, stopped, show, onHide, patientRef}) {
    const [prescEditShow, setPrescEditShow] = useState(false);
    const [prescFormEditData, setPrescFormEditData] = useState({});
    const [prescNewShow, setPrescNewShow] = useState(false);
    // const [prescFormEditData, setPrescFormEditData] = useState({});
    console.log("Stopped medReqs:")
    console.log(stopped)
    function checkStatus(medID) {
        let result = true
        stopped.forEach(element => {
            if (element.resource.priorPrescription.identifier.value === medID) {
                console.log("Pasuje do leku")
                result = false;
            }
        });
        return result;
    }

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
                status:         checkStatus(rowData[i].resource.id) ? status_tick : status_x,
                // status:         comms.includes(rowData[i].resource.id) ? status_x : status_tick,
                draft:          null,
                attachedCommID: null,
                relatedObjIDs:  [],
                relatedStopped: null,
                relatedDraft:   null,
                relatedComm:    null,
                json:           rowData[i].resource
            }


            // if (drafts !== undefined || drafts.length > 0) {
            //     drafts.forEach(element => {
            //         if (medData.medicineCode === element.medicationCodeableConcept.coding[0].code) {
            //             medData.draft = element
            //         }
            //     });
            // }
            if (commIDs !== undefined || commIDs.length > 0) {
                commIDs.forEach(element => {
                    if (element[1] === medData.id) {
                        medData.attachedCommID = element[0]
                    }
                })
            }

            if (commIDs !== undefined || commIDs.length > 0) {
                commIDs.forEach(element => {
                    if (element[0] === medData.attachedCommID) {
                        medData.relatedObjIDs.push(element[1])
                    }
                });
            }

            if (stopped !== undefined || stopped.length > 0) {
                stopped.forEach(element => {
                    for (let i=0; i<medData.relatedObjIDs.length; i++) {
                        if (element.resource.id === medData.relatedObjIDs[i]) {
                            medData.relatedStopped = element
                        }
                    }
                });
            }

            if (drafts !== undefined || drafts.length > 0) {
                drafts.forEach(element => {
                    for (let i=0; i<medData.relatedObjIDs.length; i++) {
                        if (element.resource.id === medData.relatedObjIDs[i]) {
                            medData.relatedDraft = element
                        }
                    }
                });
            }

            if (comms !== undefined || comms.length > 0) {
                comms.forEach(element => {
                    if (element.resource.id === medData.attachedCommID) {
                        medData.relatedComm = element
                    }
                });
            }

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
                        data={medicationsData !== undefined ? medicationsData : null}
                        title=""
                        onRowClick={(event, rowData) => {
                            if (rowData.status === status_x) {
                                // stopped.forEach(element => {
                                //     if (rowData.id === element.resource.id) {

                                //     }
                                // });
                                // console.log(rowData.draft)
                                if (rowData.relatedStopped !== undefined && rowData.relatedDraft !== undefined) {
                                    let tempDraft = {
                                        id:             rowData.relatedDraft.resource.id,
                                        patient:        rowData.relatedDraft.resource.subject.reference,
                                        medicine:       rowData.relatedDraft.resource.medicationCodeableConcept.coding[0].display,
                                        medicineCode:   rowData.relatedDraft.resource.medicationCodeableConcept.coding[0].code,
                                        // from:           rowData.relatedDraft.resource.dosageInstruction[0].timing.repeat.boundsPeriod.start,
                                        // to:             rowData.relatedDraft.resource.dosageInstruction[0].timing.repeat.boundsPeriod.end,
                                        dosageText:     rowData.relatedDraft.resource.dosageInstruction[0].text,
                                        boundValue:     rowData.relatedDraft.resource.dosageInstruction[0].timing.repeat.boundsDuration.value,
                                        boundUnit:      rowData.relatedDraft.resource.dosageInstruction[0].timing.repeat.boundsDuration.unit,
                                        asNeeded:       rowData.relatedDraft.resource.dosageInstruction[0].asNeededBoolean,
                                        frequency:      rowData.relatedDraft.resource.dosageInstruction[0].timing.repeat.frequency,
                                        period:         rowData.relatedDraft.resource.dosageInstruction[0].timing.repeat.period,
                                        periodUnit:     rowData.relatedDraft.resource.dosageInstruction[0].timing.repeat.periodUnit,
                                        doseValue:      rowData.relatedDraft.resource.dosageInstruction[0].doseAndRate[0].doseQuantity.value,
                                        doseUnit:       rowData.relatedDraft.resource.dosageInstruction[0].doseAndRate[0].doseQuantity.unit,
                                        dosing:         ""
                                    }
                                    tempDraft.dosing = tempDraft.frequency + "x " + tempDraft.doseValue + tempDraft.doseUnit + " every " + tempDraft.period + " " + tempDraft.periodUnit;
                                    let confirmMsg = 'Prescribe ' + tempDraft.medicine + '\n'
                                    confirmMsg = confirmMsg + 'Dosing: ' + tempDraft.dosageText + '\n'
                                    confirmMsg = confirmMsg + 'For the next: ' + tempDraft.boundValue + ' ' + tempDraft.boundUnit + '(s)'
                                    if (window.confirm('Do you wish to apply the suggestion below?\n' + confirmMsg)) {
                                        let modifiedDraftBody = rowData.relatedDraft
                                        modifiedDraftBody.status = "active"
                                        modifiedDraftBody.intent = "order"
                                        // = {
                                        //     "resourceType": "MedicationRequest",
                                        //     "status": "active",
                                        //     "intent": "order"
                                        // }
                                        client.update({ resourceType: 'MedicationRequest', id: tempDraft.id, body: modifiedDraftBody})

                                        if (window.confirm('(Regarding the previous suggestion)\nDo you wish to cancel prescription of ' + rowData.medicine + '?')) {
                                            let modifiedOriginalBody = rowData.json
                                            modifiedOriginalBody.status = "stopped"
                                            // = {
                                            //     "resourceType": "MedicationRequest",
                                            //     "status": "stopped"
                                            // }
                                            client.update({ resourceType: 'MedicationRequest', id: rowData.id, body: modifiedOriginalBody})
                                        }

                                        let modifiedCommBody = rowData.relatedComm
                                        modifiedCommBody.status = "in-progress"
                                        client.update({ resourceType: 'Communication', id: rowData.attachedCommID, body: modifiedCommBody})
                                    }
                                    else {
                                        let modifiedDraftBody = rowData.relatedDraft
                                        modifiedDraftBody.status = "cancelled"
                                        modifiedDraftBody.intent = "order"
                                        // let modifiedDraftBody = {
                                        //     status: "cancelled"
                                        // }
                                        client.update({ resourceType: 'MedicationRequest', id: tempDraft.id, body: modifiedDraftBody})

                                        let modifiedCommBody = rowData.relatedComm
                                        modifiedCommBody.status = "in-progress"
                                        client.update({ resourceType: 'Communication', id: rowData.attachedCommID, body: modifiedCommBody})
                                    }
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
                    prescCount={data.length}
                />
            }
            {prescEditShow===true &&
                <PrescriptionsForm
                    show={prescEditShow}
                    onHide={() => setPrescEditShow(false)}
                    client={client}
                    data={prescFormEditData}
                    patient={patientRef.id}
                    prescCount={data.length}
                />
            }
            {

            }
        </div>
    )
}