import { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { db } from '../config/firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  addDoc,
} from 'firebase/firestore';

const ScheduleContext = createContext();

const COLLECTIONS = {
  SLOTS: 'slots',
  REQUESTS: 'requests',
  APPOINTMENTS: 'appointments',
  CANCELLED: 'cancelled',
  SETTINGS: 'settings',
};

const generateWorkingHours = (slotDuration) => {
  const startHour = 10;
  const endHour = 21;
  const slots = [];
  
  if (slotDuration === 30) {
    for (let hour = startHour; hour < endHour; hour++) {
      slots.push({
        hour: hour * 100,
        label: `${String(hour).padStart(2, '0')}:00 - ${String(hour).padStart(2, '0')}:30`
      });
      slots.push({
        hour: hour * 100 + 30,
        label: `${String(hour).padStart(2, '0')}:30 - ${String(hour + 1).padStart(2, '0')}:00`
      });
    }
  } else {
    for (let hour = startHour; hour < endHour; hour++) {
      slots.push({
        hour,
        label: `${String(hour).padStart(2, '0')}:00 - ${String(hour + 1).padStart(2, '0')}:00`
      });
    }
  }
  
  return slots;
};

export function ScheduleProvider({ children }) {
  const [slots, setSlots] = useState({});
  const [requests, setRequests] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [cancelledAppointments, setCancelledAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [slotDuration, setSlotDurationState] = useState(60);
  
  const workingHours = useMemo(() => generateWorkingHours(slotDuration), [slotDuration]);

  const formatDateKey = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const unsubSettings = onSnapshot(
      doc(db, COLLECTIONS.SETTINGS, 'app'),
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (data.slotDuration) {
            setSlotDurationState(data.slotDuration);
          }
        }
      }
    );

    const unsubSlots = onSnapshot(
      collection(db, COLLECTIONS.SLOTS), 
      (snapshot) => {
        const slotsData = {};
        snapshot.forEach((doc) => {
          slotsData[doc.id] = doc.data();
        });
        setSlots(slotsData);
      }
    );

    const unsubRequests = onSnapshot(
      collection(db, COLLECTIONS.REQUESTS),
      (snapshot) => {
        const allRequests = [];
        snapshot.forEach((doc) => {
          allRequests.push({ id: doc.id, ...doc.data() });
        });
        const pendingRequests = allRequests.filter(r => r.status === 'pending');
        setRequests(pendingRequests);
      }
    );

    const unsubAppointments = onSnapshot(
      collection(db, COLLECTIONS.APPOINTMENTS),
      (snapshot) => {
        const appointmentsData = [];
        snapshot.forEach((doc) => {
          appointmentsData.push({ id: doc.id, ...doc.data() });
        });
        setAppointments(appointmentsData);
      }
    );

    const unsubCancelled = onSnapshot(
      collection(db, COLLECTIONS.CANCELLED),
      (snapshot) => {
        const cancelledData = [];
        snapshot.forEach((doc) => {
          cancelledData.push({ id: doc.id, ...doc.data() });
        });
        setCancelledAppointments(cancelledData);
      }
    );

    setLoading(false);

    return () => {
      unsubSettings();
      unsubSlots();
      unsubRequests();
      unsubAppointments();
      unsubCancelled();
    };
  }, []);

  const getSlotsForDay = useCallback((date) => {
    const dateKey = formatDateKey(date);
    const daySlots = slots[dateKey] || {};
    
    return workingHours.map(({ hour, label }) => {
      let slotData = daySlots[hour];
      
      if (!slotData) {
        if (slotDuration === 30) {
          const baseHour = Math.floor(hour / 100);
          slotData = daySlots[baseHour];
        } else {
          const slot30First = hour * 100;
          const slot30Second = hour * 100 + 30;
          slotData = daySlots[slot30First] || daySlots[slot30Second];
        }
      }
      
      return {
        hour,
        label,
        status: slotData?.status || 'available',
        request: slotData?.request || null,
      };
    });
  }, [slots, workingHours, slotDuration]);

  const hasPendingRequest = useCallback((email) => {
    return requests.some(r => (r.requesterEmail === email || r.requesterPhone === email) && r.status === 'pending');
  }, [requests]);

  const createRequest = useCallback(async (date, hour, requesterName, requesterEmail, requesterPhone, description) => {
    if (hasPendingRequest(requesterEmail)) {
      return { error: 'You already have a pending request.' };
    }

    const dateKey = formatDateKey(date);
    const newRequest = {
      date: dateKey,
      hour,
      requesterName,
      requesterEmail,
      requesterPhone: requesterPhone || '',
      description,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    try {
      const requestRef = await addDoc(collection(db, COLLECTIONS.REQUESTS), newRequest);
      
      const slotRef = doc(db, COLLECTIONS.SLOTS, dateKey);
      await setDoc(slotRef, {
        [hour]: { 
          status: 'pending', 
          request: { ...newRequest, id: requestRef.id } 
        }
      }, { merge: true });

      return { id: requestRef.id, ...newRequest };
    } catch (error) {
      console.error('Request creation error:', error);
      return { error: 'Could not create request. Please try again.' };
    }
  }, [hasPendingRequest]);

  const approveRequest = useCallback(async (requestId) => {
    const request = requests.find(r => r.id === requestId);
    if (!request) return;

    try {
      await addDoc(collection(db, COLLECTIONS.APPOINTMENTS), {
        ...request,
        status: 'approved',
        approvedAt: new Date().toISOString(),
      });

      await deleteDoc(doc(db, COLLECTIONS.REQUESTS, requestId));

      const slotRef = doc(db, COLLECTIONS.SLOTS, request.date);
      await setDoc(slotRef, {
        [request.hour]: { 
          status: 'booked', 
          request: { ...request, status: 'approved' } 
        }
      }, { merge: true });
    } catch (error) {
      console.error('Approval error:', error);
    }
  }, [requests]);

  const rejectRequest = useCallback(async (requestId) => {
    const request = requests.find(r => r.id === requestId);
    if (!request) return;

    try {
      await deleteDoc(doc(db, COLLECTIONS.REQUESTS, requestId));

      const slotRef = doc(db, COLLECTIONS.SLOTS, request.date);
      await setDoc(slotRef, {
        [request.hour]: { status: 'available', request: null }
      }, { merge: true });
    } catch (error) {
      console.error('Rejection error:', error);
    }
  }, [requests]);

  const cancelAppointment = useCallback(async (appointmentId, cancelNote) => {
    const appointment = appointments.find(a => a.id === appointmentId);
    if (!appointment) return;

    try {
      await addDoc(collection(db, COLLECTIONS.CANCELLED), {
        ...appointment,
        status: 'cancelled',
        cancelNote,
        cancelledAt: new Date().toISOString(),
      });

      await deleteDoc(doc(db, COLLECTIONS.APPOINTMENTS, appointmentId));

      const slotRef = doc(db, COLLECTIONS.SLOTS, appointment.date);
      await setDoc(slotRef, {
        [appointment.hour]: { status: 'available', request: null }
      }, { merge: true });
    } catch (error) {
      console.error('Cancellation error:', error);
    }
  }, [appointments]);

  const blockSlot = useCallback(async (date, hour) => {
    const dateKey = formatDateKey(date);
    try {
      const slotRef = doc(db, COLLECTIONS.SLOTS, dateKey);
      await setDoc(slotRef, {
        [hour]: { status: 'blocked', request: null }
      }, { merge: true });
    } catch (error) {
      console.error('Block error:', error);
    }
  }, []);

  const unblockSlot = useCallback(async (date, hour) => {
    const dateKey = formatDateKey(date);
    try {
      const slotRef = doc(db, COLLECTIONS.SLOTS, dateKey);
      await setDoc(slotRef, {
        [hour]: { status: 'available', request: null }
      }, { merge: true });
    } catch (error) {
      console.error('Unblock error:', error);
    }
  }, []);

  const getSortedRequests = useCallback(() => {
    return [...requests].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }, [requests]);

  const setSlotDuration = useCallback(async (duration) => {
    try {
      const settingsRef = doc(db, COLLECTIONS.SETTINGS, 'app');
      await setDoc(settingsRef, { slotDuration: duration }, { merge: true });
    } catch (error) {
      console.error('Slot duration update error:', error);
    }
  }, []);

  const value = {
    slots,
    requests,
    appointments,
    cancelledAppointments,
    workingHours,
    slotDuration,
    setSlotDuration,
    loading,
    getSlotsForDay,
    createRequest,
    approveRequest,
    rejectRequest,
    cancelAppointment,
    blockSlot,
    unblockSlot,
    getSortedRequests,
    hasPendingRequest,
  };

  return (
    <ScheduleContext.Provider value={value}>
      {children}
    </ScheduleContext.Provider>
  );
}

export function useSchedule() {
  const context = useContext(ScheduleContext);
  if (!context) {
    throw new Error('useSchedule must be used within a ScheduleProvider');
  }
  return context;
}

