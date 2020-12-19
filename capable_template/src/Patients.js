import React, { useState, useEffect }  from 'react';
import { Button }           from 'reactstrap';
import MaterialTable        from'material-table';
import Prescriptions        from './Prescriptions';
import PatientsForm         from './PatientsForm';
import "./styles.css";
import "./bootstrap.min.css";

/*SNOMED codes
weight:             27113001
height:             50373000
bmi:                60621009
smoker:             77176002
drinker:            219006
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
    smoker:             "77176002",
    drinker:            "219006",
    dyssomnia:          "44186003",
    diabetes_mellitus:  "73211009",
    hypertension:       "38341003",
    collagen_vascular:  "398049005",
    ibd:                "24526004",
    physical_activity:  "68130003",
    gastro_operation:   "386621005",
    diet:               "230125005",
    cm:                 "258672001",
    kg:                 "258683005",
    years:              "258707000",
    per_week:           "259038000"
}

function Get(yourUrl){
    var Httpreq = new XMLHttpRequest(); // a new request
    Httpreq.open("GET",yourUrl,false);
    Httpreq.send(null);
    return Httpreq.responseText;          
}



// function getDataold() {

//     let patients = [];
//     let patientCount, current, obsCount, nextPage, pages;
//     let dataPages = [];
//     let i, j;
//     //let searchAllPatients = client.search({resourceType: 'Patient'})
//     //console.log("Searched for all patients:")
//     //console.log(searchAllPatients)
//     client.search({resourceType: 'Patient'})
//             .then((resource) => {
//                 patientCount = resource.entry.length;
                
//                 let patientsIds = [];
//                 for (i = 0; i < patientCount; i++) {
//                     patientsIds.push(resource.entry[i].resource.id)
//                 }
//                 console.log('Patients IDs: ' + patientsIds)
//                 i = 0;
//                 //while (i < patientCount) {
//                 for (i = 0; i < patientCount; i++) {
//                     let patientData = {
//                         "id": '',
//                         "fname": '',
//                         "sname": '',
//                         "birthDate": '',
//                         "gender": '',
//                         "height": 0,
//                         "weight": 0,
//                         "lastUpdated": '',
//                         "bmi": 0,
//                         "yearsSmoking": 0,
//                         "yearsDrinking": 0,
//                         "diabetes": 0,
//                         "hypertension": 0,
//                         "gastroOperation": 0,
//                         "dyssomnia": 0,
//                         "collagen_vascular": 0,
//                         "physical_activity": 0,
//                         "ibd": 0
//                     }
//                     client.read({ resourceType: 'Patient', id: `${patientsIds[i]}` })
//                         .then((resource2) => {
//                             patientData.id = resource2.id;
//                             patientData.fname = resource2.name[0].given[0];
//                             patientData.sname = resource2.name[0].family;
//                             patientData.birthDate = resource2.birthDate;
//                             patientData.gender = resource2.gender;
//                             patientData.lastUpdated = resource2.meta.lastUpdated.slice(0,10) + " " + resource2.meta.lastUpdated.slice(11,16);
//                             client.search({ resourceType: 'Observation'})
//                                 .then((resource3) => {
//                                     // console.log("All observations:")
//                                     // console.log(resource3)
//                                     // console.log("Resource3 length:")
//                                     // console.log(resource3[1].length)
//                                     obsCount = resource3.entry.length
//                                     console.log("All fetched observations:")
//                                     console.log(dataPages);
//                                     for (j = 0; j < obsCount; j++) {
//                                         if (resource3.entry[j].resource.subject.reference === ("Patient/" + resource2.id)) {
//                                             current = resource3.entry[j].resource.code.coding[0].code;
//                                             switch(current) {
//                                                 case codes.height: 
//                                                     patientData.height = resource3.entry[j].resource.valueQuantity.value;
//                                                     break;
//                                                 case codes.weight:
//                                                     patientData.weight = resource3.entry[j].resource.valueQuantity.value;
//                                                     break;
//                                                 case codes.bmi:
//                                                     patientData.bmi = resource3.entry[j].resource.valueQuantity.value;
//                                                     break;
//                                                 case codes.smoker:
//                                                     patientData.yearsSmoking = resource3.entry[j].resource.valueQuantity.value;
//                                                     break;
//                                                 case codes.drinker:
//                                                     patientData.yearsDrinking = resource3.entry[j].resource.valueQuantity.value;
//                                                     break;
//                                                 case codes.dyssomnia:
//                                                     patientData.dyssomnia = resource3.entry[j].resource.valueQuantity.value;
//                                                     break;
//                                                 case codes.diabetes_mellitus:
//                                                     patientData.diabetes = resource3.entry[j].resource.valueQuantity.value;
//                                                     break;
//                                                 case codes.collagen_vascular:
//                                                     patientData.collagen_vascular = resource3.entry[j].resource.valueQuantity.value;
//                                                     break;
//                                                 case codes.ibd:
//                                                     patientData.ibd = resource3.entry[j].resource.valueQuantity.value;
//                                                     break;
//                                                 case codes.gastro_operation:
//                                                     patientData.gastroOperation = resource3.entry[j].resource.valueQuantity.value;
//                                                     break;
//                                                 case codes.physical_activity:
//                                                     patientData.physical_activity = resource3.entry[j].resource.valueQuantity.value;
//                                                     break;
//                                                 case codes.hypertension:
//                                                     patientData.hypertension = resource3.entry[j].resource.valueQuantity.value;
//                                                     break;
//                                                 default:
//                                                     break;
//                                             }
//                                         }
//                                     }
//                                     console.log(patientData);
//                                     patients.push(patientData);
//                                 })      
//                         });
//                     // i++;
//                 }
//             });

//             return patients;
//     }
//     // getData2();
    

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
            title: "Birth date",
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
            field: "physical_activity",
            hidden: true
        },
        {
            title: "Hypertensive disorder",
            field: "hypertenstion",
            hidden: true
        },
        {
            title: "Collagen vascular",
            field: "collagen_vascular",
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
    const [patientFormData,setPatientFormData] = useState({});
    // const handleClose = () => setShow(false);
    // const handleShow = () => setShow(true);
    const [modalShow, setModalShow] = useState(false);
    const [patientsData, setPatientsData] = useState([])
    const [prescShow, setPrescShow] = useState(false);
    const [prescData, setPrescData] = useState({});

    useEffect(() => {
        async function getData() {
            let fetchedPatients, fetchedObservations, fetchedMedReqs;
            let i, j, k, nextPage, currentCode;
            let patients = [];
        
            await client.search({resourceType: 'Patient'}).then((resource) => {
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
            })
            // console.log(fetchedPatients);
        
            await client.search({resourceType: 'Observation'}).then((resource) => {
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
            })

            await client.search({resourceType: 'MedicationRequest'}).then((resource) => {
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
            })
        
            for (i = 0; i < fetchedPatients.length; i++) {
                let patientData = {
                    "id": '',
                    "fname": '',
                    "sname": '',
                    "birthDate": '',
                    "gender": '',
                    "lastUpdated": '',
                    "height": 0,
                    "heightID": '',
                    "weight": 0,
                    "weightID": '',
                    "bmi": 0,
                    "bmiID": '',
                    "yearsSmoking": 0,
                    "yearsSmokingID": '',
                    "yearsDrinking": 0,
                    "yearsDrinkingID": '',
                    "diabetes": 0,
                    "diabetesID": '',
                    "hypertension": 0,
                    "hypertensionID": '',
                    "gastroOperation": 0,
                    "gastroOperationID": '',
                    "dyssomnia": 0,
                    "dyssomniaID": '',
                    "collagen_vascular": 0,
                    "collagen_vascularID": '',
                    "physical_activity": 0,
                    "physical_activityID": '',
                    "ibd": 0,
                    "ibdID": '',
                    "medications": []
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
                            case codes.smoker:
                                patientData.yearsSmoking = fetchedObservations[j].resource.valueQuantity.value;
                                patientData.yearsSmokingID = fetchedObservations[j].resource.id;
                                break;
                            case codes.drinker:
                                patientData.yearsDrinking = fetchedObservations[j].resource.valueQuantity.value;
                                patientData.yearsDrinkingID = fetchedObservations[j].resource.id;
                                break;
                            case codes.dyssomnia:
                                patientData.dyssomnia = fetchedObservations[j].resource.valueQuantity.value;
                                patientData.dyssomniaID = fetchedObservations[j].resource.id;
                                break;
                            case codes.diabetes_mellitus:
                                patientData.diabetes = fetchedObservations[j].resource.valueQuantity.value;
                                patientData.diabetesID = fetchedObservations[j].resource.id;
                                break;
                            case codes.collagen_vascular:
                                patientData.collagen_vascular = fetchedObservations[j].resource.valueQuantity.value;
                                patientData.collagen_vascularID = fetchedObservations[j].resource.id;
                                break;
                            case codes.ibd:
                                patientData.ibd = fetchedObservations[j].resource.valueQuantity.value;
                                patientData.ibdID = fetchedObservations[j].resource.id;
                                break;
                            case codes.gastro_operation:
                                patientData.gastroOperation = fetchedObservations[j].resource.valueQuantity.value;
                                patientData.gastroOperationID = fetchedObservations[j].resource.id;
                                break;
                            case codes.physical_activity:
                                patientData.physical_activity = fetchedObservations[j].resource.valueQuantity.value;
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
                    if (fetchedMedReqs[k].resource.subject.reference === ("Patient/" + patientData.id)) {
                        patientData.medications.push(fetchedMedReqs[k])
                    }
                }
                patients.push(patientData);
            }
            console.log(patients)
            setPatientsData(patients)
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
                                    // handleShow();
                                    setShow(true);
                                    setPatientFormData(rowData);
                                }
                                
                            },
                            {
                                icon: 'receipt',
                                tooltip: 'Prescriptions',
                                onClick: (event, rowData) => {
                                    setPrescShow(true);
                                    console.log(rowData.medications)
                                    setPrescData(rowData.medications);
                                    // client.delete({resourceType: "Patient", id: rowData.id})
                                }
                            }
                        ]}
                        options={
                            {
                                pageSize: 13
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
                    {/* {receiptsShow===true &&  */}
                        <Prescriptions
                            show={prescShow}
                            onHide={() => setPrescShow(false)}
                            client={client}
                            data={prescData}
                        />
                    {/* } */}
                </div>
            </div>
        )
    }