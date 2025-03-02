import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Generic fetch data hook
export const useFetchData = <T>(
  queryKey: string[],
  url: string,
  options?: RequestInit
) => {
  return useQuery({
    queryKey,
    queryFn: async (): Promise<T> => {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
        },
        ...options,
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      return response.json();
    },
  });
};

// Generic create data hook
export const useCreateData = <T, S>(url: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: T): Promise<S> => {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch relevant queries after a successful mutation
      queryClient.invalidateQueries();
    },
  });
};

// Generic update data hook
export const useUpdateData = <T, S>(url: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: T }): Promise<S> => {
      const response = await fetch(`${url}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch relevant queries after a successful mutation
      queryClient.invalidateQueries();
    },
  });
};

// Generic delete data hook
export const useDeleteData = <T>(url: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string): Promise<T> => {
      const response = await fetch(`${url}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch relevant queries after a successful mutation
      queryClient.invalidateQueries();
    },
  });
};