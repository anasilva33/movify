import { useState, MouseEvent } from 'react';
import { Button, Menu, MenuItem } from '@mui/material';
import './styles.css'


export default function Filters() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div className='filterWrap'>

            <Button className='filterLabel'>Top 10 Revenue</Button>

            <Button
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                className='filterLabel'
                onClick={handleClick}
            >
                Top 10 Revenue per Year
            </Button>
            <Menu
                id="demo-positioned-menu"
                aria-labelledby="demo-positioned-button"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                sx={{
                    '& .MuiPaper-root': {
                        width: '178px',  // Defina a largura desejada do painel aqui
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
                            <MenuItem key={year} onClick={handleClose} className='filterOptions'>
                                {year}
                            </MenuItem>
                        );
                    })
                }


            </Menu>
        </div>
    );
}
