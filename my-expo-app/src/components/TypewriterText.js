import React, { useState, useEffect, useRef } from 'react';
import { Text } from 'react-native';

const TypewriterText = ({ text, speed = 25, onComplete, style }) => {
  const [displayedText, setDisplayedText] = useState('');
  const index = useRef(0);
  const timer = useRef(null);

  useEffect(() => {
    // Reset index and clear any existing timer when text changes
    index.current = 0;
    setDisplayedText('');
    if (timer.current) clearInterval(timer.current);

    timer.current = setInterval(() => {
      if (index.current < text.length) {
        setDisplayedText((prev) => prev + text.charAt(index.current));
        index.current += 1;
      } else {
        if (timer.current) clearInterval(timer.current);
        if (onComplete) onComplete();
      }
    }, speed);

    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [text, speed]);

  return <Text style={style}>{displayedText}</Text>;
};

export default TypewriterText;
