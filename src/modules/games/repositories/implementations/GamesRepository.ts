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
      .createQueryBuilder('game')
      .select('game.title', 'title')
      .where('title ILIKE :title', { title: `%${param}%` })
      .execute();
      // Complete usando query builder

    return games;
  }

  async countAllGames(): Promise<[{ count: string }]> {
   const countGamesQuery = 'SELECT COUNT(*) FROM games';
   const count = await this.repository.query(countGamesQuery); // Complete usando raw query

    return count;
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    const users = await this.repository
      .createQueryBuilder('games')
      .select(['users.email', 'users.first_name', 'users.last_name'])
      .leftJoinAndSelect('games.users', 'users')
      .where('games.id = :id', { id })
      .execute();
      // Complete usando query builder

    console.log('users are', users);
    return users;
  }
}
