import React, { useState, useEffect } from 'react';

interface TimerProps {
    setMinute: Function;
    setSecond: Function;

    minute: number;
    second: number;

    isStart: boolean;
}

export const Timer = ({ minute, second, isStart, setSecond, setMinute }: TimerProps) => {
    const [_min, _setMinute] = useState(minute);
    const [_sec, _setSecond] = useState(second);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        if (isStart) {
            setIsRunning(true);
        }
    }, [isStart]);

    const formatMinute = React.useMemo(() => {
        return _min.toString();
    }, [_min]);

    const formatSecond = React.useMemo(() => {
        return _sec.toString();
    }, [_sec]);

    React.useEffect(() => {
        if (!isRunning) {
            return;
        }

        let interval: any;

        interval = setInterval(() => {
            const second = setSecond();
            _setSecond(second - 1);
            setSecond(second - 1);

            if (_min <= 0 && _sec <= 0) {
                _setMinute(0);
                _setSecond(0);
                setIsRunning(false);
                return;
            }
            if (_min > 0 && _sec <= 0) {
                const minute = setMinute();
                _setMinute(minute - 1);
                setMinute(minute - 1);

                setSecond(59);
                _setSecond(59);
            }
        }, 1000);

        return () => clearInterval(interval);
    });

    const reset = () => {
        _setMinute(minute);
        _setSecond(second);
    };

    return (
        <>
            <>
                <span>{formatMinute}:</span>
                <span>{formatSecond}</span>
            </>
        </>
    );
};
