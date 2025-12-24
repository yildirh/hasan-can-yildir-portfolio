import { useState } from 'react';
import { useSchedule } from '../context/ScheduleContext';
import { useLanguage } from '../context/LanguageContext';

export default function SettingsModal({ onClose }) {
  const { slotDuration, setSlotDuration } = useSchedule();
  const { t, language } = useLanguage();
  const [duration, setDuration] = useState(slotDuration);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await setSlotDuration(duration);
    setIsSaving(false);
    onClose();
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
          <div className="settings-group">
            <label>{t('schedule.admin.settings.duration')}</label>
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

          <div className="settings-preview">
            <h4>{language === 'tr' ? 'Önizleme' : 'Preview'}</h4>
            <p>
              {language === 'tr' 
                ? `Günde ${duration === 30 ? '22' : '11'} slot müsait olacak (09:00 - ${duration === 30 ? '19:30' : '19:00'})` 
                : `${duration === 30 ? '22' : '11'} slots will be available per day (09:00 - ${duration === 30 ? '19:30' : '19:00'})`}
            </p>
          </div>
        </div>

        <div className="modal-actions">
          <button type="button" onClick={onClose} className="btn-secondary">
            {language === 'tr' ? 'İptal' : 'Cancel'}
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving || duration === slotDuration}
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

