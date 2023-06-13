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
            getBoard: function(element) {
                if(element.id === "board-1" || element.id === "board-2" || element.id === "board-3"){
                    return element;
                }
                else return this.getBoard(element.parentNode);
            },
            drop: function(e) {
                console.log(e.target);
                const targetBoard = this.getBoard(e.target);
                const card_id = e.dataTransfer.getData("card_id");
                
                const card = document.getElementById(card_id);

                card.style.display = "block";

                const elementiLista = targetBoard.querySelectorAll("li");

                elementiLista.forEach(element => {
                    if(element.textContent === "") element.parentNode.removeChild(element);
                });

                targetBoard.appendChild(card);
            },
            
        }
    }
</script>