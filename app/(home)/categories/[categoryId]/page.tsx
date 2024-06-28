import getCoursesByCategory from "@/app/actions/getCourses";
import CourseCard from "@/components/courses/CourseCard";
import Categories from "@/components/custom/Categories";
import { db } from "@/lib/db";

const CoursesByCategory = async ({
  params,
}: {
  params: { categoryId: string };
}) => {
  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const courses = await getCoursesByCategory(params.categoryId);

  return (
    <div className="md:mt-5 md:px-10 xl:px-16 pb-16">
      <Categories
        categories={categories}
        selectedCategory={params.categoryId}
      />
      <div className="flex flex-wrap gap-7 justify-center">
        {courses.length > 0 ? (
          courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))
        ) : (
          <p className="text-center font-bold text-xl text-rose-500">
            No courses found for this category. <br />
            <span className="italic text-black">
              Please select another category.
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default CoursesByCategory;
