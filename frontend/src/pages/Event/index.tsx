import React from 'react';
import EventList from './components/EventList';

const EventPage: React.FC = () => {
  return (
    <div className="h-full overflow-y-auto">
      <EventList />
    </div>
  );
};

export default EventPage;
