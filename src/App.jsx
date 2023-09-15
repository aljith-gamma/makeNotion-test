import { useState } from 'react'
import './App.css'
import axios from 'axios';

let templates = [
  "1_hjärtat",
  "2_kronan",
  "3_apotea",
  "4_lyko",
  "5_meds",
  "6_bangerhead"
]

function App() {
  const [file, setFile] = useState(null);
  const [data, setData] = useState({
    inputFormat: '',
    outputFormat: ''
  })
  const [load, setLoad] = useState(false);

  const handleDataChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value
    })
  }

  const handleFileChange =  (e) => {
    setFile(e.target.files[0]);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('inputFormat', data.inputFormat);
    formData.append('outputFormat', data.outputFormat);
    formData.append('sheet', file);

    setLoad(true);
    try {
        const response = await axios.post("http://51.159.206.19/api/v1/products/upload-bulk-products", formData, {
          headers: {
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjkyNjAzMDEyLCJleHAiOjE2OTMyMDc4MTJ9.JbuZBB3Uo9paWqmxOhHTEdnnqtX4Vsa0xYLTQ12FZ1k'
          },
          responseType: 'arraybuffer'
        });

        const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

        const blobUrl = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = blobUrl;
        const out = data.outputFormat;
        const ext = data.outputFormat === "template6" ? '.xlsm' : '.xlsx'; 
        a.download = templates[out[(Number(out.length-1))] - 1] + ext;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        URL.revokeObjectURL(blobUrl);
        console.log(response);
        alert(templates[out[(Number(out.length-1))] - 1] + ' Successfully downloaded');
    } catch (error) {
        alert('Something went wrong!');
    }finally{
      setLoad(false);
    }
  }

  return (
    <div id="container">
      <div>
        <form onSubmit={ handleSubmit }>
          <div>
            <label>Select File</label>
            <input type='file' onChange={ handleFileChange } required/>
          </div>

          <div>
            <label>Input format</label>
            <select onChange={ handleDataChange } name="inputFormat" required>
              <option value="">Choose input format...</option>
              <option value="template1">template1</option>
            </select>
          </div>

          <div>
            <label>Output format</label>
            <select onChange={ handleDataChange } name="outputFormat" required>
              <option value="">Choose output format...</option>
              <option value="template1">1_hjärtat</option>
              <option value="template2">2_kronan</option>
              <option value="template3">3_apotea</option>
              <option value="template4">4_lyko</option>
              <option value="template5">5_meds</option>
              <option value="template6">6_bangerhead</option>
            </select>
          </div>

          <button disabled={load}>Submit</button>
        </form>
      </div>
      <h2 style={{ visibility: load ? "visible" : 'hidden' }}>Loading...</h2>
    </div>
  )
}

export default App
