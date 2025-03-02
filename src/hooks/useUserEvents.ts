import { where } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { eventsCollection } from '@/utils/firebase';
import { useFetchData } from './useApi';
import type { Event } from '@/utils/firebase';

export const useUserEvents = () => {
  const { user } = useAuth();
  const uid = user?.uid || 'no-user';
  
  return useFetchData<Event>(
    ['userEvents', uid],
    eventsCollection,
    [where('createdBy', '==', uid)]
  );
};