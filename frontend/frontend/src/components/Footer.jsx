import { useEffect, useRef, useState } from 'react';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Heart } from 'lucide-react';

const Footer = () => {
  const footerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Simple fade-in effect
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const currentYear = new Date().getFullYear();

  return (
    <footer 
      ref={footerRef} 
      className={`bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-64 h-64 bg-cyan-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-500 rounded-full blur-3xl"></div>
      </div>

      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* About Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 mb-6">
              <span className="text-4xl">🏖️</span>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Paradise Resort
              </h3>
            </div>
            <p className="text-gray-300 leading-relaxed text-sm">
              Experience luxury and comfort at Paradise Resort. Your dream vacation destination
              with world-class amenities and unforgettable experiences.
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-400 pt-2">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500" fill="currentColor" />
              <span>for travelers</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-cyan-400">Quick Links</h3>
            <ul className="space-y-3">
              {['Home', 'About Us', 'Services', 'Packages', 'Gallery', 'Contact'].map((link, index) => (
                <li key={index}>
                  <a
                    href={`#${link.toLowerCase().replace(' ', '-')}`}
                    className="text-gray-300 hover:text-cyan-400 transition-all duration-300 hover:translate-x-2 inline-block text-sm font-medium"
                  >
                    → {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-cyan-400">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 group">
                <MapPin className="w-5 h-5 text-cyan-400 mt-1 flex-shrink-0" />
                <p className="text-gray-300 text-sm group-hover:text-white transition-colors">
                  123 Paradise Lane<br />Beach City, BC 12345
                </p>
              </div>
              <div className="flex items-center space-x-3 group">
                <Phone className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                <a
                  href="tel:+1234567890"
                  className="text-gray-300 hover:text-cyan-400 transition-colors text-sm"
                >
                  +1 (234) 567-890
                </a>
              </div>
              <div className="flex items-center space-x-3 group">
                <Mail className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                <a
                  href="mailto:info@paradiseresort.com"
                  className="text-gray-300 hover:text-cyan-400 transition-colors text-sm"
                >
                  info@paradiseresort.com
                </a>
              </div>
            </div>
          </div>

          {/* Social Media & Newsletter */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-cyan-400">Stay Connected</h3>
            <p className="text-gray-300 mb-4 text-sm">
              Follow us for the latest updates and exclusive offers.
            </p>
            <div className="flex space-x-3 mb-6">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-700 p-3 rounded-full hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-500 transition-all duration-300 transform hover:scale-110"
                title="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-700 p-3 rounded-full hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-500 transition-all duration-300 transform hover:scale-110"
                title="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-700 p-3 rounded-full hover:bg-gradient-to-r hover:from-pink-500 hover:to-orange-500 transition-all duration-300 transform hover:scale-110"
                title="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-700 p-3 rounded-full hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-110"
                title="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>

            {/* Newsletter */}
            <div className="bg-slate-800/70 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
              <h4 className="text-sm font-semibold mb-3 text-white">Subscribe Newsletter</h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 bg-slate-700 text-white placeholder-gray-400 px-4 py-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                />
                <button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 px-4 py-2 rounded-r-lg transition-all duration-300 transform hover:scale-105">
                  <Mail className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-center md:text-left text-sm">
              © {currentYear} Paradise Resort. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="#privacy" className="text-gray-400 hover:text-cyan-400 transition-colors">
                Privacy Policy
              </a>
              <a href="#terms" className="text-gray-400 hover:text-cyan-400 transition-colors">
                Terms of Service
              </a>
              <a href="#cookies" className="text-gray-400 hover:text-cyan-400 transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>

          {/* Credit */}
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Designed & Developed with passion for unforgettable experiences</p>
          </div>
        </div>
      </div>

      {/* Decorative Wave */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500"></div>
    </footer>
  );
};

export default Footer;