import './styles.css'

type FilterProps = {
    info: string
}

export default function Filter({ info }: FilterProps) {
    return (
        <div className="filterBorder">
            <label className='filterLabel'>{info}</label>
        </div>
    );
}
