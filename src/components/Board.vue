<template>
    <div
        :id="id"
        @dragover.prevent
        @drop.prevent="drop"
        @dragstart="dragstart"
    >
        <slot />
    </div>
</template>

<script>
    export default{
        data(){
            return {
                source: "",
            }
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
                
                const data_di_oggi = new Date();

                const giorno = `${data_di_oggi.getDate()}`.padStart(2,"0");
                const mese = `${data_di_oggi.getMonth()+1}`.padStart(2,"0");
                const anno = data_di_oggi.getFullYear();

                //ottengo ricorsivamente la board dall'elemento target
                const targetBoard = this.getBoard(e.target);
                let list = JSON.parse(e.dataTransfer.getData("card_id"));
                const card_id = list[0]; // ottengo la card dall'evento
                const card = document.getElementById(card_id);
                const task = list[1];
                card.style.display = "block";
                //rimozione dei li vuoti
                const elementiLista = targetBoard.querySelectorAll("li");

                elementiLista.forEach(element => {
                    if(element.textContent === "") element.parentNode.removeChild(element);
                });

                card.parentElement.classList.add("taskStyle");
                card.parentElement.classList.add("taskCompletate");

                //aggiungo la card alla board
                if(targetBoard.id === "board-3"){ 
                    if(!task.scaduta)card.parentElement.classList.add("intempo");
                    else card.parentElement.classList.add("scaduto");
                    card.parentElement.classList.remove("inscadenza");
                }
                else if(targetBoard.id === "board-2" || targetBoard.id === "board-1"){
                    card.parentElement.classList.remove("intempo");
                    if(task.dataScadenza === `${anno}-${mese}-${giorno}`){
                        card.parentElement.classList.add("inscadenza");
                    }
                    else{
                        card.parentElement.classList.add("NotScaduto")
                    }
                }
                targetBoard.appendChild(card.parentElement);
            },

            dragstart: function(e){
                this.source = this.getBoard(e.target);
            }
            
        }
    }
</script>
<style scoped>
    div {
        text-align: left;
        overflow-y: auto;
        max-width: 100%;
        height: 100%;
    }
</style>
