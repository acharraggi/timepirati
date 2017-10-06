import React from 'react'
import {Project, Task} from '../ProjectStore.js'
import {observer} from 'mobx-react'
import { NavLink } from 'react-router-dom'

@observer export default class EditProject extends React.Component {
  constructor (props) {
    super(props)
    this.projectStore = props.rootStore.projectStore
    function findProject (p) {
      return p.id === props.match.params.id
    }
    this.project = this.projectStore.projectList.find(findProject)
    if (this.project === undefined) {
      console.log('EditProject not able to find project in projectList')
    } else {
      // console.log("EditProject found "+this.project.name);
    }
  }

  updateInputValue (event) {
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

  handleTaskNameChange = (idx) => (evt) => {
    this.project.taskList[idx].updateName(evt.target.value)
  }

  handleTaskDescriptionChange = (idx) => (evt) => {
    this.project.taskList[idx].updateDescription(evt.target.value)
  }

  handleAddTask= () => {
    this.project.addTask(new Task())
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
                  autoFocus
                /></td>
                <td><input type='text' placeholder={`task #${idx + 1} description`} value={task.description}
                  onChange={this.handleTaskDescriptionChange(idx)}
                  /></td>
                <td><button type='button' onClick={() => this.project.removeTask(task)}>Delete</button></td>
              </tr>
               ))}
          </tbody>
        </table>
        <button type='button' onClick={this.handleAddTask}>Add Task</button>
        <p><NavLink to='/projects'>Return to project list.</NavLink></p>
      </div>
    )
  }
}
