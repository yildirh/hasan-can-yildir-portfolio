import { useState, useMemo, useCallback } from 'react';
import { useSchedule } from '../context/ScheduleContext';
import { useLanguage } from '../context/LanguageContext';
import RequestModal from './RequestModal';

const DAYS_FULL_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAYS_FULL_TR = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];

export default function DayView({ date, isAdmin = false, onClose, isMobile = false }) {
  const { getSlotsForDay, blockSlot, unblockSlot, slotDuration } = useSchedule();
  const { t, language } = useLanguage();
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [hidePastSlots, setHidePastSlots] = useState(true);

  const MONTHS = t('schedule.calendar.months');
  const DAYS_FULL = language === 'tr' ? DAYS_FULL_TR : DAYS_FULL_EN;

  // Calculate today check and current time
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  
  const isToday = date ? (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  ) : false;

  // Memoized function to check if slot is past
  const isSlotPast = useCallback((slotHour) => {
    if (!isToday) return false;
    
    if (slotDuration === 30) {
      const hour = Math.floor(slotHour / 100);
      const minute = slotHour % 100;
      if (hour < currentHour) return true;
      if (hour === currentHour && minute <= currentMinute) return true;
      return false;
    }
    
    return slotHour <= currentHour;
  }, [isToday, slotDuration, currentHour, currentMinute]);

  // Get all slots for the date
  const allSlots = date ? getSlotsForDay(date) : [];

  // Count past slots
  const pastSlotsCount = useMemo(() => {
    if (!isToday || !allSlots.length) return 0;
    return allSlots.filter(slot => isSlotPast(slot.hour)).length;
  }, [allSlots, isToday, isSlotPast]);

  // Filter slots based on hidePastSlots toggle
  const slots = useMemo(() => {
    if (!hidePastSlots || !isToday) return allSlots;
    return allSlots.filter(slot => !isSlotPast(slot.hour));
  }, [allSlots, hidePastSlots, isToday, isSlotPast]);

  if (!date) {
    return (
      <div className="schedule-card schedule-empty">
        <svg width="64" height="64" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="empty-title">{t('schedule.selectDay')}</p>
        <p className="empty-sub">{language === 'tr' ? 'Müsait saatleri görmek için bir gün seçin' : 'Click on a day to view available time slots'}</p>
      </div>
    );
  }

  const handleSlotClick = (slot, isPast) => {
    if (isPast) return;

    if (isAdmin) {
      if (slot.status === 'available') {
        blockSlot(date, slot.hour);
      } else if (slot.status === 'blocked') {
        unblockSlot(date, slot.hour);
      }
    } else {
      if (slot.status === 'available') {
        setSelectedSlot(slot);
        setShowRequestModal(true);
      }
    }
  };

  const getStatusText = (status, isPast) => {
    if (isPast) return language === 'tr' ? 'Geçti' : 'Past';
    if (status === 'available') return t('schedule.available');
    if (status === 'pending') return t('schedule.pending');
    if (status === 'booked') return t('schedule.booked');
    return language === 'tr' ? 'Engellendi' : 'Blocked';
  };

  // Get timezone abbreviation
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <div className={`schedule-card ${isMobile ? 'mobile' : ''}`}>
      {/* Header */}
      <div className="dayview-header">
        <div>
          <h2 className="dayview-date">
            {date.getDate()} {MONTHS[date.getMonth()]} {date.getFullYear()}
          </h2>
          <p className="dayview-day">
            {DAYS_FULL[date.getDay()]}
            {isToday && <span className="today-badge">{t('schedule.calendar.today')}</span>}
          </p>
        </div>
        {onClose && (
          <button onClick={onClose} className="dayview-close" aria-label="Close">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Timezone Info */}
      <div className="dayview-timezone">
        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{language === 'tr' ? 'Yerel saat dilimi' : 'Your local timezone'}: {timezone}</span>
      </div>

      {/* Past slots toggle - only show on today */}
      {isToday && pastSlotsCount > 0 && (
        <button 
          className="past-slots-toggle"
          onClick={() => setHidePastSlots(!hidePastSlots)}
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d={hidePastSlots ? "M19 9l-7 7-7-7" : "M5 15l7-7 7 7"} />
          </svg>
          {hidePastSlots 
            ? (language === 'tr' ? `Geçmiş saatler (${pastSlotsCount})` : `Past slots (${pastSlotsCount})`)
            : (language === 'tr' ? 'Geçmiş saatleri gizle' : 'Hide past slots')
          }
        </button>
      )}

      {/* Slots */}
      <div className={`slots-list ${isMobile ? '' : 'scrollable'}`}>
        {slots.length === 0 ? (
          <div className="no-slots">
            {isToday && hidePastSlots && pastSlotsCount > 0
              ? (language === 'tr' ? 'Bugün için uygun saat kalmadı' : 'No available slots left today')
              : t('schedule.noSlots')
            }
          </div>
        ) : (
          slots.map((slot) => {
            const isPast = isSlotPast(slot.hour);
            const isClickable = !isPast && (
              isAdmin 
                ? (slot.status === 'available' || slot.status === 'blocked')
                : slot.status === 'available'
            );

            return (
              <div
                key={slot.hour}
                onClick={() => isClickable && handleSlotClick(slot, isPast)}
                className={`slot-item ${slot.status} ${isPast ? 'past' : ''} ${isClickable ? 'clickable' : ''}`}
              >
                <div className="slot-left">
                  <span className="slot-time">{slot.label}</span>
                  <span className={`slot-status ${slot.status}`}>
                    {getStatusText(slot.status, isPast)}
                  </span>
                </div>

                <div className="slot-right">
                  {!isPast && slot.status === 'available' && !isAdmin && (
                    <button className="slot-book-btn">
                      {language === 'tr' ? 'Seç' : 'Book'}
                    </button>
                  )}
                  {!isPast && slot.status === 'pending' && !isAdmin && (
                    <span className="slot-pending-indicator">
                      <span className="pending-dot" />
                      {t('schedule.pending')}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Request Modal */}
      {showRequestModal && selectedSlot && (
        <RequestModal
          date={date}
          slot={selectedSlot}
          onClose={() => {
            setShowRequestModal(false);
            setSelectedSlot(null);
          }}
        />
      )}
    </div>
  );
}
