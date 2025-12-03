import type { ReactElement } from 'react';
import { Routes, Route } from 'react-router-dom';
import Contacts from '../pages/Contacts/Contacts';
import AddFriendRequest from '../pages/Contacts/AddFriendRequest';
import ListGroups from '../pages/Contacts/ListGroups';
import ListContacts from '../pages/Contacts/ListContacts';
import AddGroupRequest from '../pages/Contacts/AddGroupRequest';
import Messages from '../pages/message/Messages';
import Post from '../pages/post/Post';

interface CustomRoute {
  path: string;
  element: ReactElement;
  children?: CustomRoute[];
  subRoutes?: CustomRoute[];
}

const router: CustomRoute[] = [
  {
    path: '/',
    element: (
      <Messages />
    ),
  },
  {
    path: '/:id',
    element: (
      <Messages />
    ),
  },
  {
    path: '/group/:id',
    element: (
      <Messages />
    ),
  },
  {
    path: '/contacts',
    element: (
      <Contacts />
    ),
    subRoutes: [
      { path: '', element: <ListContacts /> },
      { path: '/contacts/list-groups', element: <ListGroups /> },
      { path: '/contacts/add-group-request', element: <AddGroupRequest /> },
      { path: '/contacts/add-friend-request', element: <AddFriendRequest /> },
    ]
  },
  {
    path: '/post',
    element: (
      <Post />
    )
  }
  
];

// Recursive function to render both top-level and nested routes
function renderRoutes(routeArray: CustomRoute[]): ReactElement[] {
  return routeArray.map((route, index) => (
    <Route key={index} path={route.path} element={route.element}>
      {route.subRoutes && renderRoutes(route.subRoutes)}
    </Route>
  ));
}

function ClientRouter(): ReactElement {
  return (
    <Routes>
      {renderRoutes(router)}
    </Routes>
  );
}

export default ClientRouter;



