import React from "react";
import styles from "./App.css";
import DrawPolygons from "./DrawPolygons";
import Data from "../services/Data";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      selectedLayers: []
    };
  }
  setSelectedLayers(list) {
    this.setState({
      selectedLayers: list
    });
  }
  createUnion() {
    if (this.state.selectedLayers.length >= 2) {
      for (let a = 0, b = this.state.selectedLayers.length; a < b; a++) {
        Data.getFeatureById(this.state.selectedLayers[a]).then(res => {
          console.log("Layer ", a, res)
        })
      }
    } else {
      console.log("Select two or more polygons to create a union")
    }
  }
  render() {
    let selectedLayers = this.state.selectedLayers.map((i, k) => {
      return <li key={k}>{i}</li>;
    });
    return (
      <div className={styles.app}>
        <header className={styles.header}>
          <div className={styles.logo}>
            <h1>Polymaker</h1>
          </div>
          <h4>Selected layers:</h4>
          <ul className={styles.selected}>{selectedLayers}</ul>
          <ul className={styles.menu}>
            <li>
              <button
                onClick={() => {
                  this.createUnion();
                }}
              >
                Create union
              </button>
            </li>
            <li>
              <button>Intersect polygons</button>
            </li>
          </ul>
        </header>
        <DrawPolygons
          toggleSelectedLayers={list => this.setSelectedLayers(list)}
        />
      </div>
    );
  }
}

export default App;
