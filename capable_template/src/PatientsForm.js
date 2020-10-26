import React, { Component } from 'react';
import "./bootstrap.min.css";
import "./styles.css";

class PatientsForm extends Component {
    
    constructor () {
        super();
        this.state = {
            f_name: '',
            s_name: '',
            born: '',
            weight: '',
            height: '',
            years_smoking: '',
            prev_surgery: '',
            prev_diseases: '',
            therapy: '',
            other_treatments: '',
            sleep_problems: '',
            additional_info: ''
        }
    };

    handleChange (event) {
        this.setState({ [event.target.name]: event.target.value });
    }
  
    render() {
        return (
            <form>
                <div className="form-row">
                    <div className="form-group col-md-4">
                        <label for="f_name">First name</label>
                        <input type="text" 
                                name="f_name" 
                                onChange={this.handleChange}
                                id="f_name"
                                className="form-control"
                        />
                    </div>
                    <div className="form-group col-md-4">
                        <label for="s_name">Last name</label>
                        <input type="text" 
                                name="s_name" 
                                onChange={this.handleChange}
                                id="s_name"
                                className="form-control"
                        />
                    </div>
                    <div className="form-group col-md-4">
                        <label for="born">Date of birth</label>
                        <input type="date" 
                                name="born" 
                                onChange={this.handleChange}
                                id="born"
                                className="form-control"
                        />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group col-md-2">
                        <label for="height">Height [cm]</label>
                        <input type="number" 
                                name="height" 
                                onChange={this.handleChange}
                                id="height"
                                className="form-control"
                        />
                    </div>
                    <div className="form-group col-md-2">
                        <label for="weight">Weight [kg]</label>
                        <input type="number" 
                                name="weight" 
                                onChange={this.handleChange}
                                id="weight"
                                className="form-control"
                        />
                    </div>
                    <div className="form-group col-md-2">
                        <label for="bmi">BMI</label>
                        <input type="number" 
                                name="bmi" 
                                onChange={this.handleChange}
                                id="bmi"
                                className="form-control"
                                disabled
                        />
                    </div>
                    <div className="form-group col-md-3">
                        <label for="years_smoking">Years as a smoker</label>
                        <input type="number" 
                                name="years_smoking" 
                                onChange={this.handleChange}
                                id="years_smoking"
                                className="form-control"
                            />
                    </div>
                    <div className="form-group col-md-3">
                        <label for="sleep_problems">Sleep problems</label>
                        <select name="sleep_problems" 
                                onChange={this.handleChange}
                                id="sleep_problems"
                                className="form-control">
                            <option>True</option>
                            <option>False</option>
                        </select>
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group col-md-6">
                        <label for="prev_diseases">Previous diseases</label>
                        <input type="text" 
                                name="prev_diseases" 
                                onChange={this.handleChange}
                                id="prev_diseases"
                                className="form-control"
                            />
                    </div>
                    <div className="form-group col-md-6">
                        <label for="prev_surgery">Previous surgery</label>
                        <input type="text" 
                                name="prev_surgery" 
                                onChange={this.handleChange}
                                id="prev_surgery"
                                className="form-control"
                            />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group col-md-6">
                    <label for="therapy">Therapy</label>
                        <input type="text" 
                                name="therapy" 
                                onChange={this.handleChange}
                                id="therapy"
                                className="form-control"
                            />
                    </div>
                    <div className="form-group col-md-6">
                    <label for="other_treatments">Other treatments</label>
                        <input type="text" 
                                name="other_treatments" 
                                onChange={this.handleChange}
                                id="other_treatments"
                                className="form-control"
                            />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group col-md-12">
                    <label for="additional_info">Additional informations</label>
                        <input type="text" 
                                name="additional_info" 
                                onChange={this.handleChange}
                                id="additional_info"
                                className="form-control"
                            />
                    </div>
                </div>
            </form>           
      );
  }

}


export default PatientsForm;