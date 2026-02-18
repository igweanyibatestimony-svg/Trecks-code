import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, isAuthenticated }) => {
  return isAuthenticated ? children : <Navigate to="/admin/login" />;
};

export default PrivateRoute;