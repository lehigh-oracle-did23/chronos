import React, { useState } from 'react'
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavbarText
} from 'reactstrap'

function Header(props) {
  const [isOpen, setIsOpen] = useState(false)
  let universityName = props.name
  console.log(props.name)

  const toggle = () => setIsOpen(!isOpen)

  return (
    <div>
      <Navbar style={{ borderBottom: '1px solid rgb(192, 192, 192)' }} color='light' light expand='md'>
        <NavbarBrand style={{ fontWeight: 'bold' }} href='/'>
          {universityName}
        </NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className='me-auto' navbar></Nav>
          <Nav>
            <NavItem>
              {/* <NavLink href="/client">
                    Portal
                </NavLink> */}
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  )
}

export default Header
