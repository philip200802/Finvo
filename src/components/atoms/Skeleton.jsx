function Skeleton({ height = '1rem', className = '' }) {
    return <div className={`skeleton ${className}`.trim()} style={{ height }} aria-hidden="true" />
}

export default Skeleton
