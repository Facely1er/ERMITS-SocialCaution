const express = require('express');
// const { optionalAuth } = require('../middleware/auth'); // eslint-disable-line no-unused-vars
const logger = require('../utils/logger');

const router = express.Router();

// @route   GET /api/blog/posts
// @desc    Get blog posts
// @access  Public
router.get('/posts', async (req, res) => {
  try {
    const { category, tag, limit = 10, page = 1, search } = req.query;

    // Mock data - in a real app, this would come from a database
    const posts = [
      {
        id: 'privacy-importance-2024',
        title: 'The Rising Importance of Digital Privacy in 2024',
        excerpt: 'In an increasingly connected world, protecting your digital privacy has never been more crucial. Learn about the latest threats and how to stay safe.',
        content: 'Full blog post content here...',
        author: {
          name: 'Privacy Expert',
          avatar: '/images/authors/privacy-expert.jpg',
          bio: 'Privacy advocate with 10+ years of experience in digital security.'
        },
        category: 'Privacy Trends',
        tags: ['privacy', 'digital-security', 'trends'],
        publishedAt: '2024-03-15',
        updatedAt: '2024-03-15',
        readTime: '5 min read',
        featuredImage: '/images/blog/privacy-importance.jpg',
        slug: 'privacy-importance-2024',
        status: 'published',
        views: 1250,
        likes: 89,
        comments: 23
      },
      {
        id: 'data-protection-laws-2024',
        title: 'Understanding Data Protection Laws in 2024',
        excerpt: 'A comprehensive guide to the latest privacy regulations and how they affect you and your business.',
        content: 'Full blog post content here...',
        author: {
          name: 'Legal Analyst',
          avatar: '/images/authors/legal-analyst.jpg',
          bio: 'Legal expert specializing in privacy law and data protection.'
        },
        category: 'Privacy Laws',
        tags: ['privacy-laws', 'gdpr', 'compliance', 'legal'],
        publishedAt: '2024-03-10',
        updatedAt: '2024-03-10',
        readTime: '8 min read',
        featuredImage: '/images/blog/data-protection-laws.jpg',
        slug: 'data-protection-laws-2024',
        status: 'published',
        views: 980,
        likes: 67,
        comments: 15
      },
      {
        id: 'privacy-tools-social-media',
        title: 'Top Privacy Tools for Social Media',
        excerpt: 'Essential tools and techniques to enhance your privacy across social platforms.',
        content: 'Full blog post content here...',
        author: {
          name: 'Tech Specialist',
          avatar: '/images/authors/tech-specialist.jpg',
          bio: 'Technology expert focused on privacy tools and digital security.'
        },
        category: 'Tools & Tips',
        tags: ['privacy-tools', 'social-media', 'tools', 'tips'],
        publishedAt: '2024-03-05',
        updatedAt: '2024-03-05',
        readTime: '6 min read',
        featuredImage: '/images/blog/privacy-tools-social-media.jpg',
        slug: 'privacy-tools-social-media',
        status: 'published',
        views: 1450,
        likes: 112,
        comments: 31
      }
    ];

    // Filter posts
    let filteredPosts = posts;

    if (category) {
      filteredPosts = filteredPosts.filter(post => 
        post.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (tag) {
      filteredPosts = filteredPosts.filter(post => 
        post.tags.some(t => t.toLowerCase() === tag.toLowerCase())
      );
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredPosts = filteredPosts.filter(post => 
        post.title.toLowerCase().includes(searchLower) ||
        post.excerpt.toLowerCase().includes(searchLower) ||
        post.tags.some(t => t.toLowerCase().includes(searchLower))
      );
    }

    // Sort by published date (newest first)
    filteredPosts.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

    // Pagination
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

    res.json({
      status: 'success',
      data: {
        posts: paginatedPosts,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(filteredPosts.length / parseInt(limit)),
          total: filteredPosts.length,
          limit: parseInt(limit)
        }
      }
    });

  } catch (error) {
    logger.error('Get blog posts error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching blog posts'
    });
  }
});

// @route   GET /api/blog/posts/:slug
// @desc    Get specific blog post
// @access  Public
router.get('/posts/:slug', async (req, res) => {
  try {
    const { slug } = req.params; // eslint-disable-line no-unused-vars

    // Mock data - in a real app, this would come from a database
    const post = {
      id: 'privacy-importance-2024',
      title: 'The Rising Importance of Digital Privacy in 2024',
      excerpt: 'In an increasingly connected world, protecting your digital privacy has never been more crucial. Learn about the latest threats and how to stay safe.',
      content: `
        <h2>Introduction</h2>
        <p>In today's digital age, our personal information is constantly being collected, analyzed, and potentially misused. From social media platforms to e-commerce websites, data collection has become ubiquitous, making digital privacy more important than ever.</p>
        
        <h2>The Current State of Digital Privacy</h2>
        <p>Recent studies show that the average person's data is collected by over 200 companies daily. This includes:</p>
        <ul>
          <li>Personal information from social media profiles</li>
          <li>Browsing history and online behavior</li>
          <li>Location data from mobile devices</li>
          <li>Purchase history and financial information</li>
        </ul>

        <h2>Why Privacy Matters</h2>
        <p>Digital privacy isn't just about keeping secrets – it's about maintaining control over your personal information and protecting yourself from:</p>
        <ul>
          <li>Identity theft and fraud</li>
          <li>Targeted advertising and manipulation</li>
          <li>Data breaches and unauthorized access</li>
          <li>Discrimination based on personal data</li>
        </ul>

        <h2>Steps to Protect Your Privacy</h2>
        <p>Here are some practical steps you can take to improve your digital privacy:</p>
        <ol>
          <li><strong>Use strong, unique passwords</strong> for all your accounts</li>
          <li><strong>Enable two-factor authentication</strong> wherever possible</li>
          <li><strong>Review and adjust privacy settings</strong> on social media platforms</li>
          <li><strong>Use a VPN</strong> when browsing on public Wi-Fi</li>
          <li><strong>Be cautious about sharing personal information</strong> online</li>
        </ol>

        <h2>Conclusion</h2>
        <p>Protecting your digital privacy is an ongoing process that requires awareness and action. By taking the right steps, you can significantly reduce your digital footprint and protect your personal information from misuse.</p>
      `,
      author: {
        name: 'Privacy Expert',
        avatar: '/images/authors/privacy-expert.jpg',
        bio: 'Privacy advocate with 10+ years of experience in digital security.',
        social: {
          twitter: '@privacyexpert',
          linkedin: 'privacy-expert'
        }
      },
      category: 'Privacy Trends',
      tags: ['privacy', 'digital-security', 'trends'],
      publishedAt: '2024-03-15',
      updatedAt: '2024-03-15',
      readTime: '5 min read',
      featuredImage: '/images/blog/privacy-importance.jpg',
      slug: 'privacy-importance-2024',
      status: 'published',
      views: 1250,
      likes: 89,
      comments: 23,
      relatedPosts: [
        {
          id: 'data-protection-laws-2024',
          title: 'Understanding Data Protection Laws in 2024',
          slug: 'data-protection-laws-2024',
          featuredImage: '/images/blog/data-protection-laws.jpg'
        },
        {
          id: 'privacy-tools-social-media',
          title: 'Top Privacy Tools for Social Media',
          slug: 'privacy-tools-social-media',
          featuredImage: '/images/blog/privacy-tools-social-media.jpg'
        }
      ]
    };

    res.json({
      status: 'success',
      data: {
        post
      }
    });

  } catch (error) {
    logger.error('Get blog post error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching blog post'
    });
  }
});

// @route   GET /api/blog/categories
// @desc    Get blog categories
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = [
      { name: 'Privacy Trends', slug: 'privacy-trends', count: 12 },
      { name: 'Privacy Laws', slug: 'privacy-laws', count: 8 },
      { name: 'Tools & Tips', slug: 'tools-tips', count: 15 },
      { name: 'Family Protection', slug: 'family-protection', count: 6 },
      { name: 'Digital Economy', slug: 'digital-economy', count: 4 },
      { name: 'Privacy Legislation', slug: 'privacy-legislation', count: 7 }
    ];

    res.json({
      status: 'success',
      data: {
        categories
      }
    });

  } catch (error) {
    logger.error('Get blog categories error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching blog categories'
    });
  }
});

// @route   GET /api/blog/tags
// @desc    Get blog tags
// @access  Public
router.get('/tags', async (req, res) => {
  try {
    const tags = [
      { name: 'privacy', count: 25 },
      { name: 'security', count: 18 },
      { name: 'gdpr', count: 12 },
      { name: 'social-media', count: 15 },
      { name: 'tools', count: 20 },
      { name: 'compliance', count: 8 },
      { name: 'data-protection', count: 14 },
      { name: 'digital-rights', count: 6 }
    ];

    res.json({
      status: 'success',
      data: {
        tags
      }
    });

  } catch (error) {
    logger.error('Get blog tags error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching blog tags'
    });
  }
});

module.exports = router;