import React, { useState } from 'react'

const ContactModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    attachment: null
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)
  const [isDragOver, setIsDragOver] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file && file.size <= 10 * 1024 * 1024) { // 10MB limit
      setFormData(prev => ({
        ...prev,
        attachment: file
      }))
    } else if (file) {
      alert('File size must be less than 10MB')
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      if (file.size <= 10 * 1024 * 1024) { // 10MB limit
        setFormData(prev => ({
          ...prev,
          attachment: file
        }))
      } else {
        alert('File size must be less than 10MB')
      }
    }
  }

  const removeAttachment = () => {
    setFormData(prev => ({
      ...prev,
      attachment: null
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      // Simulate form submission - replace with actual form handling
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSubmitStatus('success')
      setFormData({ name: '', email: '', message: '', attachment: null })
      setTimeout(() => {
        onClose()
        setSubmitStatus(null)
      }, 2000)
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="contact-modal-overlay" onClick={handleOverlayClick}>
      <div 
        className={`contact-modal ${isDragOver ? 'drag-over' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="contact-modal-header">
          <h2>Get In Touch</h2>
          <button className="contact-modal-close" onClick={onClose}>
            <span>×</span>
          </button>
        </div>
        
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Your full name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="your.email@example.com"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="message">Message *</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              required
              rows="4"
              placeholder="Tell me about your project or how I can help you..."
            />
            <div className="attachment-note">
              💡 You can drag & drop files here or{' '}
              <label htmlFor="attachment" className="file-upload-link">
                click to browse
                <input
                  type="file"
                  id="attachment"
                  name="attachment"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
                  style={{ display: 'none' }}
                />
              </label>
              {' '}(max 10MB)
              {formData.attachment && (
                <div className="attached-file">
                  📎 {formData.attachment.name}
                  <button 
                    type="button" 
                    onClick={removeAttachment}
                    className="remove-attachment"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={isSubmitting || !formData.name || !formData.email || !formData.message}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </div>

          {submitStatus === 'success' && (
            <div className="submit-status success">
              ✅ Message sent successfully! I'll get back to you soon.
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="submit-status error">
              ❌ Failed to send message. Please try again or email me directly.
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default ContactModal
