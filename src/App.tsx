import './styles/App.css'
import MovieTable from './components/MovieTable'
import Filters from './components/Filters'
import { useState } from 'react';
import { Movie } from './types/movieTable';

function App() {
  const [posts, setPosts] = useState<Movie[]>([]);
  const [activeState, setActiveState] = useState<'all' | 'top10' | 'top10ByYear' | null>('all');
  const [error, setError] = useState(String);
  return (
    <>
      <header>
        <div className='header' />
      </header>
      <main className='main'>
        <h1 className='title'>Movie Ranking</h1>
        <Filters posts={posts} setPosts={setPosts} activeState={activeState} setActiveState={setActiveState} setError={setError} />
        <MovieTable posts={posts} setPosts={setPosts} activeState={activeState} error={error} />
      </main>
    </>
  )
}

export default App

