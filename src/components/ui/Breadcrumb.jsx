import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

const Breadcrumb = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const pathMap = {
    '/dashboard': 'Dashboard',
    '/content-generation': 'Content Generation',
    '/model-management': 'Model Management',
    '/landing-page': 'Landing Page',
    '/authentication': 'Authentication',
    '/settings': 'Settings',
    '/help': 'Help',
  };

  const generateBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = [{ label: 'Dashboard', path: '/dashboard' }];

    if (location.pathname !== '/dashboard') {
      const currentPath = `/${pathSegments.join('/')}`;
      const currentLabel = pathMap[currentPath] || pathSegments[pathSegments.length - 1];
      
      if (currentPath !== '/dashboard') {
        breadcrumbs.push({ label: currentLabel, path: currentPath });
      }
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  const handleNavigation = (path) => {
    navigate(path);
  };

  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm font-caption mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbs.map((crumb, index) => (
          <li key={crumb.path} className="flex items-center">
            {index > 0 && (
              <Icon 
                name="ChevronRight" 
                size={16} 
                className="text-muted-foreground mx-2" 
              />
            )}
            {index === breadcrumbs.length - 1 ? (
              <span className="text-foreground font-medium">
                {crumb.label}
              </span>
            ) : (
              <button
                onClick={() => handleNavigation(crumb.path)}
                className="text-muted-foreground hover:text-foreground transition-colors duration-150 hover:underline"
              >
                {crumb.label}
              </button>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;