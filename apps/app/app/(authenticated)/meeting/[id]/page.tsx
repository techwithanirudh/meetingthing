import { database } from '@repo/database/client';
import { meetingsTable } from '@repo/database/schema';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@repo/design-system/components/ui/breadcrumb';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/design-system/components/ui/card';
import { Separator } from '@repo/design-system/components/ui/separator';
import { SidebarTrigger } from '@repo/design-system/components/ui/sidebar';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

const title = 'Acme Inc | Meeting';
const description = 'My application.';

export const metadata: Metadata = {
  title,
  description,
};

const Meeting = async ({ params }: { params: Promise<{ id: number }> }) => {
  const id = (await params).id;
  const meeting = await database.query.meetingsTable.findFirst({
    where: (meetings, { eq }) => eq(meetings.id, id),
  });
  if (!meeting) return notFound();

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 justify-between w-full">
        <div className="flex items-center justify-between gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/">Meetings</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{id}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
          <CardHeader>
            <CardTitle>{meeting?.name}</CardTitle>
            <CardDescription>{meeting?.botId}</CardDescription>
          </CardHeader>
        </div>
      </div>
    </>
  );
};

export default Meeting;
