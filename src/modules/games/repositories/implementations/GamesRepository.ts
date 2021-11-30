import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {

    const games = await this.repository
      .createQueryBuilder('games')
        .where(`games.title ILIKE '%${param}%'`)
        .getMany()
      // Complete usando query builder

      return games
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return this.repository.query(`
    SELECT COUNT(games)
    FROM games
    `); // Complete usando raw query
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    const games = await this.repository
      .createQueryBuilder('games')
        .innerJoinAndSelect('games.users', 'users')
        .where(`games.id = '${id}'`)
        .getOne()
        // Complete usando query builder

    if(!games) {
      throw new Error('Game not found')
    }

    return games.users
  }
}
