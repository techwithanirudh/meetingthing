'use client';
import { Button } from '@repo/design-system/components/ui/button';
import { fonts } from '@repo/design-system/lib/fonts';
import { captureException } from '@sentry/nextjs';
import type NextError from 'next/error';
import { useEffect } from 'react';

type GlobalErrorProperties = {
  readonly error: NextError & { digest?: string };
  readonly reset: () => void;
};

const GlobalError = ({ error, reset }: GlobalErrorProperties) => {
  useEffect(() => {
    captureException(error);
  }, [error]);

  return (
    <html lang="en" className={fonts}>
      <body>
        <div className="flex h-full min-h-svh flex-col items-center justify-center">
          <div className="flex max-w-md flex-1 flex-col justify-center gap-4">
            <h1 className="font-bold text-4xl">Error!</h1>
            <p className="text-lg text-muted-foreground">
              Oops! Something went wrong. We couldn't complete the requested
              operation.
            </p>
            <Button asChild>
              <Button onClick={() => reset()}>Try Again</Button>
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
};

export default GlobalError;
