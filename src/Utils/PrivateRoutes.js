import { Outlet, Navigate } from 'react-router-dom'

const PrivateRoutes = () => {
    let isLoggedIn = localStorage.getItem('token');
    return(
        isLoggedIn ? <Outlet/> : <Navigate to="/login"/>
    )
}

export default PrivateRoutes


// import { Outlet, Navigate } from 'react-router-dom'

// const PrivateRoutes = () => {
//   const isLoggedIn = localStorage.getItem('token');

//   // Check if user is already logged in
//   if (isLoggedIn) {
//     return <Navigate to="/dashboard" />;
//   }

//   // Render outlet for nested routes
//   return <Outlet />;
// };

// export default PrivateRoutes;
