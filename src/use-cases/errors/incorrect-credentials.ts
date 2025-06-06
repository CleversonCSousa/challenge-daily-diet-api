export class IncorretUserCredentials extends Error {
    constructor() {
        super('Incorrect credentials');
    }
}