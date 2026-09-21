import Link from "next/link";

import { Badge } from "@/components/ui/badge";

import { COURSE_LEVELS, type CourseLevel } from "../types";

export function LevelFilter({ active }: { active?: CourseLevel }) {
  return (
    <nav aria-label="Lọc theo trình độ" className="flex flex-wrap gap-2">
      <Link href="/courses">
        <Badge variant={active === undefined ? "default" : "outline"}>
          Tất cả
        </Badge>
      </Link>
      {COURSE_LEVELS.map((level) => (
        <Link key={level} href={`/courses?level=${level}`}>
          <Badge variant={active === level ? "default" : "outline"}>
            {level}
          </Badge>
        </Link>
      ))}
    </nav>
  );
}
