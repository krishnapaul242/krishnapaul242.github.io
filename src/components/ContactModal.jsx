import React, { useState } from 'react'
import { submitContactForm, validateFiles } from '../utils/api'

const ContactModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    attachments: []
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)
  const [submitMessage, setSubmitMessage] = useState('')
  const [isDragOver, setIsDragOver] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    addFiles(files)
  }

  const addFiles = (newFiles) => {
    const allFiles = [...formData.attachments, ...newFiles]
    const validation = validateFiles(allFiles)
    
    if (!validation.valid) {
      alert(validation.error)
      return
    }
    
    setFormData(prev => ({
      ...prev,
      attachments: allFiles
    }))
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
    
    const files = Array.from(e.dataTransfer.files)
    addFiles(files)
  }

  const removeAttachment = (index) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)
    setSubmitMessage('')
    setValidationErrors({})

    try {
      const result = await submitContactForm(formData)
      
      if (result.success) {
        setSubmitStatus('success')
        setSubmitMessage('Message sent successfully! I\'ll get back to you soon.')
        setFormData({ 
          name: '', 
          email: '', 
          subject: '', 
          message: '', 
          attachments: [] 
        })
        
        // Close modal after success
        setTimeout(() => {
          onClose()
          setSubmitStatus(null)
          setSubmitMessage('')
        }, 3000)
      } else {
        throw new Error(result.error || 'Failed to send message')
      }
    } catch (error) {
      console.error('Form submission error:', error)
      setSubmitStatus('error')
      
      // Handle validation errors from API
      if (error.message.includes('Validation failed') && error.details) {
        const errors = {}
        error.details.forEach(detail => {
          errors[detail.field] = detail.message
        })
        setValidationErrors(errors)
        setSubmitMessage('Please check the form for errors and try again.')
      } else if (error.message.includes('Too many requests')) {
        setSubmitMessage('Too many requests. Please try again later.')
      } else {
        setSubmitMessage('Failed to send message. Please try again or email me directly.')
      }
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
                minLength={2}
                maxLength={100}
                placeholder="Your full name"
                className={validationErrors.name ? 'error' : ''}
              />
              {validationErrors.name && (
                <span className="validation-error">{validationErrors.name}</span>
              )}
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
                className={validationErrors.email ? 'error' : ''}
              />
              {validationErrors.email && (
                <span className="validation-error">{validationErrors.email}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="subject">Subject *</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              required
              minLength={5}
              maxLength={200}
              placeholder="What's this about?"
              className={validationErrors.subject ? 'error' : ''}
            />
            {validationErrors.subject && (
              <span className="validation-error">{validationErrors.subject}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="message">Message *</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              required
              minLength={10}
              maxLength={5000}
              rows="4"
              placeholder="Tell me about your project or how I can help you..."
              className={validationErrors.message ? 'error' : ''}
            />
            {validationErrors.message && (
              <span className="validation-error">{validationErrors.message}</span>
            )}
            <div className="attachment-note">
              💡 You can drag & drop files here or{' '}
              <label htmlFor="attachment" className="file-upload-link">
                click to browse
                <input
                  type="file"
                  id="attachment"
                  name="attachment"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.zip,.rar"
                  multiple
                  style={{ display: 'none' }}
                />
              </label>
              {' '}(max 10 files, 50MB total)
              
              {formData.attachments.length > 0 && (
                <div className="attached-files">
                  {formData.attachments.map((file, index) => (
                    <div key={index} className="attached-file">
                      📎 {file.name} ({Math.round(file.size / 1024)}KB)
                      <button 
                        type="button" 
                        onClick={() => removeAttachment(index)}
                        className="remove-attachment"
                        title="Remove file"
                      >
                        ×
                      </button>
                    </div>
                  ))}
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
              disabled={isSubmitting || !formData.name || !formData.email || !formData.subject || !formData.message}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </div>

          {submitStatus === 'success' && (
            <div className="submit-status success">
              ✅ {submitMessage}
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="submit-status error">
              ❌ {submitMessage}
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default ContactModal
