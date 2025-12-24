import { useState } from 'react';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function CancelModal({ appointment, onConfirm, onClose }) {
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  const formatTime = (hour) => {
    return `${String(hour).padStart(2, '0')}:00`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    onConfirm(appointment.id, note);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3>Cancel Appointment</h3>
            <p className="modal-warning">This action cannot be undone</p>
          </div>
          <button onClick={onClose} className="modal-close">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="cancel-info">
          <div className="cancel-avatar">
            {appointment.requesterName.charAt(0).toUpperCase()}
          </div>
          <div className="cancel-details">
            <h4>{appointment.requesterName}</h4>
            <p>{appointment.requesterEmail || appointment.requesterPhone}</p>
            <span>{formatDate(appointment.date)} · {formatTime(appointment.hour)}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Reason for Cancellation</label>
            <textarea
              required
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="Enter the reason for cancellation..."
            />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">
              Go Back
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting || !note.trim()}
              className="btn-danger"
            >
              {isSubmitting ? 'Cancelling...' : 'Cancel Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

