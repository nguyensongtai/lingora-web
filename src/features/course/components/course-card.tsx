import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { LEVEL_LABELS, STATUS_LABELS, type Course } from "../types";

export function CourseCard({ course }: { course: Course }) {
  return (
    <Card className="transition-colors hover:border-foreground/20">
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">
            {course.level} · {LEVEL_LABELS[course.level]}
          </Badge>
          {course.status === "draft" ? (
            <Badge variant="outline">{STATUS_LABELS.draft}</Badge>
          ) : null}
        </div>
        <CardTitle className="text-xl">
          <Link
            href={`/courses/${course.id}`}
            className="after:absolute after:inset-0 hover:underline"
          >
            {course.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {course.description ? (
          <p className="text-muted-foreground line-clamp-2 text-sm">
            {course.description}
          </p>
        ) : (
          <p className="text-muted-foreground/60 text-sm italic">
            Chưa có mô tả.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
