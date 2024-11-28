import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/sequelize';
import Lesson from './lessons';
import Teacher from './teachers';

class LessonTeacher extends Model {
  public lesson_id!: number;
  public teacher_id!: number;
}

LessonTeacher.init(
  {
    lesson_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Lesson,
        key: 'id'
      },
      primaryKey: true
    },
    teacher_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Teacher,
        key: 'id'
      },
      primaryKey: true
    }
  },
  {
    sequelize,
    tableName: 'lesson_teachers',
    timestamps: false
  }
);

export default LessonTeacher;
