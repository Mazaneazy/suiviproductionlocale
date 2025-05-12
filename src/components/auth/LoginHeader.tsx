
import React from 'react';

const LoginHeader = () => {
  return (
    <div className="text-center mb-8">
      <img 
        src="/lovable-uploads/e1bf7151-3abe-4c2a-8037-71e791d77bf9.png" 
        alt="ANOR Logo" 
        className="h-16 mx-auto mb-4" 
        loading="eager"
        width="64"
        height="64"
      />
      <h1 className="text-2xl font-bold text-gray-800">
        ANOR Certification
      </h1>
      <p className="text-gray-500 mt-2">
        Système de gestion des certifications
      </p>
    </div>
  );
};

export default LoginHeader;
