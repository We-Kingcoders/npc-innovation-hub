/**
 * Main App Component
 *
 * Updated to include AuthProvider for authentication management.
 * This wraps your entire application to provide auth context.
 */
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { SocketProvider } from "./contexts/SocketContext";
import AllRoutes from "./Routes/AllRoutes";
import "./index.css";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <AllRoutes />
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
