import {
  FiBookOpen,
  FiHome,
  FiShoppingCart,
  FiMail,
  FiPhone,
  FiMapPin,
} from "react-icons/fi";

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-indigo-700 to-purple-700 text-white p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
        <div>
          <h3 className="text-xl font-semibold border-b border-white/20 pb-1 mb-2">
            EduCart
          </h3>
          <p>
            Your smart learning resources marketplace. Find everything you need
            for your educational journey.
          </p>
        </div>
        <div>
          <h3 className="text-xl font-semibold border-b border-white/20 pb-1 mb-2">
            Quick Links
          </h3>
          <ul className="space-y-1">
            <li>
              <a className="flex items-center gap-1 hover:text-white" href="/">
                <FiHome /> Home
              </a>
            </li>
            <li>
              <a
                className="flex items-center gap-1 hover:text-white"
                href="/products"
              >
                <FiBookOpen /> Products
              </a>
            </li>
            <li>
              <a
                className="flex items-center gap-1 hover:text-white"
                href="/cart"
              >
                <FiShoppingCart /> Cart
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-semibold border-b border-white/20 pb-1 mb-2">
            Contact
          </h3>
          <ul className="space-y-1">
            <li>
              <a
                className="flex items-center gap-1 hover:text-white"
                href="mailto:info@educart.com"
              >
                <FiMail /> info@educart.com
              </a>
            </li>
            <li>
              <a
                className="flex items-center gap-1 hover:text-white"
                href="tel:+1234567890"
              >
                <FiPhone /> (123) 456-7890
              </a>
            </li>
            <li>
              <a className="flex items-center gap-1 hover:text-white" href="#">
                <FiMapPin /> 123 Learning St, EduCity
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="mt-6 text-center text-sm text-white/60 border-t border-white/20 pt-4">
        &copy; {new Date().getFullYear()} EduCart. All rights reserved.
      </div>
    </footer>
  );
};
