import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/sequelize';
import Lesson from './lessons';
import Student from './students';

class LessonStudent extends Model {
  public lesson_id!: number;
  public student_id!: number;
  public visit!: boolean;
}

LessonStudent.init(
  {
    lesson_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Lesson,
        key: 'id'
      },
      primaryKey: true
    },
    student_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Student,
        key: 'id'
      },
      primaryKey: true
    },
    visit: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  },
  {
    sequelize,
    tableName: 'lesson_students',
    timestamps: false
  }
);

export default LessonStudent;
