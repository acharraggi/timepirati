/*
    ./client/components/App.jsx
*/
import React from 'react';
import styles from './app.css';
import Home from './Home.jsx';
import Timer from './Timer.jsx';
import About from './About.jsx';
import {
  NavLink,
  Route
} from 'react-router-dom';

export default class App extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
        <div>
          <h1>TimePirati</h1>
          <ul className={styles.ul_header}>
            <li className={styles.ul_li}><NavLink to="/" exact activeClassName={styles.selected}>Home</NavLink></li>
            <li className={styles.ul_li}><NavLink to="/timer" exact activeClassName={styles.selected}>Timer</NavLink></li>
            <li className={styles.ul_li}><NavLink to="/about" exact activeClassName={styles.selected}>About</NavLink></li>
          </ul>
          <div className={styles.content}>
            <Route exact path="/" component={Home}/>
            <Route path="/timer" render={routeProps => <Timer {...routeProps} timerStore={this.props.timerStore}/>}/>
            <Route path="/about" component={About}/>
          </div>
        </div>
    );
  }
}
