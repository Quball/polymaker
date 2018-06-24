import React from "react";
import styles from "./App.css";
import Map from "./Map";

class App extends React.Component {
  constructor() {
    super();
    this.state = {};
  }
  render() {
    return (
      <Map />
    );
  }
}

export default App;
