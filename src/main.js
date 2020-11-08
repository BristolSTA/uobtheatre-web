import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';

/**
 * Import server
 */

import { makeServer } from './server';

if (process.env.NODE_ENV === 'development') {
    makeServer();
}

/**
 * Import styles
 */
import './assets/styles/app.css';

/**
 * Create view app
 */
new Vue({
    router,
    render: h => h(App)
}).$mount('#app');
