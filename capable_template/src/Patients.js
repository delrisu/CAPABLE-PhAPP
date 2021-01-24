import React, { useState, useEffect }  from 'react';
import { Button }           from 'reactstrap';
import MaterialTable        from'material-table';
import Prescriptions        from './Prescriptions';
import PatientsForm         from './PatientsForm';
import PatientCard          from './PatientCard';
import status_tick from     './images/status_tick.png';
import status_x from        './images/status_x.png';
import "./styles.css";
import "./bootstrap.min.css";

/*SNOMED codes
weight:             27113001
height:             50373000
bmi:                60621009
yearsSmoking:             77176002
yearsDrinking:            219006
dyssomnia:          44186003    (sleeping problems)
diabetes mellitus:  73211009
hypertension:       38341003    (hypertensive disorder)
collagen vascular:  398049005
ibd:                24526004
physical activity:  68130003
diet:               230125005
cm:                 258672001
kg:                 258672001
years:              258707000
per week:           259038000
*/

const { FHIRClient } = require('fhir-crud-client');

const BASE_URL = 'http://10.131.46.196:8080/baseR4/';
const HEADERS = {

        Accept: 'application/json',
    };

const client = new FHIRClient(BASE_URL, HEADERS);

const codes = {
    weight:             "27113001",
    height:             "50373000",
    bmi:                "60621009",
    yearsSmoking:       "77176002",
    yearsDrinking:      "219006",
    dyssomnia:          "44186003",
    diabetes:           "73211009",
    hypertension:       "38341003",
    collagenVascular:   "398049005",
    ibd:                "24526004",
    physicalActivity:   "68130003",
    gastroOperation:    "386621005",
    diet:               "230125005",
    cm:                 "258672001",
    kg:                 "258683005",
    years:              "258707000",
    perWeek:            "259038000"
}

function Get(yourUrl){
    var Httpreq = new XMLHttpRequest(); // a new request
    Httpreq.open("GET",yourUrl,false);
    Httpreq.send(null);
    return Httpreq.responseText;          
}

    const columns = [
        {
            title: "ID",
            field: "id"
        },
        {
            title: "First name",
            field: "fname"
        },
        {
            title: "Second name",
            field: "sname"
        },
        {
            title: "Gender",
            field: "gender"
        },
        {
            title: "Date of birth",
            field: "birthDate"
        },
        {
            title: "Height [cm]",
            field: "height"
        },
        {
            title: "Weight [kg]",
            field: "weight"
        },
        {
            title: "Last updated",
            field: "lastUpdated"
        },
        {
            title: "Status",
            field: "status",
            render: rowData => <img src={rowData.status} alt={'Status'} style={{width: 20, borderRadius: '50%'}}/>
        },
        {
            title: "Years drinking",
            field: "yearsDrinking",
            hidden: true
        },
        {
            title: "Years smoking",
            field: "yearsSmoking",
            hidden: true
        },
        {
            title: "Diabetes mellitus",
            field: "diabetes",
            hidden: true
        },
        {
            title: "Years drinking",
            field: "yearsDrinking",
            hidden: true
        },
        {
            title: "Gastro operation",
            field: "gastroOperation",
            hidden: true
        },
        {
            title: "Dyssomnia",
            field: "dyssomnia",
            hidden: true
        },
        {
            title: "BMI",
            field: "bmi",
            hidden: true
        },
        {
            title: "Physical activity",
            field: "physicalActivity",
            hidden: true
        },
        {
            title: "Hypertensive disorder",
            field: "hypertenstion",
            hidden: true
        },
        {
            title: "Collagen vascular",
            field: "collagenVascular",
            hidden: true
        },
        {
            title: "IBD",
            field: "ibd",
            hidden: true
        }
      ]

export default function Patients() {
    const [show, setShow] = useState(false);
    const [modalShow, setModalShow] = useState(false);
    const [patientsData, setPatientsData] = useState([])
    const [patientFormData,setPatientFormData] = useState({});
    const [prescShow, setPrescShow] = useState(false);
    const [prescData, setPrescData] = useState({});
    const [patientCardShow, setPatientCardShow] = useState(false);
    const [patientCardData, setPatientCardData] = useState({});
    // const [patientID, setPatientID] = useState("");

    useEffect(() => {
        async function getData() {
            let fetchedPatients = [], fetchedObservations = [], fetchedMedReqs = [], fetchedDrafts = [], fetchedComms = [];
            let i, j, k, l, m, nextPage, currentCode;
            let patients = [];
        
            await client.search({resourceType: 'Patient'}).then((resource) => {
                if (resource.total > 0) {
                    fetchedPatients = resource.entry
                    console.log(resource.entry)
                    if (resource.total > 10) {
                        let numOfPages = Math.ceil(resource.total/10)
                        for (i = 1; i < numOfPages; i++) {
                            if (i === 1) {
                                nextPage = JSON.parse(Get(resource.link[1].url + "&_format=json"));
                                fetchedPatients = fetchedPatients.concat(nextPage.entry);
                            }
                            else {
                                nextPage = JSON.parse(Get(nextPage.link[1].url + "&_format=json")); 
                                fetchedPatients = fetchedPatients.concat(nextPage.entry);
                            }
                        }
                    }
                }
            })

            // console.log("Szukanie pustego:")
            // client.search({resourceType: 'Communication', params: 
            //     {
            //         status: "in-progress"
            //     }})
            //     .then((resource) => {
            //         console.log(resource)
            //     })
        
            await client.search({resourceType: 'Observation'}).then((resource) => {
                if (resource.total > 0) {
                    fetchedObservations = resource.entry
                    if (resource.total > 10) {
                        let numOfPages = Math.ceil(resource.total/10)
                        console.log("Num of pages: " + numOfPages);
                        for (i = 1; i < numOfPages; i++) {
                            if (i === 1) {
                                nextPage = JSON.parse(Get(resource.link[1].url + "&_format=json"));
                                fetchedObservations = fetchedObservations.concat(nextPage.entry);
                            }
                            else {
                                nextPage = JSON.parse(Get(nextPage.link[1].url + "&_format=json")); 
                                fetchedObservations = fetchedObservations.concat(nextPage.entry);
                            }
                        }
                    }
                }
            })

            await client.search({resourceType: 'MedicationRequest', params: {status: "active"}}).then((resource) => {
                if (resource.total > 0) {
                fetchedMedReqs = resource.entry
                    if (resource.total > 10) {
                        let numOfPages = Math.ceil(resource.total/10)

                        for (i = 1; i < numOfPages; i++) {
                            if (i === 1) {
                                nextPage = JSON.parse(Get(resource.link[1].url + "&_format=json"));
                                fetchedMedReqs = fetchedMedReqs.concat(nextPage.entry);
                            }
                            else {
                                nextPage = JSON.parse(Get(nextPage.link[1].url + "&_format=json")); 
                                fetchedMedReqs = fetchedMedReqs.concat(nextPage.entry);
                            }
                        }
                    }
                }
            })

            await client.search({resourceType: 'MedicationRequest', params: {status: "draft"}}).then((resource) => {
                console.log(resource)
                if (resource.total > 0) {
                    fetchedDrafts = resource.entry
                    if (resource.total > 10) {
                        let numOfPages = Math.ceil(resource.total/10)

                        for (i = 1; i < numOfPages; i++) {
                            if (i === 1) {
                                nextPage = JSON.parse(Get(resource.link[1].url + "&_format=json"));
                                fetchedDrafts = fetchedDrafts.concat(nextPage.entry);
                            }
                            else {
                                nextPage = JSON.parse(Get(nextPage.link[1].url + "&_format=json")); 
                                fetchedDrafts = fetchedDrafts.concat(nextPage.entry);
                            }
                        }
                    }
                }
            })

            // console.log("Fetched medReqs:")
            // console.log(fetchedMedReqs)
            await client.search({resourceType: 'Communication', params: {status: "preparation"}}).then((resource) => {
                if (resource.total > 0) {
                fetchedComms = resource.entry
                    if (resource.total > 10) {
                        let numOfPages = Math.ceil(resource.total/10)

                        for (i = 1; i < numOfPages; i++) {
                            if (i === 1) {
                                nextPage = JSON.parse(Get(resource.link[1].url + "&_format=json"));
                                fetchedComms = fetchedComms.concat(nextPage.entry);
                            }
                            else {
                                nextPage = JSON.parse(Get(nextPage.link[1].url + "&_format=json")); 
                                fetchedComms = fetchedComms.concat(nextPage.entry);
                            }
                        }
                    }
                }
            })

            console.log(fetchedComms)
            if (fetchedPatients !== undefined || fetchedPatients.length > 0) {
                for (i = 0; i < fetchedPatients.length; i++) {
                    let patientData = {
                        id:                     '',
                        fname:                  '',
                        sname:                  '',
                        birthDate:              '',
                        gender:                 '',
                        lastUpdated:            '',
                        height:                 0,
                        heightID:               '',
                        weight:                 0,
                        weightID:               '',
                        bmi:                    0,
                        bmiID:                  '',
                        yearsSmoking:           0,
                        yearsSmokingID:         '',
                        yearsDrinking:          0,
                        yearsDrinkingID:        '',
                        diabetes:               0,
                        diabetesID:             '',
                        hypertension:           0,
                        hypertensionID:         '',
                        gastroOperation:        0,
                        gastroOperationID:      '',
                        dyssomnia:              0,
                        dyssomniaID:            '',
                        collagenVascular:       0,
                        collagen_vascularID:    '',
                        physicalActivity:       0,
                        physical_activityID:    '',
                        ibd:                    0,
                        ibdID:                  '',
                        medications:            [],
                        medicationIDs:          [],
                        communications:         [],
                        communicationIDs:       [],
                        drafts:                 [],
                        status:                 null
                    }
                    patientData.id = fetchedPatients[i].resource.id;
                    patientData.fname = fetchedPatients[i].resource.name[0].given[0];
                    patientData.sname = fetchedPatients[i].resource.name[0].family;
                    patientData.birthDate = fetchedPatients[i].resource.birthDate;
                    patientData.gender = fetchedPatients[i].resource.gender;
                    patientData.lastUpdated = fetchedPatients[i].resource.meta.lastUpdated.slice(0,10) + " " + fetchedPatients[i].resource.meta.lastUpdated.slice(11,16);
                    for (j = 0; j < fetchedObservations.length; j++) {
                        if (fetchedObservations[j].resource.subject.reference === ("Patient/" + patientData.id)) {
                            currentCode = fetchedObservations[j].resource.code.coding[0].code;
                            switch(currentCode) {
                                case codes.height: 
                                    patientData.height = fetchedObservations[j].resource.valueQuantity.value;
                                    patientData.heightID = fetchedObservations[j].resource.id;
                                    break;
                                case codes.weight:
                                    patientData.weight = fetchedObservations[j].resource.valueQuantity.value;
                                    patientData.weightID = fetchedObservations[j].resource.id;
                                    break;
                                case codes.bmi:
                                    patientData.bmi = fetchedObservations[j].resource.valueQuantity.value;
                                    patientData.bmiID = fetchedObservations[j].resource.id;
                                    break;
                                case codes.yearsSmoking:
                                    patientData.yearsSmoking = fetchedObservations[j].resource.valueQuantity.value;
                                    patientData.yearsSmokingID = fetchedObservations[j].resource.id;
                                    break;
                                case codes.yearsDrinking:
                                    patientData.yearsDrinking = fetchedObservations[j].resource.valueQuantity.value;
                                    patientData.yearsDrinkingID = fetchedObservations[j].resource.id;
                                    break;
                                case codes.dyssomnia:
                                    patientData.dyssomnia = fetchedObservations[j].resource.valueQuantity.value;
                                    patientData.dyssomniaID = fetchedObservations[j].resource.id;
                                    break;
                                case codes.diabetes:
                                    patientData.diabetes = fetchedObservations[j].resource.valueQuantity.value;
                                    patientData.diabetesID = fetchedObservations[j].resource.id;
                                    break;
                                case codes.collagenVascular:
                                    patientData.collagenVascular = fetchedObservations[j].resource.valueQuantity.value;
                                    patientData.collagen_vascularID = fetchedObservations[j].resource.id;
                                    break;
                                case codes.ibd:
                                    patientData.ibd = fetchedObservations[j].resource.valueQuantity.value;
                                    patientData.ibdID = fetchedObservations[j].resource.id;
                                    break;
                                case codes.gastroOperation:
                                    patientData.gastroOperation = fetchedObservations[j].resource.valueQuantity.value;
                                    patientData.gastroOperationID = fetchedObservations[j].resource.id;
                                    break;
                                case codes.physicalActivity:
                                    patientData.physicalActivity = fetchedObservations[j].resource.valueQuantity.value;
                                    patientData.physical_activityID = fetchedObservations[j].resource.id;
                                    break;
                                case codes.hypertension:
                                    patientData.hypertension = fetchedObservations[j].resource.valueQuantity.value;
                                    patientData.hypertensionID = fetchedObservations[j].resource.id;
                                    break;
                                default:
                                    break;
                            }
                        }
                    }

                    for (k = 0; k < fetchedMedReqs.length; k++) {
                        if (fetchedMedReqs[k].resource.subject.reference === ("Patient/" + patientData.id) && fetchedMedReqs[k].resource.status !== "canceled") {
                            patientData.medications.push(fetchedMedReqs[k])
                            patientData.medicationIDs.push(fetchedMedReqs[k].resource.id)
                        }
                    }
                    if (fetchedComms !== undefined || fetchedComms.length > 0) {
                        for (l = 0; l < fetchedComms.length; l++) {
                            if (patientData.medicationIDs.includes(fetchedComms[l].resource.payload[0].contentReference.identifier.value) && fetchedComms[l].resource.payload[0].contentReference.type === "MedicationRequest") {
                                patientData.communications.push(fetchedComms[l].resource.payload[0].contentReference.identifier.value)
                                patientData.communicationIDs.push([fetchedComms[l].resource.id, fetchedComms[l].resource.payload[0].contentReference.identifier.value])
                            }
                        }
                    }

                    if (fetchedDrafts !== undefined || fetchedDrafts.length > 0) {
                        for (m = 0; m < fetchedDrafts.length; m++) {
                            if (fetchedDrafts[k].resource.subject.reference === ("Patient/" + patientData.id) && fetchedDrafts[k].resource.status !== "canceled") {
                                patientData.drafts.push(fetchedDrafts[m])
                            }
                        }
                    }

                    if (patientData.communications.length !== 0) {
                        patientData.status = status_x
                    }
                    else {
                        patientData.status = status_tick
                    }
                    patients.push(patientData);
                }
                // console.log(patients)
                setPatientsData(patients)
            }
        }
        getData();
    }, [])

        return (
            <div className="content-main">
                {console.log(patientsData)}
                <h1><span className="badge badge-dark">Patients</span></h1>
                <div className="content-patients">
                {/* <div className="content-whiteboard">
                    <div className="patients-top-bar">
                        <div className="patients-top-bar-left">
                        
                        </div>
                        <div className="patients-top-bar-right">
                            <Button color="primary" onClick={() => setModalShow(true)}>
                                + Add a new patient
                            </Button>
                        </div>
                    </div> */}
                    <MaterialTable
                        columns={columns}
                        data={patientsData!== undefined ? patientsData : null}
                        title=""
                        onRowClick={(event, rowData) => {
                            setPatientCardData(rowData);
                            setPatientCardShow(true);
                        }}
                        actions={[
                            {
                                icon: 'add',
                                tooltip: 'Add a new patient',
                                isFreeAction: true,
                                onClick: (event, rowData) => {
                                    setModalShow(true);
                                }
                            },
                            {
                                icon: 'delete',
                                tooltip: 'Remove this patient',
                                onClick: (event, rowData) => {
                                    client.delete({resourceType: "Patient", id: rowData.id})
                                }
                            },
                            {
                                icon: 'edit',
                                tooltip: 'View/Edit patient\'s data',
                                onClick: (event, rowData) => {
                                    setShow(true);
                                    setPatientFormData(rowData);
                                }
                                
                            },
                            {
                                icon: 'receipt',
                                tooltip: 'Prescriptions',
                                onClick: (event, rowData) => {
                                    setPrescShow(true);
                                    // console.log(rowData.medications);
                                    setPrescData(rowData);
                                    // setPatientID(rowData.id);
                                    // console.log(patientID);
                                }
                            }
                        ]}
                        options={
                            {
                                pageSize: 10
                            },
                            {
                                searchFieldAlignment: 'left'
                            }
                        }
                    />
                    <PatientsForm
                        show={modalShow}
                        onHide={() => setModalShow(false)}
                        client={client}
                        data={false}
                    />
                    {show===true && 
                        <PatientsForm
                            show={show}
                            onHide={() => setShow(false)}
                            client={client}
                            data={patientFormData}
                        />
                    }
                    {prescShow===true &&
                        <Prescriptions
                            show={prescShow}
                            onHide={() => setPrescShow(false)}
                            client={client}
                            data={prescData.medications}
                            comms={prescData.communications}
                            commIDs={prescData.communicationIDs}
                            drafts={prescData.drafts}
                            patientRef={prescData}
                        />
                    }
                    {patientCardShow===true &&
                        <PatientCard
                            show={patientCardShow}
                            onHide={() => setPatientCardShow(false)}
                            data={patientCardData}
                        />
                    }
                </div>
            </div>
        )
    }