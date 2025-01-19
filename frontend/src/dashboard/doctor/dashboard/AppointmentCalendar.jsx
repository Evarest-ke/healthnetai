import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

// Import the styles in your main CSS file instead
import './calendar.css';

export default function AppointmentCalendar() {
  const events = [
    {
      title: 'Patient: John Doe',
      start: '2024-03-20T10:00:00',
      end: '2024-03-20T11:00:00',
      backgroundColor: '#818CF8',
      borderColor: '#6366F1'
    },
    {
      title: 'Patient: Jane Smith',
      start: '2024-03-21T14:00:00',
      end: '2024-03-21T15:00:00',
      backgroundColor: '#818CF8',
      borderColor: '#6366F1'
    },
    {
      title: 'Patient: Mike Johnson',
      start: '2024-03-22T09:00:00',
      end: '2024-03-22T10:00:00',
      backgroundColor: '#818CF8',
      borderColor: '#6366F1'
    }
  ];

  return (
    <div className="appointment-calendar">
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
        height="100%"
        slotMinTime="08:00:00"
        slotMaxTime="18:00:00"
        allDaySlot={false}
        slotDuration="00:30:00"
        businessHours={{
          daysOfWeek: [1, 2, 3, 4, 5],
          startTime: '08:00',
          endTime: '18:00',
        }}
        eventTimeFormat={{
          hour: '2-digit',
          minute: '2-digit',
          meridiem: false,
          hour12: true
        }}
        slotLabelFormat={{
          hour: '2-digit',
          minute: '2-digit',
          meridiem: true,
          hour12: true
        }}
      />
    </div>
  );
} 