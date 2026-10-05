import { QueryClient } from "@tanstack/react-query";
import { extractErrorMessage } from "@/services/api-client";

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000, 
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
          
          const status = (error as { response?: { status?: number } })?.response?.status;
          if (status === 401 || status === 403) return false;
          return failureCount < 2;
        },
      },
      mutations: {
        onError: (error) => {
         
          console.error(extractErrorMessage(error));
        },
      },
    },
  });
}
