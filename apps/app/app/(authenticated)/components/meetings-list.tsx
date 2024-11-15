
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@repo/design-system/components/ui/card';
import { RecordMeeting } from './record-meeting';
import Link from 'next/link';
import { cn } from '@repo/design-system/lib/utils';
import { Check, LoaderCircle } from 'lucide-react';
import type { SelectMeeting } from '@repo/database/src/schema';

export function MeetingsList({ meetings }: { meetings: SelectMeeting[] }) {
  return (
    <>
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        {meetings.map((meeting) => (
          <Link
            href={`/meeting/${meeting.id}`}
            key={meeting.id}
            className={cn(
              'flex aspect-video cursor-pointer flex-col rounded-xl bg-muted/50',
              {
                'bg-muted/30 pointer-events-none': meeting.status !== 'loaded',
              }
            )}
          >
            <CardHeader>
              <CardTitle>{meeting.name}</CardTitle>
              <CardDescription>{meeting?.botId}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1" />

            <CardFooter className="flex w-full justify-end">
              {meeting.status === 'loading' ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                <Check />
              )}
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
    </>
  );
}
