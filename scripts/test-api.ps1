# PowerShell API Connection Test Script
# Tests connectivity to the Shift-Med API endpoints

param(
    [string]$BaseUrl = "http://192.168.43.45:3000/api",
    [int]$Timeout = 10000
)

# Colors for output
$Colors = @{
    Reset = "`e[0m"
    Red = "`e[31m"
    Green = "`e[32m"
    Yellow = "`e[33m"
    Blue = "`e[34m"
    Cyan = "`e[36m"
    Bright = "`e[1m"
}

function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "Reset"
    )
    Write-Host "$($Colors[$Color])$Message$($Colors.Reset)"
}

function Test-NetworkConnectivity {
    param([string]$Host, [int]$Port)
    
    Write-ColorOutput "Testing network connectivity to $Host`:$Port..." "Blue"
    
    try {
        $tcpClient = New-Object System.Net.Sockets.TcpClient
        $connect = $tcpClient.BeginConnect($Host, $Port, $null, $null)
        $wait = $connect.AsyncWaitHandle.WaitOne($Timeout, $false)
        
        if ($wait) {
            $tcpClient.EndConnect($connect)
            Write-ColorOutput "✅ Network: Connected to $Host`:$Port" "Green"
            $tcpClient.Close()
            return $true
        } else {
            Write-ColorOutput "❌ Network: Connection timeout to $Host`:$Port" "Red"
            $tcpClient.Close()
            return $false
        }
    } catch {
        Write-ColorOutput "❌ Network: Connection failed to $Host`:$Port - $($_.Exception.Message)" "Red"
        return $false
    }
}

function Test-ApiEndpoint {
    param(
        [string]$Endpoint,
        [string]$BaseUrl,
        [int]$Timeout
    )
    
    $url = "$BaseUrl$Endpoint"
    Write-ColorOutput "Testing: $url" "Blue"
    
    try {
        $response = Invoke-WebRequest -Uri $url -TimeoutSec ($Timeout / 1000) -UseBasicParsing
        
        Write-ColorOutput "✅ $Endpoint - Status: $($response.StatusCode)" "Green"
        
        try {
            $jsonResponse = $response.Content | ConvertFrom-Json
            Write-ColorOutput "Response: $($jsonResponse | ConvertTo-Json -Depth 3)" "Cyan"
        } catch {
            Write-ColorOutput "⚠️  $Endpoint - Non-JSON response" "Yellow"
            Write-ColorOutput "Raw response: $($response.Content.Substring(0, [Math]::Min(200, $response.Content.Length)))..." "Cyan"
        }
        
        return @{
            Success = $true
            Status = $response.StatusCode
            Data = $response.Content
        }
    } catch {
        $errorMessage = $_.Exception.Message
        if ($_.Exception.Response) {
            $errorMessage = "HTTP $($_.Exception.Response.StatusCode) - $errorMessage"
        }
        
        Write-ColorOutput "❌ $Endpoint - Failed: $errorMessage" "Red"
        return @{
            Success = $false
            Error = $errorMessage
        }
    }
}

function Test-DnsResolution {
    param([string]$Host)
    
    Write-ColorOutput "Testing DNS resolution for $Host..." "Blue"
    
    try {
        $dnsResult = [System.Net.Dns]::GetHostAddresses($Host)
        if ($dnsResult) {
            Write-ColorOutput "✅ DNS: $Host resolves to $($dnsResult[0].IPAddressToString)" "Green"
            return $true
        } else {
            Write-ColorOutput "❌ DNS: Failed to resolve $Host" "Red"
            return $false
        }
    } catch {
        Write-ColorOutput "❌ DNS: Failed to resolve $Host - $($_.Exception.Message)" "Red"
        return $false
    }
}

# Main execution
function Main {
    Write-ColorOutput "🚀 Starting API Connection Tests..." "Bright"
    Write-ColorOutput "📍 Target: $BaseUrl" "Cyan"
    Write-ColorOutput "─" * 50 "Cyan"
    
    # Parse URL
    $uri = [System.Uri]$BaseUrl
    $host = $uri.Host
    $port = if ($uri.Port -eq -1) { if ($uri.Scheme -eq "https") { 443 } else { 80 } } else { $uri.Port }
    
    # Test network connectivity first
    $networkOk = Test-NetworkConnectivity -Host $host -Port $port
    if (-not $networkOk) {
        Write-ColorOutput "Network connectivity failed. Please check:" "Red"
        Write-ColorOutput "1. Your internet connection" "Red"
        Write-ColorOutput "2. The API server is running" "Red"
        Write-ColorOutput "3. The IP address is correct" "Red"
        Write-ColorOutput "4. Firewall settings" "Red"
        return
    }
    
    # Test DNS resolution
    $dnsOk = Test-DnsResolution -Host $host
    if (-not $dnsOk) {
        Write-ColorOutput "⚠️  DNS resolution failed, but continuing with IP-based tests..." "Yellow"
    }
    
    Write-ColorOutput "─" * 50 "Cyan"
    Write-ColorOutput "🧪 Testing API Endpoints..." "Bright"
    
    # Test endpoints
    $endpoints = @('/nurses', '/nurses/1', '/health', '/status')
    $results = @()
    
    foreach ($endpoint in $endpoints) {
        $result = Test-ApiEndpoint -Endpoint $endpoint -BaseUrl $BaseUrl -Timeout $Timeout
        $results += [PSCustomObject]@{
            Endpoint = $endpoint
            Success = $result.Success
            Status = $result.Status
            Error = $result.Error
        }
        Write-ColorOutput "─" * 30 "Cyan"
    }
    
    # Summary
    Write-ColorOutput "─" * 50 "Cyan"
    Write-ColorOutput "📊 Test Summary:" "Bright"
    
    $successful = ($results | Where-Object { $_.Success }).Count
    $total = $results.Count
    
    Write-ColorOutput "Total endpoints tested: $total" "Cyan"
    Write-ColorOutput "Successful: $successful" "Green"
    Write-ColorOutput "Failed: $($total - $successful)" "Red"
    
    if ($successful -eq $total) {
        Write-ColorOutput "🎉 All API endpoints are working correctly!" "Green"
    } elseif ($successful -gt 0) {
        Write-ColorOutput "⚠️  Some endpoints are working, but there are issues." "Yellow"
    } else {
        Write-ColorOutput "💥 All API endpoints failed. Please check your server configuration." "Red"
    }
    
    # Detailed results
    Write-ColorOutput "`n📋 Detailed Results:" "Bright"
    foreach ($result in $results) {
        if ($result.Success) {
            Write-ColorOutput "$($result.Endpoint): OK ($($result.Status))" "Green"
        } else {
            Write-ColorOutput "$($result.Endpoint): FAILED - $($result.Error)" "Red"
        }
    }
}

# Run the script
try {
    Main
} catch {
    Write-ColorOutput "❌ Script execution failed: $($_.Exception.Message)" "Red"
    exit 1
}

