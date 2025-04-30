import { useEffect, useState, useRef } from "react";
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

export default function MovieTable({ posts, error, hasMore, isFetching, loadNextPage }: MovieTableProps) {
    const [areDetailsOpen, setAreDetailsOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState<MovieDetails | null>(null);

    const columns = [
        columnHelper.accessor('rank', {
            header: () => 'RANKING',
            cell: info => info.getValue(),
            size: 93,
        }),
        columnHelper.accessor('title', {
            header: () => 'Title',
            cell: info => info.renderValue(),
            size: 550,
        }),
        columnHelper.accessor('year', {
            header: () => 'Year',
            cell: info => info.renderValue(),
            size: 93,
        }),
        columnHelper.accessor('revenue', {
            header: 'Revenue',
            cell: info => `$${info.getValue()}`,
            size: 93,
        }),
        {
            id: 'actions',
            header: '',
            cell: ({ row }: any) => (
                <FaEye onClick={() => {
                    setAreDetailsOpen(true);
                    getMovieDetails(row.original.id);

                }} />
            ),
            size: 100,
        },
    ];

    const table = useReactTable({
        data: posts,
        columns,
        state: {
            columnSizing: {},
        },
        columnResizeMode: 'onChange',
        getCoreRowModel: getCoreRowModel()
    })

    const { rows } = table.getRowModel()

    const tableContainerRef = useRef<HTMLDivElement>(null)

    const rowVirtualizer = useVirtualizer({
        count: rows.length, // número total de elementos a renderizar
        estimateSize: () => 19,  // altura de cada linha ( em px )
        getScrollElement: () => tableContainerRef.current, // o elemento onde está a ser aplicado o scroll
        overscan: 2 // número de itens extra a renderizar antes e depois da janela visível
    });

    const fetchMoreOnBottomReachedFromVirtualizer = () => {
        const virtualItems = rowVirtualizer.getVirtualItems();
        const lastItem = virtualItems[virtualItems.length - 1];

        if (!lastItem) return;

        const isNearEnd = lastItem.index >= rows.length - 2;

        if (isNearEnd && hasMore && !isFetching) {
            loadNextPage();
        }
    };

    const getMovieDetails = (movieID: string) => {
        api.getById(movieID).then((res: any) => {
            setSelectedRow(res.data);
        });
    }

    useEffect(() => {
        if (hasMore) {
            fetchMoreOnBottomReachedFromVirtualizer();
        }
    }, [rowVirtualizer.getVirtualItems(), rows.length, isFetching, hasMore]);

    return (
        <div className="tableWrap" ref={tableContainerRef}>
            <div style={{ height: `${rowVirtualizer.getTotalSize()}px` }}>
                <table className="table">
                    <thead>
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id} className="tableHeaderRow">
                                {headerGroup.headers.map(header => {
                                    return (
                                        <th key={header.id} className="tableHeaderColumn" style={{ width: `${header.getSize()}px` }}
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </th>
                                    )
                                })}
                            </tr>
                        ))}
                    </thead>
                    {error && error !== '' && (
                        <p className="errorLabel">{error}</p>
                    )}
                    <tbody style={{ marginTop: '22px' }}>
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
                                                    justifyContent: isFirst || isLast ? 'center' : 'flex-start',
                                                    width: `${cell.column.getSize()}px`
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
                onClose={() => setAreDetailsOpen(false)}
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
                                        <p>
                                            {selectedRow.genre
                                                .split(",")
                                                .map(name => name.trim())
                                                .filter(name => name)
                                                .join(", ")}
                                        </p>
                                        <p>Description</p>
                                        <p>{selectedRow.description}</p>
                                        <div className="elencoDiv">
                                            <div>
                                                <p>Director</p>
                                                <p>{selectedRow.director}</p>
                                            </div>
                                            <div>
                                                <p>Actors</p>
                                                <p>
                                                    {selectedRow.actors.split(",")
                                                        .map(name => name.trim())
                                                        .filter(name => name)
                                                        .join(" ")}
                                                </p>
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
