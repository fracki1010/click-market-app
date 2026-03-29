import {
  FiInstagram,
  FiTwitter,
  FiFacebook,
  FiMail,
  FiPhone,
  FiMapPin,
} from "react-icons/fi";
import { FaCcVisa, FaCcMastercard, FaCcPaypal } from "react-icons/fa6";
import { Link } from "react-router";

import Logo from "../../assets/Recurso 1.svg";

export const Footer = () => {
  return (
    <footer className="bg-content1 text-default-600 border-t border-divider pt-12 pb-24 md:pb-12 px-4 transition-colors duration-300">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link
              className="flex items-center gap-2 text-primary font-black text-2xl tracking-tight"
              to="/"
            >
              <img alt="Logo" className="w-10 h-10" src={Logo} />
              <span>Click Market</span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs">
              Llevamos lo mejor del súper directamente a tu puerta. Calidad,
              variedad y rapidez en cada pedido.
            </p>
            <div className="flex gap-4">
              <a
                className="p-2 bg-gray-50 dark:bg-neutral-900 rounded-full hover:text-indigo-600 transition-colors"
                href="#"
              >
                <FiInstagram size={18} />
              </a>
              <a
                className="p-2 bg-gray-50 dark:bg-neutral-900 rounded-full hover:text-indigo-600 transition-colors"
                href="#"
              >
                <FiFacebook size={18} />
              </a>
              <a
                className="p-2 bg-gray-50 dark:bg-neutral-900 rounded-full hover:text-indigo-600 transition-colors"
                href="#"
              >
                <FiTwitter size={18} />
              </a>
            </div>
          </div>

          {/* Links Column */}
          <div>
            <h4 className="text-default-900 font-bold mb-6 text-sm uppercase tracking-widest">
              Nuestra Tienda
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  className="hover:text-primary transition-colors"
                  to="/products"
                >
                  Todos los productos
                </Link>
              </li>
              <li>
                <Link
                  className="hover:text-primary transition-colors text-secondary font-medium"
                  to="/products?categories=OFERTAS"
                >
                  Ofertas del día
                </Link>
              </li>
              {/* <li>
                <Link
                  to="/home"
                  className="hover:text-primary transition-colors"
                >
                  Cómo funciona
                </Link>
              </li> */}
              <li>
                <Link
                  className="hover:text-primary transition-colors"
                  to="/zonas-de-entrega"
                >
                  Zonas de entrega
                </Link>
              </li>
              <li>
                <Link
                  className="hover:text-primary transition-colors"
                  to="/nosotros"
                >
                  Quiénes somos
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="text-default-900 font-bold mb-6 text-sm uppercase tracking-widest">
              Atención al Cliente
            </h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <FiMapPin className="text-primary shrink-0 mt-0.5" size={16} />
                <span>
                  Valle de Uco, Mendoza, Argentina
                  <br />
                  <span className="text-[11px] opacity-70">
                    Envíos en menos de 48 horas
                  </span>
                </span>
              </li>
              <li className="flex items-center gap-3">
                <FiPhone className="text-primary shrink-0" size={16} />
                <span>+54 9 2622 430004</span>
              </li>
              <li className="flex items-center gap-3">
                <FiMail className="text-primary shrink-0" size={16} />
                <span>click.market.serv@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter/Payments Column */}
          <div className="space-y-6">
            <div>
              <h4 className="text-default-900 font-bold mb-4 text-sm uppercase tracking-widest">
                Métodos de Pago
              </h4>
              <div className="flex gap-4 text-gray-400 dark:text-neutral-600">
                <FaCcVisa size={32} />
                <FaCcMastercard size={32} />
                <FaCcPaypal size={32} />
              </div>
            </div>
            <div className="pt-2">
              <p className="text-xs font-bold text-default-400 mb-2 italic">
                100% SEGURO
              </p>
              <div className="h-0.5 w-12 bg-primary rounded-full" />
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-divider flex flex-col md:flex-row justify-between items-center gap-4 text-[12px] font-medium text-default-400">
          <p>
            © {new Date().getFullYear()} Click Market. Hecho con ❤️ para tu
            barrio.
          </p>
          <div className="flex gap-6">
            <Link className="hover:text-primary" to="/privacidad">
              Privacidad
            </Link>
            <Link className="hover:text-primary" to="/terminos">
              Términos
            </Link>
            <Link className="hover:text-primary" to="/condiciones">
              Condiciones
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
