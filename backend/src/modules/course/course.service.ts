import { courseSchema } from "../../database/schema";
import { DrizzleClientType } from "../../database/db.connection";
import { eq } from "drizzle-orm";
import { zCourseSchema } from "./course.dto";

export class CourseService {
  private readonly db: Partial<DrizzleClientType>;

  constructor(db: Partial<DrizzleClientType>) {
    this.db = db;
  }

  async getAll() {
    const courses = await this.db.select().from(courseSchema);
    return courses;
  }

  async getOne(id: string) {
    const course = await this.db
      .select()
      .from(courseSchema)
      .where(eq(courseSchema.id, id));

    return course;
  }

  async create(course: zCourseSchema) {
    const { title } = course;
    const newCourse = await this.db
      .insert(courseSchema)
      .values({
        title,
      })
      .returning();

    return newCourse;
  }

  async update(id: string, course: zCourseSchema) {
    const [updatedCourse] = await this.db
      .update(courseSchema)
      .set({ ...course })
      .where(eq(courseSchema.id, id))
      .returning();

    return updatedCourse;
  }

  async delete(id: string) {
    const [deletedCourse] = await this.db
      .delete(courseSchema)
      .where(eq(courseSchema.id, id))
      .returning();

    return deletedCourse;
  }
}
