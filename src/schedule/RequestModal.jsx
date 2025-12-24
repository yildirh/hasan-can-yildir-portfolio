import { useState, useEffect } from 'react';
import { useSchedule } from '../context/ScheduleContext';
import { useLanguage } from '../context/LanguageContext';

// Validation constants
const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 100;
const MAX_PHONE_LENGTH = 20;
const MAX_DESCRIPTION_LENGTH = 500;

// Only allow valid phone characters
const sanitizePhone = (value) => {
  return value.replace(/[^0-9+\-() ]/g, '').slice(0, MAX_PHONE_LENGTH);
};

// Sanitize text to prevent issues
const sanitizeText = (value, maxLength) => {
  return value.slice(0, maxLength);
};

export default function RequestModal({ date, slot, onClose }) {
  const { createRequest, hasPendingRequest } = useSchedule();
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    description: '',
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [hasPending, setHasPending] = useState(false);

  const MONTHS = t('schedule.calendar.months');

  useEffect(() => {
    const savedData = localStorage.getItem('scheduleit_user');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setFormData(prev => ({
        ...prev,
        name: parsed.name || '',
        email: parsed.email || '',
        phone: parsed.phone || '',
      }));
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    if (formData.email && formData.email.includes('@')) {
      const pending = hasPendingRequest(formData.email);
      setHasPending(pending);
      if (pending) {
        setError(language === 'tr' 
          ? 'Bu e-posta ile zaten bekleyen bir talebiniz var.' 
          : 'You already have a pending request with this email.');
      } else {
        setError('');
      }
    } else {
      setHasPending(false);
      setError('');
    }
  }, [formData.email, hasPendingRequest, language]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (hasPending) return;

    setIsSubmitting(true);
    
    if (rememberMe) {
      localStorage.setItem('scheduleit_user', JSON.stringify({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      }));
    } else {
      localStorage.removeItem('scheduleit_user');
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));

    const result = createRequest(date, slot.hour, formData.name, formData.email, formData.phone, formData.description);
    
    if (result.error) {
      setError(result.error);
      setIsSubmitting(false);
      return;
    }
    
    setIsSubmitting(false);
    setIsSuccess(true);

    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {isSuccess ? (
          <div className="modal-success">
            <div className="success-icon">
              <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3>{t('schedule.modal.success')}</h3>
            <p>{t('schedule.modal.successMessage')}</p>
          </div>
        ) : (
          <>
            <div className="modal-header">
              <div>
                <h3>{t('schedule.modal.title')}</h3>
                <p className="modal-datetime">
                  {date.getDate()} {MONTHS[date.getMonth()]} · {slot.label}
                </p>
              </div>
              <button onClick={onClose} className="modal-close">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {error && (
              <div className="modal-error">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>{t('schedule.modal.name')} <span className="required">*</span></label>
                <input
                  type="text"
                  required
                  maxLength={MAX_NAME_LENGTH}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: sanitizeText(e.target.value, MAX_NAME_LENGTH) })}
                  placeholder={t('schedule.modal.namePlaceholder')}
                />
              </div>

              <div className="form-group">
                <label>Email <span className="required">*</span></label>
                <input
                  type="email"
                  required
                  maxLength={MAX_EMAIL_LENGTH}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: sanitizeText(e.target.value, MAX_EMAIL_LENGTH) })}
                  placeholder="john@example.com"
                  className={hasPending ? 'error' : ''}
                />
              </div>

              <div className="form-group">
                <label>{language === 'tr' ? 'Telefon' : 'Phone'}</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: sanitizePhone(e.target.value) })}
                  placeholder={language === 'tr' ? '+90 5XX XXX XX XX' : '+1 (XXX) XXX-XXXX'}
                />
                <span className="form-hint">
                  {language === 'tr' ? 'Sadece rakam ve + işareti' : 'Numbers, +, spaces, dashes only'}
                </span>
              </div>

              <div className="form-group">
                <label>
                  {t('schedule.modal.note')}
                  <span className="char-count">
                    {formData.description.length}/{MAX_DESCRIPTION_LENGTH}
                  </span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: sanitizeText(e.target.value, MAX_DESCRIPTION_LENGTH) })}
                  rows={3}
                  maxLength={MAX_DESCRIPTION_LENGTH}
                  placeholder={t('schedule.modal.notePlaceholder')}
                />
              </div>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="checkmark" />
                <span>{language === 'tr' ? 'Bilgilerimi hatırla' : 'Remember my info for next time'}</span>
              </label>

              <div className="modal-actions">
                <button type="button" onClick={onClose} className="btn-secondary">
                  {language === 'tr' ? 'İptal' : 'Cancel'}
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting || formData.name.trim() === '' || !formData.email.includes('@') || hasPending}
                  className="btn-primary"
                >
                  {isSubmitting 
                    ? t('schedule.modal.submitting') 
                    : hasPending 
                      ? (language === 'tr' ? 'Bekleyen Talep' : 'Pending Request')
                      : t('schedule.modal.submit')}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
