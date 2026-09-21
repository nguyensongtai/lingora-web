import { ApiError, apiClient, unwrap, type ApiErrorBody } from "@/lib/api/client";

import type {
  Course,
  CourseCreate,
  CourseList,
  CourseUpdate,
  Lesson,
  LessonCreate,
  LessonList,
  LessonUpdate,
  ListCoursesQuery,
} from "./types";

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

/* ---------- thao tác quản trị ---------- */

/**
 * Route ghi đi qua Route Handler của Next chứ không gọi thẳng API: access token
 * nằm trong httpOnly cookie và chỉ server đọc được.
 */
async function callAdmin<T>(path: string, init: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: { "Content-Type": "application/json", ...init.headers },
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as ApiErrorBody | null;
    throw new ApiError(response.status, body ?? undefined);
  }

  if (response.status === 204) {
    return undefined as T;
  }
  return (await response.json()) as T;
}

export function createCourse(input: CourseCreate): Promise<Course> {
  return callAdmin<Course>("/api/admin/courses", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateCourse(
  courseId: string,
  input: CourseUpdate,
): Promise<Course> {
  return callAdmin<Course>(`/api/admin/courses/${courseId}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function deleteCourse(courseId: string): Promise<void> {
  return callAdmin<void>(`/api/admin/courses/${courseId}`, { method: "DELETE" });
}

export function createLesson(
  courseId: string,
  input: LessonCreate,
): Promise<Lesson> {
  return callAdmin<Lesson>(`/api/admin/courses/${courseId}/lessons`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateLesson(
  lessonId: string,
  input: LessonUpdate,
): Promise<Lesson> {
  return callAdmin<Lesson>(`/api/admin/lessons/${lessonId}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function deleteLesson(lessonId: string): Promise<void> {
  return callAdmin<void>(`/api/admin/lessons/${lessonId}`, { method: "DELETE" });
}

/** lessonIds phải là toàn bộ bài của khoá, theo thứ tự mong muốn. */
export function reorderLessons(
  courseId: string,
  lessonIds: string[],
): Promise<void> {
  return callAdmin<void>(`/api/admin/courses/${courseId}/lessons/order`, {
    method: "PUT",
    body: JSON.stringify({ lesson_ids: lessonIds }),
  });
}
