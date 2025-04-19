import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import './styles.css'
import axios from 'axios';
import { FaEye } from "react-icons/fa";
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table'
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Movie, MovieDetails } from "../../types/movieTable"
import { movies } from "../../data/movie";
import { movieDetails } from "../../data/movieDetails";

const columnHelper = createColumnHelper<Movie>()

export default function MovieTable() {
    const [posts, setPosts] = useState(movies);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [areDetailsOpen, setAreDetailsOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState<MovieDetails | null>(null);

    const columns = [
        columnHelper.accessor('ranking', {
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

    useEffect(() => {
        // fetchPosts();
    }, []);

    const fetchPosts = () => {
        axios
            .get(`https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=10`)
            .then((response) => {
                const newPosts = response.data;

                if (newPosts.length === 0 || newPosts.length < 10) {
                    setHasMore(false);
                }

                setPosts((prevPosts) => [...prevPosts, ...newPosts]);
                setPage((prevPage) => prevPage + 1);
            })
            .catch((error) => {
                console.error("Erro ao buscar dados:", error);
            });
    };

    const table = useReactTable({
        data: posts ?? [],
        columns,
        getCoreRowModel: getCoreRowModel(),
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
        setSelectedRow(movieDetails);
    }

    return (
        <>
            <div className="tableWrap">
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
        </>
    )
}
