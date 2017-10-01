import React from 'react'
import styles from './Timer.css'
import {observer} from 'mobx-react'
import AWS from 'aws-sdk'
import appConfig from './awsconfig'
AWS.config.region = appConfig.region

@observer export default class Timer extends React.Component {
  constructor (props) {
    super(props)
    this.timerStore = props.rootStore.timerStore
    this.projectList = props.rootStore.projectStore.projectList
    this.userStore = props.rootStore.userStore
    this.handleChange = this.handleChange.bind(this)
    this.logTime = this.logTime.bind(this)

    // set timer projectID and taskID if currently empty
    if (this.timerStore.timer.getProjectID === '' && this.projectList.length > 0) {
      this.timerStore.timer.setProjectID(this.projectList[0].id)
      if (this.projectList[0].taskList.length === 0) {
        this.timerStore.timer.setTaskID('')
      } else {
        this.timerStore.timer.setTaskID(this.projectList[0].taskList[0].id)
      }
    } else { // set taskID if empty and the project's tasklist is not empty
      const proj = this.projectList.find(p => p.id === this.timerStore.timer.getProjectID)
      if (proj.taskList.length === 0) {
        this.timerStore.timer.setTaskID('')
      } else {
        this.timerStore.timer.setTaskID(proj.taskList[0].id) // just take first task
      }
    }
  }

  handleChange (event) {
    console.log('handle change was called with: ' + event.target.name + ',' + event.target.value)
    switch (event.target.name) {
      case 'project': this.timerStore.timer.setProjectID(event.target.value)
        if (event.target.value !== '') {   // we have a new project ID, so change task
          const proj = this.projectList[this.projectList.findIndex(p => p.id === event.target.value)]
          if (proj.taskList.length === 0) {
            this.timerStore.timer.setTaskID('')
          } else {
            this.timerStore.timer.setTaskID(proj.taskList[0].id) // just take first task
          }
        }
        break
      case 'task': this.timerStore.timer.setTaskID(event.target.value)
        break
      case 'note': this.timerStore.timer.setNote(event.target.value)
        break
      default: /* do nothing */
    }
  }
  logTime (t, u) {
    console.log('log these hours: ' + t.display + ' for project: ' + t.getProjectID + ' and task ' +
      t.getTaskID + ' note: ' + t.getNote + ' user: ' + u)
    const params = {
      TableName: 'TimePiratiTimeLog',
      // 'Item' contains the attributes of the item to be created
      // - 'timelogid': a unique uuid
      // - 'userid': my userid
      // - 'projectID': project
      // - 'taskID': task
      // - 'note': time log note
      // - 'createdAt': current Unix timestamp
      // note: these fields must be non-empty.
      Item: {
        timelogid: t.id,
        userid: u,
        projectID: t.getProjectID,
        taskID: t.getTaskID,
        time: t.display,
        note: t.getNote,
        createdAt: new Date().getTime()
      }
    }
    if (this.userStore.isAuthenticated) {
      AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: appConfig.IdentityPoolId,
        Logins: {
          'cognito-idp.us-east-1.amazonaws.com/us-east-1_cYDmjMIFp': this.userStore.getIdToken
        }
      })
    }
    const dynamoDb = new AWS.DynamoDB.DocumentClient()
    dynamoDb.put(params, (error, data) => {
      if (error) {
        console.log(error)
      } else {
        console.log('time log inserted')
      }
    })
  }
  render () {
    let firstButton
    let secondButton
    let listOfTasks
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
    if (this.projectList.length === 0 || this.timerStore.timer.getProjectID === '') {
      listOfTasks = (<option key='No tasks defined' value=''>No tasks defined</option>)
    } else {
      // console.log('timer render getProjectID ' + this.timerStore.timer.getProjectID)
      // console.log('project list length: ' + this.projectList.length)
      // console.log('first project id: ' + this.projectList[0].id)
      const proj = this.projectList.find(p => p.id === this.timerStore.timer.getProjectID)
      if (proj.taskList.length === 0) {
        listOfTasks = (<option key='No tasks defined' value=''>No tasks defined</option>)
      } else {
        listOfTasks = (proj.taskList.map(task => (
          <option key={task.id} value={task.id}>{task.name}</option>
        )))
      }
    }
    return (
      <div className={styles.timer}>
        <p>Some blue timer text.</p>
        <form>
          <label>
            Project:
            <select name='project' value={this.timerStore.timer.getProjectID} onChange={this.handleChange}>
              {this.projectList.length === 0 ? <option key='No projects defined' value=''>No projects defined</option>
                : this.projectList.map(project => (
                  <option key={project.id} value={project.id}>{project.name}</option>
              ))}
            </select>
          </label>
          <br />
          <label>
            task:
            <select name='task' value={this.timerStore.timer.getTaskID} onChange={this.handleChange}>
              {listOfTasks}
            </select>
          </label>
          <br />
          <label>
            note:
            <input autoFocus name='note' type='text' value={this.timerStore.timer.getNote} onChange={this.handleChange} />
          </label>
        </form>
        <p>{this.timerStore.mainDisplay}<br /><small>hr : min : sec</small></p>
        {firstButton}
        {secondButton}
        <p>---</p>
        <button onClick={() => this.logTime(this.timerStore.timer, this.userStore.userId)}>
          Log Hours
        </button>
      </div>
    )
  }
}
