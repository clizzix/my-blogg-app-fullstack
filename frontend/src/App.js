import React from 'react'; 
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PostForm from './PostForm.js';
import PostList from './PostList.js'; 
import PostDetail from './PostDetail.js';


function App() {
  return (
    <Router>
      <div className="App" style={{ fontFamily: 'Arial, sans-serif' }}>
        <header className="App-header" style={{ backgroundColor: '#f4f4f4', padding: '20px', textAlign: 'center', borderBottom: '1px solid #ccc' }}>
          <h1>Mein Blog</h1>
          <nav>
            <Link to="/" style={{ margin: '0 15px', textDecoration: 'none', color: '#333'}}>Startseite</Link>
            <Link to="/create" style={{ margin: '0 15px', textDecoration: 'none', color: '#333' }}>Neuer Beitrag</Link>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<PostList />} />
            <Route path="/create" element={<PostForm />} />
            <Route path="/posts/:id" element={<PostDetail />} />
            <Route path="/posts/edit/:id" element={<PostForm />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
