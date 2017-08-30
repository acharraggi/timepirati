import React from 'react'
import styles from './Timer.css'
import {observer} from 'mobx-react'

@observer export default class Timer extends React.Component {
  constructor (props) {
    super(props)
    this.timerStore = props.rootStore.timerStore
    this.projectList = props.rootStore.projectStore.projectList
    this.state = {project: this.projectList[0].id, task: this.projectList[0].taskList[0].id}
    // console.log('Timer constructor')
    // console.log(this.projectList[0].id)
    // console.log(this.projectList[1].id)
    this.handleChange = this.handleChange.bind(this)
  }

  // handleSubmit (event) {
  //   console.log('handle submit was called ')
  //   // this.projectStore.projectList.push(new Project(this.projectStore, this.state.inputName, this.state.inputDescription))
  //   // this.projectStore.createProject(this.state.inputName, this.state.inputDescription)
  //   // this.setState({projectAdded: true})
  //   event.preventDefault()
  // }
  handleChange (event) {
    console.log('handle change was called with: ' + event.target.name + ',' + event.target.value)
    // this.setState({value: event.target.value})
    switch (event.target.name) {
      case 'project': this.setState({'project': event.target.value,
        'task': this.projectList[this.projectList.findIndex(p => p.id === event.target.value)].taskList[0].id})
        break
      case 'task': this.setState({'task': event.target.value})
        break
      default: /* do nothing */
    }
  }
  render () {
    let firstButton
    let secondButton
    if (!this.timerStore.isRunning) {
      firstButton = (
        <button onClick={() => this.timerStore.startTimer()}>
          start
        </button>
      )

      secondButton = (
        <button onClick={() => this.timerStore.resetTimer()}>
          reset
        </button>
      )

      if (!this.timerStore.hasStarted) {
        secondButton = null
      }
    } else {
      firstButton = (
        <button onClick={() => this.timerStore.stopTimer()}>
          stop
        </button>
      )
      secondButton = null
    }
    return (
      <div className={styles.timer}>
        <p>Some blue timer text.</p>
        <form>
          <label>
            Project:
            <select name='project' value={this.state.project} onChange={this.handleChange}>
              {this.projectList.map(project => (
                <option key={project.id} value={project.id}>{project.name}</option>
              ))}
            </select>
          </label>
          <br />
          <label>
            task:
            <select name='task' value={this.state.task} onChange={this.handleChange}>
              {this.projectList[this.projectList.findIndex(p => p.id === this.state.project)].taskList.map(task => (
                <option key={task.id} value={task.id}>{task.name}</option>
              ))}
            </select>
          </label>
        </form>
        <p>{this.timerStore.mainDisplay}<br /><small>hr : min : sec</small></p>
        {firstButton}
        {secondButton}
        <p>---</p>
        <button onClick={() => alert('log these hours: ' + this.timerStore.mainDisplay + ' for project: ' +
          this.projectList[this.projectList.findIndex(p => p.id === this.state.project)].name +
          ' and task ' +
          this.projectList[this.projectList.findIndex(p => p.id === this.state.project)].taskList[
            this.projectList[this.projectList.findIndex(p => p.id === this.state.project)].taskList.findIndex(
              t => t.id === this.state.task)
            ].name)}>
          Log Hours
        </button>
      </div>
    )
  }
}
