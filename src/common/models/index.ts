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

LessonStudent.belongsTo(Lesson, { foreignKey: 'lesson_id' });
LessonStudent.belongsTo(Student, { foreignKey: 'student_id' });
Lesson.hasMany(LessonStudent, { foreignKey: 'lesson_id' });
Student.hasMany(LessonStudent, { foreignKey: 'student_id' });

LessonTeacher.belongsTo(Lesson, { foreignKey: 'lesson_id' });
LessonTeacher.belongsTo(Teacher, { foreignKey: 'teacher_id' });
Lesson.hasMany(LessonTeacher, { foreignKey: 'lesson_id' });
Teacher.hasMany(LessonTeacher, { foreignKey: 'teacher_id' });

export { Lesson, Teacher, Student, LessonStudent, LessonTeacher };
