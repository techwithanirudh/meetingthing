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
  CardHeader,
  CardTitle,
} from '@repo/design-system/components/ui/card';
import { Separator } from '@repo/design-system/components/ui/separator';
import { SidebarTrigger } from '@repo/design-system/components/ui/sidebar';
import type { Metadata } from 'next';
import { useParams } from 'next/navigation';

const title = 'Acme Inc | Meeting';
const description = 'My application.';

export const metadata: Metadata = {
  title,
  description,
};

const Meeting = ({ params }: { params: { id: string } }) => {
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
                <BreadcrumbPage>{params.id}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div>
        {params.id}
      </div>
    </>
  );
};

export default Meeting;
