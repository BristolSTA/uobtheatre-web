<template>
    <div>
        <div id="nav" class="bg-teal-400">
            <router-link to="/">Home</router-link> |
            <router-link to="/about">About</router-link>
        </div>
        <slot />
        <div id="footer" class="bg-gray-500">
            &copy; Bristol STA
        </div>
    </div>
</template>

<style lang="scss">
#nav {
    padding: 30px;

    a {
        font-weight: bold;
        color: #2c3e50;

        &.router-link-exact-active {
            color: #42b983;
        }
    }
}
</style>

<script>
export default {
    name: 'Layout'
};
</script>
