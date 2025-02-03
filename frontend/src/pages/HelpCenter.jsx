import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaBook, FaQuestionCircle, FaVideo, FaSearch, FaLightbulb, FaUserMd, FaHospital, 
         FaNetworkWired, FaChartLine, FaShieldAlt, FaArrowRight, FaPlay, FaDownload, 
         FaExternalLinkAlt, FaTimes } from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('getting-started');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const categories = [
    {
      id: 'basics',
      title: 'Platform Basics',
      icon: <FaLightbulb className="w-6 h-6" />,
      description: 'Learn the fundamentals of HealthNetAI'
    },
    {
      id: 'doctors',
      title: 'For Doctors',
      icon: <FaUserMd className="w-6 h-6" />,
      description: 'Resources for healthcare providers'
    },
    {
      id: 'facilities',
      title: 'Healthcare Facilities',
      icon: <FaHospital className="w-6 h-6" />,
      description: 'Manage your healthcare facility'
    },
    {
      id: 'network',
      title: 'Network Management',
      icon: <FaNetworkWired className="w-6 h-6" />,
      description: 'Network monitoring and optimization'
    },
    {
      id: 'analytics',
      title: 'Analytics & Reports',
      icon: <FaChartLine className="w-6 h-6" />,
      description: 'Understanding data and insights'
    },
    {
      id: 'security',
      title: 'Security & Privacy',
      icon: <FaShieldAlt className="w-6 h-6" />,
      description: 'Data protection and compliance'
    }
  ];

  const helpSections = {
    'getting-started': {
      title: 'Getting Started',
      icon: <FaBook className="w-6 h-6" />,
      content: [
        {
          title: 'Welcome to HealthNetAI',
          description: 'HealthNetAI is a comprehensive healthcare platform that combines AI-driven insights with offline-first capabilities.',
          videoUrl: 'https://example.com/intro-video',
          steps: [
            {
              title: 'Create Your Account',
              description: 'Sign up with your professional email and verify your credentials',
              action: 'Sign Up Now',
              link: '/signup'
            },
            {
              title: 'Complete Your Profile',
              description: 'Add your professional details, specializations, and certifications',
              action: 'Edit Profile',
              link: '/login'
            },
            {
              title: 'Explore the Dashboard',
              description: 'Familiarize yourself with the main features and navigation',
              action: 'View Dashboard',
              link: '/dashboard'
            },
            {
              title: 'Connect Your Facility',
              description: 'Link your healthcare facility to enable network features',
              action: 'Add Facility',
              link: '/network/facilities'
            }
          ]
        },
        {
          title: 'Key Features',
          description: 'Discover the powerful features that make HealthNetAI essential for modern healthcare:',
          features: [
            {
              title: 'Real-time Monitoring',
              description: 'Monitor network health and facility status in real-time',
              icon: <FaNetworkWired className="w-5 h-5" />
            },
            {
              title: 'AI Predictions',
              description: 'Get intelligent predictions about network performance and resource needs',
              icon: <FaLightbulb className="w-5 h-5" />
            },
            {
              title: 'Offline Capabilities',
              description: 'Continue working even without internet connectivity',
              icon: <FaShieldAlt className="w-5 h-5" />
            },
            {
              title: 'Emergency Sharing',
              description: 'Share resources during emergencies with nearby facilities',
              icon: <FaHospital className="w-5 h-5" />
            },
            {
              title: 'Analytics Dashboard',
              description: 'Comprehensive analytics and reporting tools',
              icon: <FaChartLine className="w-5 h-5" />
            }
          ]
        }
      ]
    },
    'tutorials': {
      title: 'Video Tutorials',
      icon: <FaVideo className="w-6 h-6" />,
      content: [
        {
          title: 'Dashboard Overview',
          thumbnail: '/tutorial-thumbnails/dashboard.jpg',
          duration: '5:30',
          description: 'A comprehensive guide to using the dashboard effectively',
          topics: [
            'Navigating the interface',
            'Understanding key metrics',
            'Customizing your view',
            'Setting up alerts',
            'Generating reports'
          ]
        },
        {
          title: 'Network Management',
          thumbnail: '/tutorial-thumbnails/network.jpg',
          duration: '8:45',
          description: 'Learn how to manage your healthcare network',
          topics: [
            'Adding new facilities',
            'Monitoring network health',
            'Managing bandwidth allocation',
            'Emergency protocols',
            'Performance optimization'
          ]
        },
        {
          title: 'Analytics & Reporting',
          thumbnail: '/tutorial-thumbnails/analytics.jpg',
          duration: '6:15',
          description: 'Master the analytics tools and reporting features',
          topics: [
            'Understanding AI predictions',
            'Creating custom reports',
            'Analyzing trends',
            'Export and sharing',
            'Setting up automated reports'
          ]
        }
      ]
    },
    'faq': {
      title: 'FAQ',
      icon: <FaQuestionCircle className="w-6 h-6" />,
      content: [
        {
          category: 'General',
          questions: [
            {
              question: 'What is HealthNetAI?',
              answer: 'HealthNetAI is an innovative healthcare platform that uses artificial intelligence to monitor and optimize healthcare network performance while ensuring service availability even in offline scenarios.',
              relatedLinks: [
                { text: 'Learn More', url: '/about' },
                { text: 'Get Started', url: '/signup' }
              ]
            },
            {
              question: 'How does the offline-first feature work?',
              answer: 'Our platform maintains a local database that syncs with the central server when online. This ensures continuous operation even during network outages.',
              relatedLinks: [
                { text: 'Technical Details', url: '/docs/offline' },
                { text: 'Setup Guide', url: '/help/offline-setup' }
              ]
            }
          ]
        },
        {
          category: 'Security',
          questions: [
            {
              question: 'How secure is my data?',
              answer: 'We implement industry-standard security measures including end-to-end encryption, secure authentication, and regular security audits to protect your data.',
              relatedLinks: [
                { text: 'Security Features', url: '/security' },
                { text: 'Privacy Policy', url: '/privacy' }
              ]
            },
            {
              question: 'Who has access to patient information?',
              answer: 'Access to patient information is strictly controlled through role-based permissions and is only available to authorized healthcare providers.',
              relatedLinks: [
                { text: 'Access Control', url: '/security/access' },
                { text: 'Compliance', url: '/security/compliance' }
              ]
            }
          ]
        }
      ]
    }
  };

  // Handle search functionality
  useEffect(() => {
    if (searchQuery.length > 2) {
      const results = Object.entries(helpSections).flatMap(([section, data]) => {
        return data.content.flatMap(item => {
          const matches = [];
          const searchText = searchQuery.toLowerCase();
          
          if (item.title?.toLowerCase().includes(searchText)) {
            matches.push({ ...item, section, type: 'title' });
          }
          if (item.description?.toLowerCase().includes(searchText)) {
            matches.push({ ...item, section, type: 'description' });
          }
          if (item.questions) {
            item.questions.forEach(q => {
              if (q.question.toLowerCase().includes(searchText) || 
                  q.answer.toLowerCase().includes(searchText)) {
                matches.push({ ...q, section, type: 'faq' });
              }
            });
          }
          return matches;
        });
      });
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  // Video Modal Component
  const VideoModal = ({ video, onClose }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
    >
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-semibold">{video.title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>
{/*         <div className="relative pb-[56.25%]">
          <iframe
            src={video.videoUrl || "#"}
            className="absolute inset-0 w-full h-full"
            allowFullScreen
          />
        </div> */}
        <div className="p-6">
          <h4 className="font-semibold mb-2">Topics Covered:</h4>
          <ul className="space-y-2">
            {video.topics.map((topic, idx) => (
              <li key={idx} className="flex items-center text-gray-600">
                <FaPlay className="w-4 h-4 text-blue-500 mr-2" />
                {topic}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex space-x-4">
            <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
              <FaDownload className="w-4 h-4" />
              <span>Download Resources</span>
            </button>
            <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
              <FaExternalLinkAlt className="w-4 h-4" />
              <span>View Transcript</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  // Search Results Component
  const SearchResults = () => (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl max-h-96 overflow-y-auto z-50"
    >
      {searchResults.map((result, idx) => (
        <div
          key={idx}
          className="p-4 border-b hover:bg-gray-50 cursor-pointer"
          onClick={() => {
            setActiveSection(result.section);
            setSearchQuery('');
            setSearchResults([]);
          }}
        >
          <div className="flex items-start space-x-3">
            {result.type === 'faq' && <FaQuestionCircle className="w-5 h-5 text-blue-500 mt-1" />}
            {result.type === 'title' && <FaBook className="w-5 h-5 text-blue-500 mt-1" />}
            {result.type === 'description' && <FaLightbulb className="w-5 h-5 text-blue-500 mt-1" />}
            <div>
              <h4 className="font-semibold text-gray-900">
                {result.title || result.question}
              </h4>
              <p className="text-sm text-gray-600">
                {result.description || result.answer}
              </p>
            </div>
          </div>
        </div>
      ))}
    </motion.div>
  );

  // Interactive Step Card Component
  const StepCard = ({ step, index }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-gray-50 rounded-lg p-6 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-2 h-full bg-blue-500" />
      <span className="absolute top-2 right-2 text-3xl font-bold text-gray-200">
        {index + 1}
      </span>
      <h4 className="font-semibold text-gray-900 mb-2">{step.title}</h4>
      <p className="text-gray-600 text-sm mb-4">{step.description}</p>
      <Link
        to={step.link}
        className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm font-medium group"
      >
        <span>{step.action}</span>
        <FaArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
      </Link>
    </motion.div>
  );

  // Category Content Component
  const CategoryContent = ({ category }) => {
    const categoryContent = {
      basics: {
        title: "Platform Basics",
        sections: [
          {
            title: "Getting Started Guide",
            items: helpSections['getting-started'].content
          },
          {
            title: "Common Tasks",
            items: [
              { title: "Setting up your workspace", link: "/help/setup" },
              { title: "Navigating the dashboard", link: "/help/navigation" },
              { title: "Managing your profile", link: "/profile" }
            ]
          }
        ]
      },
      doctors: {
        title: "For Healthcare Providers",
        sections: [
          {
            title: "Clinical Tools",
            items: [
              { title: "Patient Management", link: "/doctor/patients" },
              { title: "Appointment Scheduling", link: "/doctor/appointments" },
              { title: "Medical Records", link: "/doctor/records" }
            ]
          }
        ]
      },
      // Add more category content as needed
    };

    return categoryContent[category] ? (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-8"
      >
        <h2 className="text-2xl font-bold mb-6">{categoryContent[category].title}</h2>
        <div className="space-y-8">
          {categoryContent[category].sections.map((section, idx) => (
            <div key={idx}>
              <h3 className="text-xl font-semibold mb-4">{section.title}</h3>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {section.items.map((item, itemIdx) => (
                  <Link
                    key={itemIdx}
                    to={item.link}
                    className="block p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
                    {item.description && (
                      <p className="text-gray-600 text-sm">{item.description}</p>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    ) : null;
  };

  const filteredContent = (section) => {
    if (!searchQuery) return helpSections[section].content;
    
    return helpSections[section].content.filter(item => {
      const searchText = JSON.stringify(item).toLowerCase();
      return searchText.includes(searchQuery.toLowerCase());
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <Header />
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">How can we help you?</h1>
          <p className="text-xl text-blue-100 mb-8">
            Find answers, tutorials, and guidance for using HealthNetAI
          </p>
          {/* Enhanced Search Bar */}
          <div className="max-w-xl mx-auto relative">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search for help..."
                className="w-full pl-12 pr-4 py-4 rounded-full text-gray-900 bg-white shadow-lg focus:ring-2 focus:ring-blue-300 focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {searchResults.length > 0 && <SearchResults />}
          </div>
        </div>
      </div>

      <div className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Quick Access Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {categories.map((category) => (
              <motion.div
                key={category.id}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-md transition-all"
                onClick={() => setSelectedCategory(category.id)}
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                    {category.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{category.title}</h3>
                    <p className="text-sm text-gray-500">{category.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Selected Category Content */}
          {selectedCategory && (
            <CategoryContent category={selectedCategory} />
          )}

          {/* Navigation Tabs */}
          {!selectedCategory && (
            <>
              <div className="border-b border-gray-200 mb-8">
                <nav className="flex space-x-8" aria-label="Tabs">
                  {Object.entries(helpSections).map(([key, section]) => (
                    <button
                      key={key}
                      onClick={() => setActiveSection(key)}
                      className={`${
                        activeSection === key
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      } flex items-center space-x-2 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                    >
                      {section.icon}
                      <span>{section.title}</span>
                    </button>
                  ))}
                </nav>
              </div>

              {/* Content Section */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {activeSection === 'getting-started' && (
                    <div className="space-y-12">
                      {filteredContent('getting-started').map((section, idx) => (
                        <div key={idx} className="bg-white rounded-xl shadow-sm p-8">
                          <h3 className="text-2xl font-semibold text-gray-900 mb-4">{section.title}</h3>
                          <p className="text-gray-600 mb-6">{section.description}</p>
                          
                          {section.steps && (
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
                              {section.steps.map((step, stepIdx) => (
                                <StepCard key={stepIdx} step={step} index={stepIdx} />
                              ))}
                            </div>
                          )}
                          
                          {section.features && (
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                              {section.features.map((feature, featureIdx) => (
                                <motion.div
                                  key={featureIdx}
                                  whileHover={{ scale: 1.02 }}
                                  className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50"
                                >
                                  <div className="flex-shrink-0 bg-blue-100 p-2 rounded-lg text-blue-600">
                                    {feature.icon}
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                                    <p className="text-gray-600 text-sm">{feature.description}</p>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {activeSection === 'tutorials' && (
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                      {filteredContent('tutorials').map((tutorial, idx) => (
                        <motion.div
                          key={idx}
                          whileHover={{ scale: 1.02 }}
                          className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer"
                          onClick={() => {
                            setSelectedVideo(tutorial);
                            setShowVideoModal(true);
                          }}
                        >
                          <div className="relative pb-[56.25%] bg-gray-100 group">
                            <img
                              src={tutorial.thumbnail}
                              alt={tutorial.title}
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center">
                              <FaPlay className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all" />
                            </div>
                            <span className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
                              {tutorial.duration}
                            </span>
                          </div>
                          <div className="p-6">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">{tutorial.title}</h3>
                            <p className="text-gray-600 text-sm mb-4">{tutorial.description}</p>
                            <ul className="space-y-2">
                              {tutorial.topics.map((topic, topicIdx) => (
                                <li key={topicIdx} className="flex items-center text-sm text-gray-600">
                                  <FaVideo className="w-4 h-4 text-blue-500 mr-2" />
                                  {topic}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {activeSection === 'faq' && (
                    <div className="space-y-8">
                      {helpSections.faq.content.map((category, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="bg-white rounded-xl shadow-sm p-8"
                        >
                          <h3 className="text-xl font-semibold text-gray-900 mb-6">{category.category}</h3>
                          <div className="space-y-6">
                            {category.questions.map((item, itemIdx) => (
                              <motion.div
                                key={itemIdx}
                                className="border-b border-gray-100 pb-6 last:border-0"
                                whileHover={{ x: 4 }}
                              >
                                <h4 className="text-lg font-semibold text-gray-900 mb-3">{item.question}</h4>
                                <p className="text-gray-600 mb-4">{item.answer}</p>
                                {item.relatedLinks && (
                                  <div className="flex space-x-4">
                                    {item.relatedLinks.map((link, linkIdx) => (
                                      <Link
                                        key={linkIdx}
                                        to={link.url}
                                        className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm font-medium group"
                                      >
                                        <span>{link.text}</span>
                                        <FaArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                                      </Link>
                                    ))}
                                  </div>
                                )}
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </>
          )}
        </div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {showVideoModal && selectedVideo && (
          <VideoModal
            video={selectedVideo}
            onClose={() => {
              setShowVideoModal(false);
              setSelectedVideo(null);
            }}
          />
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default HelpCenter; 
