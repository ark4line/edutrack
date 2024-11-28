import { FindAndCountOptions, WhereOptions, Includeable } from 'sequelize';
import { Lesson } from '../models';
import { createLessonFilters } from '../../utils/lessons.filters';
import { LessonFilters, LessonWithRelations } from '../interfaces/interfaces';

export class LessonsRepository {
  async findLessons(
    filters: LessonFilters,
    page: number,
    lessonsPerPage: number
  ): Promise<{
    rows: LessonWithRelations[];
    count: number;
  }> {
    const filterResult = createLessonFilters(filters);

    const queryOptions: FindAndCountOptions<Lesson> = {
      ...filterResult,
      distinct: true,
      offset: (page - 1) * lessonsPerPage,
      limit: lessonsPerPage,
      where: filterResult.where as WhereOptions<Lesson>,
      include: filterResult.include as Includeable[],
      attributes: filterResult.attributes,
      group: filterResult.group,
      having: filterResult.having as WhereOptions<Lesson>
    };

    const lessons = await Lesson.findAndCountAll(queryOptions);

    return {
      rows: lessons.rows as LessonWithRelations[],
      count: lessons.count
    };
  }
}

