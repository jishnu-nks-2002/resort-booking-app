
import { useEffect, useRef, useState } from 'react';
import { 
  Home as HomeIcon, 
  Mountain, 
  Heart, 
  Calendar, 
  Users, 
  Plus, 
  Minus, 
  X,
  CheckCircle,
  Utensils,
  Waves,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Star,
  Award,
  Shield,
  Menu,
} from 'lucide-react';

const HomePage = () => {
  const heroRef = useRef(null);
  const servicesRef = useRef(null);
  const packagesRef = useRef(null);
  const galleryRef = useRef(null);
  const featuresRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    customerName: '',
    email: '',
    phone: '',
    checkInDate: '',
    checkOutDate: '',
    numberOfGuests: 1,
    specialRequests: '',
  });

  const [selectedItems, setSelectedItems] = useState([]);
  const [showItemModal, setShowItemModal] = useState(false);
  const [currentItem, setCurrentItem] = useState({
    itemType: 'food',
    name: '',
    price: 0,
    quantity: 1,
  });

  const [galleryIndex, setGalleryIndex] = useState(0);

  const availableItems = {
    accommodation: [
      { name: 'Deluxe Room', price: 150, description: 'Luxury room with ocean view' },
      { name: 'Suite', price: 250, description: 'Spacious suite with premium amenities' },
      { name: 'Villa', price: 500, description: 'Private villa with pool' },
    ],
    food: [
      { name: 'Continental Breakfast', price: 25, description: 'Fresh breakfast spread' },
      { name: 'Gourmet Dinner', price: 75, description: 'Chef\'s special 3-course meal' },
      { name: 'Seafood Platter', price: 95, description: 'Fresh catch of the day' },
      { name: 'BBQ Special', price: 65, description: 'Grilled delights' },
    ],
    activity: [
      { name: 'Scuba Diving', price: 120, description: 'Explore underwater beauty' },
      { name: 'Jet Ski', price: 80, description: 'Thrilling water adventure' },
      { name: 'Sunset Cruise', price: 150, description: 'Romantic evening cruise' },
    ],
    spa: [
      { name: 'Full Body Massage', price: 90, description: '90-minute relaxation' },
      { name: 'Facial Treatment', price: 70, description: 'Rejuvenating facial' },
      { name: 'Spa Package', price: 200, description: 'Complete wellness experience' },
    ],
  };

  const heroSlides = [
    {
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1920&h=1080&fit=crop',
      title: 'Welcome to Paradise',
      subtitle: 'Your Dream Vacation Awaits',
      description: 'Experience luxury, comfort, and unforgettable memories'
    },
    {
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&h=1080&fit=crop',
      title: 'Luxury Accommodation',
      subtitle: 'Indulge in Comfort',
      description: 'Premium rooms with breathtaking ocean views'
    },
    {
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1920&h=1080&fit=crop',
      title: 'Gourmet Dining',
      subtitle: 'Culinary Excellence',
      description: 'World-class cuisine by master chefs'
    },
    {
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1920&h=1080&fit=crop',
      title: 'Wellness & Spa',
      subtitle: 'Rejuvenate Your Soul',
      description: 'Premium spa treatments and wellness programs'
    },
  ];

  const galleryImages = [
    { url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800', caption: 'Luxury Ocean View Rooms' },
    { url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', caption: 'Infinity Pool Paradise' },
    { url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', caption: 'Gourmet Dining Experience' },
    { url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800', caption: 'Spa & Wellness Center' },
    { url: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800', caption: 'Beach Activities' },
    { url: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800', caption: 'Sunset Views' },
  ];

  const packages = [
    {
      name: 'Beach Escape',
      type: 'standard',
      price: 599,
      discount: 15,
      description: 'Perfect getaway for beach lovers',
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
      features: ['Ocean view room', 'Daily breakfast', 'Beach activities', 'Spa access']
    },
    {
      name: 'Luxury Paradise',
      type: 'luxury',
      price: 1299,
      discount: 20,
      description: 'Ultimate luxury experience',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
      features: ['Premium suite', 'All meals included', 'Private butler', 'Exclusive spa']
    },
    {
      name: 'Adventure Plus',
      type: 'standard',
      price: 799,
      discount: 10,
      description: 'For thrill-seekers and explorers',
      image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
      features: ['Deluxe room', 'Adventure activities', 'Equipment rental', 'Guide services']
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setGalleryIndex((prev) => (prev + 1) % galleryImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  const handleBookNow = () => setShowBookingModal(true);

  const handleSelectPackage = (pkg) => {
    const items = pkg.features.map((feature, idx) => ({
      itemType: 'package',
      name: feature,
      price: pkg.price / pkg.features.length,
      quantity: 1
    }));
    setSelectedItems(items);
    setShowBookingModal(true);
  };

  const handleAddItem = () => setShowItemModal(true);

  const handleItemSelect = (type, item) => {
    setCurrentItem({
      itemType: type,
      name: item.name,
      description: item.description,
      price: item.price,
      quantity: 1,
    });
  };

  const addItemToList = () => {
    if (!currentItem.name) return;
    setSelectedItems([...selectedItems, { ...currentItem }]);
    setCurrentItem({ itemType: 'food', name: '', price: 0, quantity: 1 });
    setShowItemModal(false);
  };

  const removeItem = (index) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    const subtotal = selectedItems.reduce((total, item) => total + item.price * item.quantity, 0);
    return { subtotal, discount: 0, total: subtotal };
  };

  const handleSubmitBooking = (e) => {
    e.preventDefault();
    if (selectedItems.length === 0) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowBookingModal(false);
      setSelectedItems([]);
      alert('Booking confirmed!');
    }, 1500);
  };

  const services = [
    { icon: <HomeIcon className="w-8 h-8 sm:w-10 md:w-12" />, title: 'Luxury Accommodation', description: 'Premium rooms with breathtaking ocean views', gradient: 'from-blue-500 to-cyan-500' },
    { icon: <Utensils className="w-8 h-8 sm:w-10 md:w-12" />, title: 'Gourmet Dining', description: 'World-class cuisine by master chefs', gradient: 'from-orange-500 to-red-500' },
    { icon: <Waves className="w-8 h-8 sm:w-10 md:w-12" />, title: 'Water Adventures', description: 'Exciting water sports and beach activities', gradient: 'from-teal-500 to-green-500' },
    { icon: <Sparkles className="w-8 h-8 sm:w-10 md:w-12" />, title: 'Wellness & Spa', description: 'Rejuvenate with world-class spa treatments', gradient: 'from-purple-500 to-pink-500' },
  ];

  const features = [
    { icon: <Star className="w-5 h-5 sm:w-6" />, title: '5-Star Service', description: 'Exceptional hospitality' },
    { icon: <Award className="w-5 h-5 sm:w-6" />, title: 'Award Winning', description: 'Globally recognized excellence' },
    { icon: <Shield className="w-5 h-5 sm:w-6" />, title: 'Safe & Secure', description: '24/7 security protocols' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section - Fully Responsive */}
      <section ref={heroRef} className="relative h-[100svh] min-h-[500px] max-h-[900px] overflow-hidden">
        {/* Background Slides */}
        <div className="absolute inset-0">
          {heroSlides.map((slide, index) => (
            <div key={index} className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
              <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
            </div>
          ))}
        </div>

        {/* Slider Controls - Responsive positioning */}
        <button onClick={prevSlide} className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 sm:p-3 rounded-full transition-all">
          <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
        </button>
        <button onClick={nextSlide} className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 sm:p-3 rounded-full transition-all">
          <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
        </button>

        {/* Slider Dots - Responsive */}
        <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-2 sm:space-x-3">
          {heroSlides.map((_, index) => (
            <button key={index} onClick={() => setCurrentSlide(index)} className={`transition-all rounded-full ${index === currentSlide ? 'w-8 sm:w-12 h-2 sm:h-3 bg-white' : 'w-2 sm:w-3 h-2 sm:h-3 bg-white/50'}`} />
          ))}
        </div>

        {/* Hero Content - Fully Responsive */}
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-3xl">
              <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-3 sm:mb-4 md:mb-6 text-white leading-tight">
                {heroSlides[currentSlide].title}
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl lg:text-4xl mb-2 sm:mb-3 md:mb-4 text-cyan-300 font-light">
                {heroSlides[currentSlide].subtitle}
              </p>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-4 sm:mb-6 md:mb-8 text-gray-200">
                {heroSlides[currentSlide].description}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button onClick={handleBookNow} className="text-sm sm:text-base lg:text-lg px-6 sm:px-8 lg:px-10 py-3 sm:py-3.5 lg:py-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold transition-all">
                  Book Now
                </button>
                <button onClick={() => servicesRef.current?.scrollIntoView({ behavior: 'smooth' })} className="text-sm sm:text-base lg:text-lg px-6 sm:px-8 lg:px-10 py-3 sm:py-3.5 lg:py-4 rounded-full bg-white/10 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-gray-900 font-bold transition-all">
                  Explore More
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar - Responsive Grid */}
      <section ref={featuresRef} className="py-6 sm:py-8 md:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3 sm:space-x-4 p-4 sm:p-5 md:p-6 bg-gradient-to-r from-gray-50 to-white rounded-xl shadow-md hover:shadow-xl transition-all">
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center text-white">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm sm:text-base lg:text-lg">{feature.title}</h3>
                  <p className="text-gray-600 text-xs sm:text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section - Responsive Grid */}
      <section ref={servicesRef} className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">Our Premium Services</h2>
            <div className="w-16 sm:w-20 md:w-24 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto mb-4 sm:mb-6"></div>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 px-4">Everything you need for an unforgettable experience</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {services.map((service, index) => (
              <div key={index} className="group relative bg-white rounded-2xl p-6 sm:p-7 md:p-8 shadow-lg hover:shadow-2xl transition-all overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
                <div className="relative z-10 flex justify-center mb-4 sm:mb-5 md:mb-6 text-gray-700 group-hover:text-cyan-600 transition-colors">
                  {service.icon}
                </div>
                <h3 className="relative z-10 text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 text-center group-hover:text-cyan-600 transition-all">
                  {service.title}
                </h3>
                <p className="relative z-10 text-sm sm:text-base text-gray-600 text-center leading-relaxed">
                  {service.description}
                </p>
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${service.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform`}></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Section - Responsive Cards */}
      <section ref={packagesRef} className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-br from-gray-50 via-cyan-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">Our Exclusive Packages</h2>
            <div className="w-16 sm:w-20 md:w-24 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto mb-4 sm:mb-6"></div>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 px-4">Choose the perfect package for your dream vacation</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {/* Custom Package */}
            <div className="group bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all">
              <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800" alt="Custom Package" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h3 className="text-xl sm:text-2xl font-bold text-white">Custom Package</h3>
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold">CUSTOM</span>
                  </div>
                </div>
              </div>
              <div className="p-4 sm:p-5 md:p-6">
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Create your perfect vacation by selecting exactly what you want</p>
                <button onClick={handleBookNow} className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg text-sm sm:text-base transition-all">
                  Create Custom Package
                </button>
              </div>
            </div>

            {/* Regular Packages */}
            {packages.map((pkg, idx) => (
              <div key={idx} className="group bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all">
                <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
                  <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                  <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <h3 className="text-xl sm:text-2xl font-bold text-white">{pkg.name}</h3>
                      {pkg.discount > 0 && (
                        <span className={`${pkg.type === 'luxury' ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' : 'bg-gradient-to-r from-green-400 to-green-600'} text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold`}>
                          {pkg.discount}% OFF
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="p-4 sm:p-5 md:p-6">
                  <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">{pkg.description}</p>
                  <div className="flex items-baseline mb-4 sm:mb-6">
                    <span className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                      ${(pkg.price * (1 - pkg.discount / 100)).toFixed(0)}
                    </span>
                    {pkg.discount > 0 && (
                      <span className="text-gray-400 line-through ml-2 text-base sm:text-lg">${pkg.price}</span>
                    )}
                  </div>
                  <ul className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-start text-gray-700">
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => handleSelectPackage(pkg)} className={`w-full ${pkg.type === 'luxury' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' : 'bg-gradient-to-r from-green-500 to-green-600'} text-white font-bold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg text-sm sm:text-base transition-all`}>
                    Book {pkg.name}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section ref={galleryRef} className="py-24 bg-gradient-to-b from-gray-900 to-black text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">Explore Paradise</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto mb-6"></div>
            <p className="text-xl text-gray-400">
              Glimpse into your next unforgettable vacation
            </p>
          </div>

          <div className="gallery-container relative" style={{ opacity: 1 }}>
            <div className="relative h-[600px] rounded-3xl overflow-hidden shadow-2xl">
              {galleryImages.map((image, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-all duration-1000 ${
                    index === galleryIndex
                      ? 'opacity-100 scale-100'
                      : 'opacity-0 scale-105'
                  }`}
                >
                  <img
                    src={image.url}
                    alt={image.caption}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                  
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-center">
                    <h3 className="text-3xl font-bold mb-2">{image.caption}</h3>
                    <div className="flex justify-center space-x-2 mt-4">
                      {galleryImages.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setGalleryIndex(idx)}
                          className={`transition-all ${
                            idx === galleryIndex
                              ? 'w-8 h-2 bg-white'
                              : 'w-2 h-2 bg-white/50 hover:bg-white/75'
                          } rounded-full`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-center space-x-4 overflow-x-auto pb-4">
              {galleryImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setGalleryIndex(index)}
                  className={`flex-shrink-0 w-32 h-24 rounded-lg overflow-hidden transition-all ${
                    index === galleryIndex
                      ? 'ring-4 ring-cyan-500 scale-110'
                      : 'opacity-50 hover:opacity-100'
                  }`}
                >
                  <img
                    src={image.url}
                    alt={image.caption}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Create Booking</h2>
                {selectedPackage && (
                  <span className={`badge mt-2 ${
                    selectedPackage.type === 'luxury'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {selectedPackage.name}
                  </span>
                )}
              </div>
              <button
                onClick={() => setShowBookingModal(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmitBooking} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={bookingForm.customerName}
                    onChange={(e) =>
                      setBookingForm({ ...bookingForm, customerName: e.target.value })
                    }
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={bookingForm.email}
                    onChange={(e) =>
                      setBookingForm({ ...bookingForm, email: e.target.value })
                    }
                    className="input-field"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    required
                    value={bookingForm.phone}
                    onChange={(e) =>
                      setBookingForm({ ...bookingForm, phone: e.target.value })
                    }
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Guests
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={bookingForm.numberOfGuests}
                    onChange={(e) =>
                      setBookingForm({ ...bookingForm, numberOfGuests: parseInt(e.target.value) })
                    }
                    className="input-field"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-in Date
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={bookingForm.checkInDate}
                    onChange={(e) =>
                      setBookingForm({ ...bookingForm, checkInDate: e.target.value })
                    }
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-out Date
                  </label>
                  <input
                    type="date"
                    required
                    min={bookingForm.checkInDate || new Date().toISOString().split('T')[0]}
                    value={bookingForm.checkOutDate}
                    onChange={(e) =>
                      setBookingForm({ ...bookingForm, checkOutDate: e.target.value })
                    }
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Selected Items ({selectedItems.length})
                  </label>
                  {!selectedPackage && (
                    <button
                      type="button"
                      onClick={handleAddItem}
                      className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium"
                    >
                      <Plus className="w-5 h-5" />
                      <span>Add Item</span>
                    </button>
                  )}
                </div>

                {selectedItems.length > 0 && (
                  <div className="space-y-2 mb-4">
                    {selectedPackage && (
                      <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-3 rounded-lg text-center mb-3">
                        <span className="font-bold">{selectedPackage.name}</span>
                        {selectedPackage.discountPercent > 0 && (
                          <span className="ml-2 bg-white text-cyan-600 px-2 py-1 rounded-full text-sm font-bold">
                            {selectedPackage.discountPercent}% OFF
                          </span>
                        )}
                      </div>
                    )}

                    {selectedItems.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div>
                          <span className="font-medium">{item.name}</span>
                          <span className="text-gray-600 text-sm ml-2">
                            x{item.quantity}
                          </span>
                          <span className="text-cyan-600 font-medium ml-2">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                        {!selectedPackage && (
                          <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="text-red-600 hover:text-red-700 transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    ))}

                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between text-gray-700">
                        <span>Subtotal:</span>
                        <span className="font-semibold">${calculateTotal().subtotal.toFixed(2)}</span>
                      </div>
                      
                      {calculateTotal().discount > 0 && (
                        <div className="flex justify-between text-green-600 font-semibold">
                          <span>Package Discount ({selectedPackage.discountPercent}%):</span>
                          <span>-${calculateTotal().discount.toFixed(2)}</span>
                        </div>
                      )}
                      
                      <div className="border-t pt-2 flex justify-between items-center font-bold text-lg">
                        <span>Total:</span>
                        <span className="text-cyan-600 text-2xl">
                          ${calculateTotal().total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Requests (Optional)
                </label>
                <textarea
                  rows="3"
                  value={bookingForm.specialRequests}
                  onChange={(e) =>
                    setBookingForm({ ...bookingForm, specialRequests: e.target.value })
                  }
                  className="input-field"
                  placeholder="Any special requirements or dietary restrictions..."
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="btn-secondary"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                  disabled={loading || selectedItems.length === 0}
                >
                  {loading ? 'Creating...' : 'Confirm Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Item Modal */}
      {showItemModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
              <h3 className="text-xl font-bold text-gray-900">Add Item to Booking</h3>
              <button
                onClick={() => setShowItemModal(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex space-x-2 mb-6 overflow-x-auto">
                {Object.keys(availableItems).map((type) => (
                  <button
                    key={type}
                    onClick={() => setCurrentItem({ ...currentItem, itemType: type })}
                    className={`px-4 py-2 rounded-lg font-medium capitalize whitespace-nowrap transition-all ${
                      currentItem.itemType === type
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {availableItems[currentItem.itemType].map((item, index) => (
                  <div
                    key={index}
                    onClick={() => handleItemSelect(currentItem.itemType, item)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      currentItem.name === item.name
                        ? 'border-cyan-500 bg-cyan-50 shadow-lg'
                        : 'border-gray-200 hover:border-cyan-300 hover:shadow-md'
                    }`}
                  >
                    <h4 className="font-semibold text-lg mb-1">{item.name}</h4>
                    <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                    <p className="text-cyan-600 font-bold">${item.price}</p>
                  </div>
                ))}
              </div>

              {currentItem.name && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center space-x-4">
                    <button
                      type="button"
                      onClick={() =>
                        setCurrentItem({
                          ...currentItem,
                          quantity: Math.max(1, currentItem.quantity - 1),
                        })
                      }
                      className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <span className="text-xl font-semibold w-12 text-center">
                      {currentItem.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setCurrentItem({
                          ...currentItem,
                          quantity: currentItem.quantity + 1,
                        })
                      }
                      className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowItemModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button onClick={addItemToList} className="btn-primary bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
                  Add to Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;