import request from 'supertest';
import app from '../app';
import { LessonsRepository } from '../common/repositories/lessons.repository';

jest.mock('../common/models', () => ({
  Lesson: {
    findAndCountAll: jest.fn()
  }
}));

jest.mock('../common/repositories/lessons.repository');

describe('Lessons API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return lessons with default pagination', async() => {
    const mockLessons = [
      {
        id: 1,
        date: new Date('2023-01-01'),
        title: 'Math 101',
        status: 1,
        students: [{ id: 1, name: 'John Doe', visit: true }],
        teachers: [{ id: 1, name: 'Jane Smith' }]
      }
    ];

    (LessonsRepository.prototype.findLessons as jest.Mock).mockResolvedValue({
      rows: mockLessons,
      count: 1
    });

    const response = await request(app).get('/lessons');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      lessons: [
        {
          id: 1,
          date: '2023-01-01T00:00:00.000Z',
          title: 'Math 101',
          status: 1,
          visitCount: 1,
          students: [{ id: 1, name: 'John Doe', visit: true }],
          teachers: [{ id: 1, name: 'Jane Smith' }]
        }
      ],
      total: 1
    });
    expect(LessonsRepository.prototype.findLessons).toHaveBeenCalledWith(
      expect.any(Object),
      1,
      5
    );
  });

  it('should filter lessons by date range', async() => {
    const mockLessons = [
      {
        id: 2,
        date: new Date('2023-02-15'),
        title: 'Physics 101',
        status: 0,
        students: [],
        teachers: []
      }
    ];

    (LessonsRepository.prototype.findLessons as jest.Mock).mockResolvedValue({
      rows: mockLessons,
      count: 1
    });

    const response = await request(app)
      .get('/lessons')
      .query({ date: '2023-02-01,2023-02-28' });

    expect(response.status).toBe(200);
    expect(response.body.lessons[0].date).toBe('2023-02-15T00:00:00.000Z');
    expect(LessonsRepository.prototype.findLessons).toHaveBeenCalledWith(
      expect.objectContaining({ date: '2023-02-01,2023-02-28' }),
      1,
      5
    );
  });

  it('should filter lessons by status', async() => {
    (LessonsRepository.prototype.findLessons as jest.Mock).mockResolvedValue({
      rows: [],
      count: 0
    });

    const response = await request(app)
      .get('/lessons')
      .query({ status: '1' });

    expect(response.status).toBe(200);
    expect(LessonsRepository.prototype.findLessons).toHaveBeenCalledWith(
      expect.objectContaining({ status: 1 }),
      1,
      5
    );
  });

  it('should return 400 for invalid status', async() => {
    const response = await request(app)
      .get('/lessons')
      .query({ status: '2' });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Invalid status value');
  });

  it('should filter lessons by teacherIds', async() => {
    (LessonsRepository.prototype.findLessons as jest.Mock).mockResolvedValue({
      rows: [],
      count: 0
    });

    const response = await request(app)
      .get('/lessons')
      .query({ teacherIds: '1,2,3' });

    expect(response.status).toBe(200);
    expect(LessonsRepository.prototype.findLessons).toHaveBeenCalledWith(
      expect.objectContaining({ teacherIds: '1,2,3' }),
      1,
      5
    );
  });

  it('should filter lessons by studentsCount', async() => {
    (LessonsRepository.prototype.findLessons as jest.Mock).mockResolvedValue({
      rows: [],
      count: 0
    });

    const response = await request(app)
      .get('/lessons')
      .query({ studentsCount: '5,10' });

    expect(response.status).toBe(200);
    expect(LessonsRepository.prototype.findLessons).toHaveBeenCalledWith(
      expect.objectContaining({ studentsCount: '5,10' }),
      1,
      5
    );
  });

  it('should paginate results', async() => {
    (LessonsRepository.prototype.findLessons as jest.Mock).mockResolvedValue({
      rows: [],
      count: 100
    });

    const response = await request(app)
      .get('/lessons')
      .query({ page: '2', lessonsPerPage: '10' });

    expect(response.status).toBe(200);
    expect(LessonsRepository.prototype.findLessons).toHaveBeenCalledWith(
      expect.any(Object),
      2,
      10
    );
  });

  it('should return 400 for invalid date format', async() => {
    const response = await request(app)
      .get('/lessons')
      .query({ date: '2023-02-36' }); // Invalid date

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Invalid date format');
  });

  it('should handle empty result set', async() => {
    (LessonsRepository.prototype.findLessons as jest.Mock).mockResolvedValue({
      rows: [],
      count: 0
    });

    const response = await request(app).get('/lessons');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      lessons: [],
      total: 0
    });
  });
});

