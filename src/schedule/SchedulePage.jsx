import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ScheduleProvider } from '../context/ScheduleContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import Calendar from './Calendar';
import DayView from './DayView';

function ScheduleContent() {
  const [selectedDate, setSelectedDate] = useState(null);
  const { language, toggleLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const handleCloseSlots = () => {
    setSelectedDate(null);
  };

  return (
    <div className="schedule-page">
      {/* Header */}
      <header className="schedule-header">
        <div className="schedule-header-left">
          <div className="schedule-logo">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h1 className="schedule-title">{t('schedule.title')}</h1>
            <p className="schedule-subtitle">Hasan Can YILDIR</p>
          </div>
        </div>

        <div className="schedule-header-right">
          {/* Theme Toggle */}
          <button onClick={toggleTheme} className="theme-toggle-btn" aria-label="Toggle theme">
            {theme === 'dark' ? (
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {/* Language Toggle */}
          <button onClick={toggleLanguage} className="lang-toggle-btn">
            {language === 'en' ? 'TR' : 'EN'}
          </button>
          
          <Link to="/" className="schedule-back-link">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>{t('schedule.portfolio')}</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="schedule-main">
        {/* Desktop: Grid layout */}
        <div className="schedule-desktop">
          <Calendar
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            onDayClick={(date) => setSelectedDate(date)}
          />
          <DayView 
            date={selectedDate} 
            isAdmin={false} 
            onClose={handleCloseSlots}
          />
        </div>

        {/* Mobile: Only Calendar, DayView as modal */}
        <div className="schedule-mobile">
          <Calendar
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            onDayClick={(date) => setSelectedDate(date)}
          />

          {/* Mobile DayView Modal */}
          {selectedDate && (
            <div className="schedule-mobile-modal">
              <div className="mobile-modal-header">
                <h2>{t('schedule.selectTime')}</h2>
                <button onClick={handleCloseSlots} className="mobile-modal-close">
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="mobile-modal-content">
                <DayView 
                  date={selectedDate} 
                  isAdmin={false} 
                  onClose={handleCloseSlots}
                  isMobile={true}
                />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="schedule-footer">
        <p>{t('schedule.footer')} · © 2024 Hasan Can YILDIR</p>
      </footer>
    </div>
  );
}

export default function SchedulePage() {
  return (
    <ScheduleProvider>
      <ScheduleContent />
    </ScheduleProvider>
  );
}
