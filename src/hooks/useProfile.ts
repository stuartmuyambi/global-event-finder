import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { usersCollection } from '@/utils/firebase';
import type { UserProfile } from '@/utils/firebase';

// Hook to fetch user profile data
export const useProfile = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['profile', user?.uid],
    queryFn: async (): Promise<UserProfile | null> => {
      if (!user?.uid) return null;
      const docRef = doc(usersCollection, user.uid);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? docSnap.data() as UserProfile : null;
    },
    enabled: !!user?.uid,
  });

  // Mutation to update profile
  const updateProfile = useMutation({
    mutationFn: async (data: Partial<UserProfile>) => {
      if (!user?.uid) throw new Error('No user logged in');
      const docRef = doc(usersCollection, user.uid);
      await updateDoc(docRef, data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', user?.uid] });
    },
  });

  return {
    profile,
    isLoading,
    error,
    updateProfile: updateProfile.mutate,
    isUpdating: updateProfile.isPending,
  };
};