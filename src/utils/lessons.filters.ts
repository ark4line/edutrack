import { Op, WhereOptions, Includeable, FindAttributeOptions, Sequelize } from 'sequelize';
import { Student, Teacher } from '../common/models';
import { LessonFilters } from '../common/interfaces/interfaces';

interface FilterResult {
  where: WhereOptions;
  include: Includeable[];
  attributes?: FindAttributeOptions;
}

export function createLessonFilters(filters: LessonFilters): FilterResult {
  const where: WhereOptions = {};
  const include: Includeable[] = [];

  if (filters.date) {
    const [startDate, endDate] = filters.date.split(',');
    where.date = endDate 
      ? { [Op.between]: [startDate, endDate] }
      : startDate;
  }

  if (filters.status !== undefined) {
    where.status = filters.status;
  }

  if (filters.teacherIds) {
    const teacherIds = filters.teacherIds.split(',').map(Number);
    include.push({
      model: Teacher,
      where: { id: { [Op.in]: teacherIds } },
      through: { attributes: [] }
    });
  } else {
    include.push({
      model: Teacher,
      through: { attributes: [] }
    });
  }

  include.push({
    model: Student,
    through: { attributes: ['visit'] }
  });

  const result: FilterResult = { 
    where, 
    include,
    attributes: {
      include: [
        [
          Sequelize.literal(`(
            SELECT COUNT(DISTINCT "lesson_students"."student_id")
            FROM "lesson_students"
            WHERE "lesson_students"."lesson_id" = "Lesson"."id"
          )`),
          'studentsCount'
        ]
      ]
    }
  };

  if (filters.studentsCount) {
    const [minCount, maxCount] = filters.studentsCount.split(',').map(Number);
    if (maxCount) {
      result.where = {
        ...result.where,
        [Op.and]: [
          Sequelize.where(
            Sequelize.literal(`(
              SELECT COUNT(DISTINCT "lesson_students"."student_id")
              FROM "lesson_students"
              WHERE "lesson_students"."lesson_id" = "Lesson"."id"
            )`),
            { [Op.between]: [minCount, maxCount] }
          )
        ]
      };
    } else {
      result.where = {
        ...result.where,
        [Op.and]: [
          Sequelize.where(
            Sequelize.literal(`(
              SELECT COUNT(DISTINCT "lesson_students"."student_id")
              FROM "lesson_students"
              WHERE "lesson_students"."lesson_id" = "Lesson"."id"
            )`),
            minCount
          )
        ]
      };
    }
  }

  return result;
}
