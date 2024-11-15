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
  CardHeader,
  CardTitle,
} from '@repo/design-system/components/ui/card';
import { Separator } from '@repo/design-system/components/ui/separator';
import { SidebarTrigger } from '@repo/design-system/components/ui/sidebar';
import type { Metadata } from 'next';
import { RecordMeeting } from './components/record-meeting';
import Link from 'next/link';

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
              className="aspect-video rounded-xl bg-muted/50"
            >
              <CardHeader>
                <CardTitle>{meeting.name}</CardTitle>
              </CardHeader>
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
