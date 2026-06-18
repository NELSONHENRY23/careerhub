import { useCallback, useEffect, useRef, useState } from 'react';

const useFeedback = (duration = 3000) => {
  const timerRef = useRef(null);

  const [feedback, setFeedback] = useState({
    message: '',
    type: '',
  });

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const clearFeedback = useCallback(() => {
    clearTimer();

    setFeedback({
      message: '',
      type: '',
    });
  }, [clearTimer]);

  const showFeedback = useCallback(
    (message, type = 'success') => {
      clearTimer();

      setFeedback({
        message,
        type,
      });

      timerRef.current = setTimeout(() => {
        setFeedback({
          message: '',
          type: '',
        });

        timerRef.current = null;
      }, duration);
    },
    [clearTimer, duration]
  );

  const showSuccess = useCallback(
    (message) => {
      showFeedback(message, 'success');
    },
    [showFeedback]
  );

  const showError = useCallback(
    (message) => {
      showFeedback(message, 'error');
    },
    [showFeedback]
  );

  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, [clearTimer]);

  return {
    feedback,
    showFeedback,
    showSuccess,
    showError,
    clearFeedback,
  };
};

export default useFeedback;