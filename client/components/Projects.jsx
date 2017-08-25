import React from 'react'
import {NavLink} from 'react-router-dom'
import {observer} from 'mobx-react'
import styles from './projects.css'

@observer export default class Projects extends React.Component {
  constructor (props) {
    super(props)
    this.projectStore = props.rootStore.projectStore
  }

  render () {
    return (
      <div>
        <h2>Projects</h2>
        <p>This is the projects page.</p>
        <h2>Project List</h2>
        <NavLink to='/newProject'>+ New Project</NavLink>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Delete?</th>
            </tr>
          </thead>
          <tbody>
            {this.projectStore.projectList.map(project => (
              <tr key={project.id}>
                <td><NavLink to={`/editProject/${project.id}`}>{project.name}</NavLink></td>
                <td>{project.description}</td>
                <td><button onClick={() => project.delete()}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
}
