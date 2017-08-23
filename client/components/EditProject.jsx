import React from 'react';
import {Project} from '../ProjectStore.js';
import {observer, action} from "mobx-react";
import { Redirect } from 'react-router-dom';

export default @observer class EditProject extends React.Component {


  constructor(props) {
    super(props);
    this.projectStore = props.rootStore.projectStore;
    function findProject(p) {
      return p.id === props.match.params.id;
    }
    this.project = this.projectStore.projectList.find(findProject);
    if (this.project === undefined) {
      console.log("EditProject not able to find project in projectList ");
    }
    else {
      console.log("EditProject found "+this.project.name);
    }
    this.state = {
      inputName: this.project.name,
      inputDescription: this.project.description,
      projectUpdated: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.handleEnterKeyPress = this.handleEnterKeyPress.bind(this);
    this.updateInputValue = this.updateInputValue.bind(this);
  }

  handleSubmit() {
//    console.log('handle submit '+this.state.inputName+this.state.inputDescription);
//    console.log(this.project.name);
    this.setState({projectUpdated: true});
    this.project.updateName(this.state.inputName);
    this.project.updateDescription(this.state.inputDescription);
  }

  onBlur(event) {
    //console.log("field "+event.target.name+": "+event.target.value);
    switch(event.target.name) {
      case 'name': this.setState({inputName: event.target.value});
        break;
      case 'description': this.setState({inputDescription: event.target.value});
        break;
      default: /*do nothing*/
    }
  }

  updateInputValue(event) {
    console.log("updateInputValue "+event.target.name+": "+event.target.value);
    switch(event.target.name) {
      case 'name': this.setState({inputName: event.target.value});
        break;
      case 'description': this.setState({inputDescription: event.target.value});
        break;
      default: /*do nothing*/
    }
  }
  handleEnterKeyPress(e) {
    if(e.which == 13){
      e.target.blur();
    }
    return false;
  }

  render () {
    if (this.state.projectUpdated) {
      return (<Redirect to="/projects"/>)
    }
    else {
      return (
          <div>
            <h2>Edit Project</h2>
            <form>
              <label>Name:
                {/*<input name="name" type="text" value={this.state.inputName} onBlur={this.onBlur} onKeyPress={this.handleEnterKeyPress} />*/}
                <input name="name" type="text" value={this.state.inputName} onChange={evt => this.updateInputValue(evt)}
                       onKeyPress={this.handleEnterKeyPress}/>
              </label>
              <label>Description:
                <input name="description" type="text" value={this.state.inputDescription}
                       onChange={evt => this.updateInputValue(evt)} onKeyPress={this.handleEnterKeyPress}/>
              </label>
              <button type="button" onClick={this.handleSubmit} className="btn">Update Project</button>
            </form>
          </div>
      )
    }
  }
}


