import { env } from '@/env';
import { auth } from '@repo/auth/server';
import { database } from '@repo/database/client';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import { AvatarStack } from './components/avatar-stack';
import { Cursors } from './components/cursors';
import { Header } from './components/header';
import { RecordMeeting } from './components/record-meeting';
import { MeetingsList } from './components/meetings-list';

const title = 'Meetings';
const description = 'View and manage your meetings.';

const CollaborationProvider = dynamic(() =>
  import('./components/collaboration-provider').then(
    (mod) => mod.CollaborationProvider
  )
);

export const metadata: Metadata = {
  title,
  description,
};

const App = async () => {
  const { orgId, userId } = await auth();

  if (!orgId) {
    notFound();
  }

  const meetings = await database.query.meetingsTable.findMany({
    where: (meetings, { eq, or }) =>
      // todo: ]this is blank not swecure
      or(eq(meetings.userId, userId), eq(meetings.orgId, orgId ?? '')),
  });

  return (
    <>
      <Header pages={[]} page="Meetings">
        {env.LIVEBLOCKS_SECRET && (
          <CollaborationProvider orgId={orgId}>
            <AvatarStack />
            <Cursors />
          </CollaborationProvider>
        )}

        <div className="px-4">
          <RecordMeeting />
        </div>
      </Header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <MeetingsList meetings={meetings} />
      </div>
    </>
  );
};

export default App;
