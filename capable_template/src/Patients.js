import React, { Component }       from 'react';
import MaterialTable from 'material-table';
import "./styles.css";
import "./bootstrap.min.css";
import PatientsModal from './PatientsModal';

function getData(client) {

    // const { FHIRClient } = require('fhir-crud-client');

    // const BASE_URL = 'http://10.131.46.196:8080/baseR4/';
    // const HEADERS = {
    //   Accept: 'application/json',
    // };
 
    // const client = new FHIRClient(BASE_URL, HEADERS);
    
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
                i = 0;
                while (i < patientCount) {
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
                            patientData.lastUpdated = resource.meta.lastUpdated.slice(0,10) + " " + resource.meta.lastUpdated.slice(11,16);
                        patients.push(patientData);
                    });
                    i++;
                }
            });

            return patients;
    }

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
    
    const { FHIRClient } = require('fhir-crud-client');

    const BASE_URL = 'http://10.131.46.196:8080/baseR4/';
    const HEADERS = {
            Accept: 'application/json',
        };
   
    const client = new FHIRClient(BASE_URL, HEADERS);

    const patientsData = getData(client);


export default function Patients() {
        return (
            <div className="content-main">
                <h1><span className="badge badge-dark">Patients</span></h1>
                <div className="content-whiteboard">
                    <PatientsModal/>
                    <MaterialTable
                        columns={columns}
                        data={patientsData}
                        title="Patients"
                        actions={[
                            {
                                icon: 'edit',
                                tooltip: 'Edit patient\'s data',
                                // onClick: (event, rowData) => {
                                //     editPatientsData();
                                // }
                            }
                        ]}
                    />
                </div>
            </div>
        )
    }
