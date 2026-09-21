import Link from "next/link";
import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { fetchCourseLessons, fetchCourses } from "@/features/course/api";
import {
  COURSE_LEVELS,
  type Course,
  type CourseLevel,
  type Lesson,
} from "@/features/course/types";
import { LevelStrip } from "@/features/learn/components/level-strip";
import { StartCard } from "@/features/learn/components/start-card";
import { TodayCard } from "@/features/progress/components/today-card";
import { readProgress } from "@/features/progress/server";
import {
  completedSetOf,
  type ProgressSnapshot,
} from "@/features/progress/types";
import { readCurrentUser } from "@/lib/auth/current-user";

const MAX_COURSES = 100;

export function HomeScreen() {
  return (
    <main className="mx-auto flex w-full max-w-240 flex-1 flex-col gap-8 px-4 pt-1 pb-24 app:px-8 app:pt-2 app:pb-16">
      {/* Cookie và danh sách khoá đều là dữ liệu động: Cache Components bắt buộc Suspense. */}
      <Suspense fallback={<HomeSkeleton />}>
        <HomeContent />
      </Suspense>
    </main>
  );
}

async function HomeContent() {
  const [user, published, progress] = await Promise.all([
    readCurrentUser(),
    fetchCourses({ status: "published", page_size: MAX_COURSES }),
    readProgress(),
  ]);

  const counts = countByLevel(published.items);
  const completed = completedSetOf(progress);
  const featured = pickFeatured(published.items, progress);
  const lessons = featured ? (await fetchCourseLessons(featured.id)).items : [];
  const doneCount = lessons.filter((lesson) => completed.has(lesson.id)).length;

  return (
    <>
      <div>
        <h1 className="text-[26px] leading-tight font-bold tracking-tight">
          {user ? `Chào ${firstNameOf(user.display_name)}` : "Chào bạn"}
        </h1>
        <p className="text-muted-foreground mt-1.5">
          {published.items.length === 0
            ? "Chưa có khoá học nào được xuất bản."
            : `Đang có ${published.items.length} khoá học sẵn sàng, xếp theo khung CEFR.`}
        </p>
      </div>

      <div className="grid gap-4 min-[1100px]:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        {featured ? (
          <StartCard
            course={featured}
            lessons={lessons}
            doneCount={doneCount}
            nextLesson={firstUnfinished(lessons, completed)}
          />
        ) : null}
        {user ? <TodayCard initialProgress={progress} /> : null}
      </div>

      <LevelStrip counts={counts} />

      {user ? null : (
        <p className="text-muted-foreground text-sm">
          <Link href="/login" className="text-brand-strong font-semibold">
            Đăng nhập
          </Link>{" "}
          để dùng khu vực quản trị nội dung.
        </p>
      )}
    </>
  );
}

/**
 * Khoá được nêu trên trang chủ, theo đúng thứ tự người học mong đợi khi bấm
 * "tiếp tục": khoá đang học dở → khoá còn dở sớm nhất trong lộ trình → khoá mở
 * màn. Số dở/xong lấy từ snapshot nên không phải gọi thêm lần nào.
 */
function pickFeatured(
  courses: Course[],
  progress: ProgressSnapshot,
): Course | undefined {
  const unfinished = new Set(
    progress.courses
      .filter((course) => course.completed_count < course.lesson_count)
      .map((course) => course.course_id),
  );

  const latest = courses.find(
    (course) =>
      course.id === progress.latest_course_id && unfinished.has(course.id),
  );
  if (latest) {
    return latest;
  }

  const byPath = orderedByPath(courses);
  return byPath.find((course) => unfinished.has(course.id)) ?? byPath[0];
}

/** Khoá xếp theo bậc tăng dần, trong mỗi bậc thì theo position người soạn đặt. */
function orderedByPath(courses: Course[]): Course[] {
  return COURSE_LEVELS.flatMap((level) =>
    courses
      .filter((course) => course.level === level)
      .sort((a, b) => a.position - b.position),
  );
}

/** Bài chưa đánh dấu xong đầu tiên; undefined khi khoá đã xong hết. */
function firstUnfinished(
  lessons: Lesson[],
  completed: Set<string>,
): Lesson | undefined {
  return lessons.find((lesson) => !completed.has(lesson.id));
}

function countByLevel(courses: Course[]): Record<CourseLevel, number> {
  const counts = Object.fromEntries(
    COURSE_LEVELS.map((level) => [level, 0]),
  ) as Record<CourseLevel, number>;

  for (const course of courses) {
    counts[course.level] += 1;
  }
  return counts;
}

/** "Nguyễn Song Tài" → "Tài": tiếng Việt gọi nhau bằng tên cuối. */
function firstNameOf(displayName: string): string {
  const words = displayName.trim().split(/\s+/).filter(Boolean);
  return words[words.length - 1] ?? displayName;
}

function HomeSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-5 w-80" />
      </div>
      <Skeleton className="rounded-card h-52 w-full" />
      <Skeleton className="h-16 w-full" />
    </div>
  );
}
