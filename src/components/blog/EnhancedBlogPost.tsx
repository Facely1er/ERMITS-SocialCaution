import React, { useState, useEffect, useRef } from 'react';
import {
  Clock,
  User,
  ArrowLeft,
  Eye,
  Share2,
  BookOpen,
  ChevronUp,
  Heart,
  MessageCircle,
  Bookmark
} from 'lucide-react';
import Section from '../common/Section';
import Card from '../common/Card';
import { Link } from 'react-router-dom';
interface BlogPostProps {
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
    bio: string;
    social?: {
      twitter?: string;
      linkedin?: string;
    };
  };
  category: string;
  tags: string[];
  publishedAt: string;
  readTime: string;
  featuredImage?: string;
  views?: number;
  likes?: number;
  comments?: number;
  relatedPosts?: Array<{
    id: string;
    title: string;
    slug: string;
    featuredImage?: string;
  }>;
}

const EnhancedBlogPost: React.FC<BlogPostProps> = ({
  title,
  content,
  author,
  readTime,
  featuredImage,
  views = 0,
  likes: initialLikes = 0,
  comments: initialComments = 0,
  relatedPosts = []
}) => {
  const [readingProgress, setReadingProgress] = useState(0);
  const [isTocVisible, setIsTocVisible] = useState(false);
  const [activeHeading, setActiveHeading] = useState('');
  const contentRef = useRef<HTMLDivElement>(null);
  const headingsRef = useRef<HTMLHeadingElement[]>([]);
  const [isLiked, setIsLiked] = useState(() => {
    const stored = localStorage.getItem(`blog-liked-${title}`);
    return stored === 'true';
  });
  const [isBookmarked, setIsBookmarked] = useState(() => {
    const bookmarks = JSON.parse(localStorage.getItem('blog-bookmarks') || '[]');
    return bookmarks.includes(title);
  });
  const [likes, setLikes] = useState(initialLikes + (isLiked ? 1 : 0));
  const [comments, setComments] = useState(initialComments);

  // Reading progress calculation
  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;
      
      const element = contentRef.current;
      const scrollTop = window.scrollY;
      const docHeight = element.offsetHeight;
      const winHeight = window.innerHeight;
      const scrollPercent = scrollTop / (docHeight - winHeight);
      const scrollPercentRounded = Math.round(scrollPercent * 100);
      
      setReadingProgress(Math.min(100, Math.max(0, scrollPercentRounded)));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Table of contents generation
  useEffect(() => {
    if (!contentRef.current) return;
    
    const headings = contentRef.current.querySelectorAll('h2, h3, h4');
    headingsRef.current = Array.from(headings) as HTMLHeadingElement[];
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHeading(entry.target.id || entry.target.textContent || '');
          }
        });
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );

    headingsRef.current.forEach((heading, index) => {
      if (!heading.id) {
        heading.id = heading.textContent?.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') || `heading-${index}`;
      }
      // Add smooth scroll behavior to heading links
      heading.style.scrollMarginTop = '100px';
      observer.observe(heading);
    });

    return () => observer.disconnect();
  }, [content]);

  const generateToc = () => {
    return headingsRef.current.map((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1));
      const indentClass = level === 2 ? 'ml-0' : level === 3 ? 'ml-4' : 'ml-8';
      
      return (
        <li key={index} className={indentClass}>
          <a
            href={`#${heading.id}`}
            onClick={(e) => {
              e.preventDefault();
              heading.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
              });
            }}
            className={`block py-1 text-sm transition-colors ${
              activeHeading === heading.id
                ? 'text-accent font-medium'
                : 'text-text-secondary dark:text-text-secondary hover:text-accent'
            }`}
          >
            {heading.textContent}
          </a>
        </li>
      );
    });
  };

  const handleLike = () => {
    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);
    setLikes(prev => newIsLiked ? prev + 1 : prev - 1);
    localStorage.setItem(`blog-liked-${title}`, String(newIsLiked));
  };

  const handleBookmark = () => {
    const newIsBookmarked = !isBookmarked;
    setIsBookmarked(newIsBookmarked);
    const bookmarks = JSON.parse(localStorage.getItem('blog-bookmarks') || '[]');
    if (newIsBookmarked) {
      bookmarks.push(title);
    } else {
      const index = bookmarks.indexOf(title);
      if (index > -1) bookmarks.splice(index, 1);
    }
    localStorage.setItem('blog-bookmarks', JSON.stringify(bookmarks));
  };

  const handleComment = () => {
    // In a real app, this would open a comment modal or navigate to a comment section
    // For now, just increment the comment count
    setComments(prev => prev + 1);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      {/* Reading Progress Bar */}
      <div className="reading-progress">
        <div
          className="reading-progress-bar"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <Section>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Table of Contents - Desktop */}
          <div className="hidden lg:block lg:w-1/4">
            <div className="toc">
              <h3 className="flex items-center justify-between">
                <span className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Table of Contents
                </span>
                <span className="text-sm text-text-secondary dark:text-text-secondary bg-accent/10 px-2 py-1 rounded-full">
                  {headingsRef.current.length}
                </span>
              </h3>
              <ul className="space-y-1">
                {generateToc()}
              </ul>
              <div className="mt-4 pt-4 border-t border-border text-sm text-text-secondary dark:text-text-secondary">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  {readTime}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <Card className="p-8 md:p-12">
              {/* Featured Image */}
              {featuredImage && (
                <div className="mb-8">
                  <img 
                    src={featuredImage} 
                    alt={title}
                    className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
                  />
                </div>
              )}

              {/* Article Content */}
              <div 
                ref={contentRef}
                className="blog-content"
                dangerouslySetInnerHTML={{ __html: content }}
              />

              {/* Social Sharing */}
              <div className="social-sharing">
                <span className="text-sm font-medium text-text-secondary dark:text-text-secondary">
                  Share Article
                </span>
                <button 
                  className="hover:bg-blue-500 transition-colors"
                  onClick={async () => {
                    if (navigator.share) {
                      try {
                        await navigator.share({
                          title: document.title,
                          url: window.location.href
                        });
                      } catch (error) {
                        // User cancelled or share failed - silently handle
                        if ((error as Error).name !== 'AbortError') {
                          // Only log unexpected errors in development
                          if (import.meta.env.DEV) {
                            console.error('Share failed:', error);
                          }
                        }
                      }
                    } else {
                      // Fallback: copy to clipboard
                      try {
                        await navigator.clipboard.writeText(window.location.href);
                        // Could show a toast notification here
                      } catch (error) {
                        if (import.meta.env.DEV) {
                          console.error('Copy to clipboard failed:', error);
                        }
                      }
                    }
                  }}
                  aria-label="Share article"
                >
                  <Share2 className="h-4 w-4" />
                </button>
                <button 
                  className={`transition-colors ${isLiked ? 'bg-red-500 text-white' : 'hover:bg-red-500'}`}
                  onClick={handleLike}
                  aria-label={`Like article - ${likes} likes`}
                >
                  <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                </button>
                <button 
                  className="hover:bg-green-500 transition-colors"
                  onClick={handleComment}
                  aria-label={`Comment on article - ${comments} comments`}
                >
                  <MessageCircle className="h-4 w-4" />
                </button>
                <button 
                  className={`transition-colors ${isBookmarked ? 'bg-yellow-500 text-white' : 'hover:bg-yellow-500'}`}
                  onClick={handleBookmark}
                  aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark article'}
                >
                  <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Reading Stats */}
              <div className="reading-stats">
                <div className="stat">
                  <Eye className="h-4 w-4" />
                  <span>{views.toLocaleString()} views</span>
                </div>
                <div className="stat">
                  <Heart className="h-4 w-4" />
                  <span>{likes} likes</span>
                </div>
                <div className="stat">
                  <MessageCircle className="h-4 w-4" />
                  <span>{comments} comments</span>
                </div>
                <div className="stat">
                  <Clock className="h-4 w-4" />
                  <span>{readTime} read</span>
                </div>
              </div>

              {/* Author Bio */}
              <div className="author-bio">
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    {author.avatar ? (
                      <img 
                        src={author.avatar} 
                        alt={author.name}
                        className="avatar"
                      />
                    ) : (
                      <div className="avatar bg-accent/20 flex items-center justify-center">
                        <User className="h-8 w-8 text-accent" />
                      </div>
                    )}
                  </div>
                  <div className="flex-grow">
                    <h4 className="text-xl font-semibold text-text dark:text-text mb-2">
                      About {author.name}
                    </h4>
                    <p className="text-text-secondary dark:text-text-secondary mb-4">
                      {author.bio}
                    </p>
                    {author.social && (
                      <div className="flex space-x-4">
                        {author.social.twitter && (
                          <a 
                            href={`https://twitter.com/${author.social.twitter}`}
                            className="text-accent hover:text-accent-dark transition-colors"
                          >
                            Twitter
                          </a>
                        )}
                        {author.social.linkedin && (
                          <a 
                            href={`https://linkedin.com/in/${author.social.linkedin}`}
                            className="text-accent hover:text-accent-dark transition-colors"
                          >
                            LinkedIn
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div className="mt-12">
                <h3 className="text-2xl font-bold text-text dark:text-text mb-8">
                  Related Articles
                </h3>
                <div className="related-posts">
                  {relatedPosts.map((post) => (
                    <div key={post.id} className="related-post-card">
                      {post.featuredImage && (
                        <img 
                          src={post.featuredImage} 
                          alt={post.title}
                          className="w-full h-48 object-cover"
                        />
                      )}
                      <div className="content">
                        <h4 className="font-semibold text-text dark:text-text mb-2">
                          {post.title}
                        </h4>
                        <Link 
                          to={`/blog/${post.slug}`}
                          className="text-accent hover:text-accent-dark font-medium text-sm"
                        >
                          Read More →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Table of Contents */}
        <div className="lg:hidden mt-8">
          <Card className="p-6">
            <button
              onClick={() => setIsTocVisible(!isTocVisible)}
              className="flex items-center justify-between w-full text-left hover:bg-accent/5 rounded-lg p-2 -m-2 transition-colors"
            >
              <h3 className="text-lg font-semibold text-text dark:text-text flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Table of Contents
                <span className="ml-2 text-sm text-text-secondary dark:text-text-secondary">
                  ({headingsRef.current.length} sections)
                </span>
              </h3>
              <ChevronUp 
                className={`h-5 w-5 text-accent transition-transform ${
                  isTocVisible ? 'rotate-180' : ''
                }`}
              />
            </button>
            {isTocVisible && (
              <div className="mt-4">
                <ul className="space-y-1">
                  {generateToc()}
                </ul>
                <div className="mt-4 pt-4 border-t border-border text-sm text-text-secondary dark:text-text-secondary">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Estimated reading time: {readTime}
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Back to Blog */}
        <div className="mt-8">
          <Link to="/blog" className="inline-flex items-center text-accent hover:text-accent/80 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Link>
        </div>
      </Section>

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 bg-accent hover:bg-accent-dark text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-40"
      >
        <ChevronUp className="h-6 w-6" />
      </button>
    </div>
  );
};

export default EnhancedBlogPost;