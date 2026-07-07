import { Routes, Route, useLocation } from "react-router-dom";

import Login from "./pages/01.login";
import Features from "./pages/02.features";
import CreateNew from "./pages/03.createnew";
import ChatSessiion from "./pages/04.chatSession";
import History from "./pages/05.history";
import Logger from "./components/03.handling.jsx";
import Nav from "./components/01.nav";
import Resume from "./pages/05.resume.jsx"
import Analysis from "./pages/06.analytics.jsx"

function App() {
  const location = useLocation();

  const shouldHideNav =
    location.pathname === "/login-signup" ||
    location.pathname.startsWith("/chatSession"); 

  return (
    <div>
      {!shouldHideNav && <Nav />}

      <Routes>
        <Route path="/analytics/:interviewId/:userId" element={<Analysis/>}/>
        <Route path="/resume" element={<Resume />}/>
        <Route path="" element={<Features />}/>
        <Route path="/login-signup" element={<Login />} />
        <Route path="/features" element={<Features />} />
        <Route path="/createNew" element={<CreateNew />} />
        <Route path="/chatSession/:id" element={<ChatSessiion />} />
        <Route path="/history" element={<History />} />
        <Route path="/login-with-google" element={<Logger />} />
      </Routes>
    </div>
  );
}

export default App;