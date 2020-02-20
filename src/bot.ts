import { Client, Message, GuildMember } from 'discord.js';
import { inject, injectable } from 'inversify';
import { TYPES } from './types';
import { MessageResponder } from './services/message-responder';
import { NewUserHandler } from './services/new-user-handler';

@injectable()
export class Bot {
    private client: Client;
    private readonly token: string;
    private messageResponder: MessageResponder;
    private newUserHandler: NewUserHandler

    constructor(
        @inject(TYPES.Client) client: Client,
        @inject(TYPES.Token) token: string,
        @inject(TYPES.MessageResponder) messageResponder: MessageResponder,
        @inject(TYPES.NewUserHandler) newUserHandler: NewUserHandler
    ) {
        this.client = client;
        this.token = token;
        this.messageResponder = messageResponder;
        this.newUserHandler = newUserHandler;
    }

    public listen(): Promise<string> {
        this.client.on('message', (message: Message) => {
            if(message.author.bot) {
                console.log('Ignoring bot message')
                return;
            }

            console.log('Message recieved, contents: ', message.content);

            this.messageResponder.handle(message).then(() => {
                console.log('Response sent');
            }).catch((error) => {
                console.log('Response not sent for reason: ', error.message);
            })
        });

        this.client.on('guildMemberAdd', (member: GuildMember) => {
            console.log('User joined: ', member.displayName);
            this.newUserHandler.handle(member).then(() => {
                console.log('DM successfuly sent to user: ', member.displayName)
            }).catch((error) => {
                console.log('Unable to send DM for reason: ', error.message);
            });
        });

        return this.client.login(this.token);
    }
}