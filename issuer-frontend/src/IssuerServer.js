import React from 'react'
import axios from 'axios'
import moment from 'moment'

export async function writeUserCredentials(username, password) {
  var config = {
    method: 'post',
    url: 'http://132.145.160.102:4000/api/login/',
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      username,
      password
    }
  }

  return await axios(config)
}

export async function requestNewVC(firstName, lastName, ssn, major, minor, did, dob, year, citizenship, gpa) {
  var config = {
    method: 'post',
    url: 'http://localhost:4000/api/requestVC',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('authToken'),
      'Content-Type': 'application/json'
    },
    data: {
      credentialSubject: {
        id: did,
        alumniOf: {
          id: 'did:example:c276e12ec21ebfeb1f712ebc6f1',
          name: [
            {
              value: 'DemoTester University',
              lang: 'en'
            }
          ]
        },
        firstName: firstName,
        lastName: lastName,
        ssn: ssn,
        major: major,
        minor: minor,
        dob: dob,
        graduationYear: year,
        citizenshipStatus: citizenship,
        gpa: gpa
      }
    }
  }
  let result = await axios(config)
  console.log(result)

  return result
}

export async function getRequests() {
  var config = {
    method: 'get',
    url: 'http://localhost:4000/api/Requests',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('authToken'),
      'Content-Type': 'application/json'
    }
  }
  let result = await axios(config)

  let data = result.data.data
  console.log(data)
  let finalData = []
  data.forEach(row => {
    let resolvedDater
    if (row.request.resolvedDate) {
      resolvedDater = moment(row.request.resolvedDate).format('MMMM Do YYYY, h:mm:ss a')
    } else {
      resolvedDater = 'N/A'
    }
    let dater = moment(row.request.createdDate).format('MMMM Do YYYY, h:mm:ss a')
    finalData.push({ id: row._id, status: row.request.status, dateRequested: dater, type: row.request.type, dateResolved: resolvedDater })
  })

  return finalData
}

export async function getSpecificVC(VCid) {
  var config = {
    method: 'get',
    url: 'http://localhost:4000/api/VC/' + VCid,
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('authToken'),
      'Content-Type': 'application/json'
    }
  }

  let result = await axios(config)
  console.log(result)
  let data = result.data.data.credentialSubject
  console.log(data)
  let formattedDate = moment(data.graduationYear).format('YYYY')
  let formattedDob = moment(data.dob).format('MM/DD/YYYY')
  let finalData = {
    id: result.data.data.id,
    firstName: data.firstName,
    lastName: data.lastName,
    ssn: data.ssn,
    major: data.major,
    minor: data.minor,
    dob: formattedDob,
    graduationYear: formattedDate,
    citizenshipStatus: data.citizenshipStatus,
    userDID: data.id,
    issuerDID: data.alumniOf.id,
    gpa: data.gpa,
    status: result.data.data.request.status,
    type: result.data.data.request.type
  }
  return finalData
}

export async function adminGetAll() {
  var config = {
    method: 'get',
    url: 'http://localhost:4000/api/getRequests',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('authToken'),
      'Content-Type': 'application/json'
    }
  }
  let result = await axios(config)

  let data = result.data.data
  console.log(data)
  let finalData = []
  data.forEach(row => {
    let resolvedDater
    if (row.request.resolvedDate) {
      resolvedDater = moment(row.request.resolvedDate).format('MMMM Do YYYY, h:mm:ss a')
    } else {
      resolvedDater = 'N/A'
    }
    let dater = moment(row.request.createdDate).format('MMMM Do YYYY, h:mm:ss a')
    finalData.push({
      id: row._id,
      status: row.request.status,
      dateRequested: dater,
      type: row.request.type,
      dateResolved: resolvedDater,
      user: row.username,
      verified: true
    })
  })

  return finalData
}

export async function acceptVC(VCid) {
  var config = {
    method: 'post',
    url: 'http://localhost:4000/api/VC/Issue/Approve/' + VCid,
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('authToken'),
      'Content-Type': 'application/json'
    }
  }

  let result = await axios(config)
  console.log(result)
  return result
}

export async function rejectVC(VCid) {
  var config = {
    method: 'post',
    url: 'http://localhost:4000/api/VC/Issue/Reject/' + VCid,
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('authToken'),
      'Content-Type': 'application/json'
    }
  }

  let result = axios(config)
  console.log(result)
  return result
}

export async function getFullVC(VCid) {
  var config = {
    method: 'get',
    url: 'http://localhost:4000/api/VC/' + VCid,
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('authToken'),
      'Content-Type': 'application/json'
    }
  }

  let result = await axios(config)
  let finalData = result.data.data

  return finalData
}

export async function uploadVC(VC) {
  var config = {
    method: 'post',
    url: 'http://localhost:4000/api/uploadVC',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('authToken'),
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    data: { VC: VC.VC, proof: VC.proof }
  }

  let result = await axios(config)
  console.log(result)
  return result
}

export async function verifyVC(VCid) {
  var config = {
    method: 'post',
    url: 'http://localhost:4000/api/VC/Verify/Validate/' + VCid,
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('authToken'),
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  }

  let result = await axios(config)
  let finalData = result.data.data
  return finalData
}

export async function acceptVC2(VCid) {
  var config = {
    method: 'post',
    url: 'http://localhost:4000/api/VC/Verify/Approve/' + VCid,
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('authToken'),
      'Content-Type': 'application/json'
    }
  }

  let result = await axios(config)
  console.log(result)
  return result
}

export async function rejectVC2(VCid) {
  var config = {
    method: 'post',
    url: 'http://localhost:4000/api/VC/Verify/Reject/' + VCid,
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('authToken'),
      'Content-Type': 'application/json'
    }
  }

  let result = axios(config)
  console.log(result)
  return result
}
