'use client';
import { Button } from '@repo/design-system/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/design-system/components/ui/dialog';
import Form from 'next/form';
import { useActionState } from 'react';
import { joinMeeting } from '../../join-meeting-action';
import { Input } from '@repo/design-system/components/ui/input';

export const JoinMeeting = () => {
  const [error, submitAction, isPending] = useActionState(
    async (previousState, formData) => {
      const error = await joinMeeting(formData.get('name'));
      if (error?.validationErrors) {
        return error;
      }
      return null;
    },
    null
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" className="mx-4">
          Record Meeting
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Record Meeting</DialogTitle>
          <DialogDescription>Start a new meeting to record.</DialogDescription>
          <Form action={submitAction}>
            <Input name="url" label="Meeting URL" />
            <Input name="name" label="Meeting Bot Name" />
            
            <DialogFooter>
              <Button variant="outline" type="submit" disabled={isPending}>
                Submit
              </Button>
            </DialogFooter>
            {error && <p>{error}</p>}
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
