import { useInfiniteQuery } from '@tanstack/react-query';
import { query, getDocs, startAfter, limit, QueryConstraint, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { eventsCollection } from '@/utils/firebase';
import type { Event } from '@/utils/firebase';

const EVENTS_PER_PAGE = 12;

export interface EventsResponse {
  events: Event[];
  lastVisible: QueryDocumentSnapshot<DocumentData> | null;
}

type QueryFnProps = {
  pageParam?: QueryDocumentSnapshot<DocumentData> | null;
};

export const useInfiniteEvents = (constraints: QueryConstraint[] = []) => {
  return useInfiniteQuery<EventsResponse>({
    queryKey: ['events', 'infinite', ...constraints],
    queryFn: async ({ pageParam }: QueryFnProps) => {
      let q = query(
        eventsCollection,
        ...constraints,
        limit(EVENTS_PER_PAGE)
      );

      if (pageParam) {
        q = query(
          eventsCollection,
          ...constraints,
          startAfter(pageParam),
          limit(EVENTS_PER_PAGE)
        );
      }

      const snapshot = await getDocs(q);
      const lastVisible = snapshot.docs[snapshot.docs.length - 1] || null;
      const events = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Event[];

      return {
        events,
        lastVisible,
      };
    },
    getNextPageParam: (lastPage) => lastPage.lastVisible,
    initialPageParam: null,
  });
};