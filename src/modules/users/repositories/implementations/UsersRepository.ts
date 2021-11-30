import { getRepository, Repository } from 'typeorm';
import { GamesRepository } from '../../../games/repositories/implementations/GamesRepository';

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from '../../dtos';
import { User } from '../../entities/User';
import { Game } from '../../../games/entities/Game'
import { IUsersRepository } from '../IUsersRepository';

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({user_id,}: IFindUserWithGamesDTO): Promise<User> {
    // Complete usando ORM
    const user = await this.repository.findOne({
      relations: ['games'],
      where: {
        id: user_id
      }
    })

    if (!user) {
      throw new Error('user not found')
    }

    return user
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    return await this.repository.query(`
      SELECT *
      FROM users
      ORDER BY users.first_name
    `); // Complete usando raw query
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    const users = await this.repository.query(`
      SELECT *
      FROM users
      WHERE LOWER(users.first_name)=LOWER('${first_name}') AND
        LOWER(users.last_name)=LOWER('${last_name}')
    `); // Complete usando raw query

    return users
  }
}
