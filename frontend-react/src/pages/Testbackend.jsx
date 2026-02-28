import axios from "axios";
import { useEffect } from "react";

function TestBackend() {
  useEffect(() => {
    axios
      .get("http://localhost:5000/")
      .then(res => {
        console.log("Backend says:", res.data);
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  return <h2>Check console for backend response</h2>;
}

export default TestBackend;
