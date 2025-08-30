# Healthcare Staffing App - Project Structure

## 📁 Root Structure
```
healthcare-staffing-app/
├── app/                          # Expo Router app directory
├── components/                   # Reusable UI components
├── lib/                         # Utilities, constants, helpers
├── hooks/                       # Custom React hooks
├── services/                    # API services, external integrations
├── stores/                      # State management (Zustand)
├── types/                       # TypeScript type definitions
├── assets/                      # Images, fonts, static files
├── docs/                        # Documentation
└── config/                      # Configuration files
```

## 📱 App Directory (Expo Router)
```
app/
├── _layout.tsx                  # Root layout with providers
├── index.tsx                    # Entry point (redirect to onboarding)
├── onboarding.tsx               # Onboarding flow (3 screens)
├── auth/                        # Authentication screens
│   ├── signin.tsx
│   ├── signup.tsx
│   └── forgot-password.tsx
├── (tabs)/                      # Main app tabs
│   ├── _layout.tsx              # Bottom tab navigation
│   ├── index.tsx                # Home/Dashboard screen
│   ├── shifts/                  # Shifts management
│   │   ├── index.tsx            # Shifts listing with filters
│   │   ├── filters.tsx          # Filters screen
│   │   └── [id].tsx             # Job details screen
│   ├── schedule/                # Schedule management
│   │   ├── index.tsx            # Schedule screen (All/Upcoming/Ongoing/Past)
│   │   └── [id].tsx             # Schedule details
│   └── profile/                 # User profile
│       ├── index.tsx            # Profile overview
│       ├── edit.tsx             # Edit profile
│       └── settings.tsx         # App settings
├── wallet/                      # Wallet/Payments
│   ├── index.tsx                # Wallet screen with earnings
│   └── [id].tsx                 # Payment details
├── modals/                      # Modal screens
│   ├── shift-booking.tsx
│   └── payment-details.tsx
└── +not-found.tsx               # 404 page
```

## 🧩 Components Directory
```
components/
├── ui/                          # Base UI components
│   ├── index.ts                 # Export all UI components
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   ├── text.tsx
│   ├── modal.tsx
│   ├── loading.tsx
│   ├── badge.tsx                # Status badges (Scheduled, Requested, etc.)
│   ├── chip.tsx                 # Filter chips (RN, CNA, etc.)
│   ├── avatar.tsx               # User avatars
│   ├── icon.tsx                 # Icon wrapper
│   └── ...                      # Other base components
├── forms/                       # Form components
│   ├── shift-search-form.tsx
│   ├── profile-form.tsx
│   ├── booking-form.tsx
│   └── filter-form.tsx          # Filters form
├── layout/                      # Layout components
│   ├── header.tsx               # Screen headers
│   ├── footer.tsx
│   ├── status-bar.tsx           # Status bar wrapper
│   └── navigation.tsx
├── features/                    # Feature-specific components
│   ├── home/
│   │   ├── greeting-header.tsx  # "Good Morning, Brooklyn Simmons"
│   │   ├── shift-summary-card.tsx # Scheduled/Worked/Cancelled shifts
│   │   ├── shifts-worked-chart.tsx # Bar chart component
│   │   └── wallet-summary.tsx   # Total Earnings/Processing cards
│   ├── shifts/
│   │   ├── shift-card.tsx       # Individual shift listing card
│   │   ├── shift-list.tsx       # List of shifts
│   │   ├── shift-filters.tsx    # Filter components
│   │   ├── location-display.tsx # Location and shift count
│   │   └── shift-status-badge.tsx # Status indicators
│   ├── schedule/
│   │   ├── schedule-tabs.tsx    # All/Upcoming/Ongoing/Past tabs
│   │   ├── schedule-card.tsx    # Scheduled shift card
│   │   └── schedule-list.tsx    # List of scheduled shifts
│   ├── job/
│   │   ├── job-details-header.tsx # Job title, license, pay info
│   │   ├── job-description.tsx  # Job description text
│   │   ├── job-responsibilities.tsx # Bulleted responsibilities
│   │   └── job-actions.tsx      # Apply/Book buttons
│   ├── wallet/
│   │   ├── earnings-summary.tsx # Total Earnings/Processing cards
│   │   ├── account-details.tsx  # Account info with edit
│   │   ├── payment-activity.tsx # Payment history list
│   │   └── payment-item.tsx     # Individual payment item
│   └── profile/
│       ├── profile-header.tsx
│       └── profile-stats.tsx
└── onboarding/                  # Onboarding components
    ├── onboarding-card.tsx      # Onboarding screen layout
    ├── pagination-dots.tsx      # Step indicators
    └── onboarding-navigation.tsx # Skip/Next/Get Started buttons
```

## 🔧 Services Directory
```
services/
├── api/                         # API services
│   ├── client.ts                # API client setup
│   ├── auth.ts                  # Authentication API
│   ├── shifts.ts                # Shifts API
│   ├── profile.ts               # Profile API
│   ├── payments.ts              # Payments API
│   └── wallet.ts                # Wallet API
├── storage/                     # Local storage
│   ├── async-storage.ts
│   └── secure-storage.ts
├── notifications/               # Push notifications
│   ├── push-notifications.ts
│   └── notification-handlers.ts
└── external/                    # External integrations
    ├── payment-gateway.ts
    ├── maps.ts
    ├── calendar.ts
    └── location.ts              # Location services
```

## 🎯 Stores Directory (Zustand)
```
stores/
├── auth-store.ts                # Authentication state
├── shifts-store.ts              # Shifts state
├── schedule-store.ts            # Schedule state
├── profile-store.ts             # User profile state
├── payments-store.ts            # Payments state
├── wallet-store.ts              # Wallet state
├── notifications-store.ts       # Notifications state
├── filters-store.ts             # Filter state
└── index.ts                     # Export all stores
```

## 📋 Types Directory
```
types/
├── api.ts                       # API response types
├── auth.ts                      # Authentication types
├── shifts.ts                    # Shift-related types
├── schedule.ts                  # Schedule types
├── profile.ts                   # Profile types
├── payments.ts                  # Payment types
├── wallet.ts                    # Wallet types
├── filters.ts                   # Filter types
├── navigation.ts                # Navigation types
└── common.ts                    # Common types
```

## 🛠️ Lib Directory
```
lib/
├── utils.ts                     # Utility functions
├── constants.ts                 # App constants
├── validation.ts                # Form validation schemas
├── date-helpers.ts              # Date manipulation
├── currency-helpers.ts          # Currency formatting
├── location-helpers.ts          # Location utilities
├── permissions.ts               # App permissions
├── charts.ts                    # Chart utilities
└── status-helpers.ts            # Status badge helpers
```

## 🎨 Assets Directory
```
assets/
├── images/                      # App images
│   ├── onboarding/              # Onboarding illustrations
│   │   ├── nurse-stethoscope.png
│   │   ├── nurse-tablet.png
│   │   └── nurse-smartphone.png
│   ├── icons/                   # App icons
│   │   ├── medical-cross.svg
│   │   ├── star.svg
│   │   ├── bell.svg
│   │   ├── filter.svg
│   │   ├── share.svg
│   │   ├── calendar.svg
│   │   ├── location.svg
│   │   └── edit.svg
│   ├── backgrounds/             # Background images
│   └── placeholders/            # Placeholder images
├── fonts/                       # Custom fonts
├── animations/                  # Lottie animations
└── sounds/                      # App sounds
```

## 📚 Features by Module

### 🔐 Authentication Module
- User registration/login
- Password reset
- Email verification
- Biometric authentication
- Session management

### 🏠 Home/Dashboard Module
- Greeting with user name
- Shift summary cards (Scheduled, Worked, Cancelled)
- Shifts worked chart with monthly data
- Wallet summary (Total Earnings, Processing)
- Quick access to key features

### 📅 Shifts Module
- Browse available shifts with location info
- Advanced filtering (distance, license, job type, day)
- Shift cards with detailed information
- Distance and location display
- Favorite/bookmark shifts
- Search functionality

### 📋 Schedule Module
- Tab navigation (All, Upcoming, Ongoing, Past)
- Scheduled shifts list
- Shift status indicators
- Requested shifts tracking
- Schedule management

### 💼 Job Details Module
- Detailed job information
- Pay rate and estimated earnings
- Job description and responsibilities
- License requirements
- Application/booking actions

### 💰 Wallet Module
- Earnings summary (Total, Processing)
- Account details management
- Payment activity history
- Payment status tracking
- Transaction details

### 👤 Profile Module
- User profile management
- Professional credentials
- Availability calendar
- Work preferences
- Document uploads
- Skills and certifications

### 🔔 Notifications Module
- Push notifications
- In-app notifications
- Email notifications
- Notification preferences
- Notification history

## 🚀 Development Workflow

### Phase 1: Foundation & Onboarding
1. Project setup and structure
2. Onboarding flow (3 screens)
3. Basic navigation setup
4. Core UI components

### Phase 2: Core Features
1. Home/Dashboard screen
2. Shifts browsing and filtering
3. Job details and booking
4. Schedule management
5. Basic profile setup

### Phase 3: Advanced Features
1. Wallet and payments
2. Advanced filtering
3. Calendar integration
4. Document management
5. Notifications system

### Phase 4: Polish & Testing
1. Performance optimization
2. UI/UX improvements
3. Testing and bug fixes
4. App store preparation

## 📱 Key Technologies
- **Framework**: Expo with React Native
- **Navigation**: Expo Router
- **State Management**: Zustand
- **UI**: NativeWind (Tailwind CSS)
- **Forms**: React Hook Form + Zod
- **API**: TanStack Query
- **Storage**: AsyncStorage + SecureStore
- **Notifications**: Expo Notifications
- **Payments**: Stripe integration
- **Maps**: React Native Maps
- **Calendar**: React Native Calendar Events
- **Charts**: React Native Chart Kit
- **Icons**: Lucide React Native

## 🎯 Benefits of This Structure
- **Scalable**: Easy to add new features
- **Maintainable**: Clear separation of concerns
- **Reusable**: Components can be shared
- **Type-safe**: Full TypeScript support
- **Testable**: Easy to write unit tests
- **Performance**: Optimized for mobile
- **Developer Experience**: Clear file organization
- **Design System**: Consistent UI components


mobile-app/
├── images/                      # App images
│   ├── onboarding/              # Onboarding illustrations
│   │   ├── nurse-stethoscope.png
│   │   ├── nurse-tablet.png
│   │   └── nurse-smartphone.png
│   ├── icons/                   # App icons
│   │   ├── medical-cross.svg
│   │   ├── star.svg
│   │   ├── bell.svg
│   │   ├── filter.svg
│   │   ├── share.svg
│   │   ├── calendar.svg
│   │   ├── location.svg
│   │   └── edit.svg
│   ├── backgrounds/             # Background images
│   └── placeholders/            # Placeholder images
├── fonts/                       # Custom fonts
├── animations/                  # Lottie animations
└── sounds/                      # App sounds

shifts-app
├──web-app/                     # Next.js app
|   ├── app/
|   │   ├── api/
|   │   │   ├── [[..route]]
|   │   │   |   ├── lib/
|   │   │   |   ├── middlewares/
|   │   │   |   └── routes/
|   |   │   |       ├── attendance/
|   |   │   |       |    ├── attendance.handlers.ts
|   |   │   |       |    ├── attendace.index.ts
|   |   │   |       |    ├── attendace.routes.ts
|   |   │   |       |    └── attendace.types.ts
|   |   │   |       ├── .../
|   |   │   |       └── index.ts
|   │   │   └── app.ts
|   │   │   └── routes.ts
|   └── lib/
|       └──  hono.ts                 # API Client
|
├──mobile-app/                      # react-native app
|   ├── app/
|   ├── assets/
|   ├── hooks/
|   ├── lib/
|   ├── services/
|   └── stores/
...


