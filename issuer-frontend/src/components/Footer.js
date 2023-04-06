import { React, useState, useReducer, useEffect, forwardRef } from 'react'
import { Container, Row, Col, Button, Input } from 'reactstrap'
import { Link } from 'react-router-dom'
import { useMediaPredicate } from 'react-media-hook'
import { SocialIcon } from 'react-social-icons'

function Footer(props) {
  const MediumScreenMin = useMediaPredicate('(min-width: 992px)')

  return (
    <div style={{ color: 'black' }} className='footer footerBG'>
      <Container>
        <Row>
          <Col style={{}} xs='12' sm='12' md='12' lg='12' xl='12'>
            <Row style={{ marginTop: 0 }}>
              <Col></Col>
            </Row>
            <div style={{ marginTop: 0 }}>
              <SocialIcon style={{ width: 40, height: 40, marginRight: 10 }} url='https://twitter.com' />
              <SocialIcon style={{ width: 40, height: 40 }} url='https://instagram.com' />
              <SocialIcon style={{ width: 40, height: 40, marginLeft: 10 }} url='https://discord.com' />
            </div>
            <div style={{ marginTop: 15, marginBottom: 30 }}>
              <p style={{ color: 'black' }}>© Copyright 2022 TesterDester University</p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Footer
