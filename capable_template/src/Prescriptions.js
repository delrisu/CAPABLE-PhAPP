import MaterialTable        from 'material-table';
import React, { useState } from 'react';
import Modal                from 'react-bootstrap/Modal'
import { Button }           from 'reactstrap';
import PrescriptionsForm    from './PrescriptionsForm'
import status_tick from     './images/status_tick.png';
import status_x from        './images/status_x.png';
import status_orange from   './images/status_orange.png';
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
    console.log("comms:")
    console.log(comms)
    console.log("commIDs")
    console.log(commIDs)
    console.log("drafts:")
    console.log(drafts)
    console.log("Stopped medReqs:")
    console.log(stopped)
    function checkStatus(medID, commID, status) {
        if (status === "draft") {
            return status_orange
        }
        let result = status_tick
        if (stopped !== undefined && stopped.length > 0 && comms.length > 0) {
            stopped.forEach(element => {
                if (element.resource.priorPrescription.identifier.value === medID) {
                    comms.forEach(element2 => {
                        if (element2.resource.id === commID)
                        result = status_x;
                        console.log("Pasuje do leku " + element.resource.id.toString())
                        console.log(element)
                    });
                    
                }
            });
        }
        return result;
    }

    function checkBoundsPeriodStart(repeat) {
        if (repeat.boundsPeriod !== undefined){
            if (repeat.boundsPeriod.start !== undefined) {
                return repeat.boundsPeriod.start
            }
        }
        return ''
    }

    function checkBoundsPeriodEnd(repeat) {
        if (repeat.boundsPeriod !== undefined){
            if (repeat.boundsPeriod.end !== undefined) {
                return repeat.boundsPeriod.end
            }
        }
        return ''
    }

    function convertRowData () {
        let rowData = data;
        let i, j;
        let medications = []
        console.log("In prescs:")
        console.log(rowData.length)
        
        for (i = 0; i < rowData.length; i++) {
            console.log(rowData[i].resource.id)
            let medData = {
                id:             rowData[i].resource.id,
                patient:        rowData[i].resource.subject.reference,
                medicine:       rowData[i].resource.medicationCodeableConcept.coding[0].display,
                medicineCode:   rowData[i].resource.medicationCodeableConcept.coding[0].code,
                from:           checkBoundsPeriodStart(rowData[i].resource.dosageInstruction[0].timing.repeat), //.boundsPeriod.start !== undefined ? rowData[i].resource.dosageInstruction[0].timing.repeat.boundsPeriod.start : '',
                to:             checkBoundsPeriodEnd(rowData[i].resource.dosageInstruction[0].timing.repeat), //rowData[i].resource.dosageInstruction[0].timing.repeat.boundsPeriod.end !== undefined ? rowData[i].resource.dosageInstruction[0].timing.repeat.boundsPeriod.end : '',
                asNeeded:       rowData[i].resource.dosageInstruction[0].asNeededBoolean,
                doseValue:      rowData[i].resource.dosageInstruction[0].doseAndRate[0].doseQuantity.value,
                doseUnit:       rowData[i].resource.dosageInstruction[0].doseAndRate[0].doseQuantity.unit,
                dosing:         rowData[i].resource.dosageInstruction[0].text,
                status:         null,
                draft:          null,
                attachedCommID: null,
                relatedObjIDs:  [],
                relatedStopped: null,
                relatedDraft:   null,
                relatedComm:    null,
                json:           rowData[i].resource
            }


            if (stopped !== undefined && stopped.length > 0 && comms.length > 0) {
                stopped.forEach(element => {
                    if (element.resource.priorPrescription.identifier.value === medData.id) {
                        commIDs.forEach(element2 => {
                            if (element2[1] === element.resource.id) {
                                medData.attachedCommID = element2[0]
                            }
                        });
                        
                    }
                })
            }

            console.log("attached comm id:")
            console.log(medData.attachedCommID)
            if (commIDs !== undefined && commIDs.length > 0) {
                commIDs.forEach(element => {
                    if (element[0] === medData.attachedCommID) {
                        medData.relatedObjIDs.push(element[1])
                    }
                });
            }

            if (stopped !== undefined && stopped.length > 0) {
                stopped.forEach(element => {
                    for (let i=0; i<medData.relatedObjIDs.length; i++) {
                        if (element.resource.id === medData.relatedObjIDs[i]) {
                            medData.relatedStopped = element
                        }
                    }
                });
            }
            console.log("related stopped")
            console.log(medData.relatedStopped)
            console.log('-------')
            if (drafts !== undefined && drafts.length > 0) {
                drafts.forEach(element => {
                    for (let i=0; i<medData.relatedObjIDs.length; i++) {
                        if (element.resource.id === medData.relatedObjIDs[i]) {
                            medData.relatedDraft = element
                        }
                    }
                });
            }
            console.log("related draft")
            console.log(medData.relatedDraft)

            if (comms !== undefined && comms.length > 0) {
                comms.forEach(element => {
                    if (element.resource.id === medData.attachedCommID) {
                        medData.relatedComm = element
                    }
                });
            }

            medData.status = checkStatus(medData.id, medData.attachedCommID, rowData[i].resource.status)

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
                            function convertToDates(value, unit) {
                                let returnDates = []
                                let today = new Date();
                                let dd = String(today.getDate()).padStart(2, '0');
                                let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                                let yyyy = today.getFullYear();

                                returnDates.push(yyyy + '-' + mm + '-' + dd)
                                if (unit === "wk") {
                                    today.setDate(today.getDate()+(7*value))
                                    dd = String(today.getDate()).padStart(2, '0');
                                    mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                                    yyyy = today.getFullYear();
                                    returnDates.push(yyyy + '-' + mm + '-' + dd)
                                } 
                                else if (unit === "d") {
                                    today.setDate(today.getDate()+value)
                                    dd = String(today.getDate()).padStart(2, '0');
                                    mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                                    yyyy = today.getFullYear();
                                    returnDates.push(yyyy + '-' + mm + '-' + dd)
                                }
                                return returnDates
                            }
                            if (rowData.status === status_x) {
                                if (rowData.relatedStopped !== undefined && rowData.relatedDraft !== undefined) {
                                    let tempDraft = {
                                        id:             rowData.relatedDraft.resource.id,
                                        patient:        rowData.relatedDraft.resource.subject.reference,
                                        medicine:       rowData.relatedDraft.resource.medicationCodeableConcept.coding[0].display,
                                        medicineCode:   rowData.relatedDraft.resource.medicationCodeableConcept.coding[0].code,
                                        dosageText:     rowData.relatedDraft.resource.dosageInstruction[0].text,
                                        boundValue:     rowData.relatedDraft.resource.dosageInstruction[0].timing.repeat.boundsDuration.value,
                                        boundUnit:      rowData.relatedDraft.resource.dosageInstruction[0].timing.repeat.boundsDuration.unit,
                                        asNeeded:       rowData.relatedDraft.resource.dosageInstruction[0].asNeededBoolean,
                                    }
                                    
                                    let expectedDates = convertToDates(tempDraft.boundValue, tempDraft.boundUnit)
                                    let confirmMsg = 'Prescribe ' + tempDraft.medicine + '\n'
                                    confirmMsg = confirmMsg + 'Dosing: ' + tempDraft.dosageText + '\n'
                                    confirmMsg = confirmMsg + 'When: from ' + expectedDates[0] + ' to ' + expectedDates[1]

                                    if (window.confirm('Do you wish to apply the suggestion below?\n' + confirmMsg)) {
                                        let modifiedDraftBody = rowData.relatedDraft.resource
                                        modifiedDraftBody.status = "active"
                                        modifiedDraftBody.intent = "order"
                                        delete modifiedDraftBody.dosageInstruction[0].timing.repeat.boundsDuration
                                        delete modifiedDraftBody.meta
                                        
                                        let freq = modifiedDraftBody.dosageInstruction[0].timing.repeat.frequency
                                        let period = modifiedDraftBody.dosageInstruction[0].timing.repeat.period
                                        let periodUnit = modifiedDraftBody.dosageInstruction[0].timing.repeat.periodUnit
                                        let boundsPeriod = {boundsPeriod: {start: expectedDates[0], end: expectedDates[1]}}
                                        console.log("frequency: " + freq.toString() + "-- period: " + period.toString() + "-- periodUnit: " + periodUnit.toString())
                                        console.log(boundsPeriod)

                                        modifiedDraftBody.dosageInstruction[0].timing.repeat = {...boundsPeriod, freq, period, periodUnit}

                                        client.update({ resourceType: 'MedicationRequest', id: tempDraft.id, body: modifiedDraftBody})

                                        if (window.confirm('(Regarding the previous suggestion)\nDo you wish to cancel prescription of ' + rowData.medicine + '?')) {
                                            let modifiedOriginalBody = rowData.json
                                            modifiedOriginalBody.status = "stopped"
                                            delete modifiedOriginalBody.meta

                                            client.update({ resourceType: 'MedicationRequest', id: rowData.id, body: modifiedOriginalBody})
                                        }

                                        let modifiedCommBody = rowData.relatedComm.resource
                                        modifiedCommBody.status = "in-progress"
                                        delete modifiedCommBody.meta
                                        client.update({ resourceType: 'Communication', id: rowData.attachedCommID, body: modifiedCommBody})
                                    }
                                    else {
                                        let modifiedDraftBody = rowData.relatedDraft.resource
                                        modifiedDraftBody.status = "cancelled"
                                        modifiedDraftBody.intent = "order"
                                        delete modifiedDraftBody.meta

                                        client.update({ resourceType: 'MedicationRequest', id: tempDraft.id, body: modifiedDraftBody})

                                        let modifiedCommBody = rowData.relatedComm.resource
                                        modifiedCommBody.status = "in-progress"
                                        delete modifiedCommBody.meta
                                        client.update({ resourceType: 'Communication', id: rowData.attachedCommID, body: modifiedCommBody})
                                    }
                                }
                                window.location.reload(false);
                                
                            }
                            else {
                                alert("This prescription does not require any action to be taken!")
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