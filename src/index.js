import axios from "axios";
import L from "leaflet";

const app = () => {
  axios.get("http://localhost:3000/api/polygons").then(res => {
    console.log(res.data);
    createPolygons(res.data);
  });
};

const createPolygons = polygons => {
  let map = L.map("mapid").setView([51.505, -0.09], 13);
  L.geoJson(polygons, {
    style: (feature, key) => {
      return {color: feature.properties.color || "#000"}
    }
  })
  .bindPopup(layer => {
    return layer.feature.id
  })
  .addTo(map);
};

app();
