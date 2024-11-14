'use client';

import { useAction } from 'next-safe-action/hooks';

import type { JoinMeeting } from '@repo/validators';
import { Button } from '@repo/design-system/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/design-system/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Input } from '@repo/design-system/components/ui/input';
import { JoinMeetingSchema } from '@repo/validators';

import { FormError } from './form-error';
import { joinMeeting } from '@/app/actions/join-meeting-action';

import { LoaderCircleIcon } from 'lucide-react';

export const JoinMeetingForm = () => {
  const form = useForm({
    resolver: zodResolver(JoinMeetingSchema),
    defaultValues: {
      meetingURL: '',
    },
  });

  const { execute, result, status } = useAction(joinMeeting);

  const onSubmit = (values: JoinMeeting) => {
    execute(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="meetingURL"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meeting URL</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={status === 'executing'}
                    placeholder="https://meet.acme.com/123456789"
                    type="url"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormError message={result.serverError} />

        <Button
          disabled={status === 'executing'}
          type="submit"
          className="w-full"
        >
          {status === 'executing' && (
            <LoaderCircleIcon className="mr-2 h-4 w-4 animate-spin" />
          )}
          Record Meeting
        </Button>
      </form>
    </Form>
  );
};