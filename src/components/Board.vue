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
                console.log(e.target);
                const card_id = e.dataTransfer.getData("card_id");
                
                const card = document.getElementById(card_id);

                card.style.display = "block";

                const elementiLista = e.target.querySelectorAll("li");

                elementiLista.forEach(element => {
                    if(element.textContent === "") element.parentNode.removeChild(element);
                });

                e.target.appendChild(card);
            },
        }
    }
</script>