import { React, useState, useEffect } from 'react'
import { Container, Row, Col, Input, Form, FormGroup, FormFeedback, Label } from 'reactstrap'
import Footer from './Footer'
import Header from './Header'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import FileUploadIcon from '@mui/icons-material/FileUpload'
import DescriptionIcon from '@mui/icons-material/Description'
import { writeUserCredentials } from '../IssuerServer'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { useMediaPredicate } from 'react-media-hook'

function HomePage(props) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [open, setOpen] = useState('')
  const [isDemoTester, setIsDemoTester] = useState(true)
  const [universityName, setUniversityName] = useState('DemoTester University')
  const [className, setClassName] = useState('DemoTester')

  const MobileScreen = useMediaPredicate('(max-width: 450px)')
  const OtherScreenMin = useMediaPredicate('(min-width: 451px)')
  const LargeScreenMax = useMediaPredicate('(max-width: 1399px)')
  const LargeScreenMin = useMediaPredicate('(min-width: 1400px)')

  const transform = () => {
    setIsDemoTester(!isDemoTester)
  }

  useEffect(() => {
    if (isDemoTester) {
      setUniversityName('DemoTester University')
      setClassName('DemoTester')
    } else {
      setUniversityName('Lehigh University')
      setClassName('Lehigh')
    }
    console.log(universityName)
  }, [isDemoTester])

  const handleInputChange = event => {
    let value = event.target.value
    let id = event.target.id

    switch (id) {
      case 'username':
        setUsername(value)
        break
      case 'password':
        setPassword(value)
        break
      default:
        console.log('Switch')
    }
  }

  const handleClose = () => {
    setOpen(false)
    let permission = localStorage.getItem('permission')
    console.log(permission)
    if (permission == 0) {
      window.location.href = '/client'
    } else if (permission == 1) {
      window.location.href = '/admin'
    }
  }

  const handleLoginRequest = () => {
    writeUserCredentials(username, password)
      .then(result => {
        console.log(result)
        localStorage.clear()
        console.log(result.data)
        console.log(username)
        localStorage.setItem('username', username.toString())
        localStorage.setItem('authToken', result.data.token.toString())
        localStorage.setItem('permission', result.data.admin.toString())
        setOpen(true)
      })
      .catch(err => {
        console.log(err)
        if (err.response.status == 401) {
          alert('Incorrect username/password.')
        } else {
          alert(err.response.data)
        }
      })
  }

  return (
    <div style={{ height: '100vh' }} className={universityName}>
      <Header name={universityName} />
      {/* <img style={{width:"100%", height:400}}src="assets/lehigh2.jpeg"></img> */}

      {isDemoTester && (
        <div>
          {LargeScreenMax && (
            <Container style={{ marginTop: 50 }}>
              <Row>
                <Col xs='12' sm='12' md='12' lg='12' xl='12'>
                  <div style={{ display: 'inline-block', width: '70%', textAlign: 'left', height: 'fit-content' }} className='loginBox'>
                    <div style={{ width: '100%' }} className='px-5 py-3'>
                      <h1 style={{ marginBottom: 25, textAlign: 'center', fontSize: 45 }}>Get Your Diploma Today!</h1>
                      <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: 20, borderBottom: '2px solid black' }}>
                        <FileUploadIcon style={{ width: 85, height: 85, marginLeft: 15 }}> </FileUploadIcon>
                        <DescriptionIcon style={{ width: 85, height: 85 }}></DescriptionIcon>
                        <FileDownloadIcon style={{ width: 85, height: 85, marginRight: 15 }}></FileDownloadIcon>
                      </div>

                      <div style={{ marginTop: 50 }}>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                          <TextField
                            style={{ width: '100%' }}
                            onChange={handleInputChange}
                            id='username'
                            label='Username'
                            variant='filled'
                            name='username'
                          />
                        </div>
                      </div>
                      <div style={{ paddingTop: 25 }}>
                        <TextField
                          style={{ width: '100%' }}
                          onChange={handleInputChange}
                          id='password'
                          label='Password'
                          type='password'
                          autoComplete='current-password'
                          variant='filled'
                          name='password'
                        />
                      </div>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                          <Button variant='contained' style={{ textDecoration: 'none', width: 200, marginTop: 25 }} onClick={handleLoginRequest}>
                            Log In
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Container>
          )}
          {LargeScreenMin && (
            <Container style={{ marginTop: 50 }}>
              <Row>
                <Col md='8' lg='8' xl='8'>
                  <h1
                    onClick={transform}
                    style={{ marginLeft: -50, textAlign: 'left', color: 'white', fontSize: 60, fontFamily: "'Times New Roman', Times, serif" }}
                  >
                    {' '}
                    DemoTester University
                  </h1>
                  <p style={{ marginLeft: -50, marginRight: 250, color: 'white' }}>
                    The primary purpose of DemoTester University is to provide a learning environment in which faculty, staff and students can
                    discover, examine critically, preserve and transmit the knowledge, wisdom and values that will help ensure the survival of this
                    and future generations and improve the quality of life for all. The university seeks to help students to develop an understanding
                    and appreciation for the complex cultural and physical worlds in which they live and to realize their highest potential of
                    intellectual, physical and human development.
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'left' }}>
                    <img style={{ marginLeft: -75, width: 750, height: 400 }} src='assets/gradStudents.png'></img>
                  </div>
                </Col>
                <Col md='4' lg='4' xl='4'>
                  <div
                    style={{ marginLeft: -50, display: 'inline-block', width: '100%', float: 'left', textAlign: 'left', height: '90%' }}
                    className='loginBox'
                  >
                    <div style={{ width: '100%' }} className='px-5 py-3'>
                      <h1 style={{ marginBottom: 25, textAlign: 'center', fontSize: 45 }}>Get Your Diploma Today!</h1>
                      <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: 20, borderBottom: '2px solid black' }}>
                        <FileUploadIcon style={{ width: 85, height: 85, marginLeft: 15 }}> </FileUploadIcon>
                        <DescriptionIcon style={{ width: 85, height: 85 }}></DescriptionIcon>
                        <FileDownloadIcon style={{ width: 85, height: 85, marginRight: 15 }}></FileDownloadIcon>
                      </div>

                      <div style={{ marginTop: 50 }}>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                          <TextField
                            style={{ width: '100%' }}
                            onChange={handleInputChange}
                            id='username'
                            label='Username'
                            variant='filled'
                            name='username'
                          />
                        </div>
                      </div>
                      <div style={{ paddingTop: 25 }}>
                        <TextField
                          style={{ width: '100%' }}
                          onChange={handleInputChange}
                          id='password'
                          label='Password'
                          type='password'
                          autoComplete='current-password'
                          variant='filled'
                          name='password'
                        />
                      </div>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                          <Button variant='contained' style={{ textDecoration: 'none', width: 200, marginTop: 25 }} onClick={handleLoginRequest}>
                            Log In
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Container>
          )}
        </div>
      )}

      {!isDemoTester && (
        <div>
          {LargeScreenMax && (
            <Container style={{ marginTop: 50 }}>
              <Row>
                <Col xs='12' sm='12' md='12' lg='12' xl='12'>
                  <div style={{ display: 'inline-block', width: '70%', textAlign: 'left', height: 'fit-content' }} className='loginBox'>
                    <div style={{ width: '100%' }} className='px-5 py-3'>
                      <h1 style={{ marginBottom: 25, textAlign: 'center', fontSize: 45 }}>Get Your Diploma Today!</h1>
                      <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: 20, borderBottom: '2px solid black' }}>
                        <FileUploadIcon style={{ width: 85, height: 85, marginLeft: 15 }}> </FileUploadIcon>
                        <DescriptionIcon style={{ width: 85, height: 85 }}></DescriptionIcon>
                        <FileDownloadIcon style={{ width: 85, height: 85, marginRight: 15 }}></FileDownloadIcon>
                      </div>

                      <div style={{ marginTop: 50 }}>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                          <TextField
                            style={{ width: '100%' }}
                            onChange={handleInputChange}
                            id='username'
                            label='Username'
                            variant='filled'
                            name='username'
                          />
                        </div>
                      </div>
                      <div style={{ paddingTop: 25 }}>
                        <TextField
                          style={{ width: '100%' }}
                          onChange={handleInputChange}
                          id='password'
                          label='Password'
                          type='password'
                          autoComplete='current-password'
                          variant='filled'
                          name='password'
                        />
                      </div>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                          <Button variant='contained' style={{ textDecoration: 'none', width: 200, marginTop: 25 }} onClick={handleLoginRequest}>
                            Log In
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Container>
          )}
          {LargeScreenMin && (
            <Container style={{ marginTop: 50 }}>
              <Row>
                <Col md='8' lg='8' xl='8'>
                  <h1
                    onClick={transform}
                    style={{ marginLeft: -50, textAlign: 'left', color: 'white', fontSize: 60, fontFamily: "'Times New Roman', Times, serif" }}
                  >
                    {' '}
                    Lehigh University
                  </h1>
                  <p style={{ marginLeft: -50, marginRight: 250, color: 'white' }}>
                    The primary purpose of Lehigh University is to provide a learning environment in which faculty, staff and students can discover,
                    examine critically, preserve and transmit the knowledge, wisdom and values that will help ensure the survival of this and future
                    generations and improve the quality of life for all. The university seeks to help students to develop an understanding and
                    appreciation for the complex cultural and physical worlds in which they live and to realize their highest potential of
                    intellectual, physical and human development.
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'left' }}>
                    <img style={{ marginLeft: -75, width: 750, height: 400 }} src='assets/gradStudents.png'></img>
                  </div>
                </Col>
                <Col md='4' lg='4' xl='4'>
                  <div
                    style={{ marginLeft: -50, display: 'inline-block', width: '100%', float: 'left', textAlign: 'left', height: '90%' }}
                    className='loginBox'
                  >
                    <div style={{ width: '100%' }} className='px-5 py-3'>
                      <h1 style={{ marginBottom: 25, textAlign: 'center', fontSize: 45 }}>Get Your Diploma Today!</h1>
                      <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: 20, borderBottom: '2px solid black' }}>
                        <FileUploadIcon style={{ width: 85, height: 85, marginLeft: 15 }}> </FileUploadIcon>
                        <DescriptionIcon style={{ width: 85, height: 85 }}></DescriptionIcon>
                        <FileDownloadIcon style={{ width: 85, height: 85, marginRight: 15 }}></FileDownloadIcon>
                      </div>

                      <div style={{ marginTop: 50 }}>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                          <TextField
                            style={{ width: '100%' }}
                            onChange={handleInputChange}
                            id='username'
                            label='Username'
                            variant='filled'
                            name='username'
                          />
                        </div>
                      </div>
                      <div style={{ paddingTop: 25 }}>
                        <TextField
                          style={{ width: '100%' }}
                          onChange={handleInputChange}
                          id='password'
                          label='Password'
                          type='password'
                          autoComplete='current-password'
                          variant='filled'
                          name='password'
                        />
                      </div>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                          <Button variant='contained' style={{ textDecoration: 'none', width: 200, marginTop: 25 }} onClick={handleLoginRequest}>
                            Log In
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Container>
          )}
        </div>
      )}

      <Dialog open={open} onClose={handleClose} aria-labelledby='alert-dialog-title' aria-describedby='alert-dialog-description'>
        <DialogTitle id='alert-dialog-title'>Login Successful</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>Please click OK to continue.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>OK</Button>
        </DialogActions>
      </Dialog>
      {/* <Footer/> */}
    </div>
  )
}

export default HomePage
