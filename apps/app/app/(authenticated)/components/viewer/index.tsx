'use client';
import type { TranscriptSegment } from '@repo/meeting-bots/types/meetingbaas';
import * as React from 'react';
import Chat from './chat';
import Transcript from './transcript';
import { Player as VideoPlayer } from './video-player';
import { DownloadIcon } from 'lucide-react';
import Link from 'next/link';

import { cn } from '@repo/design-system/lib/utils';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@repo/design-system/components/ui/breadcrumb';
import { Button } from '@repo/design-system/components/ui/button';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@repo/design-system/components/ui/resizable';

import { useIsMobile } from '@repo/design-system/hooks/use-mobile';

interface ViewerProps {
  botId: string;
  isLoading: boolean;
  transcripts: TranscriptSegment[];
  mp4: string; // AWS S3 URL
  speakers: string[];
}

export function Viewer({ botId, isLoading, transcripts, mp4, speakers }: ViewerProps) {
  const isMobile = useIsMobile();

  // const handleSeek = React.useCallback(
  //   (time: number) => {
  //     if (player) {
  //       player.currentTime = time;
  //     }
  //   },
  //   [player]
  // );

  return (
    <div className="min-h-svh">
      <div className="w-full">
        <header className="sticky top-0 flex h-16 shrink-0 items-center justify-between gap-2 bg-background px-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Recording</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
      </div>
      <div className={cn('flex justify-center', 'w-full')}>
        <ResizablePanelGroup
          className="flex min-h-[200dvh] lg:min-h-[calc(100svh-theme(spacing.16))]"
          direction={isMobile ? 'vertical' : 'horizontal'}
        >
          <ResizablePanel defaultSize={50} minSize={25}>
            <ResizablePanelGroup
              direction="vertical"
              className={cn('flex h-full w-full')}
            >
              <ResizablePanel defaultSize={50} minSize={25}>
                {mp4 && (
                  <VideoPlayer
                    src={{
                      src: mp4,
                      type: 'video/mp4',
                    }}
                    onTimeUpdate={handleTimeUpdate}
                    setPlayer={setPlayerRef}
                    assetTitle={name}
                  />
                )}
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={50} minSize={15}>
                <div className="h-full max-h-full flex-1 space-y-2 overflow-auto rounded-t-none border-0 border-x bg-background p-4 md:p-6 lg:border-0 lg:border-b lg:border-l">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="px-0.5 font-bold text-2xl md:text-3xl">
                      Transcript
                    </h2>
                    <div className="flex gap-2">
                      <Button className="h-8" size="sm">
                        <DownloadIcon className="h-4 w-4" /> Download JSON
                      </Button>
                      <Button className="h-8" size="sm">
                        <DownloadIcon className="h-4 w-4" /> Download Video
                      </Button>
                    </div>
                  </div>
                  {isLoading && <div className="flex px-0.5">Loading...</div>}
                  <Transcript
                    transcript={transcripts}
                    // currentTime={currentTime}
                    // onWordClick={handleSeek}
                  />
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>

          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={50} minSize={25}>
            <ResizablePanelGroup
              direction="vertical"
              className={cn('flex h-full w-full')}
            >
              <ResizablePanel defaultSize={50} minSize={25}>
                {/* <Editor
                  initialValue={LOADING_EDITOR_DATA}
                  onCreate={({ editor }) => setEditor(editor)}
                  onChange={handleEditorChange}
                /> */}
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={33} minSize={25}>
                {/* <Chat
                  messages={chatMessages}
                  handleSubmit={handleChatSubmit}
                  disabled={{
                    value: !openAIApiKey || isChatLoading,
                    reason: isChatLoading ? 'loading' : 'openai',
                  }}
                /> */}
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
