import React from 'react';
import Footer from './Footer';

const PublicLayout = ({ children }) => {
  return (
    <>
      {children}
      <Footer />
    </>
  );
};

export default PublicLayout;
