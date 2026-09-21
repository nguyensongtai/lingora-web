"use client";

import { Button } from "@/components/ui/button";

import { useCourses } from "../hooks/use-courses";
import type { CourseFilters, CourseList } from "../types";
import { CourseCard } from "./course-card";

type CourseGridProps = {
  filters: CourseFilters;
  /** Trang đầu đã được Server Component lấy sẵn. */
  initialPage: CourseList;
};

/**
 * Client Component vì cần nút "Xem thêm"; trang đầu vẫn do server render nên
 * người dùng thấy nội dung ngay cả trước khi JS chạy.
 */
export function CourseGrid({ filters, initialPage }: CourseGridProps) {
  const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useCourses(filters, { initialPage });

  const courses = data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>

      {error ? (
        <p className="text-destructive text-sm" role="alert">
          Không tải thêm được khoá học. Thử lại sau.
        </p>
      ) : null}

      {hasNextPage ? (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => void fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? "Đang tải…" : "Xem thêm"}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
