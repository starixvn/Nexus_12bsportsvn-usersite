import React from 'react';

const Input = React.forwardRef(({ open, onClick, onToggle }, ref) => {
    return (
        <i ref={ref}
            className={`date-picker-icon icon-livescore icon-live-calender ${open ? 'active' : ''}`}
            onClick={() => {
                onToggle();
                onClick();
            }}
        />
    );
});

export default Input;