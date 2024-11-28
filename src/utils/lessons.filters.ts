import { Op, WhereOptions, Includeable, FindAttributeOptions, Sequelize, literal } from 'sequelize';
import { Student, Teacher } from '../common/models';
import { LessonFilters } from '../common/interfaces/interfaces';

interface FilterResult {
  where: WhereOptions;
  include: Includeable[];
  attributes?: FindAttributeOptions;
  group?: string[];
  having?: unknown;
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

  const result: FilterResult = { where, include };

  if (filters.studentsCount) {
    const [minCount, maxCount] = filters.studentsCount.split(',').map(Number);
    result.attributes = {
      include: [[Sequelize.fn('COUNT', Sequelize.col('Students.id')), 'studentCount']]
    };
    result.group = ['Lesson.id'];
    result.having = maxCount
      ? literal(`COUNT(DISTINCT "Students"."id") BETWEEN ${minCount} AND ${maxCount}`)
      : literal(`COUNT(DISTINCT "Students"."id") = ${minCount}`);
  }

  return result;
}

