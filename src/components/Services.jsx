import React, { useState, useEffect } from 'react'
import servicesData from '../data/services.json'

const Services = () => {
  const [services, setServices] = useState([])

  useEffect(() => {
    setServices(servicesData.services.sort((a, b) => a.order - b.order))
  }, [])

  return (
    <section id="services" className="pf-services">
      <div className="pf-services-title">Services</div>
      <div className="pf-services-content" id="servicesContainer">
        {services.map(service => (
          <div key={service.id} className="pf-services-item">
            <div className="pf-services-item-image"></div>
            <div className="pf-services-item-title">{service.title}</div>
            <div className="pf-services-item-description">{service.description}</div>
            <div className="pf-services-item-examples">
              {service.examples.map((example, index) => (
                <div key={index} className="pf-services-item-example">{example}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Services
