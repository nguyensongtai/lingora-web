import { apiClient, unwrap } from "@/lib/api/client";

import type { Course, CourseList, LessonList, ListCoursesQuery } from "./types";

export async function fetchCourses(
  query: ListCoursesQuery,
  signal?: AbortSignal,
): Promise<CourseList> {
  return unwrap(
    await apiClient.GET("/courses", { params: { query }, signal }),
  );
}

export async function fetchCourse(
  courseId: string,
  signal?: AbortSignal,
): Promise<Course> {
  return unwrap(
    await apiClient.GET("/courses/{courseId}", {
      params: { path: { courseId } },
      signal,
    }),
  );
}

export async function fetchCourseBySlug(
  slug: string,
  signal?: AbortSignal,
): Promise<Course> {
  return unwrap(
    await apiClient.GET("/courses/by-slug/{slug}", {
      params: { path: { slug } },
      signal,
    }),
  );
}

export async function fetchCourseLessons(
  courseId: string,
  signal?: AbortSignal,
): Promise<LessonList> {
  return unwrap(
    await apiClient.GET("/courses/{courseId}/lessons", {
      params: { path: { courseId } },
      signal,
    }),
  );
}
