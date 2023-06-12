import { createPortal } from 'react-dom';
import { useEffect, useRef, useState } from 'react';
import { Tooltip } from '@material-ui/core';

function App() {
  const iframeRef = useRef(null);
  const [container, setContainer] = useState(null);
  const positionRef = useRef({
    x: 0,
    y: 0
  });
  const popperRef = useRef(null);
  const areaRef = useRef(null);

  useEffect(() => {
    iframeRef.current.addEventListener('load', () => {
      setTimeout(() => {
        const nestedContainer = iframeRef.current.contentWindow.document.querySelector('.js-container');

        setContainer(nestedContainer);
        console.log(nestedContainer);
      }, 500);
    })
  }, []);

  const handleMouseMove = (event) => {
    positionRef.current = { x: event.clientX, y: event.clientY };
    console.log(positionRef.current);

    if (popperRef.current != null) {
      popperRef.current.update();
    }
  };

  return (
    <div className="App">
      <div className='iframe-container'>
        <iframe src="http://localhost:3000/tool-tip" ref={iframeRef} title="Tooltip page"></iframe>
      </div>
      
      {
        container && (
          createPortal(
            <div>
              <Tooltip
                title="click me"
                arrow
                open
                PopperProps={{
                  popperRef,
                  anchorEl: {
                    getBoundingClientRect: () => {
                      const rect = areaRef.current.getBoundingClientRect();
                      const iframeRect = iframeRef.current.getBoundingClientRect();

                      return new DOMRect(
                        rect.x + (rect.width / 2) + iframeRect.x,
                        rect.y + rect.height,
                        0,
                        0
                      );
                    }
                  }
                }}  
              >
                <button ref={areaRef} onMouseMove={handleMouseMove}>Click me</button>
              </Tooltip>
            </div>,
            container
          )
        )
      }
    </div>
  );
}

export default App;
