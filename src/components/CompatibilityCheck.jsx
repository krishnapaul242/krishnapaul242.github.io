import React, { useState } from 'react'
import { submitCompatibilityCheck, validateFile } from '../utils/api'

const CompatibilityCheck = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    experience: '',
    skills: '',
    jobRole: '',
    resume: null
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)
  const [result, setResult] = useState(null)
  const [validationErrors, setValidationErrors] = useState({})
  const [isDragOver, setIsDragOver] = useState(false)

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
    const file = e.target.files[0]
    if (file) {
      const validation = validateFile(file)
      if (!validation.valid) {
        alert(validation.error)
        return
      }
      
      setFormData(prev => ({
        ...prev,
        resume: file
      }))
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
      const validation = validateFile(file)
      if (!validation.valid) {
        alert(validation.error)
        return
      }
      
      setFormData(prev => ({
        ...prev,
        resume: file
      }))
    }
  }

  const removeResume = () => {
    setFormData(prev => ({
      ...prev,
      resume: null
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)
    setValidationErrors({})
    setResult(null)

    try {
      const response = await submitCompatibilityCheck(formData)
      
      if (response.success) {
        setSubmitStatus('success')
        setResult(response.data)
      } else {
        throw new Error(response.error || 'Failed to analyze compatibility')
      }
    } catch (error) {
      console.error('Compatibility check error:', error)
      setSubmitStatus('error')
      
      // Handle validation errors from API
      if (error.message.includes('Validation failed') && error.details) {
        const errors = {}
        error.details.forEach(detail => {
          errors[detail.field] = detail.message
        })
        setValidationErrors(errors)
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

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      experience: '',
      skills: '',
      jobRole: '',
      resume: null
    })
    setResult(null)
    setSubmitStatus(null)
    setValidationErrors({})
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="compatibility-modal-overlay" onClick={handleOverlayClick}>
      <div 
        className={`compatibility-modal ${isDragOver ? 'drag-over' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="compatibility-modal-header">
          <h2>AI Compatibility Check</h2>
          <button className="compatibility-modal-close" onClick={handleClose}>
            <span>×</span>
          </button>
        </div>
        
        {!result ? (
          <form className="compatibility-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
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

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Phone (Optional)</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1234567890"
                  className={validationErrors.phone ? 'error' : ''}
                />
                {validationErrors.phone && (
                  <span className="validation-error">{validationErrors.phone}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="experience">Years of Experience *</label>
                <input
                  type="number"
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  required
                  min="0"
                  max="50"
                  placeholder="5"
                  className={validationErrors.experience ? 'error' : ''}
                />
                {validationErrors.experience && (
                  <span className="validation-error">{validationErrors.experience}</span>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="skills">Skills *</label>
              <input
                type="text"
                id="skills"
                name="skills"
                value={formData.skills}
                onChange={handleInputChange}
                required
                placeholder="JavaScript, TypeScript, React, Node.js, Python..."
                className={validationErrors.skills ? 'error' : ''}
              />
              {validationErrors.skills && (
                <span className="validation-error">{validationErrors.skills}</span>
              )}
              <small>Separate skills with commas</small>
            </div>

            <div className="form-group">
              <label htmlFor="jobRole">Desired Job Role *</label>
              <input
                type="text"
                id="jobRole"
                name="jobRole"
                value={formData.jobRole}
                onChange={handleInputChange}
                required
                placeholder="Full Stack Developer, Frontend Engineer, etc."
                className={validationErrors.jobRole ? 'error' : ''}
              />
              {validationErrors.jobRole && (
                <span className="validation-error">{validationErrors.jobRole}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="resume">Resume (Optional)</label>
              <div className="resume-upload-note">
                🤖 Upload your resume for AI-powered analysis and personalized recommendations
                <br />
                💡 You can drag & drop your resume here or{' '}
                <label htmlFor="resume" className="file-upload-link">
                  click to browse
                  <input
                    type="file"
                    id="resume"
                    name="resume"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.txt"
                    style={{ display: 'none' }}
                  />
                </label>
                {' '}(PDF, DOC, DOCX, TXT - max 50MB)
                
                {formData.resume && (
                  <div className="attached-file">
                    📄 {formData.resume.name} ({Math.round(formData.resume.size / 1024)}KB)
                    <button 
                      type="button" 
                      onClick={removeResume}
                      className="remove-attachment"
                      title="Remove resume"
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
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn-primary"
                disabled={isSubmitting || !formData.name || !formData.email || !formData.experience || !formData.skills || !formData.jobRole}
              >
                {isSubmitting ? 'Analyzing...' : 'Check Compatibility 🤖'}
              </button>
            </div>

            {submitStatus === 'error' && (
              <div className="submit-status error">
                ❌ Failed to analyze compatibility. Please try again later.
              </div>
            )}
          </form>
        ) : (
          <div className="compatibility-results">
            <div className="result-header">
              <h3>🎯 Compatibility Analysis Results</h3>
              <div className="compatibility-score">
                <span className="score-label">Compatibility Score:</span>
                <span className={`score-value ${result.aiAnalysis.compatibilityScore >= 70 ? 'high' : result.aiAnalysis.compatibilityScore >= 50 ? 'medium' : 'low'}`}>
                  {result.aiAnalysis.compatibilityScore}%
                </span>
              </div>
            </div>

            <div className="analysis-sections">
              <div className="analysis-section">
                <h4>💪 Strengths</h4>
                <ul>
                  {result.aiAnalysis.strengths.map((strength, index) => (
                    <li key={index}>{strength}</li>
                  ))}
                </ul>
              </div>

              <div className="analysis-section">
                <h4>🚀 Recommendations</h4>
                <ul>
                  {result.aiAnalysis.recommendations.map((recommendation, index) => (
                    <li key={index}>{recommendation}</li>
                  ))}
                </ul>
              </div>

              <div className="analysis-section">
                <h4>📝 Overall Assessment</h4>
                <p>{result.aiAnalysis.overallAssessment}</p>
              </div>
            </div>

            <div className="result-actions">
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={resetForm}
              >
                Run Another Check
              </button>
              <button 
                type="button" 
                className="btn-primary" 
                onClick={handleClose}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CompatibilityCheck
