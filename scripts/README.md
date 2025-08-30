# API Connection Test Scripts

This directory contains scripts to test the connection to your Shift-Med API server.

## Available Scripts

### 1. Node.js Script (Recommended)
**File:** `test-api-connection.js`
**Usage:** `node test-api-connection.js`

**Features:**
- ✅ Comprehensive testing of all endpoints
- ✅ Network connectivity testing
- ✅ DNS resolution testing
- ✅ Colored output with detailed results
- ✅ Timeout handling
- ✅ JSON response parsing

### 2. PowerShell Script
**File:** `test-api.ps1`
**Usage:** `powershell -ExecutionPolicy Bypass -File test-api.ps1`

**Features:**
- ✅ Windows PowerShell compatible
- ✅ Network connectivity testing
- ✅ Colored output
- ✅ Parameter support for custom URLs

### 3. Batch Script (Windows)
**File:** `test-api.bat`
**Usage:** Double-click the file or run `test-api.bat`

**Features:**
- ✅ Simple Windows batch file
- ✅ Basic connectivity testing
- ✅ Quick endpoint testing

## Configuration

All scripts are configured to test:
- **Base URL:** `http://192.168.43.45:3000/api`
- **Endpoints:** `/nurses`, `/nurses/1`, `/health`, `/status`
- **Timeout:** 10 seconds

## How to Use

### Quick Test (Windows)
1. Double-click `test-api.bat`
2. Check the output for connection status

### Comprehensive Test (Node.js)
1. Open terminal/command prompt
2. Navigate to the scripts directory
3. Run: `node test-api-connection.js`

### PowerShell Test
1. Open PowerShell
2. Navigate to the scripts directory
3. Run: `powershell -ExecutionPolicy Bypass -File test-api.ps1`

## What the Scripts Test

1. **Network Connectivity**
   - TCP connection to the server
   - Port accessibility

2. **DNS Resolution**
   - Hostname resolution
   - IP address mapping

3. **API Endpoints**
   - `/nurses` - List all nurses
   - `/nurses/1` - Get specific nurse
   - `/health` - Health check
   - `/status` - Server status

## Expected Results

### ✅ Success
```
✅ Network: Connected to 192.168.43.45:3000
✅ DNS: 192.168.43.45 resolves to 192.168.43.45 (IPv4)
✅ /nurses - Status: 200
✅ /nurses/1 - Status: 200
🎉 All API endpoints are working correctly!
```

### ❌ Failure
```
❌ Network: Connection failed to 192.168.43.45:3000
❌ /nurses - Failed: connect ECONNREFUSED
💥 All API endpoints failed. Please check your server configuration.
```

## Troubleshooting

### Common Issues

1. **Connection Refused**
   - API server is not running
   - Wrong IP address or port
   - Firewall blocking connection

2. **Timeout**
   - Network is slow
   - Server is overloaded
   - Increase timeout in script configuration

3. **DNS Resolution Failed**
   - Check hostname spelling
   - Try using IP address directly

### Solutions

1. **Verify API Server**
   - Ensure your API server is running
   - Check the correct IP address and port

2. **Network Configuration**
   - Verify both devices are on the same network
   - Check firewall settings
   - Try different IP addresses (localhost, 127.0.0.1, etc.)

3. **Update Configuration**
   - Modify the `baseURL` in the scripts
   - Update timeout values if needed
   - Add/remove endpoints as required

## Customization

### Change API URL
Edit the `baseURL` variable in any script:
```javascript
// Node.js
const API_CONFIG = {
  baseURL: 'http://your-new-ip:3000/api',
  // ...
};
```

### Add New Endpoints
Add endpoints to the `endpoints` array:
```javascript
endpoints: [
  '/nurses',
  '/nurses/1',
  '/health',
  '/status',
  '/your-new-endpoint'  // Add this
]
```

### Modify Timeout
Change the timeout value:
```javascript
timeout: 15000,  // 15 seconds instead of 10
```

## Requirements

- **Node.js Script:** Node.js 12+ installed
- **PowerShell Script:** Windows PowerShell 5.0+
- **Batch Script:** Windows Command Prompt
- **Network:** Both devices on same network

## Support

If you encounter issues:
1. Check the error messages in the script output
2. Verify your API server configuration
3. Test basic network connectivity (ping)
4. Check firewall and antivirus settings

