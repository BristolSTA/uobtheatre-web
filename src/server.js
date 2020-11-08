import { Server, Model } from 'miragejs';

export function makeServer({ environment = 'development' } = {}) {
    let server = new Server({
        environment,

        models: {
            production: Model
        },

        seeds(server) {
            server.create('production', {
                name: 'Legally Blonde',
                date: '15/10/2020'
            });
            server.create('production', {
                name: 'MTB Showcase',
                date: '15/10/2019'
            });
            server.create('production', {
                name: 'Present Laughter',
                date: '15/10/2021'
            });
        },

        routes() {
            this.namespace = 'api';

            this.get('/productions', schema => {
                return schema.productions.all();
            });
        }
    });

    return server;
}
