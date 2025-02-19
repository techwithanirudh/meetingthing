import { auth } from '@repo/auth/server';
import { database } from '@repo/database/client';
import { notFound, redirect } from 'next/navigation';
import { Header } from '../components/header';

type SearchPageProperties = {
  searchParams: Promise<{
    q: string;
  }>;
};

export const generateMetadata = async ({
  searchParams,
}: SearchPageProperties) => {
  const { q } = await searchParams;

  return {
    title: `${q} - Search results`,
    description: `Search results for ${q}`,
  };
};

const SearchPage = async ({ searchParams }: SearchPageProperties) => {
  const { orgId, userId } = await auth();
  const { q } = await searchParams;

  if (!orgId) {
    notFound();
  }

  if (!q) {
    redirect('/');
  }

  const meetings = await database.query.meetingsTable.findMany({
    where: (meetings, { eq, and, or }) =>
      and(
        eq(meetings.name, q),
        or(eq(meetings.userId, userId), eq(meetings.orgId, orgId ?? ''))
      ),
    with: {
      transcripts: true,
    },
  });

  return (
    <>
      <Header pages={[]} page="Search" />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          {meetings.map((meeting) => (
            <div
              key={meeting.id}
              className="aspect-video rounded-xl bg-muted/50"
            >
              {meeting.name}
            </div>
          ))}
        </div>
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
      </div>
    </>
  );
};

export default SearchPage;
