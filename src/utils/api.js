// API utility functions for Krishna Paul Backend
const API_BASE_URL = import.meta.env.PROD 
  ? 'https://api.krishnapaul.in' 
  : 'http://localhost:3000';

/**
 * Submit contact form with optional file attachments
 * @param {Object} formData - Form data object
 * @param {string} formData.name - Name (2-100 characters)
 * @param {string} formData.email - Valid email address
 * @param {string} formData.subject - Subject (5-200 characters)
 * @param {string} formData.message - Message (10-5000 characters)
 * @param {FileList|Array} formData.attachments - Optional file attachments (max 10 files, 50MB total)
 * @returns {Promise<Object>} API response
 */
export const submitContactForm = async (formData) => {
  const data = new FormData();
  
  // Add required fields
  data.append('name', formData.name);
  data.append('email', formData.email);
  data.append('subject', formData.subject);
  data.append('message', formData.message);
  
  // Add file attachments if provided
  if (formData.attachments) {
    const files = Array.isArray(formData.attachments) 
      ? formData.attachments 
      : Array.from(formData.attachments);
    
    files.forEach((file) => {
      data.append('attachments', file);
    });
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/contact`, {
      method: 'POST',
      body: data,
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || `HTTP error! status: ${response.status}`);
    }
    
    return result;
  } catch (error) {
    console.error('Contact form submission error:', error);
    throw error;
  }
};

/**
 * Submit compatibility check with optional resume upload
 * @param {Object} formData - Compatibility check data
 * @param {string} formData.name - Full name
 * @param {string} formData.email - Valid email address
 * @param {string} formData.phone - Optional phone number
 * @param {string} formData.experience - Years of experience
 * @param {string} formData.skills - Comma-separated skills
 * @param {string} formData.jobRole - Desired job role
 * @param {File} formData.resume - Optional resume file
 * @returns {Promise<Object>} API response with AI analysis
 */
export const submitCompatibilityCheck = async (formData) => {
  const data = new FormData();
  
  // Add required fields
  data.append('name', formData.name);
  data.append('email', formData.email);
  data.append('experience', formData.experience);
  data.append('skills', formData.skills);
  data.append('jobRole', formData.jobRole);
  
  // Add optional fields
  if (formData.phone) {
    data.append('phone', formData.phone);
  }
  
  if (formData.resume) {
    data.append('resume', formData.resume);
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/check-compatibility`, {
      method: 'POST',
      body: data,
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || `HTTP error! status: ${response.status}`);
    }
    
    return result;
  } catch (error) {
    console.error('Compatibility check error:', error);
    throw error;
  }
};

/**
 * Check API health status
 * @returns {Promise<Object>} Health status response
 */
export const checkApiHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Health check error:', error);
    throw error;
  }
};

/**
 * Validate file for API requirements
 * @param {File} file - File to validate
 * @returns {Object} Validation result
 */
export const validateFile = (file) => {
  const maxSize = 50 * 1024 * 1024; // 50MB
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'application/zip',
    'application/x-rar-compressed'
  ];
  
  const allowedExtensions = ['.pdf', '.doc', '.docx', '.txt', '.jpg', '.jpeg', '.png', '.gif', '.zip', '.rar'];
  
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'File size must be less than 50MB'
    };
  }
  
  const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
  if (!allowedExtensions.includes(fileExtension) && !allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'File type not allowed. Please use PDF, Word documents, text files, images, or archives.'
    };
  }
  
  return { valid: true };
};

/**
 * Validate multiple files for total size limit
 * @param {FileList|Array} files - Files to validate
 * @returns {Object} Validation result
 */
export const validateFiles = (files) => {
  const maxFiles = 10;
  const maxTotalSize = 50 * 1024 * 1024; // 50MB total
  
  const fileArray = Array.isArray(files) ? files : Array.from(files);
  
  if (fileArray.length > maxFiles) {
    return {
      valid: false,
      error: `Maximum ${maxFiles} files allowed`
    };
  }
  
  let totalSize = 0;
  for (const file of fileArray) {
    const fileValidation = validateFile(file);
    if (!fileValidation.valid) {
      return fileValidation;
    }
    totalSize += file.size;
  }
  
  if (totalSize > maxTotalSize) {
    return {
      valid: false,
      error: 'Total file size must be less than 50MB'
    };
  }
  
  return { valid: true };
};

export default {
  submitContactForm,
  submitCompatibilityCheck,
  checkApiHealth,
  validateFile,
  validateFiles
};
