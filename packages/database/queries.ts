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
        console.error('Failed to get meetings by auth from database');
        throw error;
    }
}

export async function getMeetingById({ id, userId, orgId }: { id: number, userId: string, orgId: string; }) {
    try {
        const meeting = await db.query.meetingsTable.findFirst({
            where: (meetings, { eq, and, or }) =>
                and(
                    eq(meetings.id, id),
                    or(eq(meetings.userId, userId), eq(meetings.orgId, orgId ?? ''))
                ),
            with: {
                transcripts: true,
            },
        });

        return meeting;
    } catch (error) {
        console.error(`Failed to get meeting with ID ${id} from database`);
        throw error;
    }
}
