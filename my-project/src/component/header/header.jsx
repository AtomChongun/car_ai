import React from 'react';
import { Home, Menu, Bell, Settings } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-red-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        {/* แบรนด์/ชื่อแอพ */}
        <div className="flex items-center gap-2">
          <Home size={32} />
          <h1 className="text-xl font-bold">IMPACTCHECK</h1>
        </div>
      </div>
    </header>
  );
};

export default Header;