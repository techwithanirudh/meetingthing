import type { SelectMeeting } from '@repo/database/schema';
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@repo/design-system/components/ui/card';
import { cn } from '@repo/design-system/lib/utils';
import { formatDistance } from 'date-fns';
import { Check, LoaderCircle } from 'lucide-react';
import Link from 'next/link';
import { RecordMeeting } from './record-meeting';

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
                'pointer-events-none select-none bg-muted/30':
                  meeting.status !== 'loaded',
              }
            )}
            aria-disabled={meeting.status !== 'loaded'}
          >
            <CardHeader>
              <CardTitle>{meeting.name}</CardTitle>
              <CardDescription>{meeting?.botId}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1" />

            <CardFooter className="flex w-full justify-between">
              <p className="text-muted-foreground text-sm">
                {formatDistance(new Date(meeting.createdAt), new Date(), {
                  addSuffix: true,
                })}
              </p>
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
        <div className="flex min-h-[100vh] flex-1 flex-col items-center justify-center rounded-xl bg-muted/50 md:min-h-min">
          <div className="text-left">
            <h2 className="font-semibold text-xl">No meetings found.</h2>
            <p className="mt-2 text-muted-foreground">
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
