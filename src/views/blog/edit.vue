<template>
    <div class="row">
        <div class="container">
            <wysiwyg  v-model="body" />
        </div>
    </div>
</template>

<script>
export default {
    data: () => ({
        body : null
    })
}
</script>

<style>
@import "~vue-wysiwyg/dist/vueWysiwyg.css";

</style>