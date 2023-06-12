<template>
    <div
        :id="id"
        @dragover.prevent
        @drop.prevent="drop"
    >
        <slot />
    </div>
</template>

<script>
    export default{
        data(){
            return {}
        },
        props:{
            id: String,
        },
        methods: {
            drop: e => {
                console.log("drop fired");
                const card_id = e.dataTransfer.getData("card_id");
                
                const card = document.getElementById(card_id);

                card.style.display = "block";

                e.target.appendChild(card);
            },
        }
    }
</script>