/*
    ./client/components/App.jsx
*/
import React from 'react';
import styles from './app.css';
import Timer from './Timer.jsx';
//import {observer} from 'mobx-react';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0};
   // this.timerStore = props.timerStore;
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
          <hr/>
          <Timer testText="hello there"
                 timerStore={this.props.timerStore} />
        </div>
    );
  }
}
//<Timer timerStore={this.timerStore} />
//{testText: "hello there", timerStore: {this.props.timerStore}}