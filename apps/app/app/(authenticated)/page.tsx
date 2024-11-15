import { database } from '@repo/database/client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@repo/design-system/components/ui/breadcrumb';
import { Separator } from '@repo/design-system/components/ui/separator';
import { SidebarTrigger } from '@repo/design-system/components/ui/sidebar';
import type { Metadata } from 'next';
import { RecordMeeting } from './components/record-meeting';
import { MeetingsList } from './components/meetings-list';

const title = 'Acme Inc';
const description = 'My application.';

export const metadata: Metadata = {
  title,
  description,
};

const App = async () => {
  const meetings = await database.query.meetingsTable.findMany({
    with: {
      // attendees: true,
    }
  });

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
        <MeetingsList meetings={meetings} />
      </div>
    </>
  );
};

export default App;
