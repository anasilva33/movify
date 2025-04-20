import './styles/App.css'
import Filter from './components/Filter'
import NewMovieTable from './components/NewMovieTable'
import MovieTable from './components/MovieTable'


function App() {
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
          {/* <NewMovieTable /> */}
        </div>
      </main>
    </>
  )
}

export default App

