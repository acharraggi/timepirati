/*
    ./client/components/App.jsx
*/
import React from 'react'
import styles from './app.css'
import Home from './Home.jsx'
import Projects from './Projects.jsx'
import NewProject from './NewProject.jsx'
import EditProject from './EditProject.jsx'
import Timer from './Timer.jsx'
import About from './About.jsx'
import SignUp from './SignUp.jsx'
import {
  NavLink,
  Route
} from 'react-router-dom'

export default class App extends React.Component {
  // constructor (props) {
  //   super(props)
  // }
  render () {
    return (
      <div>
        <h1>TimePirati</h1>
        <ul className={styles.ul_header}>
          <li className={styles.ul_li}><NavLink to='/' exact activeClassName={styles.selected}>Home</NavLink></li>
          <li className={styles.ul_li}><NavLink to='/projects' exact activeClassName={styles.selected}>Projects</NavLink></li>
          <li className={styles.ul_li}><NavLink to='/timer' exact activeClassName={styles.selected}>Timer</NavLink></li>
          <li className={styles.ul_li}><NavLink to='/about' exact activeClassName={styles.selected}>About</NavLink></li>
          <li className={styles.ul_li}><NavLink to='/signup' exact activeClassName={styles.selected}>Sign Up</NavLink></li>
        </ul>
        <div className={styles.content}>
          <Route exact path='/' component={Home} />
          <Route path='/projects' render={routeProps => <Projects {...routeProps} rootStore={this.props.rootStore} />} />
          <Route path='/newProject' render={routeProps => <NewProject {...routeProps} rootStore={this.props.rootStore} />} />
          <Route path='/editProject/:id' render={routeProps => <EditProject {...routeProps} rootStore={this.props.rootStore} />} />
          <Route path='/timer' render={routeProps => <Timer {...routeProps} rootStore={this.props.rootStore} />} />
          <Route path='/about' render={routeProps => <About {...routeProps} rootStore={this.props.rootStore} />} />
          <Route path='/signup' render={routeProps => <SignUp {...routeProps} rootStore={this.props.rootStore} />} />
        </div>
      </div>
    )
  }
}
