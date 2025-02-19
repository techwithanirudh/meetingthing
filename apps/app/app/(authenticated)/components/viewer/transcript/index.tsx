import type { Transcript as TranscriptT, Word } from '@/types';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import { ChevronDown, Search } from 'lucide-react';

import { cn } from '@repo/design-system/lib/utils';
import { Button } from '@repo/design-system/components/ui/button';
import { Input } from '@repo/design-system/components/ui/input';

interface TranscriptProps {
  transcript: TranscriptT[];
  currentTime: number;
  onWordClick: (time: number) => void;
}

const Transcript: React.FC<TranscriptProps> = ({
  transcript,
  currentTime,
  onWordClick,
}) => {
  const scrollViewportRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const lastUserScrollPosition = useRef<number>(0);
  const isUserScrolling = useRef<boolean>(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Word[]>([]);

  const findNearest = useMemo(() => {
    const words = transcript.flatMap((entry) => entry.words);
    if (words.length === 0) return null;
    return words.reduce((nearest, word) => {
      const currentDiff = Math.abs(
        currentTime - (word.start_time + word.end_time) / 2
      );
      const nearestDiff = Math.abs(
        currentTime - (nearest.start_time + nearest.end_time) / 2
      );
      return currentDiff < nearestDiff ? word : nearest;
    });
  }, [transcript, currentTime]);

  const isNearBottom = useCallback(() => {
    if (scrollViewportRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        scrollViewportRef.current;
      return scrollTop + clientHeight >= scrollHeight - 50;
    }
    return true;
  }, []);

  const handleScroll = useCallback(() => {
    if (scrollViewportRef.current) {
      const currentScrollTop = scrollViewportRef.current.scrollTop;
      if (currentScrollTop < lastUserScrollPosition.current) {
        isUserScrolling.current = true;
        setShowScrollButton(true);
      } else if (isNearBottom()) {
        isUserScrolling.current = false;
        setShowScrollButton(false);
      }
      lastUserScrollPosition.current = currentScrollTop;
    }
  }, [isNearBottom]);

  const scrollToCurrentTime = useCallback(() => {
    if (scrollViewportRef.current) {
      const currentWordElement = scrollViewportRef.current.querySelector(
        `[data-time-start="${currentTime.toFixed(2)}"]`
      );
      if (currentWordElement) {
        currentWordElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
      }
      isUserScrolling.current = false;
      setShowScrollButton(false);
    }
  }, [currentTime]);

  useEffect(() => {
    if (!isUserScrolling.current) {
      scrollToCurrentTime();
    }
  }, [currentTime, scrollToCurrentTime]);

  const handleSearch = useCallback(() => {
    if (searchTerm.trim() === '') {
      setSearchResults([]);
      return;
    }
    const results = transcript.flatMap((entry) =>
      entry.words.filter((word) =>
        word.text.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setSearchResults(results);
  }, [searchTerm, transcript]);

  useEffect(() => {
    handleSearch();
  }, [searchTerm, handleSearch]);

  const highlightSearchTerm = (text: string) => {
    if (!searchTerm) return text;
    const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <mark key={index} className="bg-yellow-200">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="flex h-[calc(100%-48px)] flex-col">
      <div className="flex items-center gap-2 pb-2">
        <div className="relative flex-grow">
          <Search className='absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground' />
          <Input
            type="text"
            placeholder="Search"
            className="flex-grow pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      {/* 48 + 48px + 8px */}
      <ScrollArea.Root className="h-[calc(100%-48px)] w-full overflow-hidden">
        <ScrollArea.Viewport
          ref={scrollViewportRef}
          className="h-full w-full"
          onScroll={handleScroll}
        >
          {transcript.map((entry, entryIndex) => (
            <div key={entryIndex} className="mb-4">
              <h6 className="text-md px-0.5 font-bold">{entry.speaker}</h6>
              <div className="flex max-w-full flex-wrap py-1">
                {entry.words.map((word, wordIndex) => (
                  <p
                    key={`${entryIndex}-${wordIndex}`}
                    className={cn(
                      'w-fit cursor-pointer rounded-md px-0.5 text-sm',
                      {
                        'bg-blue-500 text-white': word === findNearest,
                        'bg-yellow-100': searchResults.includes(word),
                      }
                    )}
                    data-time-start={word.start_time.toFixed(2)}
                    data-time-end={word.end_time.toFixed(2)}
                    onClick={() => onWordClick(word.start_time)}
                  >
                    {highlightSearchTerm(word.text)}{' '}
                  </p>
                ))}
                {entry.words.length === 0 && (
                  <p className="px-0.5 text-sm">No transcript available</p>
                )}
              </div>
            </div>
          ))}
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar
          className="flex touch-none select-none bg-black/5 p-0.5 transition-colors duration-150 ease-out hover:bg-black/10 data-[orientation=horizontal]:h-2.5 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col"
          orientation="vertical"
        >
          <ScrollArea.Thumb className="relative flex-1 rounded-[10px] bg-black/30 before:absolute before:left-1/2 before:top-1/2 before:h-full before:min-h-[44px] before:w-full before:min-w-[44px] before:-translate-x-1/2 before:-translate-y-1/2 before:content-['']" />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
      {showScrollButton && (
        <Button
          className="absolute bottom-0 right-0 mx-6 mb-2 rounded-md bg-muted p-2"
          variant="outline"
          onClick={scrollToCurrentTime}
          size="icon"
        >
          <ChevronDown className="size-14" />
        </Button>
      )}
    </div>
  );
};

export default Transcript;