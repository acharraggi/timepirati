import React from 'react'
import {Project, Task} from '../ProjectStore.js'
import {observer} from 'mobx-react'
import {NavLink} from 'react-router-dom'
import {observable, action} from 'mobx'

@observer export default class EditProject extends React.Component {
  @observable project
  saveProject
  constructor (props) {
    super(props)
    this.projectStore = props.rootStore.projectStore
    function findProject (p) {
      return p.id === props.match.params.id
    }
    this.saveProject = this.projectStore.projectList.find(findProject)
    if (this.saveProject === undefined) {
      console.log('EditProject not able to find project in projectList')
    } else {
      // console.log('EditProject: ' + this.saveProject.name)
      // console.log('EditProject asJson: ' + sthis.aveProject.asJson)
      // console.log('EditProject tasklist length: ' + this.saveProject.pTaskList.length)
      // let temp = JSON.parse(this.saveProject.asJson)
      // console.log('EditProject temp asJson id: ' + temp.id)
      // console.log('EditProject temp asJson pname: ' + temp.pName)
      // console.log('EditProject temp asJson pdesc: ' + temp.pDescription)
      // console.log('EditProject tasklist asJson length: ' + temp.pTaskList.length)
      this.project = new Project(this.projectStore, '', '', this.saveProject.id)
      this.project.updateFromJson(JSON.parse(this.saveProject.asJson))
      console.log('EditProject: ' + this.project.name)
    }
    this.updateInputValue = this.updateInputValue.bind(this)
    this.handleEnterKeyPress = this.handleEnterKeyPress.bind(this)
    this.handleTaskNameChange = this.handleTaskNameChange.bind(this)
    this.handleTaskDescriptionChange = this.handleTaskDescriptionChange.bind(this)
    // this.onBlur = this.onBlur.bind(this)
    this.handleAddTask = this.handleAddTask.bind(this)
    this.handleSaveChanges = this.handleSaveChanges.bind(this)
  }

  @action updateInputValue (event) {
    // console.log("updateInputValue "+event.target.name+": "+event.target.value);
    switch (event.target.name) {
      case 'name': this.project.updateName(event.target.value)
        break
      case 'description': this.project.updateDescription(event.target.value)
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

  @action handleTaskNameChange = (idx) => (evt) => {
    // console.log('handleTaskNameChange = ' + evt.target.value)
    // console.log('handleTaskNameChange idx = ' + idx)
    // console.log('handleTaskNameChange taskList.length = ' + this.project.taskList.length)
    // this.project.taskList[idx].updateName(evt.target.value)
    this.project.updateTaskName(idx, evt.target.value)
  }

  @action handleTaskDescriptionChange = (idx) => (evt) => {
    // console.log('handleTaskDescriptionChange = ' + evt.target.value)
    // this.project.taskList[idx].updateDescription(evt.target.value)
    this.project.updateTaskDescription(idx, evt.target.value)
  }

  // @action onBlur = (idx) => (event) => {
  //   console.log('index = ' + idx + ', onBlur field ' + event.target.name + ': ' + event.target.value)
  //   switch (event.target.name) {
  //     case 'name': this.project.taskList[idx].updateName(event.target.value)
  //       break
  //     case 'description': this.project.taskList[idx].updateDescription(event.target.value)
  //       break
  //     default: /* do nothing */
  //   }
  // }

  @action handleAddTask= () => {
    this.project.addTask(new Task())
  }

  handleSaveChanges= () => {
    // console.log('saveChanges project id ' + this.project.id)
    // console.log('saveChanges project asJson ' + this.project.asJson)
    this.projectStore.updateProject(this.saveProject, this.project)
  }

  render () {
    return (
      <div>
        <h2>Edit Project</h2>
        <form>
          <label>Name:
            <input autoFocus name='name' type='text' value={this.project.name}
              onChange={evt => this.updateInputValue(evt)}
              onKeyPress={this.handleEnterKeyPress}
            />
          </label>
          <label>Description:
            <input name='description' type='text' value={this.project.description}
              onChange={evt => this.updateInputValue(evt)}
              onKeyPress={this.handleEnterKeyPress}
            />
          </label>
        </form>
        <h2>Tasks</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Delete?</th>
            </tr>
          </thead>
          <tbody>
            {this.project.taskList.map((task, idx) => (
              <tr key={task.id}>
                <td><input type='text' placeholder={`task #${idx + 1} name`} value={task.name}
                  onChange={this.handleTaskNameChange(idx)}
                  // onBlur={this.onBlur(idx)}
                  onKeyPress={this.handleEnterKeyPress}
                  autoFocus
                /></td>
                <td><input type='text' placeholder={`task #${idx + 1} description`} value={task.description}
                  onChange={this.handleTaskDescriptionChange(idx)}
                  // onBlur={this.onBlur(idx)}
                  onKeyPress={this.handleEnterKeyPress}
                  /></td>
                <td><button type='button' onClick={() => this.project.removeTask(task)}>Delete</button></td>
              </tr>
               ))}
          </tbody>
        </table>
        <button type='button' onClick={this.handleAddTask}>Add Task</button>
        <p><NavLink to='/projects'>Return to project list.</NavLink></p>
        <button type='button' onClick={this.handleSaveChanges}>Save Changes</button>
      </div>
    )
  }
}
