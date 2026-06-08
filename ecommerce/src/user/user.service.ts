import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { randomBytes, scrypt as scryptCallback } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(scryptCallback);

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    // Check if email already exists
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Hash password using built-in crypto (no external dependency).
    const salt = randomBytes(16).toString('hex');
    const derivedKey = (await scrypt(createUserDto.password, salt, 64)) as Buffer;
    const hashedPassword = `${salt}:${derivedKey.toString('hex')}`;
    // Create user
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      isActive: true,
      isSuspended: false,
    });

    const savedUser = await this.userRepository.save(user);

    // Return user without password
    const { password, ...userWithoutPassword } = savedUser;
    return userWithoutPassword;
  }
  async findAllUsers(): Promise<Omit<User, 'password'>[]> {
    const users = await this.userRepository.find();
    // Remove password field from each user object
    return users.map(({ password, ...userWithoutPassword }) => userWithoutPassword);
  }

  async findById(id: string): Promise<Omit<User, 'password'> | null> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      return null;
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}