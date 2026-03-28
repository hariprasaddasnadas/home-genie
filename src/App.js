import './App.css';
import './Mycomponents/Mobile.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Mycomponents/Header';
import PartnerRegistration from './Mycomponents/PartnerRegistration';
import Home from './Mycomponents/Home'; 
import Footer from './Mycomponents/Footer';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          {/* This line makes the Home component show on the main page */}
          <Route path="/" element={<Home />} />
          
          {/* This line handles the Partner page */}
          <Route path="/partner" element={<PartnerRegistration />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
