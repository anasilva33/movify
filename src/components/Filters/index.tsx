import { useState, useEffect } from 'react';
import { Button, Menu, MenuItem } from '@mui/material';
import { getTop10ByRevenue } from '../../utils/getTop10ByRevenue';
import { Movie, FilterProps, ActiveStateType } from '../../types/movieTable';
import { api } from '../../api';
import './styles.css'

export default function Filters({ posts, setPosts, activeState, setActiveState, setError }: FilterProps) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    useEffect(() => console.log('posts ', posts), [posts]);

    const open = Boolean(anchorEl);

    const handleClick = (button: ActiveStateType, year?: number) => {
        setError(null);
        if (activeState === button) {
            setActiveState(null);
            setPosts(posts);
            setAnchorEl(null);
            return;
        }

        if (button === 'top10ByYear' && year !== undefined) {
            api.getByYear(year).then(res => {
                let content: Movie = res.data;

                if (content.length === 0) {
                    setPosts([]);
                    setError("Oops! No movies found for those dates.");
                    return;
                }
                const top10 = getTop10ByRevenue(content.content);
                setPosts(top10);
                setActiveState(button);
                setAnchorEl(null);
            }).catch(error => {
                console.error('Erro na requisição GET:', error);
            });

        } else if (button === 'top10') {
            api.getAll().then(res => {
                let content: Movie = res.data;

                if (content.length === 0) {
                    setPosts([]);
                    setError("Oops! No movies found.");
                    return;
                }

                console.log('Todos os filmes:', res.data);
                const top10 = getTop10ByRevenue(content.content);
                setPosts(top10);
                setActiveState(button);
                setAnchorEl(null);
            });

        }
    };
    return (
        <div className='filterWrap'>
            <Button className='filterLabel' onClick={() => handleClick('top10')}>Top 10 Revenue</Button>
            <Button
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                className='filterLabel'
                onClick={(e) => setAnchorEl(e.currentTarget)}
            >
                Top 10 Revenue per Year
            </Button>
            <Menu
                id="demo-positioned-menu"
                aria-labelledby="demo-positioned-button"
                anchorEl={anchorEl}
                open={open}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                sx={{
                    '& .MuiPaper-root': {
                        width: '178px',
                    }
                }}
            >
                <MenuItem disabled>
                    Select a year
                </MenuItem>
                {
                    [...Array(17)].map((_, i) => {
                        const year = 2016 - i;
                        return (
                            <MenuItem key={year} onClick={() => handleClick('top10ByYear', year)} className='filterOptions'>
                                {year}
                            </MenuItem>
                        );
                    })
                }
            </Menu>
        </div>
    );
}
