import React from 'react';
import { Pizza, Phone, Mail, Clock } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Brand Section */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-2 mb-4">
              <Pizza className="h-8 w-8 text-yellow-400" />
              <h2 className="text-2xl font-bold">Pizzaria Crosta</h2>
            </div>
            <p className="text-gray-400 text-center md:text-left">
              Pizza deliciosa feita com os melhores ingredientes, assada à perfeição em nossos fornos a lenha.
            </p>
          </div>

          {/* Contact Section */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-xl font-semibold mb-4">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-red-500" />
                <span>(555) 123-4567</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-red-500" />
                <span>contact@pizzariacrosta.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-red-500" />
                <span>Seg-Dom: 11:00 - 22:00</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-500">
            &copy; {new Date().getFullYear()} Pizzaria Crosta. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;