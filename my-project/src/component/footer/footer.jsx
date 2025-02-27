import React from 'react';
import { Heart, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-red-600 text-white py-6">
      <div className="container mx-auto px-4">
        {/* ส่วน Copyright */}
        <div className="pt-4 text-center items-center">
          <p className="text-white-400">Copyrights © {currentYear} IMPACTCHECK, All rights reserved, True Leasing Co., Ltd.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;