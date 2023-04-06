import { React, useState, useEffect } from 'react'
import { Container, Row, Col, Input, Form, FormGroup, FormFeedback, Label } from 'reactstrap'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { uploadVC } from '../IssuerServer'

function UploadForm(props) {
  const [json1, setJson1] = useState()

  const handleSubmit = () => {
    uploadVC(JSON.parse(json1))
      .then(result => {
        console.log(result)
        setJson1('')
        alert('Successfully uploaded VC')
      })
      .catch(err => {
        alert('Unsuccessfully uploaded VC: ' + err)
      })
  }

  const handleInputChange = event => {
    let value = event.target.value
    let id = event.target.id
    switch (id) {
      case 'json1':
        setJson1(value)
        break
      default:
        console.log('switch')
    }
  }
  return (
    <div>
      <h1>Upload Form</h1>
      <p>Please paste the JSON for your VC into the box below or attach a JSON file with the import button.</p>
      <TextField
        style={{ width: '80%', marginTop: 25, height: '30%' }}
        onChange={handleInputChange}
        id='json1'
        name='json1'
        label='Paste your Verifiable Credential here!'
        variant='outlined'
        multiline
        rows={10}
        value={json1}
      />
      <br></br>

      {/* <p style={{marginTop:25, marginRight:25, display:"inline-block"}}> Or choose a file :</p>
        <input type="file" id="myFile" name="filename" />
        <br></br> */}
      <Button variant='contained' style={{ textDecoration: 'none', width: 200, marginTop: 50 }} onClick={handleSubmit}>
        Submit
      </Button>
    </div>
  )
}

export default UploadForm
