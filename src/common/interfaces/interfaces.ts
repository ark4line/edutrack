import { Model } from 'sequelize';

export interface Student {
  id: number;
  name: string;
  visit: boolean;
}

export interface Teacher {
  id: number;
  name: string;
}

export interface LessonStudent {
  visit: boolean;
}

export interface LessonWithRelations extends Model {
  id: number;
  date: Date;
  title: string;
  status: number;
  students?: (Student & { lesson_students: LessonStudent })[];
  teachers?: Teacher[];
}

export interface FormattedLesson {
  id: number;
  date: Date;
  title: string;
  status: number;
  visitCount: number;
  students: Student[];
  teachers: Teacher[];
}

export interface LessonsResponse {
  lessons: FormattedLesson[];
  total: number;
}

export interface LessonFilters {
  date?: string;
  status?: number;
  teacherIds?: string;
  studentsCount?: string;
}

export interface QueryParams extends Omit<LessonFilters, 'status'> {
  status?: string;
  page?: string;
  lessonsPerPage?: string;
}
