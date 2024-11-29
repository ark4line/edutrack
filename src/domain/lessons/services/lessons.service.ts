import {
  FormattedLesson,
  LessonFilters,
  LessonsResponse,
  LessonWithRelations,
  QueryParams,
  Student,
  Teacher
} from '../../../common/interfaces/interfaces';
import { LessonsRepository } from '../../../common/repositories/lessons.repository';

export class LessonService {
  private repository: LessonsRepository;

  constructor() {
    this.repository = new LessonsRepository();
  }

  async getLessons(query: QueryParams): Promise<LessonsResponse> {
    this.validateQuery(query);

    const filters: LessonFilters = this.createFilters(query);
    const page = Number(query.page) || 1;
    const lessonsPerPage = Number(query.lessonsPerPage) || 5;

    const lessons = await this.repository.findLessons(filters, page, lessonsPerPage);

    return {
      lessons: this.formatLessons(lessons.rows),
      total: lessons.count
    };
  }

  private validateQuery(query: QueryParams): void {
    if (query.status && !['0', '1'].includes(query.status)) {
      throw new Error('Invalid status value');
    }

    if (query.date) {
      const dates = query.date.split(',');
    
      for (const date of dates) {
        if (!this.isValidISODate(date)) {
          throw new Error('Invalid date format');
        }
      }
    
      if (dates.length > 2) {
        throw new Error('Invalid date range format. Only one or two dates are allowed.');
      }
    }
  }

  private isValidISODate(date: string): boolean {
    const parsedDate = new Date(date);
    return /^\d{4}-\d{2}-\d{2}$/.test(date) && !isNaN(parsedDate.getTime());
  }

  private createFilters(query: QueryParams): LessonFilters {
    return { 
      date: query.date, 
      status: query.status !== undefined ? Number(query.status) : undefined, 
      teacherIds: query.teacherIds,
      studentsCount: query.studentsCount
    };
  }

  private formatLessons(lessons: LessonWithRelations[]): FormattedLesson[] {
    return lessons.map(lesson => {
      const students: Student[] = lesson.Students?.map(student => ({
        id: student.id,
        name: student.name,
        visit: student.LessonStudent.visit
      })) || [];

      const teachers: Teacher[] = lesson.Teachers?.map(teacher => ({
        id: teacher.id,
        name: teacher.name
      })) || [];

      return {
        id: lesson.id,
        date: lesson.date,
        title: lesson.title,
        status: lesson.status,
        studentsCount: students.length,
        visitCount: students.filter(student => student.visit).length,
        students,
        teachers
      };
    });
  }
}
