import 'server-only';

import { database as db } from './client';


export async function getMeetingsByAuth({ userId, orgId }: { userId: string, orgId: string; }) {
    try {
        const meetings = await db.query.meetingsTable.findMany({
            where: (meetings, { eq, or }) =>
                or(eq(meetings.userId, userId), eq(meetings.orgId, orgId ?? '')),
            orderBy: (meetings, { desc }) => desc(meetings.createdAt),
        });

        return meetings;
    } catch (error) {
        console.error('Failed to get document by id from database');
        throw error;
    }
}
