/*
    ./client/components/App.jsx
*/
import React from 'react';
import styles from './app.css';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = { count: 0 };
  }

  increment() {
    this.setState({
      count: this.state.count + 1
    });
  }
  render() {
    return (
        <div className={styles.app}>
          <p>Hello world!  Some green text.</p>
          <button onClick={() => this.increment()}>Increment</button>
          <p>Count = { this.state.count }.</p>
        </div>
    );
  }
}
