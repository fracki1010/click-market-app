import {
  FiInstagram,
  FiTwitter,
  FiFacebook,
  FiMail,
  FiPhone,
  FiMapPin,
} from "react-icons/fi";
import {
  FaBagShopping,
  FaCcVisa,
  FaCcMastercard,
  FaCcPaypal,
} from "react-icons/fa6";
import { Link } from "react-router";

export const Footer = () => {
  return (
    <footer className="bg-white dark:bg-neutral-950 text-gray-600 dark:text-neutral-400 border-t border-gray-100 dark:border-neutral-900 pt-12 pb-24 md:pb-12 px-4 transition-colors duration-300">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link
              className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-black text-2xl tracking-tight"
              to="/"
            >
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-1.5 rounded-xl shadow-lg">
                <FaBagShopping className="text-white text-xl" />
              </div>
              <span>Click Market</span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs">
              Llevamos lo mejor del súper directamente a tu puerta. Calidad,
              variedad y rapidez en cada pedido.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="p-2 bg-gray-50 dark:bg-neutral-900 rounded-full hover:text-indigo-600 transition-colors"
              >
                <FiInstagram size={18} />
              </a>
              <a
                href="#"
                className="p-2 bg-gray-50 dark:bg-neutral-900 rounded-full hover:text-indigo-600 transition-colors"
              >
                <FiFacebook size={18} />
              </a>
              <a
                href="#"
                className="p-2 bg-gray-50 dark:bg-neutral-900 rounded-full hover:text-indigo-600 transition-colors"
              >
                <FiTwitter size={18} />
              </a>
            </div>
          </div>

          {/* Links Column */}
          <div>
            <h4 className="text-gray-900 dark:text-white font-bold mb-6 text-sm uppercase tracking-widest">
              Nuestra Tienda
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  to="/products"
                  className="hover:text-indigo-600 transition-colors"
                >
                  Todos los productos
                </Link>
              </li>
              <li>
                <Link
                  to="/products?categories=OFERTAS"
                  className="hover:text-indigo-600 transition-colors text-secondary font-medium"
                >
                  Ofertas del día
                </Link>
              </li>
              <li>
                <Link
                  to="/home"
                  className="hover:text-indigo-600 transition-colors"
                >
                  Cómo funciona
                </Link>
              </li>
              <li>
                <Link
                  to="/zonas-de-entrega"
                  className="hover:text-indigo-600 transition-colors"
                >
                  Zonas de entrega
                </Link>
              </li>
              <li>
                <Link
                  to="/nosotros"
                  className="hover:text-indigo-600 transition-colors"
                >
                  Quiénes somos
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="text-gray-900 dark:text-white font-bold mb-6 text-sm uppercase tracking-widest">
              Atención al Cliente
            </h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <FiMapPin
                  className="text-indigo-500 shrink-0 mt-0.5"
                  size={16}
                />
                <span>
                  Buenos Aires, Argentina
                  <br />
                  <span className="text-[11px] opacity-70">
                    Envíos en menos de 90 min
                  </span>
                </span>
              </li>
              <li className="flex items-center gap-3">
                <FiPhone className="text-indigo-500 shrink-0" size={16} />
                <span>0800-CLICK-MARKET</span>
              </li>
              <li className="flex items-center gap-3">
                <FiMail className="text-indigo-500 shrink-0" size={16} />
                <span>hola@clickmarket.com.ar</span>
              </li>
            </ul>
          </div>

          {/* Newsletter/Payments Column */}
          <div className="space-y-6">
            <div>
              <h4 className="text-gray-900 dark:text-white font-bold mb-4 text-sm uppercase tracking-widest">
                Métodos de Pago
              </h4>
              <div className="flex gap-4 text-gray-400 dark:text-neutral-600">
                <FaCcVisa size={32} />
                <FaCcMastercard size={32} />
                <FaCcPaypal size={32} />
              </div>
            </div>
            <div className="pt-2">
              <p className="text-xs font-bold text-gray-400 dark:text-neutral-600 mb-2 italic">
                100% SEGURO
              </p>
              <div className="h-0.5 w-12 bg-indigo-500 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-gray-100 dark:border-neutral-900 flex flex-col md:flex-row justify-between items-center gap-4 text-[12px] font-medium text-gray-400">
          <p>
            © {new Date().getFullYear()} Click Market. Hecho con ❤️ para tu
            barrio.
          </p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-indigo-500">
              Privacidad
            </a>
            <a href="#" className="hover:text-indigo-500">
              Términos
            </a>
            <a href="#" className="hover:text-indigo-500">
              Devoluciones
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
