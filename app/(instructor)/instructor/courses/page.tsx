import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import React from "react";
import { db } from "@/lib/db";

const CoursesPage = async () => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/sign-in");
  }

  const courses = await db.course.findMany({
    where: {
      instructorId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="px-6 py-4">
      <Link href="/instructor/create-course">
        <Button>Create New Course</Button>
      </Link>

      <div className="mt-5">
        {/* <DataTable columns={columns} data={courses} /> */}
        {courses.map((course) => (
          <div key={course.id}>
            <Link href={`/instructor/courses/${course.id}/basic`}>
              {course.title}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoursesPage;
