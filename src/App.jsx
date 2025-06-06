import "./App.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "./components/mode-toggle";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Footer from "./pages/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {

  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <ModeToggle/> 
        <Routes>
        <Route path="/" element={<Home/>} />
        </Routes>
        <Footer/>
        <ToastContainer position="bottom-right" theme="dark" />
      </Router>
      </ThemeProvider>
    </>
  )
}

export default App
