import { useState, useMemo } from 'react';
import { useSchedule } from '../context/ScheduleContext';
import { useLanguage } from '../context/LanguageContext';

const HOUR_OPTIONS = [
  { value: 6, label: '06:00' },
  { value: 7, label: '07:00' },
  { value: 8, label: '08:00' },
  { value: 9, label: '09:00' },
  { value: 10, label: '10:00' },
  { value: 11, label: '11:00' },
  { value: 12, label: '12:00' },
  { value: 13, label: '13:00' },
  { value: 14, label: '14:00' },
  { value: 15, label: '15:00' },
  { value: 16, label: '16:00' },
  { value: 17, label: '17:00' },
  { value: 18, label: '18:00' },
  { value: 19, label: '19:00' },
  { value: 20, label: '20:00' },
  { value: 21, label: '21:00' },
  { value: 22, label: '22:00' },
];

export default function SettingsModal({ onClose }) {
  const { slotDuration, startHour, endHour, updateAllSettings } = useSchedule();
  const { t, language } = useLanguage();
  
  const [duration, setDuration] = useState(slotDuration);
  const [localStartHour, setLocalStartHour] = useState(startHour);
  const [localEndHour, setLocalEndHour] = useState(endHour);
  const [isSaving, setIsSaving] = useState(false);

  const slotCount = useMemo(() => {
    const hours = localEndHour - localStartHour;
    return duration === 30 ? hours * 2 : hours;
  }, [duration, localStartHour, localEndHour]);

  const hasChanges = duration !== slotDuration || localStartHour !== startHour || localEndHour !== endHour;

  const handleSave = async () => {
    if (localStartHour >= localEndHour) return;
    setIsSaving(true);
    await updateAllSettings(duration, localStartHour, localEndHour);
    setIsSaving(false);
    onClose();
  };

  const handleStartHourChange = (value) => {
    const newStart = parseInt(value);
    setLocalStartHour(newStart);
    if (newStart >= localEndHour) {
      setLocalEndHour(newStart + 1);
    }
  };

  const handleEndHourChange = (value) => {
    const newEnd = parseInt(value);
    setLocalEndHour(newEnd);
    if (newEnd <= localStartHour) {
      setLocalStartHour(newEnd - 1);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content settings-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3>{t('schedule.admin.settings.title')}</h3>
            <p className="modal-datetime">
              {language === 'tr' ? 'Randevu ayarlarını yönetin' : 'Manage appointment settings'}
            </p>
          </div>
          <button onClick={onClose} className="modal-close">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="settings-content">
          {/* Working Hours */}
          <div className="settings-group">
            <label>
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ marginRight: 8, verticalAlign: 'middle' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {language === 'tr' ? 'Çalışma Saatleri' : 'Working Hours'}
            </label>
            <p className="settings-hint">
              {language === 'tr' 
                ? 'Randevu alınabilecek saat aralığını belirleyin' 
                : 'Set the time range for available appointments'}
            </p>
            <div className="working-hours-row">
              <div className="time-select-group">
                <span className="time-label">{language === 'tr' ? 'Başlangıç' : 'Start'}</span>
                <div className="time-select-wrapper">
                  <select 
                    value={localStartHour} 
                    onChange={(e) => handleStartHourChange(e.target.value)}
                    className="time-select"
                  >
                    {HOUR_OPTIONS.filter(h => h.value < 22).map(h => (
                      <option key={h.value} value={h.value}>{h.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <span className="time-separator">—</span>
              <div className="time-select-group">
                <span className="time-label">{language === 'tr' ? 'Bitiş' : 'End'}</span>
                <div className="time-select-wrapper">
                  <select 
                    value={localEndHour} 
                    onChange={(e) => handleEndHourChange(e.target.value)}
                    className="time-select"
                  >
                    {HOUR_OPTIONS.filter(h => h.value > 6).map(h => (
                      <option key={h.value} value={h.value}>{h.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Slot Duration */}
          <div className="settings-group">
            <label>
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ marginRight: 8, verticalAlign: 'middle' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {t('schedule.admin.settings.duration')}
            </label>
            <p className="settings-hint">
              {language === 'tr' 
                ? 'Her randevu slotunun süresini seçin' 
                : 'Choose the duration for each appointment slot'}
            </p>
            <div className="duration-options">
              <button 
                className={`duration-btn ${duration === 30 ? 'active' : ''}`}
                onClick={() => setDuration(30)}
              >
                30 {t('schedule.admin.settings.minutes')}
              </button>
              <button 
                className={`duration-btn ${duration === 60 ? 'active' : ''}`}
                onClick={() => setDuration(60)}
              >
                60 {t('schedule.admin.settings.minutes')}
              </button>
            </div>
          </div>

          {/* Preview */}
          <div className="settings-preview">
            <h4>
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ marginRight: 6, verticalAlign: 'middle' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {language === 'tr' ? 'Önizleme' : 'Preview'}
            </h4>
            <div className="preview-info">
              <div className="preview-item">
                <span className="preview-label">{language === 'tr' ? 'Saat Aralığı' : 'Time Range'}</span>
                <span className="preview-value">{String(localStartHour).padStart(2, '0')}:00 - {String(localEndHour).padStart(2, '0')}:00</span>
              </div>
              <div className="preview-item">
                <span className="preview-label">{language === 'tr' ? 'Slot Süresi' : 'Slot Duration'}</span>
                <span className="preview-value">{duration} {language === 'tr' ? 'dakika' : 'min'}</span>
              </div>
              <div className="preview-item highlight">
                <span className="preview-label">{language === 'tr' ? 'Günlük Slot' : 'Daily Slots'}</span>
                <span className="preview-value">{slotCount} {language === 'tr' ? 'adet' : 'slots'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button type="button" onClick={onClose} className="btn-secondary">
            {language === 'tr' ? 'İptal' : 'Cancel'}
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving || !hasChanges || localStartHour >= localEndHour}
            className="btn-primary"
          >
            {isSaving 
              ? (language === 'tr' ? 'Kaydediliyor...' : 'Saving...') 
              : t('schedule.admin.settings.save')}
          </button>
        </div>
      </div>
    </div>
  );
}
