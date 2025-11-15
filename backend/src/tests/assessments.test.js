const request = require('supertest');
const app = require('../server');
const User = require('../models/User');
const Assessment = require('../models/Assessment');
const { connectDB, disconnectDB } = require('../database/connection');

describe('Assessment Endpoints', () => {
  let token;
  let userId;

  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Assessment.deleteMany({});
    await disconnectDB();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await Assessment.deleteMany({});

    // Create test user
    const userData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'SecurePassword123!'
    };

    const response = await request(app)
      .post('/api/auth/register')
      .send(userData);

    token = response.body.data.token;
    userId = response.body.data.user._id;
  });

  describe('GET /api/assessments/questions', () => {
    it('should get assessment questions', async () => {
      const response = await request(app)
        .get('/api/assessments/questions')
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data.questions).toBeDefined();
      expect(Array.isArray(response.body.data.questions)).toBe(true);
      expect(response.body.data.totalQuestions).toBeDefined();
    });

    it('should filter questions by type', async () => {
      const response = await request(app)
        .get('/api/assessments/questions?type=security')
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data.questions).toBeDefined();
    });
  });

  describe('POST /api/assessments/start', () => {
    it('should start a new assessment', async () => {
      const assessmentData = {
        type: 'complete'
      };

      const response = await request(app)
        .post('/api/assessments/start')
        .set('Authorization', `Bearer ${token}`)
        .send(assessmentData)
        .expect(201);

      expect(response.body.status).toBe('success');
      expect(response.body.data.assessment).toBeDefined();
      expect(response.body.data.assessment.type).toBe('complete');
      expect(response.body.data.assessment.status).toBe('in-progress');
    });

    it('should resume existing incomplete assessment', async () => {
      const assessmentData = {
        type: 'complete'
      };

      // Start first assessment
      await request(app)
        .post('/api/assessments/start')
        .set('Authorization', `Bearer ${token}`)
        .send(assessmentData);

      // Try to start another assessment of same type
      const response = await request(app)
        .post('/api/assessments/start')
        .set('Authorization', `Bearer ${token}`)
        .send(assessmentData)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.message).toContain('Resuming existing assessment');
    });

    it('should fail with invalid assessment type', async () => {
      const assessmentData = {
        type: 'invalid-type'
      };

      const response = await request(app)
        .post('/api/assessments/start')
        .set('Authorization', `Bearer ${token}`)
        .send(assessmentData)
        .expect(400);

      expect(response.body.status).toBe('error');
      expect(response.body.errors).toBeDefined();
    });

    it('should fail without authentication', async () => {
      const assessmentData = {
        type: 'complete'
      };

      const response = await request(app)
        .post('/api/assessments/start')
        .send(assessmentData)
        .expect(401);

      expect(response.body.status).toBe('error');
    });
  });

  describe('POST /api/assessments/:id/answer', () => {
    let assessmentId;

    beforeEach(async () => {
      const assessmentData = {
        type: 'complete'
      };

      const response = await request(app)
        .post('/api/assessments/start')
        .set('Authorization', `Bearer ${token}`)
        .send(assessmentData);

      assessmentId = response.body.data.assessment._id;
    });

    it('should submit an answer successfully', async () => {
      const answerData = {
        questionId: 'q1',
        value: 'yes',
        score: 2,
        level: 'intermediate'
      };

      const response = await request(app)
        .post(`/api/assessments/${assessmentId}/answer`)
        .set('Authorization', `Bearer ${token}`)
        .send(answerData)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data.assessment.answers).toBeDefined();
      expect(response.body.data.assessment.answers.length).toBe(1);
    });

    it('should update existing answer', async () => {
      const answerData = {
        questionId: 'q1',
        value: 'yes',
        score: 2,
        level: 'intermediate'
      };

      // Submit first answer
      await request(app)
        .post(`/api/assessments/${assessmentId}/answer`)
        .set('Authorization', `Bearer ${token}`)
        .send(answerData);

      // Update the same answer
      const updatedAnswerData = {
        questionId: 'q1',
        value: 'no',
        score: 1,
        level: 'beginner'
      };

      const response = await request(app)
        .post(`/api/assessments/${assessmentId}/answer`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatedAnswerData)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data.assessment.answers.length).toBe(1);
      expect(response.body.data.assessment.answers[0].value).toBe('no');
    });

    it('should fail with invalid answer data', async () => {
      const answerData = {
        questionId: 'q1',
        value: 'yes',
        score: 5, // Invalid score
        level: 'intermediate'
      };

      const response = await request(app)
        .post(`/api/assessments/${assessmentId}/answer`)
        .set('Authorization', `Bearer ${token}`)
        .send(answerData)
        .expect(400);

      expect(response.body.status).toBe('error');
      expect(response.body.errors).toBeDefined();
    });

    it('should fail with non-existent assessment', async () => {
      const answerData = {
        questionId: 'q1',
        value: 'yes',
        score: 2,
        level: 'intermediate'
      };

      const response = await request(app)
        .post('/api/assessments/507f1f77bcf86cd799439011/answer')
        .set('Authorization', `Bearer ${token}`)
        .send(answerData)
        .expect(404);

      expect(response.body.status).toBe('error');
      expect(response.body.message).toContain('Assessment not found');
    });
  });

  describe('POST /api/assessments/:id/complete', () => {
    let assessmentId;

    beforeEach(async () => {
      const assessmentData = {
        type: 'complete'
      };

      const response = await request(app)
        .post('/api/assessments/start')
        .set('Authorization', `Bearer ${token}`)
        .send(assessmentData);

      assessmentId = response.body.data.assessment._id;

      // Add some answers
      const answerData = {
        questionId: 'q1',
        value: 'yes',
        score: 2,
        level: 'intermediate'
      };

      await request(app)
        .post(`/api/assessments/${assessmentId}/answer`)
        .set('Authorization', `Bearer ${token}`)
        .send(answerData);
    });

    it('should complete assessment successfully', async () => {
      const response = await request(app)
        .post(`/api/assessments/${assessmentId}/complete`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data.assessment.status).toBe('completed');
      expect(response.body.data.results).toBeDefined();
      expect(response.body.data.actionPlan).toBeDefined();
    });

    it('should fail with non-existent assessment', async () => {
      const response = await request(app)
        .post('/api/assessments/507f1f77bcf86cd799439011/complete')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);

      expect(response.body.status).toBe('error');
      expect(response.body.message).toContain('Assessment not found');
    });
  });

  describe('GET /api/assessments', () => {
    beforeEach(async () => {
      // Create some test assessments
      const assessment1 = new Assessment({
        userId,
        type: 'complete',
        status: 'completed',
        answers: [],
        results: {
          totalScore: 10,
          maxPossibleScore: 15,
          percentage: 67,
          userLevel: 'intermediate',
          categoryScores: [],
          overallRiskLevel: 'medium',
          strengths: [],
          weaknesses: []
        },
        actionPlan: [],
        completedAt: new Date()
      });

      const assessment2 = new Assessment({
        userId,
        type: 'security',
        status: 'in-progress',
        answers: [],
        results: {},
        actionPlan: []
      });

      await assessment1.save();
      await assessment2.save();
    });

    it('should get user assessments', async () => {
      const response = await request(app)
        .get('/api/assessments')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data.assessments).toBeDefined();
      expect(response.body.data.assessments.length).toBe(2);
      expect(response.body.data.pagination).toBeDefined();
    });

    it('should filter assessments by type', async () => {
      const response = await request(app)
        .get('/api/assessments?type=complete')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data.assessments.length).toBe(1);
      expect(response.body.data.assessments[0].type).toBe('complete');
    });

    it('should filter assessments by status', async () => {
      const response = await request(app)
        .get('/api/assessments?status=completed')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data.assessments.length).toBe(1);
      expect(response.body.data.assessments[0].status).toBe('completed');
    });

    it('should support pagination', async () => {
      const response = await request(app)
        .get('/api/assessments?limit=1&page=1')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data.assessments.length).toBe(1);
      expect(response.body.data.pagination.current).toBe(1);
      expect(response.body.data.pagination.limit).toBe(1);
    });
  });

  describe('GET /api/assessments/:id', () => {
    let assessmentId;

    beforeEach(async () => {
      const assessment = new Assessment({
        userId,
        type: 'complete',
        status: 'completed',
        answers: [],
        results: {
          totalScore: 10,
          maxPossibleScore: 15,
          percentage: 67,
          userLevel: 'intermediate',
          categoryScores: [],
          overallRiskLevel: 'medium',
          strengths: [],
          weaknesses: []
        },
        actionPlan: [],
        completedAt: new Date()
      });

      const savedAssessment = await assessment.save();
      assessmentId = savedAssessment._id;
    });

    it('should get specific assessment', async () => {
      const response = await request(app)
        .get(`/api/assessments/${assessmentId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data.assessment).toBeDefined();
      expect(response.body.data.assessment._id).toBe(assessmentId.toString());
    });

    it('should fail with non-existent assessment', async () => {
      const response = await request(app)
        .get('/api/assessments/507f1f77bcf86cd799439011')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);

      expect(response.body.status).toBe('error');
      expect(response.body.message).toContain('Assessment not found');
    });
  });
});