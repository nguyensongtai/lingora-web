import Link from "next/link";
import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { fetchCourseLessons, fetchCourses } from "@/features/course/api";
import { COURSE_LEVELS, type Course, type CourseLevel } from "@/features/course/types";
import { LevelStrip } from "@/features/learn/components/level-strip";
import { StartCard } from "@/features/learn/components/start-card";
import { readCurrentUser } from "@/lib/auth/current-user";

const MAX_COURSES = 100;

export default function HomePage() {
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
  const [user, published] = await Promise.all([
    readCurrentUser(),
    fetchCourses({ status: "published", page_size: MAX_COURSES }),
  ]);

  const counts = countByLevel(published.items);
  const starter = pickStarter(published.items);
  const lessons = starter ? (await fetchCourseLessons(starter.id)).items : [];

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

      {starter ? <StartCard course={starter} lessons={lessons} /> : null}

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
 * Khoá mở màn là khoá cũ nhất của bậc thấp nhất đang có bài — không phải "bài
 * đang học dở" như design, vì chưa có tiến độ nào để biết điều đó.
 */
function pickStarter(courses: Course[]): Course | undefined {
  for (const level of COURSE_LEVELS) {
    const ofLevel = courses.filter((course) => course.level === level);
    if (ofLevel.length > 0) {
      return ofLevel[ofLevel.length - 1];
    }
  }
  return undefined;
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
