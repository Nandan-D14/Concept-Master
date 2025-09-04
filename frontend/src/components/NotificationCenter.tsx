import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import NotificationItem from './NotificationItem';
import { notificationMockData, Notification } from '../data/dummyData'; // Import Notification interface

interface NotificationCenterProps {
  // No props needed for now, as notifications will be mocked internally
}


const NotificationCenter: React.FC<NotificationCenterProps> = () => {
  return (
    <Card className="w-80 max-h-[400px] overflow-y-auto shadow-lg">
      <CardHeader className="p-4 border-b">
        <CardTitle className="text-lg">Notifications</CardTitle>
      </CardHeader>
      <CardContent className="p-2 space-y-2">
        {notificationMockData.length > 0 ? (
          notificationMockData.map((notification: Notification) => ( // Explicitly type notification
            <NotificationItem
              key={notification.id}
              message={notification.message}
              type={notification.type as any} // Type assertion for now
              timestamp={notification.timestamp}
            />
          ))
        ) : (
          <p className="text-center text-muted-foreground p-4">No new notifications.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationCenter;
