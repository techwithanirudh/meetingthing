import React from 'react';
import { JoinMeetingForm } from './join-meeting-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/design-system/components/ui/dialog';
import { Button } from '@repo/design-system/components/ui/button';
import { Disc2Icon } from 'lucide-react';

export function JoinMeeting() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mx-4 gap-2">
          <Disc2Icon /> Record
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Record Meeting</DialogTitle>
          <DialogDescription>
            Quickly record meetings using the meeting URL.
          </DialogDescription>
        </DialogHeader>
        <JoinMeetingForm />
      </DialogContent>
    </Dialog>
  );
}
