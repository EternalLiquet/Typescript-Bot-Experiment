import { GuildMember, Message, Client, DMChannel } from 'discord.js';
import { injectable } from 'inversify';

@injectable()
export class NewUserHandler {
    handle(user: GuildMember): Promise<Message | Message[]> {
        return user.sendMessage('uwu senpai pls notice me by sending %chikaSkirt').catch((error) => {
            return Promise.reject(new Error('Failed to send DM to user'));
        });
    }
}