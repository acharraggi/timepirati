/*
    ./client/components/App.jsx
*/
import React from 'react';
import styles from './app.css';

export default class App extends React.Component {
  render() {
    return (
        <div className={styles.app}>
       <p>Hello world!  Some green text.</p>
      </div>
    );
  }
}
