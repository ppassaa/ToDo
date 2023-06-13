<template>
    <div
        :id="id"
        :draggable="draggable"
        @dragstart="start"
        @dragover.stop
        @dragend="end"
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
                e.dataTransfer.setData("card_id", e.target.id); // setto i dati passati dall'evento

                setTimeout(() => {
                    e.target.style.display = "none"; //rendo la card invisibile(per ora rimane invisibile se draggata su zona non draggabile)
                }, 0)

            },
            end: e =>{
                setTimeout(() => {
                    e.target.style.display = "block";
                }, 0);
            }
        } 
    }
</script>