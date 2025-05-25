"use client";

import React from 'react';
import Calendar from '@/components/Calendar/Calendar';
import CalendarFilters from '@/components/Calendar/CalendarFilters';

const CalendarPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1>Calendar</h1>
      <CalendarFilters />
      <Calendar />
    </div>
  );
};

export default CalendarPage;