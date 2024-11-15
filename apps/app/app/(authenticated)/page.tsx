import { database } from '@repo/database/client';
import { meetingsTable } from '@repo/database/schema';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@repo/design-system/components/ui/breadcrumb';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@repo/design-system/components/ui/card';
import { Separator } from '@repo/design-system/components/ui/separator';
import { SidebarTrigger } from '@repo/design-system/components/ui/sidebar';
import type { Metadata } from 'next';
import { RecordMeeting } from './components/record-meeting';
import Link from 'next/link';
import { cn } from '@repo/design-system/lib/utils';
import { Check, LoaderCircle } from 'lucide-react';

const title = 'Acme Inc';
const description = 'My application.';

export const metadata: Metadata = {
  title,
  description,
};

const App = async () => {
  const meetings = await database.query.meetingsTable.findMany();

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 justify-between w-full">
        <div className="flex items-center justify-between gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbPage>Meetings</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="px-4">
          <RecordMeeting />
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          {meetings.map((meeting) => (
            <Link
              href={`/meeting/${meeting.id}`}
              key={meeting.id}
              className={cn('flex aspect-video cursor-pointer flex-col rounded-xl bg-muted/50', {
                'bg-muted/30 pointer-events-none': meeting.status !== 'loaded',
              })}
            >
              <CardHeader>
                <CardTitle>{meeting.name}</CardTitle>
                <CardDescription>{meeting?.botId}</CardDescription>
              </CardHeader>
              <CardContent className='flex-1'>
                
              </CardContent>

              <CardFooter className='flex w-full justify-end'>
                {meeting.status === 'loading' ? <LoaderCircle className='animate-spin' /> : <Check />}
              </CardFooter>
            </Link>
          ))}
        </div>

        {meetings.length === 0 && (
          <div className="min-h-[100vh] flex-1 flex flex-col items-center justify-center rounded-xl bg-muted/50 md:min-h-min">
            <div className="text-left">
              <h2 className="text-xl font-semibold">No meetings found.</h2>
              <p className="text-muted-foreground mt-2">
                Get started by recording a new meeting.
              </p>
              <div className="mt-4">
                <RecordMeeting />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default App;
