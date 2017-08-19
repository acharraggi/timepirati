import React from 'react';
import {observer} from "mobx-react";
import styles from './projects.css';

export default @observer class Projects extends React.Component {
  constructor(props) {
    super(props);
    this.projectStore = props.rootStore.projectStore;
  }

  deleteProject(p) {
    if (window.confirm("Do you really want to delete "+p.name+"?")) {
      console.log("yes, delete");
      p.delete();
    }
  }

  render() {
    return (
        <div>
          <h2>Projects</h2>
          <p>This is the projects page.</p>
          <h2>Project List</h2>
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
                  <td>{project.name}</td>
                  <td>{project.description}</td>
                  <td><button onClick={() => project.delete()}>Delete</button></td>
                </tr>
                ))}
            </tbody>
          </table>
        </div>
    );
  };
}
//                  {/*<td><button onClick={() => this.delete(project.name)}>Delete</button></td>*/}

