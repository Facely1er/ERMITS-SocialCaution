import React from 'react';
import { Shield, Users, Globe, BookOpen, Target, Scale, ArrowRight as Arrow, Check, Zap } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import Section from '../components/common/Section';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { Link } from 'react-router-dom';

const AboutPage: React.FC = () => {
  return (
    <PageLayout
      title="About SocialCaution"
      subtitle="Our mission is to empower individuals to take control of their digital privacy"
      heroBackground={true}
      heroType="animated"
      backgroundType="about"
      breadcrumbs={[
        { label: 'About', path: '/about' }
      ]}
    >

      <Section>
        <Card className="p-8">
          <div className="prose max-w-none">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-accent/10 rounded-full">
                <Target className="h-6 w-6 text-accent" />
              </div>
              <h2 className="text-3xl font-bold text-primary">Our Mission</h2>
            </div>
            <p className="text-lg text-text-secondary dark:text-gray-300 mb-8">
              Privacy is a fundamental right, not a privilege. We empower you with knowledge, tools, and support to protect your personal information—accessible to everyone, regardless of technical expertise.
            </p>

            <div className="bg-light-blue/10 p-6 rounded-lg mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-accent/10 rounded-full">
                  <Zap className="h-5 w-5 text-accent" />
                </div>
                <h3 className="text-xl font-bold text-primary">Technical + Legal = Unbeatable Protection</h3>
              </div>
              <p className="text-text-secondary dark:text-gray-300 mb-4">
                Most solutions focus on one area. We combine both for maximum protection:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Shield className="h-6 w-6 text-accent" />
                  </div>
                  <p className="text-sm text-text-secondary dark:text-gray-300">Technical protection closes vulnerabilities</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Scale className="h-6 w-6 text-accent" />
                  </div>
                  <p className="text-sm text-text-secondary dark:text-gray-300">Legal empowerment exercises data rights</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Target className="h-6 w-6 text-accent" />
                  </div>
                  <p className="text-sm text-text-secondary dark:text-gray-300">Practical application makes it simple</p>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-primary mb-6">Our Mission</h2>
            <div className="space-y-6 mb-12">
              <p className="text-text-secondary dark:text-gray-300">
                SocialCaution was created to address a critical gap in digital privacy education and awareness. While large corporations have teams of experts to protect their data, individuals often lack the knowledge and tools needed to protect their personal information effectively.
              </p>
              
              <p className="text-text-secondary dark:text-gray-300">
                Our platform brings together privacy experts, security professionals, and legal specialists to create accessible educational resources that help people understand and protect their digital privacy rights.
              </p>
              
              <p className="text-text-secondary dark:text-gray-300">
                Through comprehensive assessments, educational tools, and practical guidance, we empower individuals to take control of their digital privacy, regardless of their technical background or experience level.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-primary mb-6">Our Team</h2>
            <p className="text-gray-600 mb-6">
              SocialCaution is powered by a diverse team of privacy advocates, security professionals, legal experts, and user experience designers. Our team combines experience in cybersecurity, data protection, and consumer advocacy to create educational solutions that are both informative and accessible.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-light-blue/10 p-6 rounded-lg">
                <div className="flex items-center mb-3">
                  <Shield className="h-6 w-6 text-accent mr-3" />
                  <h3 className="font-bold text-primary">Security Engineers</h3>
                </div>
                <p className="text-text-secondary dark:text-gray-300">
                  Our security team brings expertise in cybersecurity and privacy protection to help identify and address common privacy vulnerabilities and risks.
                </p>
              </div>
              
              <div className="bg-light-blue/10 p-6 rounded-lg">
                <div className="flex items-center mb-3">
                  <Scale className="h-6 w-6 text-accent mr-3" />
                  <h3 className="font-bold text-primary">Legal Specialists</h3>
                </div>
                <p className="text-text-secondary dark:text-gray-300">
                  Legal experts with knowledge of data protection regulations help ensure our educational content provides accurate information about privacy rights and legal frameworks.
                </p>
              </div>
              
              <div className="bg-light-blue/10 p-6 rounded-lg">
                <div className="flex items-center mb-3">
                  <Users className="h-6 w-6 text-accent mr-3" />
                  <h3 className="font-bold text-primary">Privacy Advocates</h3>
                </div>
                <p className="text-text-secondary dark:text-gray-300">
                  Privacy advocates and consumer protection experts help ensure our platform remains focused on real-world user needs and accessible to everyone.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-primary mb-6">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="bg-light-blue/10 rounded-lg p-6">
                <div className="flex items-center mb-3">
                  <Shield className="h-5 w-5 text-accent mr-2" />
                  <h3 className="font-bold text-primary">Privacy as a Right</h3>
                </div>
                <p className="text-text-secondary dark:text-gray-300">
                  We believe privacy is a fundamental human right that should be accessible to everyone, not just those with technical expertise or financial resources.
                </p>
              </div>

              <div className="bg-light-blue/10 rounded-lg p-6">
                <div className="flex items-center mb-3">
                  <Target className="h-5 w-5 text-accent mr-2" />
                  <h3 className="font-bold text-primary">Accessibility</h3>
                </div>
                <p className="text-text-secondary dark:text-gray-300">
                  We're committed to making privacy protection understandable and achievable for everyone, regardless of technical background.
                </p>
              </div>

              <div className="bg-light-blue/10 rounded-lg p-6">
                <div className="flex items-center mb-3">
                  <Globe className="h-5 w-5 text-accent mr-2" />
                  <h3 className="font-bold text-primary">Transparency</h3>
                </div>
                <p className="text-text-secondary dark:text-gray-300">
                  We practice what we preach by being clear about our own data practices and business model, which is built on providing services, not monetizing user data.
                </p>
              </div>

              <div className="bg-light-blue/10 rounded-lg p-6">
                <div className="flex items-center mb-3">
                  <BookOpen className="h-5 w-5 text-accent mr-2" />
                  <h3 className="font-bold text-primary">Education</h3>
                </div>
                <p className="text-text-secondary dark:text-gray-300">
                  We believe in empowering users through knowledge, helping them understand privacy concepts and make informed decisions.
                </p>
              </div>

              <div className="bg-light-blue/10 rounded-lg p-6">
                <div className="flex items-center mb-3">
                  <Scale className="h-5 w-5 text-accent mr-2" />
                  <h3 className="font-bold text-primary">Data Rights</h3>
                </div>
                <p className="text-text-secondary dark:text-gray-300">
                  We advocate for strong data protection laws and help users exercise their rights under existing regulations.
                </p>
              </div>

              <div className="bg-light-blue/10 rounded-lg p-6">
                <div className="flex items-center mb-3">
                  <Users className="h-5 w-5 text-accent mr-2" />
                  <h3 className="font-bold text-primary">Community</h3>
                </div>
                <p className="text-text-secondary dark:text-gray-300">
                  We foster a supportive community where privacy-conscious individuals can share knowledge and support each other.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-primary mb-6">Our Approach</h2>
            <div className="space-y-6 mb-12">
              <div className="flex items-start">
                <div className="bg-accent/10 p-2 rounded-full mr-4 mt-1">
                  <Check className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-primary mb-2">Comprehensive Assessment</h3>
                  <p className="text-text-secondary dark:text-gray-300">
                    We start by helping you understand your current privacy posture through detailed yet accessible assessments that identify vulnerabilities and exposure risks.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-accent/10 p-2 rounded-full mr-4 mt-1">
                  <Check className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-primary mb-2">Personalized Action Plans</h3>
                  <p className="text-text-secondary dark:text-gray-300">
                    Based on your assessment results, we create customized step-by-step plans that prioritize actions for maximum impact with minimal effort.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-accent/10 p-2 rounded-full mr-4 mt-1">
                  <Check className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-primary mb-2">Continuous Monitoring</h3>
                  <p className="text-text-secondary dark:text-gray-300">
                    Privacy threats evolve constantly. Our platform provides ongoing monitoring and alerts to help you stay protected against new vulnerabilities.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-accent/10 p-2 rounded-full mr-4 mt-1">
                  <Check className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-primary mb-2">Educational Resources</h3>
                  <p className="text-text-secondary dark:text-gray-300">
                    We provide clear, jargon-free guides and tutorials that help you understand privacy concepts and make informed decisions.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-accent/5 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Join Us in Protecting Digital Privacy</h3>
              <p className="text-gray-600 mb-6">
                Whether you're just beginning your privacy journey or looking to enhance your existing protections, SocialCaution provides the tools, resources, and community support you need to take control of your digital life.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/assessment">
                  <Button variant="primary" className="w-full sm:w-auto">
                    Start Free Assessment
                    <Arrow className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="outline" className="w-full sm:w-auto">
                    Contact Our Team
                    <Arrow className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Card>
      </Section>
    </PageLayout>
  );
};

export default AboutPage;
