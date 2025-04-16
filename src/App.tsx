import { useState } from 'react'
import './styles/App.css'
import Filter from './components/Filter'
import MovieTable from './components/MovieTable.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <header>
        <div className='header' />
      </header>
      <main className='main'>
        <h1 className='title'>Movie Ranking</h1>
        <div className='filterWrap'>
          <Filter info="Top 10 Revenue" />
          <Filter info="Top 10 Revenue per Year" />
        </div>
        <div>
          <MovieTable />
        </div>
      </main>
    </>
  )
}

export default App
