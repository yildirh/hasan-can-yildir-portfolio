import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useSchedule } from '../context/ScheduleContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import Calendar from './Calendar';
import DayView from './DayView';
import CancelModal from './CancelModal';
import SettingsModal from './SettingsModal';

const ITEMS_PER_PAGE = 10;

// Empty State Component
function EmptyState({ icon, title, description, action, actionLabel }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <h4 className="empty-state-title">{title}</h4>
      <p className="empty-state-desc">{description}</p>
      {action && (
        <button onClick={action} className="empty-state-btn">
          {actionLabel}
        </button>
      )}
    </div>
  );
}

// Pagination Component
function Pagination({ currentPage, totalPages, onPageChange, language }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const showEllipsisStart = currentPage > 3;
  const showEllipsisEnd = currentPage < totalPages - 2;

  // Always show first page
  pages.push(1);

  if (showEllipsisStart) {
    pages.push('...');
  }

  // Show pages around current
  for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
    if (!pages.includes(i)) {
      pages.push(i);
    }
  }

  if (showEllipsisEnd) {
    pages.push('...');
  }

  // Always show last page
  if (totalPages > 1 && !pages.includes(totalPages)) {
    pages.push(totalPages);
  }

  return (
    <div className="pagination">
      <button 
        onClick={() => onPageChange(currentPage - 1)} 
        disabled={currentPage === 1}
        className="pagination-btn"
        aria-label="Previous"
      >
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <div className="pagination-pages">
        {pages.map((page, index) => (
          page === '...' ? (
            <span key={`ellipsis-${index}`} className="pagination-ellipsis">...</span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`pagination-page ${currentPage === page ? 'active' : ''}`}
            >
              {page}
            </button>
          )
        ))}
      </div>

      <button 
        onClick={() => onPageChange(currentPage + 1)} 
        disabled={currentPage === totalPages}
        className="pagination-btn"
        aria-label="Next"
      >
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <span className="pagination-info">
        {language === 'tr' ? `${currentPage} / ${totalPages}` : `Page ${currentPage} of ${totalPages}`}
      </span>
    </div>
  );
}

export default function AdminPanel({ onLogout }) {
  const { requests, appointments, cancelledAppointments, approveRequest, rejectRequest, cancelAppointment, getSortedRequests, slotDuration } = useSchedule();
  const { t, language, toggleLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('requests');
  const [selectedDate, setSelectedDate] = useState(null);
  const [cancellingAppointment, setCancellingAppointment] = useState(null);
  const [showSettings, setShowSettings] = useState(false);

  // Pagination states
  const [requestsPage, setRequestsPage] = useState(1);
  const [upcomingPage, setUpcomingPage] = useState(1);
  const [historyPage, setHistoryPage] = useState(1);

  const sortedRequests = getSortedRequests();
  const MONTHS = t('schedule.calendar.months');

  const today = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);

  const { todayAppointments, futureAppointments, pastAppointments } = useMemo(() => {
    const todayList = [];
    const futureList = [];
    const pastList = [];

    appointments.forEach(apt => {
      if (apt.date === today) {
        todayList.push(apt);
      } else if (apt.date > today) {
        futureList.push(apt);
      } else {
        pastList.push(apt);
      }
    });

    todayList.sort((a, b) => a.hour - b.hour);
    futureList.sort((a, b) => a.date.localeCompare(b.date));
    pastList.sort((a, b) => b.date.localeCompare(a.date)); // Most recent first

    return { todayAppointments: todayList, futureAppointments: futureList, pastAppointments: pastList };
  }, [appointments, today]);

  // Pagination calculations
  const paginatedRequests = useMemo(() => {
    const start = (requestsPage - 1) * ITEMS_PER_PAGE;
    return sortedRequests.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedRequests, requestsPage]);

  const paginatedUpcoming = useMemo(() => {
    const start = (upcomingPage - 1) * ITEMS_PER_PAGE;
    return futureAppointments.slice(start, start + ITEMS_PER_PAGE);
  }, [futureAppointments, upcomingPage]);

  const paginatedHistory = useMemo(() => {
    const start = (historyPage - 1) * ITEMS_PER_PAGE;
    return pastAppointments.slice(start, start + ITEMS_PER_PAGE);
  }, [pastAppointments, historyPage]);

  const totalRequestsPages = Math.ceil(sortedRequests.length / ITEMS_PER_PAGE);
  const totalUpcomingPages = Math.ceil(futureAppointments.length / ITEMS_PER_PAGE);
  const totalHistoryPages = Math.ceil(pastAppointments.length / ITEMS_PER_PAGE);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
  };

  const formatTime = (hour) => {
    if (hour >= 100) {
      const h = Math.floor(hour / 100);
      const m = hour % 100;
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    }
    return `${String(hour).padStart(2, '0')}:00`;
  };

  const formatCreatedAt = (isoString) => {
    const diffMs = new Date() - new Date(isoString);
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return language === 'tr' ? 'Az önce' : 'Just now';
    if (diffMins < 60) return `${diffMins}${language === 'tr' ? 'dk önce' : 'm ago'}`;
    const diffHours = Math.floor(diffMs / 3600000);
    if (diffHours < 24) return `${diffHours}${language === 'tr' ? 's önce' : 'h ago'}`;
    return `${Math.floor(diffMs / 86400000)}${language === 'tr' ? 'g önce' : 'd ago'}`;
  };

  // Icons for empty states
  const InboxIcon = (
    <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
    </svg>
  );

  const CalendarIcon = (
    <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );

  const HistoryIcon = (
    <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  return (
    <div className="admin-page">
      {/* Header - Premium with blur */}
      <header className="admin-header">
        <div className="admin-header-left">
          <div className="admin-logo">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h1>{t('schedule.admin.title')}</h1>
            <p>ScheduleIt</p>
          </div>
        </div>

        <div className="admin-header-right">
          {/* Unified Toolbar Buttons */}
          <button onClick={toggleTheme} className="toolbar-btn icon-only" aria-label="Toggle theme">
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
          <button onClick={toggleLanguage} className="toolbar-btn">
            {language === 'en' ? 'TR' : 'EN'}
          </button>
          <Link to="/" className="toolbar-btn" title={t('schedule.portfolio')}>
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="btn-text">{t('schedule.portfolio')}</span>
          </Link>
          <button onClick={onLogout} className="toolbar-btn danger" title={t('schedule.admin.logout')}>
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="btn-text">{t('schedule.admin.logout')}</span>
          </button>
        </div>
      </header>

      {/* Stats - Premium cards with indicators */}
      <div className="admin-stats">
        <div className="stat-card" onClick={() => setActiveTab('requests')}>
          <div className="stat-indicator pending" />
          <span className="stat-value">{requests.length}</span>
          <span className="stat-label">{t('schedule.admin.pending')}</span>
        </div>
        <div className="stat-card" onClick={() => setActiveTab('appointments')}>
          <div className="stat-indicator success" />
          <span className="stat-value">{todayAppointments.length}</span>
          <span className="stat-label">{t('schedule.admin.today')}</span>
        </div>
        <div className="stat-card" onClick={() => setActiveTab('appointments')}>
          <div className="stat-indicator info" />
          <span className="stat-value">{futureAppointments.length}</span>
          <span className="stat-label">{t('schedule.admin.upcoming')}</span>
        </div>
        <div className="stat-card" onClick={() => setActiveTab('history')}>
          <div className="stat-indicator muted" />
          <span className="stat-value">{pastAppointments.length}</span>
          <span className="stat-label">{language === 'tr' ? 'Geçmiş' : 'History'}</span>
        </div>
      </div>

      {/* Tabs + Duration Dropdown (separated) */}
      <div className="admin-tabs-container">
        <div className="admin-tabs">
          <button 
            className={`admin-tab ${activeTab === 'requests' ? 'active' : ''}`}
            onClick={() => setActiveTab('requests')}
          >
            {t('schedule.admin.tabs.requests')}
            {requests.length > 0 && <span className="tab-badge">{requests.length}</span>}
          </button>
          <button 
            className={`admin-tab ${activeTab === 'calendar' ? 'active' : ''}`}
            onClick={() => setActiveTab('calendar')}
          >
            {t('schedule.admin.tabs.calendar')}
          </button>
          <button 
            className={`admin-tab ${activeTab === 'appointments' ? 'active' : ''}`}
            onClick={() => setActiveTab('appointments')}
          >
            {t('schedule.admin.tabs.appointments')}
          </button>
          <button 
            className={`admin-tab ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {language === 'tr' ? 'Geçmiş' : 'History'}
            {pastAppointments.length > 0 && <span className="tab-badge muted">{pastAppointments.length}</span>}
          </button>
        </div>

        {/* Duration Dropdown - Separated */}
        <button onClick={() => setShowSettings(true)} className="duration-dropdown">
          <span className="duration-label">{language === 'tr' ? 'Süre' : 'Duration'}:</span>
          <span className="duration-value">{slotDuration}m</span>
          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Tab Content */}
      <div className="admin-content">
        {activeTab === 'requests' && (
          <div className="admin-card">
            <h3 className="admin-card-title">
              <span className="pulse-dot" />
              {t('schedule.admin.tabs.requests')}
              {sortedRequests.length > 0 && <span className="title-badge">{sortedRequests.length}</span>}
            </h3>

            {sortedRequests.length === 0 ? (
              <EmptyState
                icon={InboxIcon}
                title={language === 'tr' ? 'Bekleyen talep yok' : 'No pending requests'}
                description={language === 'tr' 
                  ? 'Birisi randevu talep ettiğinde burada görünecek.' 
                  : 'When someone books a slot, it will appear here.'}
                action={() => setActiveTab('calendar')}
                actionLabel={language === 'tr' ? 'Takvime Git' : 'Go to Calendar'}
              />
            ) : (
              <>
                <div className="requests-list">
                  {paginatedRequests.map((request, index) => (
                    <div key={request.id} className="request-item">
                      <div className="request-info">
                        <div className="request-number">{(requestsPage - 1) * ITEMS_PER_PAGE + index + 1}</div>
                        <div className="request-avatar">
                          {request.requesterName.charAt(0).toUpperCase()}
                        </div>
                        <div className="request-details">
                          <h4>{request.requesterName}</h4>
                          <p className="contact-info">
                            <span>{request.requesterEmail || request.requesterPhone}</span>
                            {request.requesterPhone && <span> · {request.requesterPhone}</span>}
                          </p>
                          <div className="request-meta">
                            <span>{formatDate(request.date)}</span>
                            <span>{formatTime(request.hour)}</span>
                            <span>{formatCreatedAt(request.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="request-actions">
                        <button onClick={() => rejectRequest(request.id)} className="btn-reject" title={t('schedule.admin.reject')}>
                          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                        <button onClick={() => approveRequest(request.id)} className="btn-approve" title={t('schedule.admin.approve')}>
                          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <Pagination 
                  currentPage={requestsPage} 
                  totalPages={totalRequestsPages} 
                  onPageChange={setRequestsPage}
                  language={language}
                />
              </>
            )}
          </div>
        )}

        {activeTab === 'calendar' && (
          <div className="admin-calendar-grid">
            <Calendar selectedDate={selectedDate} onSelectDate={setSelectedDate} onDayClick={setSelectedDate} />
            <DayView date={selectedDate} isAdmin={true} onClose={() => setSelectedDate(null)} />
          </div>
        )}

        {activeTab === 'appointments' && (
          <div className="admin-appointments">
            <div className="admin-card">
              <h3 className="admin-card-title">
                <span className="success-dot" />
                {t('schedule.admin.todayAppointments')}
                <span className="title-badge">{todayAppointments.length}</span>
              </h3>

              {todayAppointments.length === 0 ? (
                <EmptyState
                  icon={CalendarIcon}
                  title={language === 'tr' ? 'Bugün randevu yok' : 'No appointments today'}
                  description={language === 'tr' 
                    ? 'Bugün için planlanmış randevu bulunmuyor.' 
                    : 'No appointments scheduled for today.'}
                />
              ) : (
                <div className="appointments-grid">
                  {todayAppointments.map((apt) => (
                    <div key={apt.id} className="appointment-card today">
                      <div className="apt-header">
                        <div className="apt-avatar">{apt.requesterName.charAt(0).toUpperCase()}</div>
                        <div className="apt-info">
                          <h4>{apt.requesterName}</h4>
                          <p className="contact-info">
                            <span>{apt.requesterEmail || apt.requesterPhone}</span>
                            {apt.requesterPhone && <span> · {apt.requesterPhone}</span>}
                          </p>
                        </div>
                        <button onClick={() => setCancellingAppointment(apt)} className="apt-cancel">
                          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <div className="apt-footer">
                        <span className="apt-time">{formatTime(apt.hour)}</span>
                        <span className="apt-status">{language === 'tr' ? 'Aktif' : 'Active'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="admin-card">
              <h3 className="admin-card-title">
                <span className="info-dot" />
                {t('schedule.admin.upcoming')}
                <span className="title-badge">{futureAppointments.length}</span>
              </h3>

              {futureAppointments.length === 0 ? (
                <EmptyState
                  icon={CalendarIcon}
                  title={language === 'tr' ? 'Yaklaşan randevu yok' : 'No upcoming appointments'}
                  description={language === 'tr' 
                    ? 'Gelecek randevular burada görünecek.' 
                    : 'Future appointments will appear here.'}
                />
              ) : (
                <>
                  <div className="future-list">
                    {paginatedUpcoming.map((apt) => (
                      <div key={apt.id} className="future-item">
                        <div className="future-info">
                          <span className="future-name">{apt.requesterName}</span>
                          <span className="future-chip">{language === 'tr' ? 'Yaklaşan' : 'Upcoming'}</span>
                        </div>
                        <div className="future-meta">
                          <span className="future-date">{formatDate(apt.date)} · {formatTime(apt.hour)}</span>
                        </div>
                        <button onClick={() => setCancellingAppointment(apt)} className="future-cancel" title={language === 'tr' ? 'İptal Et' : 'Cancel'}>
                          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                  <Pagination 
                    currentPage={upcomingPage} 
                    totalPages={totalUpcomingPages} 
                    onPageChange={setUpcomingPage}
                    language={language}
                  />
                </>
              )}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="admin-card">
            <h3 className="admin-card-title">
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ opacity: 0.5 }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {language === 'tr' ? 'Geçmiş Randevular' : 'Past Appointments'}
              <span className="title-badge muted">{pastAppointments.length}</span>
            </h3>

            {pastAppointments.length === 0 ? (
              <EmptyState
                icon={HistoryIcon}
                title={language === 'tr' ? 'Geçmiş randevu yok' : 'No past appointments'}
                description={language === 'tr' 
                  ? 'Tamamlanan randevular burada görünecek.' 
                  : 'Completed appointments will appear here.'}
              />
            ) : (
              <>
                <div className="history-list">
                  {paginatedHistory.map((apt) => (
                    <div key={apt.id} className="history-item">
                      <div className="history-item-header">
                        <div className="history-avatar">
                          {apt.requesterName.charAt(0).toUpperCase()}
                        </div>
                        <div className="history-info">
                          <div className="history-name">{apt.requesterName}</div>
                          <div className="history-contact">
                            {apt.requesterEmail || apt.requesterPhone}
                            {apt.requesterEmail && apt.requesterPhone && ` · ${apt.requesterPhone}`}
                          </div>
                        </div>
                      </div>
                      <div className="history-item-footer">
                        <div className="history-datetime">
                          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="history-date">{formatDate(apt.date)}</span>
                          <span className="history-time">{formatTime(apt.hour)}</span>
                        </div>
                        <div className="history-status">
                          <span className="status-chip completed">
                            <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {language === 'tr' ? 'Tamamlandı' : 'Completed'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Pagination 
                  currentPage={historyPage} 
                  totalPages={totalHistoryPages} 
                  onPageChange={setHistoryPage}
                  language={language}
                />
              </>
            )}
          </div>
        )}
      </div>

      {/* Cancel Modal */}
      {cancellingAppointment && (
        <CancelModal
          appointment={cancellingAppointment}
          onConfirm={(id, note) => cancelAppointment(id, note)}
          onClose={() => setCancellingAppointment(null)}
        />
      )}

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
}
