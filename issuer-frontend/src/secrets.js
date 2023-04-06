const majors = [
  'Computer Science',
  'Economics',
  'Art',
  'Philosophy',
  'Math',
  'English',
  'History',
  'Earth and Environmental Science',
  'Finance',
  'Physics',
  'Mechanical Engineering',
  'Agriculture',
  'Entrepreneurship'
]
export const whitelist = ['alexd', 'user']

export const autoFill = user => {
  let firstName
  let lastName
  let SSN
  let major
  let minor
  let DID
  let dob
  let year
  let citizenship
  let gpa

  let majorNum = Math.floor(Math.random() * (majors.length - 1))
  let minorNum = Math.floor(Math.random() * (majors.length - 1))
  let randomDecimal = Math.random()
  gpa = Math.floor(Math.random() * 1) + 3 + randomDecimal
  gpa = gpa.toString()
  gpa = gpa.substring(0, 4)

  if (majorNum == minorNum) {
    while (majorNum == minorNum) {
      majorNum = Math.floor(Math.random() * (majors.length - 1))
    }
  }

  if (user === 'alexd') {
    let dater = new Date()
    dater.setDate(22)
    dater.setFullYear(2000)
    dater.setMonth(10)
    let yearer = new Date()
    yearer.setFullYear(2023)

    firstName = 'Alex'
    lastName = "D'Alessandro"
    SSN = 1567
    major = majors[majorNum]
    minor = majors[minorNum]
    DID = 'did:orcl:HpIcCsTPtfYOAySxGaEyPSOpwAJFxMHtzFGokANQOpfHAFNeHJ'
    dob = dater
    year = yearer
    citizenship = 'US Citizen'
  }

  if (user === 'user') {
    let dater = new Date()
    dater.setDate(26)
    dater.setFullYear(1774)
    dater.setMonth(8)
    let yearer = new Date()
    yearer.setFullYear(1804)

    firstName = 'Johnny'
    lastName = 'Appleseed'
    SSN = 8374
    major = majors[majorNum]
    minor = majors[minorNum]
    DID = 'did:example:ghks4yu712ebc6f1c27undhsgd76'
    dob = dater
    year = yearer
    citizenship = 'US Citizen'
  }

  return {
    firstName: firstName,
    lastName: lastName,
    SSN: SSN,
    major: major,
    minor: minor,
    DID: DID,
    dob: dob,
    year: year,
    citizenship: citizenship,
    gpa: gpa
  }
}
