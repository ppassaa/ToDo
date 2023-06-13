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
                //ottengo ricorsivamente la board dall'elemento target
                const targetBoard = this.getBoard(e.target);
                const card_id = e.dataTransfer.getData("card_id"); // ottengo la card dall'evento
                const card = document.getElementById(card_id);

                card.style.display = "block";
                //rimozione dei li vuoti
                const elementiLista = targetBoard.querySelectorAll("li");

                elementiLista.forEach(element => {
                    if(element.textContent === "") element.parentNode.removeChild(element);
                });
                //aggiungo la card alla board
                targetBoard.appendChild(card);
            },
            
        }
    }
</script>