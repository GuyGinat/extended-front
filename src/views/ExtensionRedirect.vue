<template>
    <h1>Welcome to Super Session!</h1>
</template>

<script>
export default {
    data() {
        return {
            userId: ''
        }
    },
    mounted() {
        if (this.$route.params.id) {
            this.userId = this.$route.params.id
            this.register()
        }
    },
    methods: {
        register: function() {
            this.$store
                .dispatch("register", {doc: {"id": this.userId}})
                .then(() => {
                    console.log(`loged in`)
                })
                .catch(err => {
                    console.log(err)
                })
            
        }
    }
}
</script>