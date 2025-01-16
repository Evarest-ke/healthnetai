import React from 'react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';

export default function AppointmentCalendar() {
  const events = [
    {
      title: 'Patient: John Doe',
      start: '2024-03-20T10:00:00',
      end: '2024-03-20T11:00:00',
    },
    {
      title: 'Patient: Jane Smith',
      start: '2024-03-21T14:00:00',
      end: '2024-03-21T15:00:00',
    },
    {
      title: 'Patient: Mike Johnson',
      start: '2024-03-22T09:00:00',
      end: '2024-03-22T10:00:00',
    }
  ];

  const handleEventClick = (clickInfo) => {
    // Handle event click
    console.log('Event clicked:', clickInfo.event.title);
  };

  const handleDateSelect = (selectInfo) => {
    // Handle date selection
    console.log('Date selected:', selectInfo.startStr);
  };

  return (
    <div className="h-[600px] bg-white p-4 rounded-lg shadow">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        events={events}
        editable={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        weekends={true}
        eventClick={handleEventClick}
        select={handleDateSelect}
        height="100%"
        slotMinTime="08:00:00"
        slotMaxTime="18:00:00"
        allDaySlot={false}
        slotDuration="00:30:00"
        businessHours={{
          daysOfWeek: [1, 2, 3, 4, 5], // Monday - Friday
          startTime: '08:00',
          endTime: '18:00',
        }}
      />
    </div>
  );
} 