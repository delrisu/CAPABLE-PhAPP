import React, { Component, useMemo, useState, useEffect }        from 'react';
import { Button }   from 'reactstrap';
import PatientsForm from './PatientsForm';
import DataTable from 'react-data-table-component';
import PatientsTable from './PatientsTable';
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
                        id: '',
                        fname: '',
                        sname: '',
                        birthDate: '',
                        gender: '',
                        lastUpdated: '',
                        height: '',
                        weight: '',
                        yearsSmoking: '',
                        diabetes: '',
                        hypertensiveDisorder: '',
                        gastroOperation: '',
                        dyssomnia: ''
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
            name: 'ID',
            selector: 'id',
            sortable: true
        },
        {
            name: 'First name',
            selector: 'fname',
            sortable: true
        },
        {
            name: 'Second name',
            selector: 'sname',
            sortable: true
        },
        {
            name: 'Gender',
            selector: 'gender',
            sortable: true
        },
        {
            name: 'Birth date',
            selector: 'birthDate',
            sortable: true
        },
        {
            name: 'Height',
            selector: 'height',
            sortable: true
        },
        {
            name: 'Weight',
            selector: 'weight',
            sortable: true
        }
      ]
    

    const patientsData = getData();

    console.log('Patients (main):');
    console.log(patientsData);

//class Patients extends Component {
export default function Patients() {
    //render() {
        return (
            <div className="content-main">
                <h1><span className="badge badge-dark">Patients</span></h1>
                <div className="content-whiteboard">
                    <PatientsModal/>
                    <DataTable
                        title="Patients"
                        columns={columns}
                        data={patientsData}
                    />
                </div>
            </div>
        )
    //}
}

// export default function Patients() {

//     const columns = [
//         {
//             name: 'ID',
//             selector: 'id',
//             sortable: true
//         },
//         {
//             name: 'First name',
//             selector: 'fname',
//             sortable: true
//         },
//         {
//             name: 'Second name',
//             selector: 'sname',
//             sortable: true
//         },
//         {
//             name: 'Gender',
//             selector: 'gender',
//             sortable: true
//         },
//         {
//             name: 'Birth date',
//             selector: 'birthDate',
//             sortable: true
//         },
//         {
//             name: 'Height',
//             selector: 'height',
//             sortable: true,
//             right: true
//         },
//         {
//             name: 'Weight',
//             selector: 'weight',
//             sortable: true,
//             right: true
//         }
//       ]
//     const [modalShow, setModalShow] = React.useState(false);

//     const patientsData = getData();

//     console.log('Patients (main):');
//     console.log(patientsData);

    
//     // const columns = useMemo(
//     //     () => [
//     //       {
//     //         // first group - TV Show
//     //         Header: "Personal data",
//     //         // First group columns
//     //         columns: [
//     //           {
//     //             Header: "ID",
//     //             accessor: "patientsData.id"
//     //           },
//     //           {
//     //             Header: "First name",
//     //             accessor: "patientsData.fname"
//     //           },
//     //           {
//     //             Header: "Second name",
//     //             accessor: "patientsData.sname"
//     //           },
//     //           {
//     //             Header: "Gender",
//     //             accessor: "patientsData.gender"
//     //           },
//     //           {
//     //             Header: "Birth date",
//     //             accessor: "patientsData.birthDate"
//     //           },
//     //           {
//     //             Header: "Height",
//     //             accessor: "patientsData.height"
//     //           },
//     //           {
//     //             Header: "Weight",
//     //             accessor: "patientsData.weight"
//     //           },
//     //         ]
//     //       },
//     //     ],
//     //     []
//     //   );
//     // const { FHIRClient } = require('fhir-crud-client');

//     // const BASE_URL = 'http://10.131.46.196:8080/baseR4/';
//     // const HEADERS = {
//     //   Accept: 'application/json',
//     // };
 
//     // const client = new FHIRClient(BASE_URL, HEADERS);

//     // client.read({ resourceType: 'Patient', id: '2/_history/2' })
//     //   .then((resource) => {
//     //   console.log(resource);
//     // });

//     return (
//         <div className="content-main">
//             <h1><span className="badge badge-dark">Patients</span></h1>
//             <div className="content-whiteboard">
//                 <div className="patients-top-bar">
//                     <div className="patients-top-bar-left">
                        
//                     </div>
//                     <div className="patients-top-bar-right">
//                         <Button color="primary" onClick={() => setModalShow(true)}>
//                             + Add a new patient
//                         </Button>
//                     </div>
//                 </div>
//                 <PatientsForm
//                     show={modalShow}
//                     onHide={() => setModalShow(false)}
//                 />
//                 <DataTable
//                     title="Patients"
//                     columns={columns}
//                     data={patientsData}
//                 />
//             </div>
//         </div>
//     )
// }

//export default Patients;
