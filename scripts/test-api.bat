@echo off
echo ========================================
echo    API Connection Test Script
echo ========================================
echo.

echo Testing connection to: http://192.168.43.45:3000/api
echo.

echo [1] Testing basic connectivity...
ping -n 1 192.168.43.45 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Host is reachable
) else (
    echo ❌ Host is not reachable
    echo Please check if the API server is running
    pause
    exit /b 1
)

echo.
echo [2] Testing API endpoints...
echo.

echo Testing /nurses endpoint...
curl -s -o temp_response.txt -w "Status: %%{http_code}, Time: %%{time_total}s\n" "http://192.168.43.45:3000/api/nurses"
if exist temp_response.txt (
    echo Response:
    type temp_response.txt
    del temp_response.txt
) else (
    echo ❌ Failed to get response
)

echo.
echo Testing /nurses/1 endpoint...
curl -s -o temp_response.txt -w "Status: %%{http_code}, Time: %%{time_total}s\n" "http://192.168.43.45:3000/api/nurses/1"
if exist temp_response.txt (
    echo Response:
    type temp_response.txt
    del temp_response.txt
) else (
    echo ❌ Failed to get response
)

echo.
echo ========================================
echo Test completed!
echo ========================================
pause

