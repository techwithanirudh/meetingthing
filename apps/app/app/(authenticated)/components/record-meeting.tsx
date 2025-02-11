import { Button } from '@repo/design-system/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/design-system/components/ui/dialog';
import { Disc2Icon } from 'lucide-react';
import { RecordMeetingForm } from './record-meeting-form';

export function RecordMeeting() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="gap-2">
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
        <RecordMeetingForm />
      </DialogContent>
    </Dialog>
  );
}
