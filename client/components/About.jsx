import React from 'react';
//import styles from './Timer.css';
import {observer} from "mobx-react";

export default @observer class About extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
        <div>
          <h2>About</h2>
          <p>this is the about page.</p>
        </div>
    );
  }
}