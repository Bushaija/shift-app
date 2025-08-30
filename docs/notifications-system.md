# Notification System Documentation

## Overview

The notification system in the Shift App provides a comprehensive way to manage and display various types of notifications to users. It follows the wireframe design specifications and includes professional styling with different priority levels and notification types.

## Features

### 🎯 **Core Functionality**
- **Real-time notifications** with different priority levels
- **Multiple notification types** (urgent, swap approved, schedule updates, etc.)
- **Professional styling** with color-coded categories
- **Expiration handling** for time-sensitive notifications
- **Action required indicators** for notifications needing user attention
- **Mark as read/unread** functionality
- **Filtering and search** capabilities

### 🔔 **Notification Types**

#### High Priority (Urgent)
- **Mandatory Overtime**: Critical staffing needs
- **Break Reminders**: Time-sensitive break notifications
- **Booking Cancellations**: Important status changes

#### Medium Priority
- **Swap Approvals**: Shift swap confirmations
- **Schedule Updates**: New schedule availability
- **Booking Confirmations**: Shift application confirmations
- **Payment Receipts**: Financial notifications

#### Low Priority
- **Application Submissions**: Status updates
- **General Updates**: Non-critical information

### 🎨 **Visual Design**

#### Color Coding
- **🔴 Red**: Urgent notifications (high priority)
- **🟢 Green**: Success/approval notifications
- **🔵 Blue**: Information/schedule notifications
- **🟡 Amber**: Warning/reminder notifications
- **⚫ Gray**: General notifications

#### Styling Features
- **Professional cards** with rounded corners and shadows
- **Priority badges** showing importance level
- **Action required indicators** for urgent items
- **Time ago formatting** (e.g., "2 hours ago")
- **Expiration warnings** for time-sensitive notifications

## Usage

### Basic Implementation

```tsx
import { useNotificationsStore } from '@/stores/notifications-store';

function MyComponent() {
  const { addNotification, notifications } = useNotificationsStore();

  const createNotification = () => {
    addNotification({
      title: 'New Message',
      message: 'You have a new message',
      type: 'general',
      priority: 'medium',
      actionRequired: false
    });
  };

  return (
    // Your component JSX
  );
}
```

### Pre-built Notification Methods

```tsx
const {
  notifyUrgentOvertime,
  notifySwapApproved,
  notifyScheduleUpdated,
  notifyBreakReminder,
  notifyBookingConfirmed,
  notifyPaymentReceived
} = useNotificationsStore();

// Create specific notification types
notifyUrgentOvertime('ICU', '6 PM today');
notifySwapApproved('March 22', 'Sarah M.');
notifyScheduleUpdated();
notifyBreakReminder('30-minute');
notifyBookingConfirmed('Emergency Shift', 'City Hospital');
notifyPaymentReceived(1250);
```

### Notification Management

```tsx
const {
  markAsRead,
  markAllAsRead,
  removeNotification,
  clearAll,
  clearExpired
} = useNotificationsStore();

// Mark individual notification as read
markAsRead('notification-id');

// Mark all notifications as read
markAllAsRead();

// Remove specific notification
removeNotification('notification-id');

// Clear all notifications
clearAll();

// Clear expired notifications
clearExpired();
```

## Components

### NotificationCard
Displays individual notifications with proper styling and actions.

```tsx
import { NotificationCard } from '@/components/features/notifications';

<NotificationCard
  notification={notification}
  onPress={handlePress}
  className="mb-4"
/>
```

### NotificationBadge
Shows unread notification count with urgent indicators.

```tsx
import { NotificationBadge } from '@/components/features/notifications';

<NotificationBadge
  showCount={true}
  size="medium"
  className="absolute top-0 right-0"
/>
```

### NotificationDemo
Interactive component for testing the notification system.

```tsx
import { NotificationDemo } from '@/components/features/notifications';

<NotificationDemo />
```

## Store Structure

### State
```tsx
interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  urgentCount: number;
}
```

### Notification Interface
```tsx
interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  priority: 'high' | 'medium' | 'low';
  isRead: boolean;
  createdAt: string;
  expiresAt?: string;
  data?: any;
  actionRequired?: boolean;
}
```

## Integration Points

### Tab Navigation
The notification system integrates with the main tab navigation, showing unread counts and urgent indicators.

### Home Screen
Includes a demo component for testing notifications and showcasing the system.

### Automatic Cleanup
Expired notifications are automatically cleaned up when components mount.

## Styling

### Tailwind Classes
The system uses Tailwind CSS classes for consistent styling:
- **Colors**: Red, green, blue, amber, gray variants
- **Spacing**: Consistent padding and margins
- **Shadows**: Professional depth and elevation
- **Borders**: Rounded corners and borders
- **Typography**: Proper font weights and sizes

### Responsive Design
- **Mobile-first** approach
- **Touch-friendly** interactions
- **Proper spacing** for mobile devices
- **Accessible** color contrasts

## Best Practices

### 1. **Notification Priority**
- Use high priority sparingly for truly urgent items
- Medium priority for important but not critical updates
- Low priority for informational content

### 2. **Message Content**
- Keep titles concise and actionable
- Provide clear, helpful messages
- Include relevant data when possible

### 3. **User Experience**
- Don't overwhelm users with too many notifications
- Use expiration dates for time-sensitive items
- Provide clear actions when required

### 4. **Performance**
- Limit notification history to reasonable amounts
- Clean up expired notifications regularly
- Use efficient filtering and search

## Testing

### Demo Mode
The system includes a demo mode that automatically creates sample notifications:
- Navigate to the Home tab to see the demo component
- Use the demo buttons to test different notification types
- Check the Notifications tab to see notifications in action

### Manual Testing
```tsx
// Test individual notification types
notifyUrgentOvertime('Test Department', 'Now');

// Test bulk operations
clearAll();
markAllAsRead();
```

## Future Enhancements

### Planned Features
- **Push notifications** integration
- **Email notifications** for critical updates
- **Notification preferences** and settings
- **Advanced filtering** and search
- **Notification templates** for common types
- **Analytics** and notification metrics

### Customization Options
- **User-defined** notification types
- **Custom styling** and themes
- **Notification scheduling** and timing
- **Integration** with external systems

## Troubleshooting

### Common Issues

#### Notifications Not Appearing
- Check if the store is properly initialized
- Verify notification creation methods are called
- Ensure components are properly subscribed to store changes

#### Styling Issues
- Verify Tailwind classes are properly applied
- Check for conflicting CSS styles
- Ensure proper component imports

#### Performance Issues
- Limit notification history size
- Use efficient filtering methods
- Implement proper cleanup strategies

## Support

For questions or issues with the notification system:
1. Check this documentation
2. Review the component examples
3. Test with the demo components
4. Check the store implementation
5. Review the wireframe specifications

---

*This notification system is designed to provide a professional, user-friendly experience that follows modern design principles and best practices.*
