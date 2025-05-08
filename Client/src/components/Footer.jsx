import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope, FaHeart } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { fadeIn, staggerContainer } from '../utils/motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const socialLinks = [
    { icon: <FaGithub className="text-xl" />, url: "https://github.com/MOUHAMEDBOUZAYAN/Mern-Blogger" },
    { icon: <FaLinkedin className="text-xl" />, url: "https://www.linkedin.com/in/mouhamed-bouzayan-9a7222344/" },
    { icon: <FaTwitter className="text-xl" />, url: "https://x.com/Mohamed25847140" },
    { icon: <FaEnvelope className="text-xl" />, url: "mohammedbouzi177@gmail.com" }
  ];

  const quickLinks = [
    { name: "Articles", url: "/articles" },
    { name: "Catégories", url: "/categories" },
    { name: "À propos", url: "/about" },
    { name: "Contact", url: "/contact" }
  ];

  const resources = [
    { name: "Documentation", url: "/about" },
    { name: "Blog", url: "/about" },
    { name: "FAQ", url: "/about" },
    { name: "Confidentialité", url: "/about" }
  ];

  return (
    <motion.footer
      initial="hidden"
      whileInView="show"
      variants={staggerContainer}
      viewport={{ once: true, amount: 0.25 }}
      className="bg-gray-900 text-white"
    >
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Section 1 - À propos */}
          <motion.div variants={fadeIn('right', 'tween', 0.2, 1)}>
            <h3 className="text-lg font-semibold text-emerald-400 mb-4">404.js Blog</h3>
            <p className="text-gray-400 text-sm">
              Plateforme de partage de connaissances et d'articles techniques pour la communauté des développeurs.
            </p>
          </motion.div>

          {/* Section 2 - Liens rapides */}
          <motion.div variants={fadeIn('right', 'tween', 0.3, 1)}>
            <h3 className="text-lg font-semibold text-emerald-400 mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.url} 
                    className="text-gray-400 hover:text-emerald-400 transition duration-300 text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Section 3 - Ressources */}
          <motion.div variants={fadeIn('right', 'tween', 0.4, 1)}>
            <h3 className="text-lg font-semibold text-emerald-400 mb-4">Ressources</h3>
            <ul className="space-y-2">
              {resources.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.url} 
                    className="text-gray-400 hover:text-emerald-400 transition duration-300 text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Section 4 - Contact */}
          <motion.div variants={fadeIn('right', 'tween', 0.5, 1)}>
            <h3 className="text-lg font-semibold text-emerald-400 mb-4">Contactez-nous</h3>
            <div className="flex space-x-4 mb-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  whileHover={{ y: -3 }}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-emerald-400 transition duration-300"
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
            <p className="text-sm text-gray-400">
              contact@404js.com<br />
              (+212) 690815605
            </p>
          </motion.div>
        </div>

        {/* Bas de footer */}
        <motion.div 
          variants={fadeIn('up', 'tween', 0.6, 1)}
          className="border-t border-gray-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center"
        >
          <p className="text-sm text-gray-400 mb-4 md:mb-0">
            © {currentYear} 404.js Blog. Tous droits réservés.
          </p>
          <p className="text-sm text-gray-400 flex items-center">
            Fait avec <FaHeart className="text-red-400 mx-1" /> par l'équipe 404.js
          </p>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;