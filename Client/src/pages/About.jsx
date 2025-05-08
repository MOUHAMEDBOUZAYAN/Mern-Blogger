import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { FaCode, FaUsers, FaRocket, FaLightbulb } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { fadeIn, staggerContainer, textVariant, zoomIn } from '../utils/motion';

const About = () => {
  const features = [
    {
      icon: <FaCode className="text-3xl text-emerald-600" />,
      title: "Technologies Modernes",
      description: "Utilisation des dernières technologies web pour une expérience utilisateur optimale."
    },
    {
      icon: <FaUsers className="text-3xl text-emerald-600" />,
      title: "Communauté Engagée",
      description: "Une communauté de développeurs passionnés qui partagent leurs connaissances."
    },
    {
      icon: <FaRocket className="text-3xl text-emerald-600" />,
      title: "Croissance Continue",
      description: "Nous évoluons constamment pour répondre aux besoins de nos utilisateurs."
    },
    {
      icon: <FaLightbulb className="text-3xl text-emerald-600" />,
      title: "Ressources Innovantes",
      description: "Des articles techniques et tutoriels pour tous les niveaux de compétence."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-600 to-emerald-900">
      <Navbar />
      
      <motion.div 
        initial="hidden"
        animate="show"
        variants={staggerContainer}
        className="container mx-auto px-4 py-16"
      >
        {/* Hero Section */}
        <motion.div variants={textVariant(0.1)} className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">À propos de <span className="text-neutral-900 text-red">404.js Blog</span></h1>
          <motion.p variants={fadeIn('up', 'tween', 0.2, 1)} className="text-xl text-emerald-100 max-w-3xl mx-auto">
            La plateforme de référence pour les développeurs qui veulent partager et acquérir des connaissances techniques.
          </motion.p>
        </motion.div>

        {/* Features Grid */}
        <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={fadeIn('up', 'tween', index * 0.1, 0.5)}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition duration-300"
            >
              <div className="flex justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-center text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-center">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Mission Section */}
        <motion.div 
          variants={fadeIn('up', 'tween', 0.2, 1)}
          className="bg-white rounded-xl shadow-lg overflow-hidden mb-16"
        >
          <div className="md:flex">
            <div className="md:w-1/2 p-8 md:p-12">
              <h2 className="text-3xl font-bold text-emerald-800 mb-4">Notre Mission</h2>
              <p className="text-gray-700 mb-4">
                Chez 404.js Blog, nous croyons que le partage des connaissances est la clé du progrès technologique.
                Notre mission est de créer un espace où les développeurs peuvent apprendre, enseigner et grandir ensemble.
              </p>
              <p className="text-gray-700">
                Nous nous engageons à fournir des contenus de qualité, vérifiés par notre communauté,
                pour aider les développeurs à résoudre des problèmes réels et à progresser dans leur carrière.
              </p>
            </div>
            <motion.div 
              variants={zoomIn(0.4, 1)}
              className="md:w-1/2 bg-emerald-100 flex items-center justify-center p-8"
            >
              <div className="text-center">
                <div className="text-6xl font-bold text-emerald-700 mb-4">2025</div>
                <p className="text-emerald-800 font-medium">Année de création</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Team Section */}
        <motion.div variants={fadeIn('up', 'tween', 0.2, 1)} className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Notre Équipe</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "MOUHAMED BOUZAYAN", role: "Fondateur & Lead Developer", bio: "Expert en JavaScript avec 10 ans d'expérience." },
              { name: "ANASS AZZ", role: "Développeur Fullstack", bio: "Passionné par les architectures évolutives." }
            ].map((member, index) => (
              <motion.div
                key={index}
                variants={fadeIn('up', 'tween', index * 0.2, 1)}
                whileHover={{ y: -10 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden transition duration-300"
              >
                <div className="h-48 bg-gradient-to-r from-emerald-400 to-emerald-600 flex items-center justify-center">
                  <div className="text-white text-6xl font-bold">{member.name.charAt(0)}</div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800">{member.name}</h3>
                  <p className="text-emerald-600 font-medium mb-2">{member.role}</p>
                  <p className="text-gray-600">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div variants={fadeIn('up', 'tween', 0.2, 1)} className="text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Prêt à nous rejoindre ?</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/register" 
              className="bg-white text-emerald-700 hover:bg-emerald-50 px-8 py-4 rounded-lg font-bold text-lg transition duration-300 shadow-lg hover:shadow-xl"
            >
              Créer un compte
            </Link>
            <Link 
              to="/articles" 
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-emerald-700 px-8 py-4 rounded-lg font-bold text-lg transition duration-300 shadow-lg hover:shadow-xl"
            >
              Explorer les articles
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default About;