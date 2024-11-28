import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/sequelize';

class Teacher extends Model {
  public id!: number;
  public name!: string;
}

Teacher.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(10)
    }
  },
  {
    sequelize,
    tableName: 'teachers',
    timestamps: false
  }
);

export default Teacher;
