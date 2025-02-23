import { RefObject, useEffect } from "react";

export const useOutsideClick = (ref: RefObject<HTMLDivElement>, callback: () => void) => {
    
    useEffect(() => {

        const handleClickOutside = (e: MouseEvent) => {
          if (!ref.current?.contains(e.target as Node)) {
            callback()
            
          }
        };
    
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
      }, []);
}