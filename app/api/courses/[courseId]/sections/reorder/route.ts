import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (
  req: NextRequest,
  { params }: { params: { courseId: string } }
) => {
  try {
    const { userId } = auth();
    const { courseId } = params;
    const { list } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await db.course.findUnique({
      where: {
        id: courseId,
        instructorId: userId,
      },
    });

    if (!course) {
      return new NextResponse("Course not found", { status: 404 });
    }

    for (let item of list) {
      await db.section.update({
        where: {
          id: item.id,
        },
        data: {
          position: item.position,
        },
      });
    }

    return NextResponse.json("Reordered successfully", { status: 200 });
  } catch (error) {
    console.log("[api/courses/[courseId]/sections/reorder] PUT", error);
    return new NextResponse("Something went wrong", { status: 500 });
  }
};
