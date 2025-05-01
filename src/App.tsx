import './styles/App.css'
import MovieTable from './components/MovieTable'
import Filters from './components/Filters'
import { useEffect, useState } from 'react';
import { ActiveFilters, loadMoviesForPageProps, Movie } from './types/movieTable';
import { api } from './api';
import { AxiosResponse } from 'axios';
import { getTop10ByRevenue } from './utils/getTop10ByRevenue';

function App() {
  const [posts, setPosts] = useState<Movie[]>([]);
  const [error, setError] = useState(String || null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [filters, setFilters] = useState<ActiveFilters>({ activeFilter: 'all' });

  const loadMoviesForPageV2 = (newPage: number) => {
    if (isFetching) {
      return;
    }

    setIsFetching(true);
    setPage(newPage);
    api.getPagedList(newPage, 10).then((res: any) => {
      setIsFetching(false);

      if (res.data.content.length === 0) {
        setHasMore(false);
        return;
      }

      const existingMovies = newPage === 1 ? [] : posts;
      setPosts([...existingMovies, ...res.data.content]);
      setHasMore(true);
    });
  }

  const loadMoviesForPageV3 = async (newPage: number) => {
    if (isFetching) {
      return;
    }

    setIsFetching(true);
    setPage(newPage);
    const res: any = await api.getPagedList(newPage, 10);
    setIsFetching(false);

    if (res.data.content.length === 0) {
      setHasMore(false);
      return;
    }

    const existingMovies = newPage === 1 ? [] : posts;
    setPosts([...existingMovies, ...res.data.content]);
    setHasMore(true);
  }

  const loadNextPage = () => {
    loadMoviesForPageV2(page + 1);
  }

  useEffect(() => {
    setError('');

    switch (filters.activeFilter) {
      case 'all':
        console.log('Inside the switch statement ' + page);
        loadMoviesForPageV2(1);
        break;
      case 'top10ByYear':
        if (!filters.year) {
          return;
        }
        api.getByYear(filters.year).then((res: any) => {
          setupTop10Movies(res.data.content);
        }).catch(error => {
          console.error('Erro na requisição GET:', error);
        });
        break;
      case 'top10':
        api.getAll().then((res: any) => {
          setupTop10Movies(res.data.content);
        }).catch(error => {
          console.error('Erro na requisição GET :', error);
        });
        break;
      default:
        return;
    }

  }, [filters]);

  const setupTop10Movies = (movies: Movie[]) => {
    if (movies.length === 0) {
      setPosts([]);
      setError("Oops! No movies found.");
      return;
    }

    const top10 = getTop10ByRevenue(movies);
    setPosts(top10);
    setHasMore(false);
  };

  // useEffect(() => loadMoviesForPage(page), []);

  return (
    <>
      <header>
        <div className='header' />
      </header>
      <main className='main'>
        <h1 className='title'>Movie Ranking</h1>
        <Filters filters={filters} updateFilters={setFilters} />
        <MovieTable posts={posts} error={error} hasMore={hasMore} isFetching={isFetching} loadNextPage={loadNextPage} />
      </main>
    </>
  )
}

export default App

