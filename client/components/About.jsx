import React from 'react'
import {observer} from 'mobx-react'

@observer export default class About extends React.Component {
  constructor (props) {
    super(props)
    this.counterStore = props.rootStore.counterStore
  }

  render () {
    return (
      <div>
        <h2>About</h2>
        <p>this is the about page.</p>
        <hr />
        <h2>Counter test</h2>
        <button onClick={() => this.counterStore.increment()} >
          increment
        </button>
        <p>count: {this.counterStore.mainDisplay}</p>
      </div>
    )
  }
}
