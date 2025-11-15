const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
// const jwt = require('jsonwebtoken');
const toolsRouter = require('../routes/tools');
const AnalysisResult = require('../models/AnalysisResult');
const User = require('../models/User');

// Mock the logger
jest.mock('../utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn()
}));

// Mock the auth middleware
jest.mock('../middleware/auth', () => ({
  authenticate: (req, res, next) => {
    req.user = { _id: '507f1f77bcf86cd799439011' };
    next();
  }
}));

const app = express();
app.use(express.json());
app.use('/api/tools', toolsRouter);

describe('Digital Footprint Analysis API', () => {
  let testUser;

  beforeAll(async () => {
    // Connect to test database
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/social-caution-test');
    }
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clean up database
    await AnalysisResult.deleteMany({});
    await User.deleteMany({});

    // Create test user
    testUser = new User({
      _id: '507f1f77bcf86cd799439011',
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedpassword'
    });
    await testUser.save();
  });

  afterEach(async () => {
    await AnalysisResult.deleteMany({});
    await User.deleteMany({});
  });

  describe('POST /api/tools/digital-footprint', () => {
    it('should analyze digital footprint successfully', async () => {
      const searchQuery = 'John Doe';
      
      const response = await request(app)
        .post('/api/tools/digital-footprint')
        .send({ searchQuery })
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('Digital footprint analysis completed');
      expect(response.body.data.searchQuery).toBe(searchQuery);
      expect(response.body.data.results).toBeDefined();
      expect(Array.isArray(response.body.data.results)).toBe(true);
      expect(response.body.data.riskLevel).toBeDefined();
    });

    it('should validate search query length', async () => {
      const response = await request(app)
        .post('/api/tools/digital-footprint')
        .send({ searchQuery: 'a' })
        .expect(400);

      expect(response.body.status).toBe('error');
      expect(response.body.message).toBe('Validation failed');
    });

    it('should validate search query presence', async () => {
      const response = await request(app)
        .post('/api/tools/digital-footprint')
        .send({})
        .expect(400);

      expect(response.body.status).toBe('error');
      expect(response.body.message).toBe('Validation failed');
    });

    it('should handle different query types', async () => {
      const testCases = [
        { query: 'john.doe@example.com', type: 'email' },
        { query: 'John Doe', type: 'name' },
        { query: 'johndoe123', type: 'username' },
        { query: '+1234567890', type: 'phone' }
      ];

      for (const testCase of testCases) {
        const response = await request(app)
          .post('/api/tools/digital-footprint')
          .send({ searchQuery: testCase.query })
          .expect(200);

        expect(response.body.status).toBe('success');
        expect(response.body.data.results).toBeDefined();
      }
    });

    it('should store analysis results in database', async () => {
      const searchQuery = 'John Doe';
      
      await request(app)
        .post('/api/tools/digital-footprint')
        .send({ searchQuery })
        .expect(200);

      const storedResult = await AnalysisResult.findOne({ 
        'data.searchQuery': searchQuery 
      });
      
      expect(storedResult).toBeDefined();
      expect(storedResult.userId.toString()).toBe('507f1f77bcf86cd799439011');
      expect(storedResult.type).toBe('digital-footprint');
    });
  });

  describe('GET /api/tools/analysis-history', () => {
    beforeEach(async () => {
      // Create test analysis results
      const analysisResults = [
        new AnalysisResult({
          userId: '507f1f77bcf86cd799439011',
          type: 'digital-footprint',
          data: {
            searchQuery: 'John Doe',
            results: [],
            analyzedAt: new Date(),
            riskLevel: 'high'
          },
          analyzedAt: new Date()
        }),
        new AnalysisResult({
          userId: '507f1f77bcf86cd799439011',
          type: 'digital-footprint',
          data: {
            searchQuery: 'Jane Smith',
            results: [],
            analyzedAt: new Date(),
            riskLevel: 'medium'
          },
          analyzedAt: new Date()
        })
      ];

      await AnalysisResult.insertMany(analysisResults);
    });

    it('should get analysis history successfully', async () => {
      const response = await request(app)
        .get('/api/tools/analysis-history')
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data.results).toBeDefined();
      expect(Array.isArray(response.body.data.results)).toBe(true);
      expect(response.body.data.results.length).toBe(2);
      expect(response.body.data.pagination).toBeDefined();
    });

    it('should filter by type', async () => {
      const response = await request(app)
        .get('/api/tools/analysis-history?type=digital-footprint')
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data.results.length).toBe(2);
    });

    it('should handle pagination', async () => {
      const response = await request(app)
        .get('/api/tools/analysis-history?limit=1&page=1')
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data.results.length).toBe(1);
      expect(response.body.data.pagination.currentPage).toBe(1);
      expect(response.body.data.pagination.totalPages).toBe(2);
    });
  });

  describe('GET /api/tools/analysis/:id', () => {
    let analysisId;

    beforeEach(async () => {
      const analysisResult = new AnalysisResult({
        userId: '507f1f77bcf86cd799439011',
        type: 'digital-footprint',
        data: {
          searchQuery: 'John Doe',
          results: [],
          analyzedAt: new Date(),
          riskLevel: 'high'
        },
        analyzedAt: new Date()
      });

      const saved = await analysisResult.save();
      analysisId = saved._id.toString();
    });

    it('should get specific analysis result', async () => {
      const response = await request(app)
        .get(`/api/tools/analysis/${analysisId}`)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data._id).toBe(analysisId);
      expect(response.body.data.data.searchQuery).toBe('John Doe');
    });

    it('should return 404 for non-existent analysis', async () => {
      const fakeId = '507f1f77bcf86cd799439012';
      const response = await request(app)
        .get(`/api/tools/analysis/${fakeId}`)
        .expect(404);

      expect(response.body.status).toBe('error');
      expect(response.body.message).toBe('Analysis result not found');
    });
  });

  describe('DELETE /api/tools/analysis/:id', () => {
    let analysisId;

    beforeEach(async () => {
      const analysisResult = new AnalysisResult({
        userId: '507f1f77bcf86cd799439011',
        type: 'digital-footprint',
        data: {
          searchQuery: 'John Doe',
          results: [],
          analyzedAt: new Date(),
          riskLevel: 'high'
        },
        analyzedAt: new Date()
      });

      const saved = await analysisResult.save();
      analysisId = saved._id.toString();
    });

    it('should delete analysis result successfully', async () => {
      const response = await request(app)
        .delete(`/api/tools/analysis/${analysisId}`)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('Analysis result deleted successfully');

      const deleted = await AnalysisResult.findById(analysisId);
      expect(deleted).toBeNull();
    });

    it('should return 404 for non-existent analysis', async () => {
      const fakeId = '507f1f77bcf86cd799439012';
      const response = await request(app)
        .delete(`/api/tools/analysis/${fakeId}`)
        .expect(404);

      expect(response.body.status).toBe('error');
      expect(response.body.message).toBe('Analysis result not found');
    });
  });

  describe('Analysis Logic', () => {
    it('should detect email patterns correctly', async () => {
      const response = await request(app)
        .post('/api/tools/digital-footprint')
        .send({ searchQuery: 'test@example.com' })
        .expect(200);

      const results = response.body.data.results;
      const emailExposure = results.find(r => r.id === 'email-exposure');
      
      expect(emailExposure).toBeDefined();
      expect(emailExposure.found).toBe(true);
    });

    it('should detect name patterns correctly', async () => {
      const response = await request(app)
        .post('/api/tools/digital-footprint')
        .send({ searchQuery: 'John Doe' })
        .expect(200);

      const results = response.body.data.results;
      const socialMedia = results.find(r => r.id === 'social-media');
      
      expect(socialMedia).toBeDefined();
      expect(socialMedia.found).toBe(true);
    });

    it('should detect username patterns correctly', async () => {
      const response = await request(app)
        .post('/api/tools/digital-footprint')
        .send({ searchQuery: 'johndoe123' })
        .expect(200);

      const results = response.body.data.results;
      const socialMedia = results.find(r => r.id === 'social-media');
      
      expect(socialMedia).toBeDefined();
      expect(socialMedia.found).toBe(true);
    });

    it('should calculate risk levels correctly', async () => {
      const response = await request(app)
        .post('/api/tools/digital-footprint')
        .send({ searchQuery: 'John Doe' })
        .expect(200);

      const riskLevel = response.body.data.riskLevel;
      expect(['low', 'medium', 'high']).toContain(riskLevel);
    });

    it('should include confidence scores', async () => {
      const response = await request(app)
        .post('/api/tools/digital-footprint')
        .send({ searchQuery: 'John Doe' })
        .expect(200);

      const results = response.body.data.results;
      results.forEach(result => {
        expect(typeof result.confidence).toBe('number');
        expect(result.confidence).toBeGreaterThanOrEqual(0);
        expect(result.confidence).toBeLessThanOrEqual(1);
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle database errors gracefully', async () => {
      // Mock database error
      const originalSave = AnalysisResult.prototype.save;
      AnalysisResult.prototype.save = jest.fn().mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/api/tools/digital-footprint')
        .send({ searchQuery: 'John Doe' })
        .expect(500);

      expect(response.body.status).toBe('error');
      expect(response.body.message).toBe('Server error during digital footprint analysis');

      // Restore original method
      AnalysisResult.prototype.save = originalSave;
    });

    it('should handle invalid ObjectId in analysis retrieval', async () => {
      const response = await request(app)
        .get('/api/tools/analysis/invalid-id')
        .expect(500);

      expect(response.body.status).toBe('error');
    });
  });

  describe('Data Validation', () => {
    it('should validate search query format', async () => {
      const invalidQueries = [
        '', // Empty
        'a', // Too short
        'a'.repeat(101), // Too long
        null,
        undefined
      ];

      for (const query of invalidQueries) {
        const response = await request(app)
          .post('/api/tools/digital-footprint')
          .send({ searchQuery: query })
          .expect(400);

        expect(response.body.status).toBe('error');
      }
    });

    it('should sanitize search query input', async () => {
      const maliciousQuery = '<script>alert("xss")</script>';
      
      const response = await request(app)
        .post('/api/tools/digital-footprint')
        .send({ searchQuery: maliciousQuery })
        .expect(200);

      // Should not contain script tags in response
      expect(JSON.stringify(response.body)).not.toContain('<script>');
    });
  });
});