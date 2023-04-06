import { React, useState, useEffect } from 'react'
import { Container, Row, Col, Input, Form, FormGroup, FormFeedback, Label } from 'reactstrap'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import { DataGrid } from '@mui/x-data-grid'
import Typography from '@mui/material/Typography'
import VerifiedIcon from '@mui/icons-material/Verified'
import ErrorIcon from '@mui/icons-material/Error'
import PendingIcon from '@mui/icons-material/Pending'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'

import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import { adminGetAll, getSpecificVC, acceptVC, rejectVC, verifyVC, rejectVC2, acceptVC2 } from '../IssuerServer'

function AdminTable(props) {
  const [pageSize, setPageSize] = useState(50)

  const [open, setOpen] = useState(false)
  const [rows, setRows] = useState([])
  const [needDID, setNeedDID] = useState(true)
  const [currentStatus, setCurrentStatus] = useState(true)
  const [currentStatus2, setCurrentStatus2] = useState('')
  const [hasVerifyBeenClicked, setHasVerifyBeenClicked] = useState(false)
  const [isCurrentVCValid, setIsCurrentVCValid] = useState(false)

  const [currentVC, setCurrentVC] = useState({})

  const [isVerifier, setIsVerifier] = useState(false)
  const [isIssuer, setIsIssuer] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    console.log(localStorage.getItem('authToken'))
    let user = localStorage.getItem('username')
    if (user == 'verifier') {
      setIsIssuer(false)
      setIsVerifier(true)
    } else if (user == 'issuer') {
      setIsVerifier(false)
      setIsIssuer(true)
    } else {
      setIsAdmin(true)
    }
  })
  const handleClose = () => {
    setOpen(false)
  }

  const handleRowClick = async params => {
    setHasVerifyBeenClicked(false)
    setIsCurrentVCValid(false)
    if (params.row.type === 'issue') {
      setNeedDID(false)
    } else {
      setNeedDID(true)
    }

    if (params.row.status === 1) {
      setCurrentStatus2('VC HAS BEEN APPROVED')
    } else if (params.row.status === -1) {
      setCurrentStatus2('VC HAS BEEN REJECTED')
    }

    if (params.row.status === 1 || params.row.status === -1) {
      setCurrentStatus(false)
    } else {
      setCurrentStatus(true)
    }
    let obj = await getSpecificVC(params.row.id)
    setCurrentVC(obj)
    setOpen(true)
  }

  useEffect(() => {
    console.log(localStorage.getItem('authToken'))
    let user = localStorage.getItem('username')
    if (user == 'verifier') {
      setIsIssuer(false)
      setIsVerifier(true)
    } else if (user == 'issuer') {
      setIsVerifier(false)
      setIsIssuer(true)
    } else {
      setIsAdmin(true)
    }
  }, [])

  useEffect(() => {
    if (isIssuer) {
      adminGetAll().then(result => {
        let finalResult = []
        result.forEach(row => {
          if (row.type !== 'verify') {
            finalResult.push(row)
          }
        })
        setRows(finalResult)
      })
    } else if (isVerifier) {
      adminGetAll().then(result => {
        let finalResult = []
        result.forEach(row => {
          if (row.type !== 'issue') {
            finalResult.push(row)
          }
        })
        setRows(finalResult)
      })
    } else {
      adminGetAll().then(result => {
        setRows(result)
      })
    }
  }, [isIssuer, isVerifier])

  const handleVCAccept = () => {
    acceptVC(currentVC.id)
      .then(result => {
        alert('VC has successfully been approved')
        if (isIssuer) {
          adminGetAll().then(result => {
            let finalResult = []
            result.forEach(row => {
              if (row.type !== 'verify') {
                finalResult.push(row)
              }
            })
            setRows(finalResult)
          })
        } else if (isVerifier) {
          adminGetAll().then(result => {
            let finalResult = []
            result.forEach(row => {
              if (row.type !== 'issue') {
                finalResult.push(row)
              }
            })
            setRows(finalResult)
          })
        } else {
          adminGetAll().then(result => {
            setRows(result)
          })
        }
      })
      .catch(err => {
        alert('Error approving VC: ' + err)
      })
    handleClose()
  }

  const handleVCReject = () => {
    rejectVC(currentVC.id)
      .then(result => {
        alert('VC has successfully been rejected')
        if (isIssuer) {
          adminGetAll().then(result => {
            let finalResult = []
            result.forEach(row => {
              if (row.type !== 'verify') {
                finalResult.push(row)
              }
            })
            setRows(finalResult)
          })
        } else if (isVerifier) {
          adminGetAll().then(result => {
            let finalResult = []
            result.forEach(row => {
              if (row.type !== 'issue') {
                finalResult.push(row)
              }
            })
            setRows(finalResult)
          })
        } else {
          adminGetAll().then(result => {
            setRows(result)
          })
        }
      })
      .catch(err => {
        alert('Error rejecting VC: ' + err)
      })
    handleClose()
  }

  const handleVCAccept2 = () => {
    acceptVC2(currentVC.id)
      .then(result => {
        alert('VC has successfully been approved')
        if (isIssuer) {
          adminGetAll().then(result => {
            let finalResult = []
            result.forEach(row => {
              if (row.type !== 'verify') {
                finalResult.push(row)
              }
            })
            setRows(finalResult)
          })
        } else if (isVerifier) {
          adminGetAll().then(result => {
            let finalResult = []
            result.forEach(row => {
              if (row.type !== 'issue') {
                finalResult.push(row)
              }
            })
            setRows(finalResult)
          })
        } else {
          adminGetAll().then(result => {
            setRows(result)
          })
        }
      })
      .catch(err => {
        alert('Error approving VC: ' + err)
      })
    handleClose()
  }

  const handleVCReject2 = () => {
    rejectVC2(currentVC.id)
      .then(result => {
        alert('VC has successfully been rejected')
        if (isIssuer) {
          adminGetAll().then(result => {
            let finalResult = []
            result.forEach(row => {
              if (row.type !== 'verify') {
                finalResult.push(row)
              }
            })
            setRows(finalResult)
          })
        } else if (isVerifier) {
          adminGetAll().then(result => {
            let finalResult = []
            result.forEach(row => {
              if (row.type !== 'issue') {
                finalResult.push(row)
              }
            })
            setRows(finalResult)
          })
        } else {
          adminGetAll().then(result => {
            setRows(result)
          })
        }
      })
      .catch(err => {
        alert('Error rejecting VC: ' + err)
      })
    handleClose()
  }

  const handleVerifyVC = () => {
    verifyVC(currentVC.id).then(result => {
      console.log(result)
      setHasVerifyBeenClicked(true)
      if (result) {
        setIsCurrentVCValid(true)
      } else {
        setIsCurrentVCValid(false)
      }
    })
  }

  const columns = [
    {
      field: 'id',
      headerName: 'Request ID',
      width: 225,
      renderCell: params => {
        return (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Typography style={{ textAlign: 'center', fontSize: 14 }}>{params.row.id}</Typography>
          </div>
        )
      }
    },
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
      field: 'user',
      headerName: 'User',
      width: 150
    },
    {
      field: 'type',
      headerName: 'Type',
      width: 100
    },
    // {
    //     field: 'verified',
    //     headerName: 'Verified?',
    //     width: 75,
    //     renderCell: (params) => {
    //       if(params.row.type !== "issue"){
    //         if(params.row.verified === true){
    //           return(<div><Typography> <VerifiedIcon style={{color:"green", width:50, height:50}} /></Typography> </div>)
    //         } else if(params.row.status === false){
    //           return(<div><Typography className="rejected"> <ErrorIcon /></Typography> </div>)
    //         }
    //       }else{
    //         return(<Typography>N/A</Typography>)
    //       }
    //       }
    // },
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
    }
  ]

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
                        {currentVC.graduationYear}
                      </Typography>
                      <Typography style={{ fontSize: 20 }}>{'2023'}</Typography>
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
                        {currentVC.citizenshipStatus}
                      </Typography>
                      <Typography style={{ fontSize: 20 }}>{'US Citizen'}</Typography>
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
                        User DID
                      </Typography>
                      <Typography style={{ fontSize: 20 }}>{currentVC.userDID}</Typography>
                    </CardContent>
                  </Card>
                </Col>
              </Row>
              {needDID && (
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

            {needDID && (
              <div>
                {!hasVerifyBeenClicked && (
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: 5, marginBottom: 20 }}>
                    <Button color='primary' variant='contained' onClick={handleVerifyVC}>
                      {' '}
                      Check Validity
                    </Button>
                  </div>
                )}
                {hasVerifyBeenClicked && (
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20, marginTop: 5 }}>
                    {isCurrentVCValid && (
                      <div>
                        <VerifiedIcon className='approved' style={{ width: 75, height: 75 }}>
                          {' '}
                        </VerifiedIcon>
                      </div>
                    )}
                    {!isCurrentVCValid && (
                      <div>
                        <ErrorIcon className='rejected' style={{ width: 75, height: 75 }}>
                          {' '}
                        </ErrorIcon>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            {currentStatus && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  {!needDID && (
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 5 }}>
                      <Button onClick={handleVCAccept} style={{ width: 100, backgroundColor: '#1b5e20', marginRight: 25 }} variant='contained'>
                        Approve
                      </Button>
                      <Button onClick={handleVCReject} style={{ width: 100, backgroundColor: '#d50000' }} variant='contained'>
                        Deny
                      </Button>
                    </div>
                  )}
                  {needDID && (
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 5 }}>
                      <Button onClick={handleVCAccept2} style={{ width: 100, backgroundColor: '#1b5e20', marginRight: 25 }} variant='contained'>
                        Approve
                      </Button>
                      <Button onClick={handleVCReject2} style={{ width: 100, backgroundColor: '#d50000' }} variant='contained'>
                        Deny
                      </Button>
                    </div>
                  )}
                </div>{' '}
              </div>
            )}
            {!currentStatus && <div style={{ display: 'flex', justifyContent: 'center', marginTop: 5 }}>{currentStatus2}</div>}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default AdminTable
