import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';

export interface KeypressDef {
  key:string;
  shiftKey:boolean;
  altKey:boolean;
  ctrlKey:boolean;
  metaKey:boolean;
}

export const useKeyPress = (keys:KeypressDef[], callback, node = null) => {
  // implement the callback ref pattern
  const callbackRef = useRef(callback);
  useLayoutEffect(() => {
    callbackRef.current = callback;
  });

  // handle what happens on key press
  const handleKeyPress = useCallback(
    (event:KeyboardEvent) => {
      // check if one of the key is part of the ones we want
      if (keys.some((key) => event.key === key.key && event.shiftKey === key.shiftKey && event.altKey === key.altKey && event.metaKey === key.metaKey)) {
        callbackRef.current(event);
      }
    },
    [keys]
  );

  useEffect(() => {
    // target is either the provided node or the document
    const targetNode = node ?? document;
    // attach the event listener
    targetNode &&
      targetNode.addEventListener("keydown", handleKeyPress);

    // remove the event listener
    return () =>
      targetNode &&
        targetNode.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress, node]);
};