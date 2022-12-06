import React, { useEffect } from 'react';
import { useTimeout } from '../../hooks';
import Toast from './Toast';

export default function GenericToastToast({
  isVisible,
  setIsVisible,
  message,
}) {
  const [startTimeout, stopTimeout] = useTimeout();

  useEffect(() => {
    if (isVisible) {
      stopTimeout();
      startTimeout(() => setIsVisible(false), 3000);
    }
  }, [isVisible, startTimeout, stopTimeout]);

  return <Toast isVisible={isVisible} text={`􀁣 ${message}`} />;
}
