import { useState } from 'react'
import './App.css'
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [data, setData] = useState({
    inputFormat: '',
    outputFormat: ''
  })

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

    try {
        const response = await axios.post("http://51.15.233.160:3333/api/v1/products/upload-bulk-products", formData, {
          headers: {
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjkyNjAzMDEyLCJleHAiOjE2OTMyMDc4MTJ9.JbuZBB3Uo9paWqmxOhHTEdnnqtX4Vsa0xYLTQ12FZ1k'
          },
          responseType: 'arraybuffer'
        });

        const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

        const blobUrl = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = data.outputFormat + '.xlsx'; 
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        URL.revokeObjectURL(blobUrl);
        console.log(response);
        alert(data.outputFormat + ' Successfully downloaded');
    } catch (error) {
        alert('Something went wrong!');
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
              <option value="template1">template1</option>
              <option value="template2">template2</option>
              <option value="template3">template3</option>
              <option value="template4">template4</option>
              <option value="template5">template5</option>
              <option value="template6">template6</option>
            </select>
          </div>

          <button>Submit</button>
        </form>
      </div>
    </div>
  )
}

export default App
