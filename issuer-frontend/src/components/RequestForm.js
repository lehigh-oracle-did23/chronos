import { React, useState, useEffect } from 'react'
import { Container, Row, Col, Input, Form, FormGroup, FormFeedback, Label } from 'reactstrap'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { requestNewVC } from '../IssuerServer'
import { autoFill, whitelist } from '../secrets'
import ArticleIcon from '@mui/icons-material/Article'
import { IconButton } from '@mui/material'

function RequestForm(props) {
  const [isBoss, setIsBoss] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [ssn, setSSN] = useState('')
  const [major, setMajor] = useState('')
  const [minor, setMinor] = useState('')
  const [did, setDID] = useState('')
  const [dob, setDob] = useState(null)
  const [year, setYear] = useState(null)
  const [citizenship, setCitizenship] = useState('')
  const [gpa, setGPA] = useState('')

  useEffect(() => {
    console.log(localStorage.getItem('authToken'))
    let user = localStorage.getItem('username')
    if (whitelist.includes(user)) {
      setIsBoss(true)
    }
  }, [])
  const requestVC = () => {
    requestNewVC(firstName, lastName, ssn, major, minor, did, dob, year, citizenship, gpa).then(result => {
      console.log(result)
      console.log(result.data)
      reset()
    })
  }

  const handleFill = () => {
    let result = autoFill(localStorage.getItem('username'))
    setFirstName(result.firstName)
    setLastName(result.lastName)
    setSSN(result.SSN)
    setMajor(result.major)
    setMinor(result.minor)
    setDID(result.DID)
    setDob(result.dob)
    setYear(result.year)
    setCitizenship(result.citizenship)
    setGPA(result.gpa)
  }

  const reset = () => {
    setFirstName('')
    setLastName('')
    setSSN('')
    setMajor('')
    setMinor('')
    setDID('')
    setDob(null)
    setYear(null)
    setCitizenship('')
    setGPA('')
  }

  const handleInputChange = event => {
    let value = event.target.value
    let id = event.target.id

    switch (id) {
      case 'firstName':
        setFirstName(value)
        break
      case 'lastName':
        setLastName(value)
        break
      case 'ssn':
        setSSN(value)
        break
      case 'major':
        setMajor(value)
        break
      case 'minor':
        setMinor(value)
        break
      case 'did':
        setDID(value)
        break
      case 'citizenship':
        setCitizenship(value)
        break
      case 'gpa':
        setGPA(value)
        break
      default:
        console.log('switch')
    }
  }
  return (
    <div>
      <Container style={{ backgroundColor: 'white', width: '85%' }}>
        <div style={{ display: 'flex', justifyContent: 'left' }}>
          <h1>Request Form</h1>
          {isBoss && (
            <div>
              <IconButton onClick={handleFill}>
                <ArticleIcon color='primary'></ArticleIcon>
              </IconButton>
            </div>
          )}
        </div>
        <p style={{ textAlign: 'left' }}>The following information is required for you to receive your digital diploma</p>
        <Row>
          <Col xs='12' sm='12' md='6' lg='6' xl='6' style={{ marginTop: 15 }}>
            <TextField value={firstName} onChange={handleInputChange} id='firstName' name='firstName' label='First Name' variant='filled' fullWidth />
          </Col>
          <Col xs='12' sm='12' md='6' lg='6' xl='6' style={{ marginTop: 15 }}>
            <TextField value={lastName} onChange={handleInputChange} id='lastName' name='lastName' label='Last Name' variant='filled' fullWidth />
          </Col>
        </Row>
        <Row>
          <Col xs='12' sm='12' md='6' lg='6' xl='6' style={{ marginTop: 15 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label='Date of Birth'
                value={dob}
                onChange={newValue => {
                  setDob(newValue)
                }}
                fullWidth
                valid
                renderInput={params => <TextField {...params} id='dob' name='dob' error={false} variant='filled' fullWidth />}
              />
            </LocalizationProvider>
          </Col>
          <Col xs='12' sm='12' md='6' lg='6' xl='6' style={{ marginTop: 15 }}>
            <TextField value={ssn} onChange={handleInputChange} id='ssn' name='ssn' label='SSN (Last 4)' variant='filled' fullWidth />
          </Col>
        </Row>
        <Row>
          <Col xs='12' sm='12' md='6' lg='6' xl='6' style={{ marginTop: 15 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                views={['year']}
                label='Graduation Year'
                value={year}
                onChange={newValue => {
                  setYear(newValue)
                }}
                renderInput={params => (
                  <TextField {...params} id='year' name='year' label='Graduation Year' error={false} variant='filled' fullWidth />
                )}
              />
            </LocalizationProvider>
          </Col>
          <Col xs='12' sm='12' md='6' lg='6' xl='6' style={{ marginTop: 15 }}>
            <TextField value={gpa} onChange={handleInputChange} id='gpa' name='gpa' label='GPA' variant='filled' fullWidth />
          </Col>
        </Row>
        <Row>
          <Col xs='12' sm='12' md='12' lg='12' xl='12' style={{ marginTop: 15 }}>
            <TextField
              value={citizenship}
              onChange={handleInputChange}
              id='citizenship'
              name='citizenship'
              label='Citizenship Status'
              variant='filled'
              fullWidth
            />
          </Col>
        </Row>
        <Row>
          <Col xs='12' sm='12' md='12' lg='12' xl='12' style={{ marginTop: 15 }}>
            <TextField value={major} onChange={handleInputChange} id='major' name='major' label='Major' variant='filled' fullWidth />
          </Col>
        </Row>
        <Row>
          <Col xs='12' sm='12' md='12' lg='12' xl='12' style={{ marginTop: 15 }}>
            <TextField value={minor} onChange={handleInputChange} id='minor' name='minor' label='Minor' variant='filled' fullWidth />
          </Col>
        </Row>

        <Row>
          <Col xs='12' sm='12' md='12' lg='12' xl='12' style={{ marginTop: 15 }}>
            <TextField value={did} onChange={handleInputChange} id='did' name='did' label='DID ID' variant='filled' fullWidth />
          </Col>
        </Row>
        <Row>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button variant='contained' style={{ textDecoration: 'none', width: 200, marginTop: 25 }} onClick={requestVC}>
              {' '}
              Submit{' '}
            </Button>
          </div>
        </Row>
      </Container>
    </div>
  )
}

export default RequestForm
