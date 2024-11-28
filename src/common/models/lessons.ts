import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/sequelize';

class Lesson extends Model {
  public id!: number;
  public date!: Date;
  public title!: string;
  public status!: number;
}

Lesson.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING(100)
    },
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  },
  {
    sequelize,
    tableName: 'lessons',
    timestamps: false
  }
);

export default Lesson;
