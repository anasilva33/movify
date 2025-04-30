import { api } from "../api";
import { loadMoviesForPageProps } from "../types/movieTable";

export const loadMoviesForPage = ({ page, isFetching, setIsFetching, setPage, setHasMore, posts, setPosts }: loadMoviesForPageProps) => {
    if (isFetching) {
        return;
    }

    setIsFetching(true);
    setPage(page);
    api.getPagedList(page, 10).then((res) => {
        setIsFetching(false);

        if (res.data.content.length === 0) {
            setHasMore(false);
            return;
        }

        setPosts([...posts, ...res.data.content]);
    });
};