import React from "react";
import L from "leaflet";
import Data from "../services/Data";
import styles from "./DrawPolygons.css";

class DrawPolygons extends React.Component {
  constructor() {
    super();
    this.state = {
      selectedLayers: [],
      features: []
    };
  }

  componentWillMount() {
    Data.getFeatures().then(polygons => {
      this.setState(
        {
          features: polygons
        },
        () => {
          this.draw(this.state.features);
        }
      );
    });
  }
  draw(polygons) {
    let selectedLayers = [];
    let map = L.map(document.getElementById("mapid")).setView(
      [51.505, -0.09],
      13
    );
    L.geoJson(polygons, {
      style: () => {
          return { color: "#000" };
      }
    })
      .bindPopup(layer => {
        return layer.feature.id;
      })
      .on("click", e => {
        console.log(e)
        // TODO: Dont handle feature from DB, use layer already created by L to figure out union etc
        if (this.state.selectedLayers.includes(e.layer.feature.id)) {
          e.layer.setStyle({ color: "#000" });
          let index = selectedLayers.indexOf(e.layer.feature.id);
          selectedLayers.splice(index, 1);
        } else {
          e.layer.setStyle({ color: "#f2f2f2" });
          selectedLayers.push(e.layer.feature.id);
        }
        this.setState({ selectedLayers: selectedLayers }, () => {
          this.props.toggleSelectedLayers(this.state.selectedLayers)
        });
      })
      .addTo(map);
  }
  render() {
    return <div id="mapid" className={styles.map} />;
  }
}

export default DrawPolygons;
