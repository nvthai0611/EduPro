import { useQuery } from "@tanstack/react-query";
import { sectionService } from "../services/sectionService";

// Hook để lấy sections với content cho learners
export const useSectionsWithContent = (courseId, enabled = true) => {
  return useQuery({
    queryKey: ["sections", "content", courseId],
    queryFn: () => sectionService.getSectionsWithContent(courseId),
    enabled: enabled && !!courseId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2
  });
};