import React from 'react'; 
import logo from './logo.svg';
import './App.css';
import PostList from './PostList.js'; 

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Willkommen zum Blog!</h1>
        {/*Hier werden später unsere Blog Beiträge angezeigt */}
      </header>
       <main>
        <PostList />
       </main>
    </div>
  );
}

export default App;
