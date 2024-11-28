import Lesson from './lessons';
import Teacher from './teachers';
import Student from './students';
import LessonStudent from './lesson-students';
import LessonTeacher from './lesson-teachers';

Lesson.belongsToMany(Teacher, { 
  through: LessonTeacher,
  foreignKey: 'lesson_id',
  otherKey: 'teacher_id'
});
Teacher.belongsToMany(Lesson, { 
  through: LessonTeacher,
  foreignKey: 'teacher_id',
  otherKey: 'lesson_id'
});

Lesson.belongsToMany(Student, { 
  through: LessonStudent,
  foreignKey: 'lesson_id',
  otherKey: 'student_id'
});
Student.belongsToMany(Lesson, { 
  through: LessonStudent,
  foreignKey: 'student_id',
  otherKey: 'lesson_id'
});

export { Lesson, Teacher, Student, LessonStudent, LessonTeacher };
