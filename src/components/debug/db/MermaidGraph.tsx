import React, { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

interface MermaidGraphProps {
  mermaidDefinition: string;
  className?: string;
}

const MermaidGraph: React.FC<MermaidGraphProps> = ({
  mermaidDefinition,
  className,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (mermaidDefinition && ref.current) {
      mermaid.init({}, ref.current);
    }

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [mermaidDefinition]);

  const toggleFullscreen = () => {
    if (ref.current) {
      if (!document.fullscreenElement) {
        ref.current.requestFullscreen().catch((err) => {
          alert(
            `Error attempting to enable full-screen mode: ${err.message} (${err.name})`
          );
        });
      } else {
        document.exitFullscreen();
      }
    }
  };

  return (
    <div
      className={className}
      style={{ position: "relative", width: "100%", height: "100%" }}
    >
      <div
        ref={ref}
        key={mermaidDefinition}
        onClick={toggleFullscreen}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          background: isFullscreen ? "white" : "",
          backgroundImage: isFullscreen
            ? "linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)"
            : "",
        }}
      >
        {mermaidDefinition}
      </div>
    </div>
  );
};

export default MermaidGraph;
