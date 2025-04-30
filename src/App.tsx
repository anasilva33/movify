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

      setPosts([...posts, ...res.data.content]);
      setHasMore(true);
    });
  }

  const loadMoviesForPage = ({ page, isFetching, setIsFetching, setPage, setHasMore, posts, setPosts }: loadMoviesForPageProps) => {
    if (isFetching) {
      return;
    }

    setIsFetching(true);
    setPage(page);
    api.getPagedList(page, 10).then((res: any) => {
      setIsFetching(false);

      if (res.data.content.length === 0) {
        setHasMore(false);
        return;
      }

      setPosts([...posts, ...res.data.content]);
    });
  };

  const loadNextPage = () => {
    loadMoviesForPageV2(page + 1);
  }

  //TODO: nos filtros o hasMore deve ser false;
  useEffect(() => {
    setError('');

    if (filters.activeFilter === 'all') {
      setPage(1);
      setIsFetching(true);
      setPosts([]);
      api.getPagedList(1, 10).then((res: any) => {
        if (res.data.content.length === 0) {
          setHasMore(false);
        } else {
          setPosts(prevPosts => [...prevPosts, ...res.data.content]);
          setHasMore(true);
        }

        setIsFetching(false);
      });

      return;
    }
    if (filters.activeFilter === 'top10ByYear') {
      if (!filters.year) {
        return;
      }
      api.getByYear(filters.year).then((res: any) => {
        handleApiResponse(res);
      }).catch(error => {
        console.error('Erro na requisição GET:', error);
      });

    } else if (filters.activeFilter === 'top10') {
      api.getAll().then((res: any) => {
        handleApiResponse(res);
      });
    }

    const handleApiResponse = (res: AxiosResponse<{ content: Movie[] }>) => {
      const content = res.data.content;

      if (content.length === 0) {
        setPosts([]);
        setError("Oops! No movies found.");
        return;
      }

      const top10 = getTop10ByRevenue(content);
      setPosts(top10);
      setHasMore(false);
    };
  }, [filters]);

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

