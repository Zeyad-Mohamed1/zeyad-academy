import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (
  req: NextRequest,
  { params }: { params: { courseId: string; sectionId: string } }
) => {
  try {
    const { userId } = auth();
    const { courseId, sectionId } = params;

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

    const section = await db.section.findUnique({
      where: {
        id: sectionId,
        courseId,
      },
    });

    if (!section) {
      return new NextResponse("Section not found", { status: 404 });
    }

    const { name, fileUrl } = await req.json();

    const resource = await db.resource.create({
      data: {
        name,
        fileUrl,
        sectionId,
      },
    });

    return NextResponse.json(resource, { status: 201 });
  } catch (error) {
    console.log("Resources_POST", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};
