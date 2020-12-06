import React, { Component } from "react";
import DataTable from 'react-data-table-component'
import "./styles.css";
import "./bootstrap.min.css";

class PatientsTable extends Component {

  constructor() {
    super();
    this.state = {
    columns: [
      {
          name: 'ID',
          selector: "id",
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
          sortable: true,
          right: true
      },
      {
          name: 'Weight',
          selector: 'weight',
          sortable: true,
          right: true,
      }
    ]
    }
  }

  logger() {
    console.log('Props data:')
    console.log(this.props.data);
  }

  render() {
    this.logger();
    return (
      <DataTable
        title="Patients' Data"
        columns={this.state.columns}
        data={this.props.data}
      />
    )
  }
}

export default PatientsTable;