import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Search, Scale, Lock, DollarSign, Zap, Shield, GraduationCap, XCircle, KeyRound, Calendar } from 'lucide-react';
import Button from '../common/Button';
import MatrixBackground from './MatrixBackground';

const Hero: React.FC = () => {
  const navigate = useNavigate();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  const pulseVariants = {
    initial: { scale: 1 },
    animate: { 
      scale: [1, 1.05, 1],
      transition: { 
        repeat: Infinity,
        repeatType: "reverse" as const,
        duration: 2,
        ease: "easeInOut"
      }
    }
  };

  return (
    <section className="hero-section relative bg-primary flex items-center pt-12 pb-4 overflow-hidden min-h-[32vh]">
      {/* Matrix animation */}
      <div className="absolute inset-0 overflow-hidden">
        <MatrixBackground color="rgba(0, 255, 170, 0.8)" opacity={0.15} speed={0.5} density={0.3} />
      </div>

      {/* Semi-transparent overlay to ensure text readability */}
      <div className="absolute inset-0 bg-primary opacity-50 z-[5]"></div>

      <div className="hero-content container mx-auto px-4 relative z-10 flex flex-col justify-between h-full">
        <motion.div
          className="max-w-4xl mx-auto text-center pt-2 pb-2"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="mb-3">
            <motion.h1
              className="text-4xl md:text-5xl font-bold text-white leading-relaxed"
              variants={pulseVariants}
              initial="initial"
              animate="animate"
            >
              <span className="block mb-2">Stop Data Theft</span>
              <span className="block">Take Back Control</span>
            </motion.h1>
          </motion.div>

          <motion.div variants={itemVariants} className="mb-3">
            <div className="flex items-center justify-center gap-4 text-2xl md:text-3xl text-white font-medium">
              <div className="p-2 bg-white/10 rounded-full">
                <Lock className="h-6 w-6 text-white" />
              </div>
              <span>Your data is being sold</span>
              <div className="p-2 bg-white/10 rounded-full">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="mb-6">
            <div className="flex items-center justify-center gap-4 text-xl md:text-2xl text-white font-semibold">
              <div className="p-2 bg-white/10 rounded-full">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <span>Find exposure • Fix vulnerabilities • Stay protected</span>
              <div className="p-2 bg-white/10 rounded-full">
                <Shield className="h-6 w-6 text-white" />
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
          >
            <Button 
              variant="primary"
              onClick={() => navigate('/30-day-roadmap')}
              className="text-lg px-8 py-4 bg-accent hover:bg-accent-dark text-white font-bold w-full sm:w-auto group transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <motion.div
                className="flex items-center"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <MessageSquare className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                Start 30-Day Plan
              </motion.div>
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate('/assessment')}
              className="text-lg px-6 py-3 !text-white border-white hover:bg-white/10 w-full sm:w-auto group transition-all duration-300"
            >
              <motion.div
                className="flex items-center !text-white"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Search className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform text-white" />
                Start Assessment
              </motion.div>
            </Button>
          </motion.div>

          {/* Trust indicators - positioned lower with more spacing */}
          <motion.div
            variants={itemVariants}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6 text-lg text-white"
          >
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <GraduationCap className="h-6 w-6 text-white" />
              <span>Free education</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <XCircle className="h-6 w-6 text-white" />
              <span>No account needed</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <KeyRound className="h-6 w-6 text-white" />
              <span>No data storage</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute inset-0 pointer-events-none z-10">
        {/* Three floating badge elements */}
        <motion.div 
          className="absolute top-[20%] left-[5%] bg-white/10 backdrop-blur-sm px-4 py-3 rounded-full shadow-lg"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.7, scale: 1, y: [-8, 8] }}
          transition={{ 
            y: { repeat: Infinity, repeatType: "reverse", duration: 3, ease: "easeInOut" },
            opacity: { duration: 0.8, delay: 0.5 },
            scale: { duration: 0.8, delay: 0.5 }
          }}
        >
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-white" />
            <span className="text-white text-sm font-medium">30-Day Plan</span>
          </div>
        </motion.div>
        
        <motion.div 
          className="absolute top-[60%] right-[5%] bg-white/10 backdrop-blur-sm px-4 py-3 rounded-full shadow-lg"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.7, scale: 1, y: [-8, 8] }}
          transition={{ 
            y: { repeat: Infinity, repeatType: "reverse", duration: 3.5, ease: "easeInOut" },
            opacity: { duration: 0.8, delay: 0.8 },
            scale: { duration: 0.8, delay: 0.8 }
          }}
        >
          <div className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-white" />
            <span className="text-white text-sm font-medium">Know Your Rights</span>
          </div>
        </motion.div>

        <motion.div 
          className="absolute top-[50%] left-[8%] bg-white/10 backdrop-blur-sm px-4 py-3 rounded-full shadow-lg"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.7, scale: 1, y: [-8, 8] }}
          transition={{ 
            y: { repeat: Infinity, repeatType: "reverse", duration: 2.8, ease: "easeInOut" },
            opacity: { duration: 0.8, delay: 1.1 },
            scale: { duration: 0.8, delay: 1.1 }
          }}
        >
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-white" />
            <span className="text-white text-sm font-medium">Protect Data</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;