import { useState } from 'react';
import { Button, Menu, MenuItem } from '@mui/material';
import { FilterProps, ActiveStateType } from '../../types/movieTypes';
import './styles.css'

export default function Filters({ filters, updateFilters }: FilterProps) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const isOpen = Boolean(anchorEl);
    const startingYear = 2016;

    const handleClick = (selectedFilter: ActiveStateType, year: number | null = null) => {
        setAnchorEl(null);
        const activeFilter = filters.activeFilter === selectedFilter && year === filters.year ? 'all' : selectedFilter;
        updateFilters({ activeFilter, year });
    };
    return (
        <div className='filterWrap'>
            <Button className={`filterLabel ${filters.activeFilter === 'top10' ? 'active' : ''}`} onClick={() => handleClick('top10')}>Top 10 Revenue</Button>
            <Button
                aria-controls={isOpen ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={isOpen ? 'true' : undefined}
                className={`filterLabel ${filters.activeFilter === 'top10ByYear' ? 'active' : ''}`}
                onClick={(e) => setAnchorEl(e.currentTarget)}
            >
                Top 10 Revenue per Year
            </Button>
            <Menu
                id="demo-positioned-menu"
                aria-labelledby="demo-positioned-button"
                anchorEl={anchorEl}
                open={isOpen}
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
                        const year = startingYear - i;
                        return (
                            <MenuItem key={year} onClick={() => handleClick('top10ByYear', year)} className='filterOptions'>
                                {year}
                            </MenuItem>
                        );
                    })
                }
            </Menu>
        </div >
    );
}
