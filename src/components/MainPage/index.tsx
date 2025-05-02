import MovieTable from '../MovieTable'
import Filters from '../Filters'
import { useEffect, useState } from 'react';
import { ActiveFilters, Movie } from '../../types/movieTypes';
import { api } from '../../api';
import { getTop10ByRevenue } from '../../utils/getTop10ByRevenue';
import './styles.css'

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState(String || null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [filters, setFilters] = useState<ActiveFilters>({ activeFilter: 'all' });

  const loadMoviesForPage = async (newPage: number) => {
    if (isFetching) {
      return;
    }

    setIsFetching(true);
    setPage(newPage);
    const res: any = await api.getPagedList(newPage, 15)

    setIsFetching(false);

    if (res.data.content.length === 0) {
      setHasMore(false);
      return;
    }

    const existingMovies = newPage === 0 ? [] : movies;
    setMovies([...existingMovies, ...res.data.content]);
    setHasMore(true);
  }

  const loadNextPage = () => {
    loadMoviesForPage(page + 1);
  }

  useEffect(() => {
    setError('');

    (async () => {
      switch (filters.activeFilter) {
        case 'all':
          loadMoviesForPage(0);
          break;
        case 'top10ByYear':
          if (!filters.year) {
            return;
          }
          try {
            const res: any = await api.getByYear(filters.year);
            setupTop10Movies(res.data.content);
          } catch (error) {
            console.error('Erro na requisição GET:', error);
          }
          break;
        case 'top10':
          try {
            const res: any = await api.getAll()
            setupTop10Movies(res.data.content);
          } catch (error) {
            console.error('Erro na requisição GET :', error);
          }
          break;
        default:
          return;
      }
    })();


  }, [filters]);

  const setupTop10Movies = (movies: Movie[]) => {
    if (movies.length === 0) {
      setMovies([]);
      setError("Oops! No movies found.");
      return;
    }

    const top10 = getTop10ByRevenue(movies);
    setMovies(top10);
    setHasMore(false);
  };

  return (
    <>
      <header>
        <div className='header' />
      </header>
      <main className='main'>
        <h1 className='title'>Movie Ranking</h1>
        <Filters filters={filters} updateFilters={setFilters} />
        <MovieTable posts={movies} error={error} hasMore={hasMore} isFetching={isFetching} loadNextPage={loadNextPage} />
      </main>
    </>
  )
}

export default App

