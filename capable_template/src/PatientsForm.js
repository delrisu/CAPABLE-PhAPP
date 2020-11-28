import React, { Component } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import "./bootstrap.min.css";
import "./styles.css";

class PatientsForm extends Component {
    
    constructor () {
        super();
        this.state = {
            f_name: '',
            s_name: '',
            born: '',
            gender: '',
            weight: 0,
            height: 0,
            bmi: 0,
            years_smoking: '',
            years_drinking: '',
            therapy: '',
            other_treatments: '',
            sleep_problems: 'False',
            diabetes: 'False',
            hypertension: 'False',
            collagen_vascular: 'False',
            ibd: 'False',
            prev_intestial_surgery: 'False',
            phys_activity: 'None',
            diet: '',
            additional_info: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeBMI = this.handleChangeBMI.bind(this);
        this.handleBMI = this.handleBMI.bind(this);
    }

    handleChange (event) {
        this.setState({ [event.target.name]: event.target.value });
        console.log(event.target.value);
    }

    handleBMI () {
        (this.state.weight !== 0 && this.state.height !== 0) ? this.setState({bmi: parseFloat(this.state.weight/Math.pow(this.state.height/100,2)).toFixed(2)}) : this.setState({bmi: 0})
        console.log(this.state.bmi)
    }

    handleChangeBMI (event) {
        this.setState({ [event.target.name]: event.target.value},() => {
            //console.log(event.target.value);
            this.handleBMI();
        });

    }
  
    render() {
        return (
            <form>
            <Carousel interval={null} wrap={false}>
                <Carousel.Item>
                    <div className="form-controller">
                        <div className="form-row" id="section-label">Personal data</div>
                        <div className="form-row">
                            <div className="form-group col-md-3">
                                <label for="f_name">First name</label>
                                <input type="text" 
                                        name="f_name" 
                                        onChange={this.handleChange}
                                        id="f_name"
                                        className="form-control"
                                />
                            </div>
                            <div className="form-group col-md-3">
                                <label for="s_name">Last name</label>
                                <input type="text" 
                                        name="s_name" 
                                        onChange={this.handleChange}
                                        id="s_name"
                                        className="form-control"
                                />
                            </div>
                            <div className="form-group col-md-3">
                                <label for="born">Date of birth</label>
                                <input type="date" 
                                        name="born" 
                                        onChange={this.handleChange}
                                        id="born"
                                        className="form-control"
                                />
                            </div>
                            <div className="form-group col-md-3">
                                <label for="gender">Gender</label>
                                <select name="gender" 
                                        onChange={this.handleChange}
                                        id="gender"
                                        className="form-control">
                                    <option value="" selected disabled hidden>Choose...</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-2">
                                <label for="height">Height [cm]</label>
                                <input type="number" 
                                        name="height" 
                                        onChange={this.handleChangeBMI}
                                        id="height"
                                        className="form-control"
                                />
                            </div>
                            <div className="form-group col-md-2">
                                <label for="weight">Weight [kg]</label>
                                <input type="number"
                                        name="weight" 
                                        onChange={this.handleChangeBMI}
                                        id="weight"
                                        className="form-control"
                                />
                            </div>
                            <div className="form-group col-md-2">
                                <label for="bmi">BMI</label>
                                <input type="number" 
                                        name="bmi" 
                                        value={this.state.bmi}
                                        id="bmi"
                                        className="form-control"
                                        disabled
                                />
                            </div>
                        </div>                 
                    </div>
                </Carousel.Item>
                <Carousel.Item>
                    <div className="form-controller">
                    <   div className="form-row" id="section-label">Medical data</div>
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
                            <div className="form-group col-md-4">
                                <label for="diabetes">Diabetes</label>
                                <select name="diabetes" 
                                        onChange={this.handleChange}
                                        id="diabetes"
                                        className="form-control">
                                    <option value="" selected disabled hidden>Choose...</option>
                                    <option value="false">False</option>
                                    <option value="true">True</option>
                                </select>
                            </div>
                            <div className="form-group col-md-4">
                                <label for="hypertension">Hypertension</label>
                                <select name="hypertension" 
                                        onChange={this.handleChange}
                                        id="hypertension"
                                        className="form-control">
                                    <option value="" selected disabled hidden>Choose...</option>
                                    <option value="false">False</option>
                                    <option value="true">True</option>
                                </select>
                            </div>
                            <div className="form-group col-md-4">
                                <label for="collagen_vascular">Collagen vascular</label>
                                <select name="collagen_vascular" 
                                        onChange={this.handleChange}
                                        id="collagen_vascular"
                                        className="form-control">
                                    <option value="" selected disabled hidden>Choose...</option>
                                    <option value="false">False</option>
                                    <option value="true">True</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-4">
                                <label for="ibd">IBD</label>
                                <select name="ibd" 
                                        onChange={this.handleChange}
                                        id="ibd"
                                        className="form-control">
                                    <option value="" selected disabled hidden>Choose...</option>
                                    <option value="false">False</option>
                                    <option value="true">True</option>
                                </select>
                            </div>
                            <div className="form-group col-md-4">
                                <label for="prev_intestial_surgery">Previous intestial surgery</label>
                                <select name="prev_intestial_surgery" 
                                        onChange={this.handleChange}
                                        id="prev_intestial_surgery"
                                        className="form-control">
                                    <option value="" selected disabled hidden>Choose...</option>
                                    <option value="false">False</option>
                                    <option value="true">True</option>
                                </select>
                            </div>
                            <div className="form-group col-md-4">
                                <label for="phys_activity">Physical activity</label>
                                <select name="phys_activity" 
                                        onChange={this.handleChange}
                                        id="phys_activity"
                                        className="form-control">
                                    <option value="" selected disabled hidden>Choose...</option>
                                    <option value="none">None</option>
                                    <option value="3xpw">More than 3 times a week</option>
                                    <option value="1t3xpw">1-3 times a week</option>
                                    <option value="1t2xp2w">1-2 times per 2 weeks</option>
                                    <option value="1xpm">Once a month</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-3">
                                <label for="sleep_problems">Sleeping problems</label>
                                <select name="sleep_problems" 
                                        onChange={this.handleChange}
                                        id="sleep_problems"
                                        className="form-control">
                                    <option value="" selected disabled hidden>Choose...</option>
                                    <option value="false">False</option>
                                    <option value="true">True</option>
                                </select>
                            </div>
                            <div className="form-group col-md-3">
                                <label for="diet">Diet</label>
                                <input type="text" 
                                        name="diet" 
                                        onChange={this.handleChange}
                                        id="diet"
                                        className="form-control"
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
                                <label for="years_drinking">Years as a drinker</label>
                                <input type="number"
                                        name="years_drinking" 
                                        onChange={this.handleChange}
                                        id="years_drinking"
                                        className="form-control"
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-12">
                            <label for="additional_info">Additional info</label>
                                <textarea
                                        name="additional_info" 
                                        onChange={this.handleChange}
                                        id="additional_info"
                                        className="form-control textarea"
                                    ></textarea>
                            </div>
                        </div>   
                    </div>
                </Carousel.Item>
            </Carousel>
            </form>  
      );
  }

}


export default PatientsForm;