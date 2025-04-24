import { useEffect, useState, useRef, useCallback } from "react";
import './styles.css'
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
import { Movie, MovieDetails, MovieTableProps } from "../../types/movieTable";
import { api } from '../../api';

const columnHelper = createColumnHelper<Movie>()

export default function MovieTable({ posts, setPosts, activeState, error }: MovieTableProps) {
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isFetching, setIsFetching] = useState(false);
    const [areDetailsOpen, setAreDetailsOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState<MovieDetails | null>(null);

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
    ];

    useEffect(() => console.log('activeState ', activeState), [activeState]);
    useEffect(() => console.log('error ', error), [error]);

    const loadMoviesForPage = (nextPage: number) => {
        if (isFetching) {
            return;
        }

        setIsFetching(true);
        setPage(nextPage);
        api.getPagedList(nextPage, 10).then((res) => {
            setIsFetching(false);

            if (res.data.content.length === 0) {
                setHasMore(false);
                return;
            }

            setPosts([...posts, ...res.data.content]);
        });
    };

    useEffect(() => loadMoviesForPage(page), []);


    // const fetchMoreOnBottomReached = useCallback(
    //     (containerRefElement?: HTMLDivElement | null) => {
    //         if (activeState !== 'all') {
    //             return;
    //         }
    //         if (containerRefElement) {
    //             const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
    //             if (scrollHeight - scrollTop - clientHeight < 50 && hasMore && !isFetching) {
    //                 loadMoviesForPage(page + 1);
    //             }
    //         }
    //     },
    //     [page, isFetching, hasMore]
    // );


    // useEffect(() => {
    //     const container = tableContainerRef.current;
    //     if (!container) return;

    //     const handleScroll = () => {
    //         fetchMoreOnBottomReached(container);
    //     };

    //     container.addEventListener('scroll', handleScroll);
    //     return () => container.removeEventListener('scroll', handleScroll);
    // }, [fetchMoreOnBottomReached]);



    const table = useReactTable({
        data: posts,
        columns,
        getCoreRowModel: getCoreRowModel()
    })

    const { rows } = table.getRowModel()

    const tableContainerRef = useRef<HTMLDivElement>(null)

    const rowVirtualizer = useVirtualizer({
        count: rows.length, // número total de elementos a renderizar
        estimateSize: () => 48,  // altura de cada linha ( em px )
        getScrollElement: () => tableContainerRef.current, // o elemento onde está a ser aplicado o scroll
        overscan: 2 // número de itens extra a renderizar antes e depois da janela visível
    });

    const fetchMoreOnBottomReachedFromVirtualizer = () => {
        const virtualItems = rowVirtualizer.getVirtualItems();
        const lastItem = virtualItems[virtualItems.length - 1];

        if (!lastItem) return;

        const isNearEnd = lastItem.index >= rows.length - 2;

        if (isNearEnd && hasMore && !isFetching) {
            loadMoviesForPage(page + 1);
        }
    };

    useEffect(() => {
        fetchMoreOnBottomReachedFromVirtualizer();
    }, [rowVirtualizer.getVirtualItems(), rows.length, page, isFetching, hasMore]);

    const handleOpenDetails = () => {
        setAreDetailsOpen(true);
    };

    const handleCloseDetails = () => {
        setAreDetailsOpen(false);
    };

    const getMovieDetails = (movieID: string) => {
        api.getById(movieID).then((res) => {
            setSelectedRow(res.data);
        });
    }

    return (
        <div className="tableWrap" /*onScroll={e => fetchMoreOnBottomReached(e.currentTarget)}*/ ref={tableContainerRef}>
            <div style={{ height: `${rowVirtualizer.getTotalSize()}px` }}>
                <table className="table">
                    <thead>
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id} className="tableHeaderRow">
                                {headerGroup.headers.map(header => (
                                    <th key={header.id} className="tableHeaderColumn"
                                    >
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
                    {error && error !== '' && (
                        <p className="errorLabel">{error}</p>
                    )}
                    <tbody >
                        {rowVirtualizer.getVirtualItems().map(virtualRow => {
                            const row = rows[virtualRow.index] as Row<Movie>
                            return (
                                <tr
                                    data-index={virtualRow.index}
                                    ref={node => rowVirtualizer.measureElement(node)}
                                    key={row.id}
                                    className="tableBodyRow"
                                    style={{
                                        transform: `translateY(${virtualRow.start}px)`,
                                    }}
                                >
                                    {row.getVisibleCells().map((cell, index, cells) => {
                                        const isFirst = index === 0;
                                        const isLast = index === cells.length - 1;

                                        return (
                                            <td
                                                key={cell.id}
                                                style={{
                                                    display: 'flex',
                                                    flex: 1,
                                                    justifyContent: isFirst || isLast ? 'center' : 'flex-start',
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
        </div >

    )
}
