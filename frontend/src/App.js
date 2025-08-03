import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PostForm from './PostForm';
import PostList from './PostList';
import PostDetail from './PostDetail';
import About from './About.js';

function App() {
  return (
    <Router>
      <div className="app-container">
        <header className="header">
          <h1>Mein Blog</h1>
          <nav>
            <Link to="/">Startseite</Link>
            <Link to="/create">Neuer Beitrag</Link>
            <Link to="/about">Über uns</Link>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<PostList />} />
            <Route path="/create" element={<PostForm />} />
            <Route path="/posts/:id" element={<PostDetail />} />
            <Route path="/posts/edit/:id" element={<PostForm />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
