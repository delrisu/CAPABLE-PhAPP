import React, { Component }       from 'react';
import MaterialTable from 'material-table';
import "./styles.css";
import "./bootstrap.min.css";
import PatientsModal from './PatientsModal';

function getData() {

    const { FHIRClient } = require('fhir-crud-client');

    const BASE_URL = 'http://10.131.46.196:8080/baseR4/';
    const HEADERS = {
      Accept: 'application/json',
    };
 
    const client = new FHIRClient(BASE_URL, HEADERS);
    
    let patients = [];
    let patientCount;
    client.search({resourceType: 'Patient', query: {id: {$gt: '0'}}})
            .then((resource) => {
                patientCount = resource.entry.length;
                let i;
                let patientsIds = [];
                for (i = 0; i < patientCount; i++) {
                    patientsIds.push(resource.entry[i].resource.id)
                }
                console.log('Patients IDs: ' + patientsIds)
                //patientCount = resource.total;
                //console.log('Patient count = ' + patientCount)
                i = 0;
                while (i < patientCount) {
                    //console.log(patientCount)
                    let patientData = {
                        "id": '',
                        "fname": '',
                        "sname": '',
                        "birthDate": '',
                        "gender": '',
                        "lastUpdated": '',
                        "height": '',
                        "weight": '',
                        "yearsSmoking": '',
                        "diabetes": '',
                        "hypertensiveDisorder": '',
                        "gastroOperation": '',
                        "dyssomnia": ''
                    }
                    client.read({ resourceType: 'Patient', id: `${patientsIds[i]}` })
                        .then((resource) => {
                            patientData.id = resource.id;
                            patientData.fname = resource.name[0].given[0];
                            patientData.sname = resource.name[0].family;
                            patientData.birthDate = resource.birthDate;
                            patientData.gender = resource.gender;
                            patientData.lastUpdated = resource.meta.lastUpdated;
                        // console.log(patientData);
                        patients.push(patientData);
                    });
                    i++;
                    // console.log(patients);
                }
            });
            // console.log('Patients:')
            // console.log(patients);

            return patients;
    }

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
            title: "Height",
            field: "height"
        },
        {
            title: "Weight",
            field: "weight"
        },
        {
            title: "Last updated",
            field: "lastUpdated"
        }
      ]
    

    const patientsData = getData();

    //console.log('Patients (main):');
    //console.log(patientsData);

// class Patients extends Component {
//     constructor() {
//         super();
//         this.state = {
//             patientsData: []
//         }
//     }

//     getData() {

//         const { FHIRClient } = require('fhir-crud-client');
    
//         const BASE_URL = 'http://10.131.46.196:8080/baseR4/';
//         const HEADERS = {
//           Accept: 'application/json',
//         };
     
//         const client = new FHIRClient(BASE_URL, HEADERS);
        
//         let patients = [];
//         let patientCount;
//         client.search({resourceType: 'Patient', query: {id: {$gt: '0'}}})
//                 .then((resource) => {
//                     patientCount = resource.entry.length;
//                     let i;
//                     let patientsIds = [];
//                     for (i = 0; i < patientCount; i++) {
//                         patientsIds.push(resource.entry[i].resource.id)
//                     }
//                     console.log('Patients IDs: ' + patientsIds)
//                     //patientCount = resource.total;
//                     //console.log('Patient count = ' + patientCount)
//                     i = 0;
//                     while (i < patientCount) {
//                         //console.log(patientCount)
//                         let patientData = {
//                             "id": '',
//                             "fname": '',
//                             "sname": '',
//                             "birthDate": '',
//                             "gender": '',
//                             "lastUpdated": '',
//                             "height": '',
//                             "weight": ''
//                             // yearsSmoking: '',
//                             // diabetes: '',
//                             // hypertensiveDisorder: '',
//                             // gastroOperation: '',
//                             // dyssomnia: ''
//                         }
//                         client.read({ resourceType: 'Patient', id: `${patientsIds[i]}` })
//                             .then((resource) => {
//                                 patientData.id = resource.id;
//                                 patientData.fname = resource.name[0].given[0];
//                                 patientData.sname = resource.name[0].family;
//                                 patientData.birthDate = resource.birthDate;
//                                 patientData.gender = resource.gender;
//                                 patientData.lastUpdated = resource.meta.lastUpdated;
//                             patients.push(patientData);
//                         });
//                         i++;
//                     }
//                 });
//                 return patients;
//         }

        // handleRowClick = (row, e) => {
        //     console.log(row);
        // }

        // componentDidMount() {
        //     const fetchedData = this.getData();
        //     this.setState({patientsData: fetchedData})
        //     console.log("Patients data is:")
        //     console.log(this.state.patientsData)
        // }
    //render() {
        //const patientsData = this.getData();
export default function Patients() {
    //const patientsData = getData();
        return (
            <div className="content-main">
                <h1><span className="badge badge-dark">Patients</span></h1>
                <div className="content-whiteboard">
                    <PatientsModal/>
                    <MaterialTable
                        columns={columns}
                        data={patientsData}
                        title="Patients"
                    />
                    {/* <DataTable
                        title="Patients"
                        columns={this.state.columns}
                        data={patientsData}
                        highlightOnHover={true}
                        onRowClicked={this.handleRowClick}
                    /> */}
                </div>
            </div>
        )
    //}
    }
