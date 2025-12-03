import type { ReactElement } from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgetPassword from '../pages/auth/ForgetPassword';
import ResetPassword from '../pages/auth/ResetPassword';

interface CustomRoute {
  path: string;
  element: ReactElement;
  children?: CustomRoute[];
}

const router: CustomRoute[] = [
  {
    path: '/',
    element: (
        <Login />
    ),
  },
  {
    path: '/register',
    element: (
      <Register />
    ),
  },
  {
    path: '/forget-password',
    element: <ForgetPassword />,
  },
  {
    path: '/reset-password',
    element: <ResetPassword email={''} />,
  },
];

// Recursive function to render both top-level and nested routes
function renderRoutes(routeArray: CustomRoute[]): ReactElement[] {
  return routeArray.map((route, index) => (
    <Route key={index} path={route.path} element={route.element}>
      {route.children && renderRoutes(route.children)}
    </Route>
  ));
}

function AuthRouter(): ReactElement {
  return (
    <Routes>
      {renderRoutes(router)}
    </Routes>
  );
}

export default AuthRouter;
