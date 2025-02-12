import 'server-only';

import { database as db } from './client';
import { InsertMeeting, meetingsTable } from './schema';

export async function createMeeting({
    name,
    provider,
    status,
    userId,
    orgId,
    botId,
}: InsertMeeting) {
    try {
        return await db.insert(meetingsTable).values({
            name,
            provider,
            status,
            userId,
            orgId,
            botId
        }).returning({
            id: meetingsTable.id,
        });
    } catch (error) {
        console.error('Failed to create meeting in database');
        throw error;
    }
}

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
