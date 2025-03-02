import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  query, 
  where, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  orderBy,
  CollectionReference,
  DocumentData,
  QueryConstraint
} from 'firebase/firestore';

// Generic fetch data hook
export const useFetchData = <T>(
  queryKey: string[],
  collection: CollectionReference<DocumentData>,
  constraints: QueryConstraint[] = []
) => {
  return useQuery({
    queryKey,
    queryFn: async (): Promise<T[]> => {
      const q = query(collection, ...constraints);
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as T[];
    },
  });
};

// Generic create data hook
export const useCreateData = <T extends Record<string, any>>(
  collection: CollectionReference<DocumentData>,
  queryKey: string[]
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: T) => {
      const docRef = await addDoc(collection, data);
      return { id: docRef.id, ...data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
};

// Generic update data hook
export const useUpdateData = <T extends Record<string, any>>(
  collection: CollectionReference<DocumentData>,
  queryKey: string[]
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<T> }) => {
      const docRef = doc(collection, id);
      await updateDoc(docRef, data);
      return { id, ...data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
};

// Generic delete data hook
export const useDeleteData = (
  collection: CollectionReference<DocumentData>,
  queryKey: string[]
) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const docRef = doc(collection, id);
      await deleteDoc(docRef);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
};