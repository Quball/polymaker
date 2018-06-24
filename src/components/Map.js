import React from "react";
import L from "leaflet";
import Data from "../services/Data";
import styles from "./Map.css";

class Map extends React.Component {
  constructor() {
    super();
    this.state = {
      map: false,
      selectedLayers: [],
      canCreateUnion: false,
      geoLayer: null,
      features: []
    };
  }

  componentWillMount() {
    this.initFromDB();
  }
  initFromDB() {
    Data.getFeatures().then(polygons => {
      console.log(polygons);
      this.setState({
        selectedLayers: [],
        canCreateUnion: false,
        geoLayer: null,
        features: polygons
      });
      this.draw(polygons);
    });
  }
  selectedLayers(e) {
    let tmpArray = this.state.selectedLayers;
    let index = tmpArray.indexOf(e.layer.feature);
    if (index < 0) {
      tmpArray.push(e.layer.feature);
      e.layer.setStyle({ color: "red" });
    } else {
      tmpArray.splice(index, 1);
      e.layer.setStyle({ color: "black" });
    }
    this.setState({ selectedLayers: tmpArray }, () => {
      if (Object.keys(this.state.selectedLayers).length >= 2) {
        this.setState({
          canCreateUnion: true
        });
      } else {
        this.setState({
          canCreateUnion: false
        });
      }
    });
  }
  centerMap() {
    this.mapState().fitBounds(this.state.geoLayer.getBounds());
  }
  createUnion() {
    let coordinates = [];
    for (let a = 0, b = this.state.selectedLayers.length; a < b; a++) {
      this.state.selectedLayers[a].geometry.coordinates.map(geoData => {
        coordinates.push(geoData);
      });
    }
    let union = {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: coordinates
      },
      properties: {}
    };
    this.state.geoLayer.clearLayers().addData(union);
    Data.postFeature(union).then(res => {
      if (res.status === 200) {
        this.initFromDB();
      }
    });
  }
  checkIntersection() {
    this.state.selectedLayers.map(feature => {
      console.log(feature);
    });
  }
  mapState() {
    let map;
    if (!this.state.map) {
      map = L.map(document.getElementById("mapid"), {
        zoomControl: false
      }).setView([51.505, -0.09], 13);
      this.setState({
        map: map
      });
      return map;
    }
    return this.state.map;
  }
  draw(polygons) {
    let map = this.mapState();
    this.setState({
      geoLayer: L.geoJson(polygons, {
        style: () => {
          return { color: "#000" };
        },
        onEachFeature: (feature, layer) => {
          layer._leaflet_id = feature.id;
        }
      })
        .on("click", e => {
          this.selectedLayers(e);
        })
        .addTo(map)
    });
  }
  toggleLayerFromMenu(e) {
    console.log(this.state.geoLayer.getLayer(e.target.dataset.id));
    if (
      !this.state.geoLayer.getLayer(e.target.dataset.id).options.interactive
    ) {
      this.state.geoLayer
        .getLayer(e.target.dataset.id)
        .setStyle({ color: "#000", interactive: true });
    } else {
      this.state.geoLayer
        .getLayer(e.target.dataset.id)
        .setStyle({ color: "transparent", interactive: false });
    }
  }
  deleteLayer(e) {
    Data.deleteFeature(e.target.dataset.id).then(res => {
      if (res.status === 200) {
        this.initFromDB();
      }
    });
  }
  render() {
    let ids = this.state.features.map((i, k) => {
      let deleteButton;
      if (k >= 3) {
        deleteButton = (
          <span
            data-id={i.id}
            onClick={e => {
              this.deleteLayer(e);
            }}
          >
            X
          </span>
        );
      }
      if (i.hasOwnProperty("id")) {
        return (
          <li
            onClick={e => {
              this.toggleLayerFromMenu(e);
            }}
            data-id={i.id}
            key={k}
          >
            {deleteButton}
            {i.id}
          </li>
        );
      }
    });
    return (
      <div className={styles.app}>
        <header className={styles.header}>
          <div className={styles.logo}>
            <h1>Polymaker</h1>
          </div>
          <ul className={styles.menu}>
            <li>
              <button
                onClick={() => {
                  this.centerMap();
                }}
              >
                Center map
              </button>
            </li>
            <li>
              <button
                disabled={!this.state.canCreateUnion}
                onClick={() => {
                  this.createUnion();
                }}
              >
                Create union
              </button>
            </li>
            <li>
              <button
                disabled={!this.state.canCreateUnion}
                onClick={() => {
                  this.checkIntersection();
                }}
              >
                Intersect polygons
              </button>
            </li>
          </ul>
          <h3>Toggle features</h3>
          <ul className={styles.menu + " " + styles.ids}>{ids}</ul>
        </header>
        <div id="mapid" className={styles.map} />
      </div>
    );
  }
}

export default Map;
