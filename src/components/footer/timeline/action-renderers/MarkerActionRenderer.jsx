const MarkerActionRenderer = ({ action, row }) => {
    return (
        <div
            className="timeline-marker"
            style={{
                width: '1px',
                height: 400 - 35 - 10 + 'px',
                backgroundColor: action.data?.color,
            }}
        >
            <span className="marker-title" style={{ color: action.data?.color }}>
                {action.data.text}
            </span>
        </div>
    );
};

export default MarkerActionRenderer;
