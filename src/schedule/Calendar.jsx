import { useState, useMemo } from 'react';
import { useSchedule } from '../context/ScheduleContext';
import { useLanguage } from '../context/LanguageContext';

const DAYS_EN = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DAYS_TR = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

export default function Calendar({ selectedDate, onSelectDate, onDayClick }) {
  const { slots } = useSchedule();
  const { t, language } = useLanguage();
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const DAYS = language === 'tr' ? DAYS_TR : DAYS_EN;
  const MONTHS = t('schedule.calendar.months');

  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    let startDay = firstDay.getDay() - 1;
    if (startDay < 0) startDay = 6;
    
    const days = [];
    
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDay - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthLastDay - i),
        isCurrentMonth: false,
      });
    }
    
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
      });
    }
    
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
      });
    }
    
    return days;
  }, [currentMonth]);

  const getDayStatus = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateKey = `${year}-${month}-${day}`;
    const daySlots = slots[dateKey];
    
    if (!daySlots) return { available: 11, pending: 0, booked: 0 };
    
    let available = 11;
    let pending = 0;
    let booked = 0;
    
    Object.values(daySlots).forEach(slot => {
      if (slot.status === 'pending') {
        pending++;
        available--;
      } else if (slot.status === 'booked') {
        booked++;
        available--;
      } else if (slot.status === 'blocked') {
        available--;
      }
    });
    
    return { available, pending, booked };
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString();
  };

  const isPast = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const goToPrevMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const goToToday = () => {
    const now = new Date();
    setCurrentMonth(new Date(now.getFullYear(), now.getMonth(), 1));
    onSelectDate(now);
  };

  return (
    <div className="schedule-card">
      {/* Header */}
      <div className="schedule-card-header">
        <h2 className="schedule-month">
          {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h2>
        <div className="schedule-nav">
          <button onClick={goToToday} className="schedule-today-btn">
            {t('schedule.calendar.today')}
          </button>
          <button onClick={goToPrevMonth} className="schedule-nav-btn">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button onClick={goToNextMonth} className="schedule-nav-btn">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Days of week */}
      <div className="schedule-weekdays">
        {DAYS.map(day => (
          <div key={day} className="schedule-weekday">{day}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="schedule-grid">
        {calendarDays.map(({ date, isCurrentMonth }, index) => {
          const status = getDayStatus(date);
          const past = isPast(date);
          const today = isToday(date);
          const selected = isSelected(date);

          return (
            <button
              key={index}
              onClick={() => !past && onDayClick(date)}
              disabled={past}
              className={`schedule-day 
                ${!isCurrentMonth ? 'other-month' : ''} 
                ${past ? 'past' : ''} 
                ${today ? 'today' : ''} 
                ${selected ? 'selected' : ''}
              `}
            >
              <span className="day-number">{date.getDate()}</span>
              {isCurrentMonth && !past && (
                <div className="day-indicators">
                  {status.pending > 0 && <span className="indicator pending" />}
                  {status.booked > 0 && <span className="indicator booked" />}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="schedule-legend">
        <div className="legend-item">
          <span className="legend-dot pending" />
          <span>{t('schedule.pending')}</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot booked" />
          <span>{t('schedule.booked')}</span>
        </div>
      </div>
    </div>
  );
}
