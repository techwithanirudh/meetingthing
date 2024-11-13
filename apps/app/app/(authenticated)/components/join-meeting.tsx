import { database } from '@repo/database/src/client';
import { meetingsTable } from '@repo/database/src/schema';
import { Button } from '@repo/design-system/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/design-system/components/ui/dialog';
import { Plus } from 'lucide-react';

export const JoinMeeting = () => {
  async function createMeeting() {
    'use server';
    const meeting = await database
      .insert(meetingsTable)
      .values({
        name: 'New Meeting',
        type: 'meetingbaas',
        status: 'loaded',
      })
      .returning({
        id: meetingsTable.id,
      });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" className="mx-4">
          Join Meeting
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Join Meeting</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
