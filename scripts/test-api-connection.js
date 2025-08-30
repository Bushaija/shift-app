#!/usr/bin/env node

/**
 * Simple API Connection Test Script
 * Tests connectivity to the Shift-Med API endpoints
 */

const https = require('https');
const http = require('http');

// Configuration
const API_CONFIG = {
  baseURL: 'http://192.168.43.45:3000/api',
  timeout: 10000,
  endpoints: [
    '/nurses',
    '/nurses/1',
    '/health',
    '/status'
  ]
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

// Test a single endpoint
async function testEndpoint(endpoint) {
  return new Promise((resolve) => {
    const url = `${API_CONFIG.baseURL}${endpoint}`;
    const isHttps = url.startsWith('https://');
    const client = isHttps ? https : http;
    
    logInfo(`Testing: ${url}`);
    
    const req = client.get(url, { timeout: API_CONFIG.timeout }, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          logSuccess(`${endpoint} - Status: ${res.statusCode}`);
          logInfo(`Response: ${JSON.stringify(jsonData, null, 2)}`);
          resolve({ success: true, status: res.statusCode, data: jsonData });
        } catch (error) {
          logWarning(`${endpoint} - Status: ${res.statusCode} (Non-JSON response)`);
          logInfo(`Raw response: ${data.substring(0, 200)}...`);
          resolve({ success: true, status: res.statusCode, data: data });
        }
      });
    });
    
    req.on('error', (error) => {
      logError(`${endpoint} - Connection failed: ${error.message}`);
      resolve({ success: false, error: error.message });
    });
    
    req.on('timeout', () => {
      logError(`${endpoint} - Request timeout after ${API_CONFIG.timeout}ms`);
      req.destroy();
      resolve({ success: false, error: 'Timeout' });
    });
    
    req.setTimeout(API_CONFIG.timeout);
  });
}

// Test network connectivity
async function testNetworkConnectivity() {
  logInfo('Testing network connectivity...');
  
  const host = new URL(API_CONFIG.baseURL).hostname;
  const port = new URL(API_CONFIG.baseURL).port || 80;
  
  return new Promise((resolve) => {
    const socket = require('net').createConnection(port, host);
    
    socket.setTimeout(5000);
    
    socket.on('connect', () => {
      logSuccess(`Network: Connected to ${host}:${port}`);
      socket.destroy();
      resolve(true);
    });
    
    socket.on('timeout', () => {
      logError(`Network: Connection timeout to ${host}:${port}`);
      socket.destroy();
      resolve(false);
    });
    
    socket.on('error', (error) => {
      logError(`Network: Connection failed to ${host}:${port} - ${error.message}`);
      socket.destroy();
      resolve(false);
    });
  });
}

// Test DNS resolution
async function testDNSResolution() {
  logInfo('Testing DNS resolution...');
  
  const host = new URL(API_CONFIG.baseURL).hostname;
  
  return new Promise((resolve) => {
    const dns = require('dns');
    
    dns.lookup(host, (error, address, family) => {
      if (error) {
        logError(`DNS: Failed to resolve ${host} - ${error.message}`);
        resolve(false);
      } else {
        logSuccess(`DNS: ${host} resolves to ${address} (IPv${family})`);
        resolve(true);
      }
    });
  });
}

// Main test function
async function runTests() {
  log('🚀 Starting API Connection Tests...', 'bright');
  log(`📍 Target: ${API_CONFIG.baseURL}`, 'cyan');
  log('─'.repeat(50), 'cyan');
  
  // Test network connectivity first
  const networkOk = await testNetworkConnectivity();
  if (!networkOk) {
    logError('Network connectivity failed. Please check:');
    logError('1. Your internet connection');
    logError('2. The API server is running');
    logError('3. The IP address is correct');
    logError('4. Firewall settings');
    return;
  }
  
  // Test DNS resolution
  const dnsOk = await testDNSResolution();
  if (!dnsOk) {
    logWarning('DNS resolution failed, but continuing with IP-based tests...');
  }
  
  log('─'.repeat(50), 'cyan');
  log('🧪 Testing API Endpoints...', 'bright');
  
  // Test each endpoint
  const results = [];
  for (const endpoint of API_CONFIG.endpoints) {
    const result = await testEndpoint(endpoint);
    results.push({ endpoint, ...result });
    log('─'.repeat(30), 'cyan');
  }
  
  // Summary
  log('─'.repeat(50), 'cyan');
  log('📊 Test Summary:', 'bright');
  
  const successful = results.filter(r => r.success).length;
  const total = results.length;
  
  log(`Total endpoints tested: ${total}`, 'cyan');
  log(`Successful: ${successful}`, 'green');
  log(`Failed: ${total - successful}`, 'red');
  
  if (successful === total) {
    logSuccess('🎉 All API endpoints are working correctly!');
  } else if (successful > 0) {
    logWarning('⚠️  Some endpoints are working, but there are issues.');
  } else {
    logError('💥 All API endpoints failed. Please check your server configuration.');
  }
  
  // Detailed results
  log('\n📋 Detailed Results:', 'bright');
  results.forEach(result => {
    if (result.success) {
      logSuccess(`${result.endpoint}: OK (${result.status})`);
    } else {
      logError(`${result.endpoint}: FAILED - ${result.error}`);
    }
  });
}

// Run the tests
if (require.main === module) {
  runTests().catch(error => {
    logError(`Test execution failed: ${error.message}`);
    process.exit(1);
  });
}

module.exports = { runTests, testEndpoint, testNetworkConnectivity, testDNSResolution };

