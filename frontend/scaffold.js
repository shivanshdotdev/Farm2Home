const fs = require('fs');
const path = require('path');

const components = [
  'Navbar', 'Footer', 'HeroSection', 'CategoryCard', 'ProductCard',
  'FarmerCard', 'VerifiedBadge', 'SearchBar', 'FilterPanel', 'Rating',
  'Button', 'Modal', 'OrderCard', 'EmptyState', 'LoadingState',
  'Toast', 'SectionHeading'
];

const pages = [
  'Home', 'Explore', 'ProductDetails', 'Farmers', 'FarmerProfile',
  'Cart', 'Checkout', 'Login', 'Signup', 'CustomerDashboard',
  'FarmerDashboard', 'AddProduct'
];

const createDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

createDir('src/components');
createDir('src/pages');

components.forEach(comp => {
  fs.writeFileSync(
    path.join('src/components', `${comp}.jsx`),
    `import React from 'react';\n\nconst ${comp} = () => {\n  return (\n    <div>${comp} Component</div>\n  );\n};\n\nexport default ${comp};\n`
  );
});

pages.forEach(page => {
  fs.writeFileSync(
    path.join('src/pages', `${page}.jsx`),
    `import React from 'react';\n\nconst ${page} = () => {\n  return (\n    <div className="min-h-screen pt-20 px-4">${page} Page</div>\n  );\n};\n\nexport default ${page};\n`
  );
});

console.log('Scaffolding complete.');
