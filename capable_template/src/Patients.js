import React, { Component }       from 'react';
import MaterialTable from 'material-table';
import "./styles.css";
import "./bootstrap.min.css";
import PatientsModal from './PatientsModal';

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
    kg:                 "258672001",
    years:              "258707000",
    per_week:           "259038000"
}

// async function getData() {
//     let allPatients = await client.search({resourceType: 'Patient'});
//     let allObservations = await client.search({resourceType: 'Observation'});
//     let patients = [];
//     let patientsIds = [];
//     let patientCount = allPatients.entry.length;
//     let obsCount = allObservations.entry.length;
//     let patientData, patientById, patientRef;
//     let i,j;
//     for (i = 0; i < patientCount; i++) {
//         patientsIds.push(allPatients.entry[i].resource.id)
//     }
//     for (i = 0; i < patientCount; i++) {
//         patientData = {
//             "id": '',
//             "fname": '',
//             "sname": '',
//             "birthDate": '',
//             "gender": '',
//             "height": '',
//             "weight": '',
//             "lastUpdated": '',
//             "bmi": '',
//             "yearsSmoking": '',
//             "yearsDrinking": '',
//             "diabetes": '',
//             "hypertension": '',
//             "gastroOperation": '',
//             "dyssomnia": '',
//             "collagen_vascular": '',
//             "physical_activity": ''
//         };
//         patientById = await client.read({ resourceType: 'Patient', id: `${patientsIds[i]}` });
//         patientData.id = patientById.id;
//         patientData.fname = patientById.name[0].given[0];
//         patientData.sname = patientById.name[0].family;
//         patientData.birthDate = patientById.birthDate;
//         patientData.gender = patientById.gender;
//         patientData.lastUpdated = patientById.meta.lastUpdated.slice(0,10) + " " + patientById.meta.lastUpdated.slice(11,16);
//         patientRef = "Patient/" + patientData.id
//         for (j = 0; j < obsCount; j++) {
//             if (allObservations.entry[j].resource.subject.reference == patientRef) {
//                 let current = allObservations.entry[j].resource.code.coding[0].code;
//                 switch(current) {
//                     case codes.height: 
//                         patientData.height = allObservations.entry[j].resource.valueQuantity.value;
//                         break;
//                     case codes.weight:
//                         patientData.weight = allObservations.entry[j].resource.valueQuantity.value;
//                         break;
//                     case codes.bmi:
//                         patientData.bmi = allObservations.entry[j].resource.valueQuantity.value;
//                         break;
//                     case codes.smoker:
//                         patientData.yearsSmoking = allObservations.entry[j].resource.valueQuantity.value;
//                         break;
//                     case codes.drinker:
//                         patientData.yearsDrinking = allObservations.entry[j].resource.valueQuantity.value;
//                         break;
//                     case codes.dyssomnia:
//                         patientData.dyssomnia = allObservations.entry[j].resource.valueQuantity.value;
//                         break;
//                     case codes.diabetes_mellitus:
//                         patientData.diabetes = allObservations.entry[j].resource.valueQuantity.value;
//                         break;
//                     case codes.collagen_vascular:
//                         patientData.collagen_vascular = allObservations.entry[j].resource.valueQuantity.value;
//                         break;
//                     case codes.ibd:
//                         patientData.ibd = allObservations.entry[j].resource.valueQuantity.value;
//                         break;
//                     case codes.gastro_operation:
//                         patientData.gastroOperation = allObservations.entry[j].resource.valueQuantity.value;
//                         break;
//                     case codes.physical_activity:
//                         patientData.physical_activity = allObservations.entry[j].resource.valueQuantity.value;
//                         break;
//                     default:
//                         break;
//                 }
//             }
//         }
//         patients.push(patientData);
//     }
//     return patients;
// }

function getData() {

    let patients = [];
    let patientCount, current;
    let obsCount;
    let i, j;
    //let searchAllPatients = client.search({resourceType: 'Patient'})
    //console.log("Searched for all patients:")
    //console.log(searchAllPatients)
    client.search({resourceType: 'Patient'})
            .then((resource) => {
                patientCount = resource.entry.length;
                
                let patientsIds = [];
                for (i = 0; i < patientCount; i++) {
                    patientsIds.push(resource.entry[i].resource.id)
                }
                console.log('Patients IDs: ' + patientsIds)
                i = 0;
                while (i < patientCount) {
                    let patientData = {
                        "id": '',
                        "fname": '',
                        "sname": '',
                        "birthDate": '',
                        "gender": '',
                        "height": '',
                        "weight": '',
                        "lastUpdated": '',
                        "bmi": '',
                        "yearsSmoking": '',
                        "yearsDrinking": '',
                        "diabetes": '',
                        "hypertension": '',
                        "gastroOperation": '',
                        "dyssomnia": '',
                        "collagen_vascular": '',
                        "physical_activity": ''
                    }
                    client.read({ resourceType: 'Patient', id: `${patientsIds[i]}` })
                        .then((resource2) => {
                            patientData.id = resource2.id;
                            patientData.fname = resource2.name[0].given[0];
                            patientData.sname = resource2.name[0].family;
                            patientData.birthDate = resource2.birthDate;
                            patientData.gender = resource2.gender;
                            patientData.lastUpdated = resource2.meta.lastUpdated.slice(0,10) + " " + resource2.meta.lastUpdated.slice(11,16);
                            client.search({ resourceType: 'Observation'})
                                .then((resource3) => {
                                    obsCount = resource3.entry.length;
                                    for (j = 0; j < obsCount; j++) {
                                        if (resource3.entry[j].resource.subject.reference === ("Patient/" + resource2.id)) {
                                            current = resource3.entry[j].resource.code.coding[0].code;
                                            switch(current) {
                                                case codes.height: 
                                                    patientData.height = resource3.entry[j].resource.valueQuantity.value;
                                                    break;
                                                case codes.weight:
                                                    patientData.weight = resource3.entry[j].resource.valueQuantity.value;
                                                    break;
                                                case codes.bmi:
                                                    patientData.bmi = resource3.entry[j].resource.valueQuantity.value;
                                                    break;
                                                case codes.smoker:
                                                    patientData.yearsSmoking = resource3.entry[j].resource.valueQuantity.value;
                                                    break;
                                                case codes.drinker:
                                                    patientData.yearsDrinking = resource3.entry[j].resource.valueQuantity.value;
                                                    break;
                                                case codes.dyssomnia:
                                                    patientData.dyssomnia = resource3.entry[j].resource.valueQuantity.value;
                                                    break;
                                                case codes.diabetes_mellitus:
                                                    patientData.diabetes = resource3.entry[j].resource.valueQuantity.value;
                                                    break;
                                                case codes.collagen_vascular:
                                                    patientData.collagen_vascular = resource3.entry[j].resource.valueQuantity.value;
                                                    break;
                                                case codes.ibd:
                                                    patientData.ibd = resource3.entry[j].resource.valueQuantity.value;
                                                    break;
                                                case codes.gastro_operation:
                                                    patientData.gastroOperation = resource3.entry[j].resource.valueQuantity.value;
                                                    break;
                                                case codes.physical_activity:
                                                    patientData.physical_activity = resource3.entry[j].resource.valueQuantity.value;
                                                    break;
                                                default:
                                                    break;
                                            }
                                        }
                                    }
                                    console.log(patientData);
                                    patients.push(patientData);
                                })      
                        });
                    i++;
                }
            });

            return patients;
    }

    const patientsData = getData();
    // editPatientsData = (event, rowData) => {

    // }

    const columns = [
        {
            title: "ID",
            field: "id",          
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
        }
      ]

      
        // {
        //     icon: 'edit',
        //     tooltip: 'Edit patient\'s data',
        //     // onClick: (event, rowData) => {
        //     //     editPatientsData();
        //     // }
        // },

export default function Patients() {
    //const patientsData = await getData();
        return (
            <div className="content-main">
                <h1><span className="badge badge-dark">Patients</span></h1>
                <div className="content-whiteboard">
                    <PatientsModal
                        client={client}
                    />
                    <MaterialTable
                        columns={columns}
                        data={patientsData}
                        title="Patients"
                        actions={[
                            {
                                icon: 'delete',
                                tooltip: 'Remove this patient',
                                onClick: (event, rowData) => {
                                    console.log(rowData.id)
                                    client.delete({resourceType: "Patient", id: rowData.id})
                                }
                            }
                        ]}
                        options={
                            {
                                pageSize: 10
                            }
                        }
                    />
                </div>
            </div>
        )
    }