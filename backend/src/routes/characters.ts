// Characters routes

import { FastifyRequest, FastifyReply } from 'fastify';
import { createCharacter, getCharacters } from '../db/queries/entries';

interface CreateCharacterBody {
  user_id: string;
  name: string;
  relationship?: string;
  one_line_description?: string;
}

export async function createCharacterHandler(
  request: FastifyRequest<{ Body: CreateCharacterBody }>,
  reply: FastifyReply
) {
  try {
    const { user_id, name, relationship, one_line_description } = request.body;
    const id = await createCharacter({ user_id, name, relationship, one_line_description });
    return reply.code(201).send({ character_id: id, name });
  } catch (error: any) {
    console.error('[Riverb Error] Create character failed:', error.message);
    return reply.code(500).send({ error: 'Failed to create character' });
  }
}

export async function getCharactersHandler(
  request: FastifyRequest<{ Params: { userId: string } }>,
  reply: FastifyReply
) {
  try {
    const { userId } = request.params;
    const characters = await getCharacters(userId);
    return reply.code(200).send({ characters });
  } catch (error: any) {
    console.error('[Riverb Error] Get characters failed:', error.message);
    return reply.code(500).send({ error: 'Failed to get characters' });
  }
}
