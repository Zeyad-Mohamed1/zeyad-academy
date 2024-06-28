import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import Mux from "@mux/mux-node";

const { video } = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET,
});
export const POST = async (
  req: NextRequest,
  { params }: { params: { courseId: string; sectionId: string } }
) => {
  try {
    const { userId } = auth();
    const { courseId, sectionId } = params;
    const values = await req.json();

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

    const section = await db.section.update({
      where: {
        id: sectionId,
        courseId,
      },
      data: {
        ...values,
      },
    });

    if (values.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: {
          sectionId,
        },
      });

      if (existingMuxData) {
        await video.assets.delete(existingMuxData.assetId);

        await db.muxData.delete({
          where: {
            id: existingMuxData.id,
          },
        });
      }
    }

    const asset = await video.assets.create({
      input: values.videoUrl,
      playback_policy: ["public"],
      test: false,
    });

    await db.muxData.create({
      data: {
        assetId: asset.id,
        playbackId: asset.playback_ids?.[0]?.id,
        sectionId,
      },
    });

    return NextResponse.json(section, { status: 200 });
  } catch (error) {
    console.log("[api/courses/[courseId]/sections/[sectionId]] POST", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};

export const DELETE = async (
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

    if (section.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: {
          sectionId,
        },
      });
      if (existingMuxData) {
        await video.assets.delete(existingMuxData.assetId);
        await db.muxData.delete({
          where: {
            id: existingMuxData.id,
          },
        });
      }
    }

    await db.section.delete({
      where: {
        id: sectionId,
        courseId,
      },
    });

    const publishedSectionsInCourse = await db.section.findMany({
      where: {
        courseId,
        isPublished: true,
      },
    });

    if (publishedSectionsInCourse.length === 0) {
      await db.course.update({
        where: {
          id: courseId,
        },
        data: {
          isPublished: false,
        },
      });
    }

    return NextResponse.json("Section Deleted", { status: 200 });
  } catch (error) {
    console.log("[api/courses/[courseId]/sections/[sectionId]] DELETE", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};
