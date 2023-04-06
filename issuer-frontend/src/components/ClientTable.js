import { React, useState, useEffect, forwardRef } from 'react'
import { Container, Row, Col, Input, Form, FormGroup, FormFeedback, Label } from 'reactstrap'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import { DataGrid } from '@mui/x-data-grid'
import Typography from '@mui/material/Typography'
import VerifiedIcon from '@mui/icons-material/Verified'
import ErrorIcon from '@mui/icons-material/Error'
import PendingIcon from '@mui/icons-material/Pending'
import { getFullVC, getRequests, getSpecificVC } from '../IssuerServer'

import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

import Snackbar from '@mui/material/Snackbar'
import MuiAlert from '@mui/material/Alert'

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />
})

function ClientTable(props) {
  const [pageSize, setPageSize] = useState(50)
  const [rows, setRows] = useState([])
  const [currentVC, setCurrentVC] = useState({})
  const [fullVC, setFullVC] = useState('')

  const [open, setOpen] = useState(false)
  const [openVC, setOpenVC] = useState(false)
  const [openSnack, setOpenSnack] = useState(false)
  const [needIssuerDID, setNeedIssuerDID] = useState(false)

  const [maxWidth, setMaxWidth] = useState('md')

  useEffect(() => {
    getRequests().then(result => {
      setRows(result)
    })
  }, [])

  const handleClose = () => {
    setOpen(false)
    setOpenVC(false)
  }

  const handleSnackClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setOpenSnack(false)
  }

  const handleRowClick = async params => {
    if (params.row.type === 'verify') {
      setNeedIssuerDID(true)
    } else {
      setNeedIssuerDID(false)
    }
    let obj = await getSpecificVC(params.row.id)
    setCurrentVC(obj)
    setOpen(true)
  }

  const handleFullVC = async params => {
    let obj = await getFullVC(params.row.id)
    setOpenVC(true)
    setFullVC(JSON.stringify(obj, null, 2))
    console.log(JSON.stringify(obj))
    console.log(obj)
  }

  const copyText = async params => {
    navigator.clipboard.writeText(fullVC).then(result => {
      setOpenSnack(true)
    })
  }

  const columns = [
    { field: 'id', headerName: 'ID', width: 250 },
    {
      field: 'dateRequested',
      headerName: 'Date Requested',
      width: 250
    },
    {
      field: 'dateResolved',
      headerName: 'Date Resolved',
      width: 250,
      renderCell: params => {
        if (params.row.dateResolved !== 'N/A') {
          return <Typography style={{ fontSize: 14 }}>{params.row.dateResolved}</Typography>
        } else {
          return <Typography style={{ fontSize: 14 }}>{params.row.dateResolved}</Typography>
        }
      }
    },
    {
      field: 'type',
      headerName: 'Request Type',
      width: 150
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      renderCell: params => {
        if (params.row.status === 1) {
          return (
            <div>
              <Typography className='approved'>
                {' '}
                <VerifiedIcon />
                {'Approved'}
              </Typography>{' '}
            </div>
          )
        } else if (params.row.status === 0) {
          return (
            <div>
              <Typography className='pending'>
                {' '}
                <PendingIcon />
                {'Pending'}
              </Typography>{' '}
            </div>
          )
        } else if (params.row.status === -1) {
          return (
            <div>
              <Typography className='rejected'>
                {' '}
                <ErrorIcon />
                {'Rejected'}
              </Typography>{' '}
            </div>
          )
        }
      }
    },
    {
      field: 'More Details',
      headerName: 'More Details',
      renderCell: params => {
        return (
          <div>
            <Button
              variant='contained'
              onClick={() => {
                handleRowClick(params)
              }}
            >
              Open
            </Button>
          </div>
        )
      }
    },
    {
      field: 'fullvc',
      headerName: 'View VC',
      renderCell: params => {
        if (params.row.status === 1) {
          return (
            <div>
              <Button
                variant='contained'
                onClick={() => {
                  handleFullVC(params)
                }}
              >
                View
              </Button>
            </div>
          )
        } else {
          return <Typography>N/A</Typography>
        }
      }
    }
  ]

  // const rows = [
  //   { id: 1, dateRequested:"11/10/2022", status: 'Approved', major:"Computer Science"},
  //   { id: 2, dateRequested:"11/01/2022", status: 'Pending' , major:"Physics"},
  //   { id: 3, dateRequested:"11/07/2022", status: 'Approved', major:"Math" },
  //   { id: 4, dateRequested:"11/10/2022", status: 'Approved', major:"Finance"},
  //   { id: 5, dateRequested:"11/06/2022", status: 'Pending', major:"Economics"},
  //   { id: 6, dateRequested:"10/18/2022", status: 'Rejected' , major:"Communication"},
  //   { id: 7, dateRequested:"11/02/2022", status: 'Approved', major:"Art"},
  //   { id: 8, dateRequested:"11/01/2022", status: 'Rejected', major:"Mechanical Engineering"},
  //   { id: 9, dateRequested:"10/29/2022", status: 'Approved', major:"Computer Engineering"},
  // ];

  const handlePageSize = params => {
    let value = params.pageSize
    setPageSize(value)
  }

  return (
    <div>
      <Box sx={{ height: 400, width: '100%', height: '86vh' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={pageSize}
          onPageSizeChange={handlePageSize}
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          experimentalFeatures={{}}
        />
      </Box>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Verifiable Credential</DialogTitle>
        <DialogContent>
          <DialogContentText style={{ marginBottom: 5, width: 500 }}></DialogContentText>
          <div>
            <Container>
              <Row>
                <Col xl='6' lg='6' md='6' sm='6' xs='6'>
                  <Card sx={{ marginBottom: 2 }}>
                    <CardContent>
                      <Typography sx={{ fontSize: 14 }} color='text.secondary' gutterBottom>
                        First Name
                      </Typography>
                      <Typography style={{ fontSize: 20 }}>{currentVC.firstName}</Typography>
                    </CardContent>
                  </Card>
                </Col>

                <Col xl='6' lg='6' md='6' sm='6' xs='6'>
                  <Card sx={{ marginBottom: 2 }}>
                    <CardContent>
                      <Typography sx={{ fontSize: 14 }} color='text.secondary' gutterBottom>
                        Last Name
                      </Typography>
                      <Typography style={{ fontSize: 20 }}>{currentVC.lastName}</Typography>
                    </CardContent>
                  </Card>
                </Col>
              </Row>

              <Row>
                <Col xl='6' lg='6' md='6' sm='6' xs='6'>
                  <Card sx={{ marginBottom: 2 }}>
                    <CardContent>
                      <Typography sx={{ fontSize: 14 }} color='text.secondary' gutterBottom>
                        SSN Last Four
                      </Typography>
                      <Typography style={{ fontSize: 20 }}>{currentVC.ssn}</Typography>
                    </CardContent>
                  </Card>
                </Col>
                <Col xl='6' lg='6' md='6' sm='6' xs='6'>
                  <Card sx={{ marginBottom: 2 }}>
                    <CardContent>
                      <Typography sx={{ fontSize: 14 }} color='text.secondary' gutterBottom>
                        Date of Birth
                      </Typography>
                      <Typography style={{ fontSize: 20 }}>{currentVC.dob}</Typography>
                    </CardContent>
                  </Card>
                </Col>
              </Row>

              <Row>
                <Col xl='6' lg='6' md='6' sm='6' xs='6'>
                  <Card sx={{ marginBottom: 2 }}>
                    <CardContent>
                      <Typography sx={{ fontSize: 14 }} color='text.secondary' gutterBottom>
                        Graduation Year
                      </Typography>
                      <Typography style={{ fontSize: 20 }}>{currentVC.graduationYear}</Typography>
                    </CardContent>
                  </Card>
                </Col>

                <Col xl='6' lg='6' md='6' sm='6' xs='6'>
                  <Card sx={{ marginBottom: 2 }}>
                    <CardContent>
                      <Typography sx={{ fontSize: 14 }} color='text.secondary' gutterBottom>
                        GPA
                      </Typography>
                      <Typography style={{ fontSize: 20 }}>{currentVC.gpa}</Typography>
                    </CardContent>
                  </Card>
                </Col>
              </Row>
              <Row>
                <Col xl='12' lg='12' md='12' sm='12' xs='12'>
                  <Card sx={{ marginBottom: 2 }}>
                    <CardContent>
                      <Typography sx={{ fontSize: 14 }} color='text.secondary' gutterBottom>
                        Citizenship Status
                      </Typography>
                      <Typography style={{ fontSize: 20 }}>{currentVC.citizenshipStatus}</Typography>
                    </CardContent>
                  </Card>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Card sx={{ marginBottom: 2 }}>
                    <CardContent>
                      <Typography sx={{ fontSize: 14 }} color='text.secondary' gutterBottom>
                        Major
                      </Typography>
                      <Typography style={{ fontSize: 20 }}>{currentVC.major}</Typography>
                    </CardContent>
                  </Card>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Card sx={{ marginBottom: 2 }}>
                    <CardContent>
                      <Typography sx={{ fontSize: 14 }} color='text.secondary' gutterBottom>
                        Minor
                      </Typography>
                      <Typography style={{ fontSize: 20 }}>{currentVC.minor}</Typography>
                    </CardContent>
                  </Card>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Card sx={{ marginBottom: 2 }} className='textWrap'>
                    <CardContent>
                      <Typography sx={{ fontSize: 14 }} color='text.secondary' gutterBottom>
                        My DID
                      </Typography>
                      <Typography style={{ fontSize: 20 }}>{currentVC.userDID}</Typography>
                    </CardContent>
                  </Card>
                </Col>
              </Row>
              {needIssuerDID && (
                <Row>
                  <Col>
                    <Card sx={{ marginBottom: 2 }} className='textWrap'>
                      <CardContent>
                        <Typography sx={{ fontSize: 14 }} color='text.secondary' gutterBottom>
                          Issuer DID
                        </Typography>
                        <Typography style={{ fontSize: 20 }}>{currentVC.issuerDID}</Typography>
                      </CardContent>
                    </Card>
                  </Col>
                </Row>
              )}
            </Container>
            {/* <div style={{display:"flex", justifyContent:"center", marginTop:5}}>
              <Button style={{backgroundColor:"#1b5e20", marginRight:25}} variant="contained">Approve</Button>
              <Button style={{backgroundColor:"#d50000"}} variant="contained">Deny</Button>
            </div> */}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>

      <Dialog fullWidth={true} maxWidth={maxWidth} open={openVC} onClose={handleClose}>
        <DialogTitle>JSON Formatted Verifiable Credential</DialogTitle>
        <DialogContent>
          <DialogContentText style={{ marginTop: -5 }}>Click on the box below to copy your Verifiable Credential!</DialogContentText>

          <div onClick={copyText} style={{ marginTop: 25 }} className='boxer1 py-3 px-3 textWrap'>
            {fullVC}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={openSnack} autoHideDuration={6000} onClose={handleSnackClose}>
        <Alert onClose={handleSnackClose} severity='success' sx={{ width: 250 }}>
          Copied To Clipboard!
        </Alert>
      </Snackbar>
    </div>
  )
}

export default ClientTable
