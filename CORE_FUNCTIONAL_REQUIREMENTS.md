# Healthcare Staffing App - Core Functional Requirements

## Overview

The Healthcare Staffing App is a mobile application designed to connect healthcare professionals (nurses, CNAs, LPNs, RNs) with healthcare facilities that need temporary staffing. The app serves as a marketplace where healthcare workers can browse, apply for, and manage shifts while facilities can post staffing requirements and manage bookings.

## Core Functional Requirements

### 1. User Management & Authentication

#### 1.1 Healthcare Professional Registration & Profiles
- **User Registration**: Healthcare professionals can create accounts with email, password, and basic information
- **Profile Management**: Users can maintain detailed profiles including:
  - Personal information (name, email, phone)
  - Professional credentials (license type, license number)
  - Specialties and certifications
  - Hourly rate preferences
  - Work experience and qualifications
- **License Types Supported**: RN (Registered Nurse), LPN (Licensed Practical Nurse), CNA (Certified Nursing Assistant)
- **Profile Verification**: System tracks profile completion and verification status

#### 1.2 Authentication System
- **Sign In/Sign Out**: Secure authentication with email and password
- **Password Recovery**: Forgot password functionality with email reset
- **Session Management**: Persistent login sessions with token-based authentication
- **Profile Status**: Active/inactive user status management

### 2. Shift Management System

#### 2.1 Shift Discovery & Search
- **Available Shifts**: Healthcare professionals can browse available shifts
- **Advanced Filtering**: Search by:
  - License type requirements (RN, LPN, CNA)
  - Department (Emergency, ICU, Medical Surgical, etc.)
  - Distance from current location
  - Date range
  - Urgency status
  - Hourly rate range
- **Search Functionality**: Text-based search across shift titles, facility names, and departments
- **Geolocation**: Distance-based filtering using user location

#### 2.2 Shift Details & Information
- **Comprehensive Shift Information**:
  - Job title and description
  - Facility name and location
  - Department and license requirements
  - Shift date, start time, and end time
  - Hourly rate and total compensation
  - Urgency indicators
  - Required certifications and experience
- **Facility Information**: Details about the healthcare facility posting the shift
- **Compensation Breakdown**: Hourly rate, total hours, and total pay calculation

#### 2.3 Shift Application Process
- **Apply for Shifts**: Healthcare professionals can apply for available shifts
- **Application Status Tracking**: Real-time status updates (pending, confirmed, completed, cancelled)
- **Application Confirmation**: System confirms successful applications with notifications
- **Application Limits**: Prevents duplicate applications for the same shift

### 3. Booking & Schedule Management

#### 3.1 Personal Schedule Management
- **My Bookings**: Healthcare professionals can view all their shift bookings
- **Schedule Organization**: Bookings categorized by status:
  - **Upcoming**: Confirmed shifts in the future
  - **Ongoing**: Currently active shifts
  - **Past**: Completed shifts
- **Booking Details**: Complete information about each booked shift
- **Schedule Calendar**: Visual calendar representation of booked shifts

#### 3.2 Booking Actions
- **Cancel Bookings**: Ability to cancel upcoming shifts with confirmation
- **Booking Status Updates**: Real-time status changes (pending → confirmed → completed)
- **Booking History**: Complete record of all past bookings and their outcomes

### 4. Payment & Financial Management

#### 4.1 Earnings Tracking
- **Total Earnings**: Calculation of total earnings from completed shifts
- **Earnings Breakdown**: Per-shift earnings with hourly rate and hours worked
- **Payment Status**: Tracking of payment status (pending, paid, failed)
- **Earnings Summary**: Monthly/weekly earnings summaries

#### 4.2 Payment Processing
- **Payment Methods**: Support for multiple payment methods
- **Payment Tracking**: Real-time payment status updates
- **Transaction History**: Complete payment transaction records
- **Payment Notifications**: Alerts for payment confirmations and issues

### 5. Facility Management

#### 5.1 Healthcare Facility Profiles
- **Facility Information**: Complete facility details including:
  - Facility name and type (Hospital, Nursing Home, Clinic)
  - Address and contact information
  - Facility specialties and departments
  - Operating hours and capacity
- **Facility Status**: Active/inactive facility status management

#### 5.2 Shift Posting & Management
- **Shift Creation**: Facilities can create and post new shifts
- **Shift Requirements**: Detailed job requirements and qualifications
- **Urgency Indicators**: Mark shifts as urgent when immediate staffing is needed
- **Shift Modifications**: Update shift details and requirements
- **Shift Cancellation**: Cancel posted shifts with appropriate notifications

### 6. Notification System

#### 6.1 Real-time Notifications
- **Application Status**: Notifications for booking confirmations, cancellations, and updates
- **Payment Notifications**: Alerts for payment confirmations and issues
- **Urgent Shift Alerts**: Notifications for urgent staffing needs
- **System Updates**: Important app updates and announcements

#### 6.2 Notification Preferences
- **Customizable Settings**: Users can configure notification preferences
- **Notification Types**: Different notification categories (bookings, payments, system)
- **Push Notifications**: Real-time push notifications for critical updates

### 7. Data Management & Storage

#### 7.1 Local-First Architecture
- **Offline Capability**: App functions without internet connection
- **Local Database**: SQLite database for local data storage
- **Data Synchronization**: Sync with remote server when connection is available
- **Data Persistence**: Persistent storage of user data and preferences

#### 7.2 Data Models
- **Users**: Healthcare professional profiles and credentials
- **Facilities**: Healthcare facility information and details
- **Shifts**: Available shift postings with requirements
- **Bookings**: User shift applications and status tracking
- **Payments**: Financial transactions and payment records

### 8. Security & Privacy

#### 8.1 Data Security
- **Secure Authentication**: Token-based authentication with secure storage
- **Data Encryption**: Sensitive data encryption in transit and at rest
- **Privacy Protection**: Compliance with healthcare data privacy regulations
- **Access Control**: Role-based access to different app features

#### 8.2 User Privacy
- **Profile Privacy**: Control over profile visibility and information sharing
- **Location Privacy**: Optional location sharing for distance-based searches
- **Data Retention**: Clear policies on data retention and deletion

## Technical Architecture

### 8.3 Technology Stack
- **Frontend**: React Native with Expo
- **Database**: SQLite with Drizzle ORM
- **State Management**: Zustand for client-side state
- **Authentication**: JWT-based authentication
- **Storage**: Local-first with remote sync capabilities
- **UI Framework**: NativeWind (Tailwind CSS for React Native)

### 8.4 API Integration Points
- **Authentication APIs**: User registration, login, password reset
- **Shift Management APIs**: CRUD operations for shifts and bookings
- **Payment APIs**: Payment processing and transaction management
- **Notification APIs**: Push notification delivery and management
- **Profile Management APIs**: User profile updates and verification

## Admin Portal Integration Requirements

### 9.1 Admin Dashboard Features
- **User Management**: View and manage healthcare professional accounts
- **Facility Management**: Oversee healthcare facility registrations and profiles
- **Shift Oversight**: Monitor shift postings and applications
- **Payment Administration**: Manage payment processing and disputes
- **Analytics & Reporting**: Generate reports on app usage and performance

### 9.2 Data Synchronization
- **Real-time Updates**: Admin portal should reflect real-time changes from the mobile app
- **Bidirectional Sync**: Changes in admin portal should update mobile app data
- **Conflict Resolution**: Handle data conflicts between admin portal and mobile app
- **Audit Trail**: Track all changes made through admin portal

### 9.3 Admin Portal API Requirements
- **User Management APIs**: CRUD operations for user accounts
- **Facility Management APIs**: Healthcare facility administration
- **Shift Administration APIs**: Oversight of shift postings and applications
- **Payment Administration APIs**: Payment processing and financial management
- **Analytics APIs**: Data aggregation and reporting endpoints

## Business Rules & Constraints

### 10.1 Application Rules
- Users can only apply for shifts matching their license type
- Users cannot apply for the same shift multiple times
- Shift applications require confirmation from facilities
- Cancellation policies apply based on shift timing

### 10.2 Payment Rules
- Payments are processed after shift completion
- Payment amounts are calculated based on actual hours worked
- Payment disputes require admin intervention
- Payment methods must be verified before processing

### 10.3 Data Validation
- License numbers must be verified against official databases
- Facility information must be validated before approval
- Shift requirements must be clearly defined and validated
- Payment information must be securely validated

## Success Metrics

### 11.1 User Engagement
- Number of active users per month
- Shift application completion rate
- User retention rates
- Profile completion rates

### 11.2 Business Performance
- Total shifts filled successfully
- Average time to fill urgent shifts
- Payment processing success rate
- User satisfaction scores

### 11.3 System Performance
- App response times
- Data synchronization success rate
- Offline functionality reliability
- Security incident rates

This document provides a comprehensive overview of the core functional requirements for the Healthcare Staffing App, serving as a foundation for successful integration with the admin portal developed in Next.js.
