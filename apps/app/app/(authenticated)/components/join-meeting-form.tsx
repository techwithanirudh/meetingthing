'use client';

import { useAction } from 'next-safe-action/hooks';

import type { SignIn } from '@repo/validators';
import { Button } from '@repo/design-system/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@repo/design-system/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Input } from '@repo/design-system/components/ui/input';
import { SignInSchema } from '@repo/validators';

import { FormError } from './form-error';
import { joinMeeting } from '@/app/actions/join-meeting-action';

import { LoaderCircleIcon } from 'lucide-react';

export const JoinMeetingForm = () => {
  const form = useForm({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { execute, result, status } = useAction(joinMeeting);

  const onSubmit = (values: SignIn) => {
    execute(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                {/* <FormLabel>Email address</FormLabel> */}
                <FormControl>
                  <Input
                    {...field}
                    disabled={status === 'executing'}
                    placeholder="Email address"
                    type="email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                {/* <FormLabel>Password</FormLabel> */}
                <FormControl>
                  <Input
                    {...field}
                    disabled={status === 'executing'}
                    placeholder="Password"
                    type="password"
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
          Continue with Email
        </Button>
      </form>
    </Form>
  );
};