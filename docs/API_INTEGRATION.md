# API Integration Documentation

This document explains how the portfolio website integrates with the Krishna Paul Backend API.

## Overview

The portfolio website now includes two main API integrations:

1. **Contact Form** - Users can send messages with file attachments
2. **AI Compatibility Check** - Users can check their compatibility with available roles using AI

## Files Structure

```
src/
├── utils/
│   └── api.js                 # API utility functions
├── components/
│   ├── ContactModal.jsx       # Enhanced contact form
│   └── CompatibilityCheck.jsx # AI compatibility checker
├── config/
│   └── api.js                 # API configuration
└── ...
```

## API Configuration

### Environment Settings

The API automatically switches between development and production environments:

- **Development**: `http://localhost:3000`
- **Production**: `https://api.krishnapaul.in`

### Environment Variables

You can override the API base URL by setting:

```bash
# For development
VITE_API_BASE_URL=http://localhost:3000

# For production
VITE_API_BASE_URL=https://api.krishnapaul.in
```

## Features

### 1. Contact Form (`ContactModal.jsx`)

**Features:**
- Name, email, subject, and message fields (all required)
- Multiple file attachments (up to 10 files, 50MB total)
- Drag & drop file upload
- Real-time validation with API error handling
- Support for various file types: PDF, Word docs, images, text files, archives

**Usage:**
```javascript
import { submitContactForm } from '../utils/api'

const formData = {
  name: 'John Doe',
  email: 'john@example.com',
  subject: 'Project Inquiry',
  message: 'I would like to discuss a project...',
  attachments: [file1, file2] // Optional
}

const result = await submitContactForm(formData)
```

### 2. AI Compatibility Check (`CompatibilityCheck.jsx`)

**Features:**
- Personal information (name, email, phone, experience)
- Skills and job role matching
- Optional resume upload for enhanced analysis
- AI-powered analysis with compatibility score
- Detailed strengths and recommendations
- Overall assessment

**Usage:**
```javascript
import { submitCompatibilityCheck } from '../utils/api'

const formData = {
  name: 'Jane Smith',
  email: 'jane@example.com',
  phone: '+1234567890', // Optional
  experience: '5',
  skills: 'JavaScript,TypeScript,React,Node.js',
  jobRole: 'Full Stack Developer',
  resume: resumeFile // Optional
}

const result = await submitCompatibilityCheck(formData)
```

## API Response Format

All API responses follow this consistent format:

```javascript
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Success message",
  "error": null,
  "timestamp": "2025-08-01T10:30:00.000Z"
}
```

### Error Responses

```javascript
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "Please provide a valid email address"
    }
  ],
  "timestamp": "2025-08-01T10:30:00.000Z"
}
```

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **Contact Form**: 5 requests per 15 minutes per IP
- **Compatibility Check**: 3 requests per hour per IP
- **General endpoints**: 100 requests per 15 minutes per IP

When rate limit is exceeded:
```javascript
{
  "success": false,
  "error": "Too many requests. Please try again later.",
  "retryAfter": 900
}
```

## File Upload Validation

### Supported File Types

**Contact Form:**
- Documents: `.pdf`, `.doc`, `.docx`, `.txt`
- Images: `.jpg`, `.jpeg`, `.png`, `.gif`
- Archives: `.zip`, `.rar`

**Compatibility Check:**
- Documents: `.pdf`, `.doc`, `.docx`, `.txt`

### Constraints

- Maximum file size: 50MB per file
- Maximum total size: 50MB per request
- Maximum files: 10 files per contact form request

## Error Handling

The integration includes comprehensive error handling:

1. **Network Errors**: Connection issues, timeouts
2. **Validation Errors**: Invalid form data, file type/size issues
3. **Rate Limiting**: Too many requests
4. **Server Errors**: API unavailability

```javascript
try {
  const result = await submitContactForm(formData)
  // Handle success
} catch (error) {
  if (error.message.includes('Too many requests')) {
    // Handle rate limiting
  } else if (error.message.includes('Validation failed')) {
    // Handle validation errors
  } else {
    // Handle other errors
  }
}
```

## Utility Functions

### File Validation

```javascript
import { validateFile, validateFiles } from '../utils/api'

// Validate single file
const singleValidation = validateFile(file)
if (!singleValidation.valid) {
  console.error(singleValidation.error)
}

// Validate multiple files
const multiValidation = validateFiles(fileArray)
if (!multiValidation.valid) {
  console.error(multiValidation.error)
}
```

### Health Check

```javascript
import { checkApiHealth } from '../utils/api'

const health = await checkApiHealth()
console.log('API Status:', health.status)
```

## Development Setup

1. **Start the Backend API** (if running locally):
   ```bash
   # In your backend directory
   npm run dev
   # API will be available at http://localhost:3000
   ```

2. **Start the Frontend**:
   ```bash
   # In your frontend directory
   npm run dev
   # Frontend will be available at http://localhost:5173
   ```

3. **CORS Configuration**: The API is configured to accept requests from:
   - `http://localhost:3000`
   - `http://localhost:3001`
   - `http://localhost:5173` (Vite default)
   - `http://localhost:4200` (Angular default)
   - `https://krishnapaul.in`
   - `https://www.krishnapaul.in`

## Testing

### Manual Testing

1. **Contact Form**:
   - Fill out all required fields
   - Try uploading different file types
   - Test drag & drop functionality
   - Verify error handling

2. **Compatibility Check**:
   - Enter your information
   - Upload a resume (optional)
   - Review the AI analysis results

### API Testing

You can test the API directly using curl:

```bash
# Contact form
curl -X POST http://localhost:3000/api/contact \
  -F "name=John Doe" \
  -F "email=john@example.com" \
  -F "subject=Test" \
  -F "message=This is a test message." \
  -F "attachments=@/path/to/file.pdf"

# Compatibility check
curl -X POST http://localhost:3000/api/check-compatibility \
  -F "name=Jane Smith" \
  -F "email=jane@example.com" \
  -F "experience=5" \
  -F "skills=JavaScript,React,Node.js" \
  -F "jobRole=Full Stack Developer" \
  -F "resume=@/path/to/resume.pdf"
```

## Production Deployment

1. **Environment Variables**: Set `VITE_API_BASE_URL` to production API URL
2. **Build**: Run `npm run build` to create production build
3. **Deploy**: Deploy the `dist` folder to your hosting platform

## Security Considerations

1. **HTTPS**: Always use HTTPS in production
2. **File Upload**: Files are validated on both client and server
3. **Rate Limiting**: Prevents abuse and DoS attacks
4. **Input Validation**: All form inputs are validated
5. **CORS**: Properly configured for allowed origins

## Support

For issues or questions regarding the API integration:

1. Check the browser console for error messages
2. Verify API endpoint availability
3. Check network requests in browser dev tools
4. Review rate limiting constraints

## API Documentation

For complete API documentation, visit:
- Development: `http://localhost:3000/docs/api/README.md`
- Production: `https://api.krishnapaul.in/docs/api/README.md`
