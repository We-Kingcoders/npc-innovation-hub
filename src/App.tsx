// import React from "react";
// import AllRoutes from "./Routes/AllRoutes";

// const App: React.FC = () => {
//   return <AllRoutes />;
// };

// export default App;

/**
 * Main App Component
 *
 * Updated to include AuthProvider for authentication management.
 * This wraps your entire application to provide auth context.
 */

import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import AllRoutes from "./Routes/AllRoutes";
import "./index.css";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AllRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
