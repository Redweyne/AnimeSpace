// Utility functions

export function createPageUrl(pageName) {
  const routes = {
    Feed: '/',
    CreateMoment: '/create',
    MomentDetail: '/moment',
  };
  return routes[pageName] || '/';
}

export function cn(...inputs) {
  return inputs.filter(Boolean).join(' ');
}
