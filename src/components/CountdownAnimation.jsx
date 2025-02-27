// src/components/CountdownAnimation.jsx
import { useState, useEffect, useRef } from 'react';
import { gameAudio } from '../utils/audio';
import '../styles/countdown.css';

const CountdownAnimation = ({ onComplete, isActive }) => {
  const [count, setCount] = useState(3);
  const timeoutRef = useRef(null);
  const startTimeRef = useRef(0);
  const frameRef = useRef(null);
  
  // Reset countdown ketika aktivasi
  useEffect(() => {
    if (isActive) {
      console.log("Countdown activated - resetting");
      setCount(3);
      startTimeRef.current = Date.now();
      
      // Force a repaint to ensure the overlay is visible
      document.body.style.display = 'none';
      document.body.offsetHeight; // Force reflow
      document.body.style.display = '';
      
      // Play countdown sound when animation starts
      gameAudio.play('countdown');
    } else {
      // Cleanup on deactivation
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    }
  }, [isActive]);
  
  // Gunakan kombinasi requestAnimationFrame dan setTimeout untuk lebih andal
  useEffect(() => {
    if (!isActive) return;
    
    const countdownTick = () => {
      const elapsed = Date.now() - startTimeRef.current;
      
      if (elapsed < 1000) {
        // Masih di hitungan 3
        frameRef.current = requestAnimationFrame(countdownTick);
      } else if (elapsed < 2000) {
        // Perubahan ke 2
        if (count === 3) {
          setCount(2);
        }
        frameRef.current = requestAnimationFrame(countdownTick);
      } else if (elapsed < 3000) {
        // Perubahan ke 1
        if (count === 2) {
          setCount(1);
        }
        frameRef.current = requestAnimationFrame(countdownTick);
      } else if (elapsed < 3800) {
        // Perubahan ke GO!
        if (count === 1) {
          setCount(0);
        }
        frameRef.current = requestAnimationFrame(countdownTick);
      } else {
        // Selesai
        console.log("Countdown complete, calling onComplete");
        onComplete();
      }
    };
    
    // Gunakan visibility change untuk mendeteksi tab minimized
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log("Tab became visible - recalculating countdown");
        // Recalculate based on elapsed time since start
        const elapsed = Date.now() - startTimeRef.current;
        if (elapsed < 1000) setCount(3);
        else if (elapsed < 2000) setCount(2);
        else if (elapsed < 3000) setCount(1);
        else if (elapsed < 3800) setCount(0);
      }
    };
    
    // Start animation frame loop
    frameRef.current = requestAnimationFrame(countdownTick);
    
    // Tambahkan juga timeout sebagai fallback
    timeoutRef.current = setTimeout(() => {
      console.log("Fallback timeout triggered");
      onComplete();
    }, 4000); // Slightly longer than the animation duration
    
    // Add visibility change listener
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Cleanup
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [count, isActive, onComplete]);
  
  // Performa hack untuk memaksa repaint
  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        const overlay = document.querySelector('.countdown-overlay');
        if (overlay) {
          overlay.style.opacity = '0.99';
          setTimeout(() => {
            overlay.style.opacity = '1';
          }, 0);
        }
      }, 100);
      
      return () => clearInterval(interval);
    }
  }, [isActive]);

  if (!isActive) return null;
  
  return (
    <div className="countdown-overlay">
      <div className="countdown-container" style={{ willChange: 'opacity, transform' }}>
        {count > 0 ? (
          <div className="countdown-number">{count}</div>
        ) : (
          <div className="countdown-go">GO!</div>
        )}
      </div>
    </div>
  );
};

export default CountdownAnimation;