import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/sequelize';

class Student extends Model {
  public id!: number;
  public name!: string;
}

Student.init(
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
    tableName: 'students',
    timestamps: false
  }
);

export default Student;
