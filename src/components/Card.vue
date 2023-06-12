<template>
    <div
        :id="id"
        :draggable="draggable"
        @dragstart="start"
        @dragover.stop
    >
        <slot />
    </div>
</template>

<script>
    export default{
        props: {
            id: String,
            draggable: Boolean,
        },
        methods: {
            start: e => {
                e.dataTransfer.setData("card_id", e.target.id);

                setTimeout(() => {
                    e.target.style.display = "none";
                }, 0)

            }
        } 
    }
</script>