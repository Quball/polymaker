import axios from "axios";

const Data = {
  getFeatures: () => {
    return axios.get("http://localhost:3000/api/polygons").then(res => {
      return res.data;
    });
  },
  getFeatureById: id => {
    return axios.get(`http://localhost:3000/api/polygons/${id}`).then(res => {
      return res.data;
    });
  },
  postFeature: feature => {
    return axios.post(`http://localhost:3000/api/polygons`, feature).then(res => {
      return res
    });
  },
  deleteFeature: id => {
    return axios.delete(`http://localhost:3000/api/polygons/${id}`).then(res => {
      return res
    });
  }
};

export default Data;
