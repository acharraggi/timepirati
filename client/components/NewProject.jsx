import React from 'react'
// import {Project} from '../ProjectStore.js'
import {observer} from 'mobx-react'
import {Redirect} from 'react-router-dom'

@observer export default class NewProject extends React.Component {
  constructor (props) {
    super(props)
    this.projectStore = props.rootStore.projectStore
    this.router = this.props.router
    this.state = {
      inputName: '',
      inputDescription: '',
      projectAdded: false
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.onBlur = this.onBlur.bind(this)
    this.handleEnterKeyPress = this.handleEnterKeyPress.bind(this)
  }

  handleSubmit () {
    // console.log("handle submit was called with "+this.state.inputName+this.state.inputDescription);
    // this.projectStore.projectList.push(new Project(this.projectStore, this.state.inputName, this.state.inputDescription))
    this.projectStore.createProject(this.state.inputName, this.state.inputDescription)
    this.setState({projectAdded: true})
  }

  onBlur (event) {
    // console.log("field "+event.target.name+": "+event.target.value)
    switch (event.target.name) {
      case 'name': this.setState({inputName: event.target.value})
        break
      case 'description': this.setState({inputDescription: event.target.value})
        break
      default: /* do nothing */
    }
  }
  handleEnterKeyPress (e) {
    if (e.which === 13) {
      e.target.blur()
    }
    return false
  }

  render () {
    if (this.state.projectAdded) {
      return (<Redirect to='/projects' />)
    } else {
      return (
        <div>
          <h2>New Project</h2>
          <form>
            <label>Name:
              <input autoFocus name='name' type='text' onBlur={this.onBlur} onKeyPress={this.handleEnterKeyPress} />
            </label>
            <label>Description:
              <input name='description' type='text' onBlur={this.onBlur} onKeyPress={this.handleEnterKeyPress} />
            </label>
            <button type='button' onClick={this.handleSubmit}>Add Project</button>
          </form>
        </div>
      )
    }
  }
}
