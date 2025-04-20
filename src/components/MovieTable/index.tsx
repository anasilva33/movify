import { useEffect, useState, useRef, useCallback, Fragment } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import './styles.css'
import axios from 'axios';
import { FaEye } from "react-icons/fa";
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
    Row,
} from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Movie, MovieDetails } from "../../types/movieTable"
import { movies } from "../../data/movie";
import { movieDetails } from "../../data/movieDetails";
import { api } from '../../api';

const columnHelper = createColumnHelper<Movie>()

export default function MovieTable() {
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isFetching, setIsFetching] = useState(false);
    const [areDetailsOpen, setAreDetailsOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState<MovieDetails | null>(null);

    const loadMoviesForPage = (nextPage: number) => {
        if (isFetching) {
            return;
        }

        setIsFetching(true);
        setPage(nextPage);
        api.getPagedList(nextPage, 20).then((res) => {
            setIsFetching(false);

            if (res.data.content.length === 0) {
                setHasMore(false);
                return;
            }

            setPosts([...posts, ...res.data.content]);
        });
    };

    useEffect(() => loadMoviesForPage(page), []);


    const columns = [
        columnHelper.accessor('rank', {
            header: () => 'Ranking',
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('title', {
            header: () => 'Title',
            cell: info => info.renderValue(),
        }),
        columnHelper.accessor('year', {
            header: () => 'Year',
            cell: info => info.renderValue(),
        }),
        columnHelper.accessor('revenue', {
            header: 'Revenue',
            cell: info => info.renderValue(),
        }),
        {
            id: 'actions',
            header: '',
            cell: ({ row }) => (
                <FaEye onClick={() => {
                    handleOpenDetails()
                    getMovieDetails(row.original.id);

                }} />
            ),
        },
    ]

    // useEffect(() => {
    //     // fetchPosts();
    //     api.getPagedList(page, 10).then((res) => {
    //         setPosts(res.data.content);
    //     });
    // }, []);
    // useEffect(() => {
    //     console.log('Inside Fetch:', isFetching, page, hasMore);
    //     if (isFetching) {
    //         return;
    //     }

    //     setIsFetching(true);
    //     api.getPagedList(page, 20).then((res) => {
    //         setIsFetching(false);

    //         if (res.data.content.length === 0) {
    //             setHasMore(false);
    //             return;
    //         }

    //         setPosts([...posts, ...res.data.content]);
    //     });
    // }, [page, hasMore, isFetching]);



    const fetchMoreOnBottomReached = useCallback(
        (containerRefElement?: HTMLDivElement | null) => {
            if (containerRefElement) {
                const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
                if (scrollHeight - scrollTop - clientHeight > 1 && hasMore && !isFetching) {
                    loadMoviesForPage(page + 1);
                }
            }
        },
        [page, isFetching, hasMore]
    );

    useEffect(() => {
        fetchMoreOnBottomReached(tableContainerRef.current)
    }, [fetchMoreOnBottomReached])

    const table = useReactTable({
        data: posts,
        columns,
        getCoreRowModel: getCoreRowModel()
    })

    const { rows } = table.getRowModel()

    const tableContainerRef = useRef<HTMLDivElement>(null)

    const rowVirtualizer = useVirtualizer({
        count: rows.length,
        estimateSize: () => 34, //estimate row height for accurate scrollbar dragging
        getScrollElement: () => tableContainerRef.current,
        //measure dynamic row height, except in firefox because it measures table border height incorrectly
        // measureElement:
        //     typeof window !== 'undefined' &&
        //         navigator.userAgent.indexOf('Firefox') === -1
        //         ? element => element?.getBoundingClientRect().height
        //         : undefined,
        overscan: 20
    })

    const handleOpenDetails = () => {
        setAreDetailsOpen(true);
    };

    const handleCloseDetails = () => {
        setAreDetailsOpen(false);
    };

    const getMovieDetails = (movieID: string) => {
        // axios
        //     .get(`http://movie-challenge-api-xpand.azurewebsites.net/api/movies/${movieID}`)
        //     .then((response) => {
        //         const movieDetails = response.data;
        //         setSelectedRow(movieDetails);
        //     })
        //     .catch((error) => {
        //         console.error("Erro ao buscar dados:", error);
        //     });
        api.getById(movieID).then((res) => {
            setSelectedRow(res.data);
        });
    }

    return (
        <div className="tableWrap" onScroll={e => fetchMoreOnBottomReached(e.currentTarget)} ref={tableContainerRef}>
            {/* <div className="tableWrap">
                <table>
                    <thead>
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.map(row => (
                            <tr key={row.id}>
                                {row.getVisibleCells().map(cell => (
                                    <td key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div> */}
            <div style={{ height: `${rowVirtualizer.getTotalSize()}px` }}>
                <table>
                    <thead>
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {rowVirtualizer.getVirtualItems().map(virtualRow => {
                            const row = rows[virtualRow.index] as Row<Movie>
                            return (
                                <tr
                                    data-index={virtualRow.index} //needed for dynamic row height measurement
                                    ref={node => rowVirtualizer.measureElement(node)} //measure dynamic row height
                                    key={row.id}
                                    style={{
                                        display: 'flex',
                                        position: 'absolute',
                                        transform: `translateY(${virtualRow.start}px)`, //this should always be a `style` as it changes on scroll
                                        width: '100%',
                                    }}
                                >
                                    {row.getVisibleCells().map(cell => {
                                        return (
                                            <td
                                                key={cell.id}
                                                style={{
                                                    display: 'flex',
                                                    width: cell.column.getSize(),
                                                }}
                                            >
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </td>
                                        )
                                    })}
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            <Dialog
                open={areDetailsOpen}
                onClose={handleCloseDetails}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                PaperProps={{ className: 'customDialogWidth' }}
            >
                <div className="detailsModal">
                    {selectedRow && (
                        <>
                            <DialogTitle id="alert-dialog-title" sx={{ paddingBottom: '0', paddingLeft: '0', paddingRight: '0' }} >
                                {selectedRow.title}
                            </DialogTitle>
                            <hr className="detailsTitleBorder" />
                            <DialogContent sx={{ padding: 0 }}>
                                <DialogContentText id="alert-dialog-description" sx={{ padding: '0' }}>
                                    <div className="customSpacing">
                                        <p>Year</p>
                                        <p>{selectedRow.year}</p>
                                        <p>Genre</p>
                                        <p>{selectedRow.genre}</p>
                                        <p>Description</p>
                                        <p>{selectedRow.description}</p>
                                        <div className="elencoDiv">
                                            <div>
                                                <p>Director</p>
                                                <p>{selectedRow.director}</p>
                                            </div>
                                            <div>
                                                <p>Actors</p>
                                                <p>{selectedRow.actors}</p>
                                            </div>
                                        </div>
                                        <p></p>
                                        <p>Runtime</p>
                                        <p>{selectedRow.runtime} mins</p>
                                        <p>Rating</p>
                                        <p>{selectedRow.rating}</p>
                                        <p>Votes</p>
                                        <p>{selectedRow.votes}</p>
                                        <p>Revenue</p>
                                        <p>${selectedRow.revenue}</p>
                                        <p>Metascore</p>
                                        <p>{selectedRow.metascore}</p>
                                    </div>
                                </DialogContentText>
                            </DialogContent>
                        </>
                    )}
                </div>
            </Dialog >
        </div>

    )
}
