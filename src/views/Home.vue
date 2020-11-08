<template>
    <div class="home">
        <img alt="Vue logo" src="../assets/logo.png" />
        <HelloWorld msg="Welcome to Your Vue.js App" />
        <h1>Productions</h1>
        <ul>
            <li v-for="production in productions" :key="production.id">
                {{ production.name }} ({{ production.date }})
            </li>
        </ul>
    </div>
</template>

<script>
import HelloWorld from '@/components/HelloWorld.vue';
import { productionService } from '@/services';

export default {
    name: 'Home',
    components: {
        HelloWorld
    },
    data() {
        return {
            productions: []
        };
    },
    created() {
        productionService
            .fetchProductions()
            .then(data => (this.productions = data.productions));
    }
};
</script>
