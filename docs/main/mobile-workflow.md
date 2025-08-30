# Mobile App Workflows - API Endpoints & Custom Hooks

## Overview
This document maps each mobile app workflow to specific API endpoints and suggests custom React Native hooks for efficient data management and state handling.

---

# 📱 MOBILE APP WORKFLOWS WITH API ENDPOINTS & HOOKS

## 1. Daily Login & Dashboard Access

### API Endpoints
```typescript
// Authentication
POST /auth/login
POST /auth/refresh
POST /auth/logout

// Dashboard Data
GET /notifications?unread_only=true&limit=10
GET /shifts?nurse_id={nurse_id}&start_date=today&end_date=+7days
GET /nurses/{nurse_id}
```

### Custom Hooks
```typescript
// Authentication Management
useAuth()
  - login(credentials)
  - logout()
  - refreshToken()
  - isAuthenticated
  - user
  - loading

// Dashboard Data
useDashboard(nurseId)
  - todayShifts
  - upcomingShifts
  - urgentNotifications
  - nurseProfile
  - loading
  - refresh()

// Notifications
useNotifications()
  - notifications
  - unreadCount
  - markAsRead(notificationId)
  - markAllAsRead()
  - refresh()
```

### Implementation Example
```typescript
const DashboardScreen = () => {
  const { user, isAuthenticated } = useAuth();
  const { todayShifts, urgentNotifications, loading } = useDashboard(user.worker_id);
  const { unreadCount } = useNotifications();

  // Component logic
};
```

---

## 2. Shift Clock-in Process

### API Endpoints
```typescript
// Location & Verification
// (Custom geolocation logic - no API endpoint needed)

// Fatigue Assessment
POST /nurses/{nurse_id}/fatigue
GET /nurses/{nurse_id}/fatigue?days=1

// Clock-in
POST /attendance/clock-in
GET /shifts?nurse_id={nurse_id}&start_date=today&status=scheduled
```

### Custom Hooks
```typescript
// Fatigue Assessment
useFatigueAssessment(nurseId)
  - submitAssessment(assessmentData)
  - latestAssessment
  - fatigueHistory
  - loading
  - submitLoading

// Clock-in Management
useClockIn()
  - clockIn(assignmentId, locationData, notes)
  - getCurrentLocation()
  - validateLocation(coordinates)
  - loading
  - error

// Shift Status
useCurrentShift(nurseId)
  - currentShift
  - nextShift
  - canClockIn
  - clockInStatus
  - refresh()

// Location Services
useLocationServices()
  - getCurrentPosition()
  - watchPosition()
  - isLocationEnabled
  - requestPermissions()
```

### Implementation Example
```typescript
const ClockInScreen = () => {
  const { user } = useAuth();
  const { currentShift, canClockIn } = useCurrentShift(user.worker_id);
  const { clockIn, loading } = useClockIn();
  const { submitAssessment } = useFatigueAssessment(user.worker_id);
  const { getCurrentPosition } = useLocationServices();

  const handleClockIn = async () => {
    const location = await getCurrentPosition();
    await submitAssessment(fatigueData);
    await clockIn(currentShift.assignment_id, location, notes);
  };
};
```

---

## 3. During Shift Activities

### API Endpoints
```typescript
// Real-time Updates
GET /notifications?category=shift_update&category=emergency
GET /shifts/{shift_id}
PUT /attendance/{record_id} // Update break times, patient counts

// Emergency Responses
POST /notifications // Response to emergency calls
GET /shifts?department_id={dept_id}&status=understaffed&urgent=true
```

### Custom Hooks
```typescript
// Real-time Shift Updates
useShiftUpdates(shiftId)
  - shiftDetails
  - patientAssignments
  - colleagues
  - updatePatientCount(count)
  - recordIncident(incidentData)
  - loading

// Break Management
useBreakManagement(attendanceRecordId)
  - startBreak()
  - endBreak()
  - currentBreakStatus
  - totalBreakTime
  - requestCoverage(colleagueId)

// Emergency Notifications
useEmergencyNotifications()
  - emergencyAlerts
  - respondToEmergency(alertId, response)
  - isOnCall
  - subscribe() // WebSocket connection
  - unsubscribe()

// Real-time Messaging
useRealTimeNotifications()
  - connect()
  - disconnect()
  - notifications
  - subscribe(categories)
```

### Implementation Example
```typescript
const ActiveShiftScreen = () => {
  const { currentShift } = useCurrentShift(user.worker_id);
  const { shiftDetails, updatePatientCount } = useShiftUpdates(currentShift.shift_id);
  const { startBreak, currentBreakStatus } = useBreakManagement(currentShift.record_id);
  const { emergencyAlerts, respondToEmergency } = useEmergencyNotifications();

  useEffect(() => {
    const unsubscribe = useRealTimeNotifications().connect();
    return unsubscribe;
  }, []);
};
```

---

## 4. Shift Completion & Clock-out

### API Endpoints
```typescript
// Pre-clock-out Data
GET /attendance/{record_id}
GET /shifts/{shift_id}/assignments

// Clock-out
POST /attendance/clock-out
PUT /shifts/{shift_id} // Update shift notes if needed
```

### Custom Hooks
```typescript
// Clock-out Process
useClockOut()
  - clockOut(assignmentId, shiftSummary)
  - validateClockOut(assignmentId)
  - loading
  - error

// Shift Summary
useShiftSummary(shiftId)
  - generateSummary()
  - submitSummary(summaryData)
  - requiredFields
  - validation

// Post-shift Data
useShiftCompletion(recordId)
  - shiftHours
  - overtimeMinutes
  - complianceStatus
  - violations
  - refresh()
```

### Implementation Example
```typescript
const ClockOutScreen = () => {
  const { currentShift } = useCurrentShift(user.worker_id);
  const { clockOut, loading } = useClockOut();
  const { submitSummary } = useShiftSummary(currentShift.shift_id);
  const { shiftHours, violations } = useShiftCompletion(currentShift.record_id);

  const handleClockOut = async () => {
    await submitSummary(summaryData);
    await clockOut(currentShift.assignment_id, shiftSummaryData);
  };
};
```

---

## 5. Schedule Management

### API Endpoints
```typescript
// Schedule Viewing
GET /shifts?nurse_id={nurse_id}&start_date={date}&end_date={date}
GET /shifts?department_id={dept_id}&status=open&nurse_id!=assigned

// Availability Updates
GET /nurses/{nurse_id}/availability
PUT /nurses/{nurse_id}/availability

// Overtime Opportunities
GET /shifts?status=open&overtime=true&department_id={dept_id}
POST /shifts/{shift_id}/assignments // Accept overtime
```

### Custom Hooks
```typescript
// Schedule Overview
useSchedule(nurseId, dateRange)
  - shifts
  - weeklyHours
  - upcomingShifts
  - conflicts
  - refresh()
  - loading

// Availability Management
useAvailability(nurseId)
  - availability
  - updateAvailability(availabilityData)
  - preferences
  - updatePreferences(preferences)
  - loading

// Overtime Opportunities
useOvertimeOpportunities(nurseId)
  - availableShifts
  - eligibleShifts
  - acceptShift(shiftId)
  - estimatedEarnings(shiftId)
  - refresh()

// Schedule Calendar
useScheduleCalendar(nurseId, month, year)
  - calendarData
  - navigateMonth(direction)
  - getDayShifts(date)
  - currentMonth
  - currentYear
```

### Implementation Example
```typescript
const ScheduleScreen = () => {
  const { user } = useAuth();
  const { shifts, weeklyHours } = useSchedule(user.worker_id, currentWeek);
  const { availability, updateAvailability } = useAvailability(user.worker_id);
  const { availableShifts, acceptShift } = useOvertimeOpportunities(user.worker_id);

  const handleAvailabilityChange = (newAvailability) => {
    updateAvailability(newAvailability);
  };
};
```

---

## 6. Shift Swapping Process

### API Endpoints
```typescript
// Swap Opportunities
GET /swap-requests/opportunities?nurse_id={nurse_id}
GET /swap-requests?nurse_id={nurse_id}&status=pending

// Swap Management
POST /swap-requests
POST /swap-requests/{swap_id}/accept
PUT /swap-requests/{swap_id} // Cancel or modify
DELETE /swap-requests/{swap_id}
```

### Custom Hooks
```typescript
// Swap Opportunities
useSwapOpportunities(nurseId)
  - opportunities
  - compatibilityScores
  - filterByDate(dateRange)
  - filterByShiftType(shiftType)
  - refresh()

// Swap Requests Management
useSwapRequests(nurseId)
  - incomingRequests
  - outgoingRequests
  - createSwapRequest(swapData)
  - acceptSwap(swapId)
  - declineSwap(swapId, reason)
  - cancelSwap(swapId)

// Swap Creation
useSwapCreation()
  - eligibleShifts
  - targetNurses
  - createSwap(originalShiftId, targetNurseId, requestedShiftId)
  - validateSwap(swapData)
  - loading
```

### Implementation Example
```typescript
const SwapScreen = () => {
  const { user } = useAuth();
  const { opportunities } = useSwapOpportunities(user.worker_id);
  const { incomingRequests, acceptSwap, declineSwap } = useSwapRequests(user.worker_id);
  const { createSwap, validateSwap } = useSwapCreation();

  const handleAcceptSwap = async (swapId) => {
    await acceptSwap(swapId);
    // Handle success/error
  };
};
```

---

## 7. Time Off Management

### API Endpoints
```typescript
// Time Off Requests
GET /time-off-requests?nurse_id={nurse_id}
POST /time-off-requests
PUT /time-off-requests/{request_id}
DELETE /time-off-requests/{request_id}

// Request Status
GET /time-off-requests/{request_id}
```

### Custom Hooks
```typescript
// Time Off Management
useTimeOffRequests(nurseId)
  - requests
  - pendingRequests
  - approvedRequests
  - submitRequest(requestData)
  - cancelRequest(requestId)
  - updateRequest(requestId, updates)
  - loading

// Time Off Creation
useTimeOffCreation()
  - validateDates(startDate, endDate)
  - checkConflicts(dateRange)
  - estimatePayImpact(requestData)
  - submitRequest(requestData)
  - loading

// Time Off Calendar
useTimeOffCalendar(nurseId)
  - approvedTimeOff
  - pendingTimeOff
  - getTimeOffForDate(date)
  - getMonthlyTimeOff(month, year)
```

### Implementation Example
```typescript
const TimeOffScreen = () => {
  const { user } = useAuth();
  const { requests, submitRequest } = useTimeOffRequests(user.worker_id);
  const { validateDates, checkConflicts } = useTimeOffCreation();

  const handleSubmitRequest = async (requestData) => {
    const isValid = validateDates(requestData.startDate, requestData.endDate);
    const conflicts = await checkConflicts(requestData.dateRange);
    
    if (isValid && !conflicts.length) {
      await submitRequest(requestData);
    }
  };
};
```

---

## 8. Communication & Notifications

### API Endpoints
```typescript
// Notifications
GET /notifications?limit=50
POST /notifications/{notification_id}/read
POST /notifications/mark-all-read

// Broadcast Messages
GET /notifications?category=broadcast&priority=urgent
```

### Custom Hooks
```typescript
// Notification Management
useNotifications()
  - notifications
  - unreadCount
  - markAsRead(notificationId)
  - markAllAsRead()
  - deleteNotification(notificationId)
  - filterByCategory(category)
  - filterByPriority(priority)

// Push Notifications
usePushNotifications()
  - registerDevice(deviceToken)
  - updateNotificationSettings(settings)
  - handleNotificationReceived(notification)
  - requestPermissions()

// Real-time Communication
useRealTimeCommunication()
  - connect()
  - disconnect()
  - sendMessage(recipientId, message)
  - subscribeToChannel(channelId)
  - onMessageReceived(callback)
```

### Implementation Example
```typescript
const NotificationsScreen = () => {
  const { notifications, markAsRead, unreadCount } = useNotifications();
  const { registerDevice } = usePushNotifications();

  useEffect(() => {
    registerDevice(deviceToken);
  }, []);

  const handleNotificationPress = (notification) => {
    if (!notification.is_read) {
      markAsRead(notification.notification_id);
    }
    // Navigate to relevant screen
  };
};
```

---

# 🛠️ UTILITY HOOKS

## Data Management & Caching
```typescript
// API State Management
useApiState()
  - loading
  - error
  - data
  - refetch()
  - setData(newData)

// Cache Management
useCache(key, ttl)
  - cachedData
  - setCachedData(data)
  - clearCache()
  - isExpired

// Offline Support
useOfflineSync()
  - isOnline
  - queuedOperations
  - syncWhenOnline()
  - addToQueue(operation)
```

## Device & Platform
```typescript
// Device Capabilities
useDeviceInfo()
  - deviceId
  - platform
  - version
  - isTablet
  - screenDimensions

// Biometric Authentication
useBiometrics()
  - isAvailable
  - authenticate()
  - supportedTypes
  - saveCredentials()
```

## Performance & UX
```typescript
// Loading States
useLoadingStates()
  - globalLoading
  - setLoading(key, isLoading)
  - isLoading(key)

// Error Handling
useErrorHandling()
  - showError(error)
  - clearError()
  - handleApiError(error)
  - retryOperation(operation)
```

---

# 📊 HOOK ARCHITECTURE PATTERNS

## 1. Composition Pattern
```typescript
// Combine related hooks
const useShiftManagement = (nurseId) => {
  const schedule = useSchedule(nurseId);
  const clockIn = useClockIn();
  const clockOut = useClockOut();
  const currentShift = useCurrentShift(nurseId);

  return {
    ...schedule,
    ...clockIn,
    ...clockOut,
    currentShift: currentShift.currentShift,
    // Combined operations
    completeShiftCycle: async (shiftData) => {
      await clockIn.clockIn(shiftData);
      // ... shift activities
      await clockOut.clockOut(shiftData);
    }
  };
};
```

## 2. Provider Pattern for Global State
```typescript
// App-wide state management
const AppStateProvider = ({ children }) => {
  const auth = useAuth();
  const notifications = useNotifications();
  const realTime = useRealTimeCommunication();

  return (
    <AppStateContext.Provider value={{ auth, notifications, realTime }}>
      {children}
    </AppStateContext.Provider>
  );
};
```

## 3. Conditional Hook Loading
```typescript
// Load hooks based on user state
const useDynamicHooks = () => {
  const { user, isAuthenticated } = useAuth();
  
  const dashboardData = useDashboard(isAuthenticated ? user.worker_id : null);
  const notifications = useNotifications(isAuthenticated);
  
  return { dashboardData, notifications };
};
```

---

*This document provides a comprehensive mapping of mobile app workflows to specific API endpoints and custom hooks, enabling efficient development of the React Native mobile application.*