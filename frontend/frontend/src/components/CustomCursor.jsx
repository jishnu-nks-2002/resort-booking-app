import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const CustomCursor = () => {
  const [cursorVariant, setCursorVariant] = useState("default");
  const [isTouch, setIsTouch] = useState(false);
  const cursorRef = useRef(null);
  const cursorDotRef = useRef(null);

  useEffect(() => {
    const checkTouch = () => {
      setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    checkTouch();

    if (isTouch) return;

    const moveCursor = (e) => {
      gsap.to(cursorRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.12, // faster
        ease: "power3.out",
      });

      gsap.to(cursorDotRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.02, // almost instant
      });
    };

    const handleDown = () => setCursorVariant("clicked");
    const handleUp = () => setCursorVariant("default");

    const addHoverListeners = () => {
      const elements = document.querySelectorAll(
        "button, a, input, textarea, select, .cursor-hover, [role='button']"
      );

      elements.forEach((el) => {
        el.addEventListener("mouseenter", () => setCursorVariant("hover"));
        el.addEventListener("mouseleave", () => setCursorVariant("default"));
      });
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mousedown", handleDown);
    window.addEventListener("mouseup", handleUp);

    addHoverListeners();

    const observer = new MutationObserver(addHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mousedown", handleDown);
      window.removeEventListener("mouseup", handleUp);
      observer.disconnect();
    };
  }, [isTouch]);

  if (isTouch) return null;

  return (
    <>
      {/* Outer Ring */}
      <div ref={cursorRef} className={`cursor-outer ${cursorVariant}`}>
        <div className="cursor-ring" />
      </div>

      {/* Dot */}
      <div ref={cursorDotRef} className={`cursor-dot ${cursorVariant}`} />

      <style jsx>{`
        /* Base cursor wrapper */
        .cursor-outer,
        .cursor-dot {
          position: fixed;
          pointer-events: none;
          z-index: 99999;
          top: 0;
          left: 0;
          mix-blend-mode: difference;
        }

        /* Outer circle */
        .cursor-outer {
          width: 35px;
          height: 35px;
          margin-left: -17.5px;
          margin-top: -17.5px;
          transition: transform 0.2s ease;
        }

        .cursor-ring {
          width: 100%;
          height: 100%;
          border: 2px solid rgba(6, 182, 212, 0.8);
          border-radius: 50%;
          transition: all 0.25s ease;
          position: relative;
        }

        /* Dot */
        .cursor-dot {
          width: 7px;
          height: 7px;
          background: rgb(6,182,212);
          border-radius: 50%;
          margin-left: -3.5px;
          margin-top: -3.5px;
        }

        /* Hover State — bigger circle + plus sign */
        .cursor-outer.hover {
          transform: scale(1.7);
        }

        .cursor-outer.hover .cursor-ring {
          border-color: rgba(34, 211, 238, 1);
          background: rgba(6, 182, 212, 0.2);
        }

        .cursor-outer.hover .cursor-ring::after {
          content: "+";
          color: rgba(34, 211, 238, 1);
          font-size: 22px;
          font-weight: bold;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .cursor-dot.hover {
          transform: scale(1.4);
          background: rgba(34, 211, 238, 1);
        }

        /* Click State */
        .cursor-outer.clicked {
          transform: scale(0.5);
        }

        .cursor-dot.clicked {
          transform: scale(0.4);
        }

        /* Hide real cursor */
        body {
          cursor: none !important;
        }
      `}</style>
    </>
  );
};

export default CustomCursor;
