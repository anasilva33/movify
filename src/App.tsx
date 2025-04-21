import './styles/App.css'
import MovieTable from './components/MovieTable'
import Filters from './components/Filters'


function App() {
  return (
    <>
      <header>
        <div className='header' />
      </header>
      <main className='main'>
        <h1 className='title'>Movie Ranking</h1>

        <Filters />

        <div>
          <MovieTable />
        </div>
      </main>
    </>
  )
}

export default App

