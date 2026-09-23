import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { fetchCourse, fetchCourseLessons, fetchLesson } from "@/features/course/api";
import { LessonBody } from "@/features/course/components/lesson-body";
import { LessonFooter } from "@/features/course/components/lesson-footer";
import { LessonStepper } from "@/features/course/components/lesson-stepper";
import { LessonWords } from "@/features/course/components/lesson-words";
import { buildSteps, type LessonStep } from "@/features/course/lesson-steps";
import { PracticeScreen } from "@/features/practice/components/practice-screen";
import { readSession } from "@/features/practice/server";
import type { PracticeQuestion } from "@/features/practice/types";
import { readProgress } from "@/features/progress/server";
import { handleMissing } from "@/lib/api/missing";
import { readCurrentUser } from "@/lib/auth/current-user";

export async function generateMetadata({
  params,
}: PageProps<"/lessons/[id]">): Promise<Metadata> {
  const { id } = await params;
  const lesson = await fetchLesson(id).catch(() => null);

  return lesson
    ? { title: lesson.title, description: lesson.summary || undefined }
    : { title: "Bài học" };
}

export default function LessonPage({ params }: PageProps<"/lessons/[id]">) {
  return (
    <main className="mx-auto flex w-full max-w-180 flex-1 flex-col gap-6 px-4 pt-1 pb-24 app:px-8 app:pt-2 app:pb-16">
      <Suspense fallback={<LessonSkeleton />}>
        <Lesson params={params} />
      </Suspense>
    </main>
  );
}

async function Lesson({ params }: { params: PageProps<"/lessons/[id]">["params"] }) {
  const { id } = await params;

  const lesson = await fetchLesson(id).catch(handleMissing);
  const steps = buildSteps(lesson);
  const practises = steps.some((step) => step.key === "practice");

  // Khoá và danh sách bài chỉ cần sau khi biết bài thuộc khoá nào.
  const [course, siblings, progress, user, questions] = await Promise.all([
    fetchCourse(lesson.course_id).catch(handleMissing),
    fetchCourseLessons(lesson.course_id).catch(handleMissing),
    readProgress(),
    readCurrentUser(),
    // Luyện tập hỏng thì chỉ bước đó báo lỗi; cả bài không được sập theo.
    practises
      ? readSession({ kind: "lesson", lessonId: lesson.id }).catch(() => null)
      : Promise.resolve(null),
  ]);

  const footer = (
    <LessonFooter
      lesson={lesson}
      courseId={course.id}
      siblings={siblings.items}
      initialProgress={progress}
      canTrack={user !== null}
    />
  );

  return (
    <>
      <div>
        <Link
          href={`/courses/${course.id}`}
          className="text-muted-foreground hover:text-foreground text-sm"
        >
          ← {course.title}
        </Link>
        <h1 className="mt-3 text-[26px] leading-tight font-bold tracking-tight">
          {lesson.title}
        </h1>
        {lesson.summary ? (
          <p className="text-muted-foreground mt-1.5">{lesson.summary}</p>
        ) : null}
      </div>

      {steps.length === 0 ? (
        <>
          <p className="text-muted-foreground border-border bg-card rounded-card border px-4 py-8 text-center text-sm">
            Bài này chưa có nội dung.
          </p>
          {footer}
        </>
      ) : (
        <LessonStepper
          finish={footer}
          steps={steps.map((step) => ({
            key: step.key,
            title: step.title,
            caption: step.caption,
            panel: <StepPanel step={step} lessonId={lesson.id} questions={questions} />,
          }))}
        />
      )}
    </>
  );
}

function StepPanel({
  step,
  lessonId,
  questions,
}: {
  step: LessonStep;
  lessonId: string;
  questions: PracticeQuestion[] | null;
}) {
  switch (step.key) {
    case "vocabulary":
      return <LessonWords words={step.words} />;
    case "dialogue":
    case "usage":
      return <LessonBody blocks={step.blocks} />;
    case "practice":
      return questions === null ? (
        <p className="bg-danger-soft text-danger rounded-xl px-4 py-3 text-sm">
          Chưa tải được phần luyện tập. Tải lại trang để thử lại.
        </p>
      ) : (
        <PracticeScreen scope={{ kind: "lesson", lessonId }} initialQuestions={questions} />
      );
  }
}

function LessonSkeleton() {
  return (
    <>
      <div className="space-y-3">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-full" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-24 w-full rounded-card" />
        <Skeleton className="h-24 w-full rounded-card" />
      </div>
    </>
  );
}
