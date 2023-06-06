<template>
  <nav class="navbar navbar-expand-sm bg-dark navbar-dark">

    <a href="#close"><img width="30" height="30" src="src\assets\closeimg.PNG" alt="close"></a>
    <p style="color: white; margin-top: 15px; margin-left: 15px;">To-Do List</p>
    <div class="dropdown ml-auto">
      <button @click="tendina()" :style="{ backgroundImage: 'url(' + imageURL + ')' }" class="dropbtn"></button>
      <div v-if="tendinaShow" class="dropdown-content">

        <div class="group">
          <a v-if="aggiungiBool" class="aggiungiScd" href="#"> <br>
            <input class="taskInp" v-model="task" placeholder="task">
            <button class="aggiungiBtn">Aggiungi</button>
          </a>
          <a @click="aggiungiPuls()" class="bordoIntero" :class="{ riduci: !aggiungiBool }, { riduciAggiungi: aggiungiBool }"
            href="#">Aggiungi</a>

        </div>

        <a class="ml-auto bordoIntero" :class="{ riduciRimuovi: aggiungiBool }" @click="rimuoviPuls()" href="#">Rimuovi</a>

        <div class="group">
          <a v-if="fattoIncorso" class="fattoBtn fattoBtnPrim riduciBottone" href="#">Fatto</a>
          <a @click="incorso" class="bordoIntero" :class="{ riduci: !fattoIncorso }" href="#">Sposta in "In corso"</a>
        </div>
        <div class="group">
          <a v-if="fattoCompletati" class="fattoBtn riduciBottone" href="#">Fatto</a>
          <a @click="completati" class="bordoIntero" :class="{ riduci: !fattoCompletati }" href="#">Sposta in
            "Completati"</a>
        </div>
        <div class="group">
          <a v-if="fattoDafare" class="fattoBtn riduciBottone" href="#">Fatto</a>
          <a @click="dafare" class="bordoIntero" :class="{ riduci: !fattoDafare }" href="#">Sposta in "Da fare"</a>
        </div>

      </div>
    </div>
  </nav>

  <div class="taskContainer">
    <div style="width: 250px; margin-top: 4%; text-align: center; height:750;color: white;">
      DA FARE
      <hr style="height:2px; color:#424c57; background-color:#424c57;margin-top: 4%;">
    </div>

    <div
      style=" margin-top: 4%;border-left: 3px solid #424c57; border-right: 3px solid #424c57; width: 250px; float:left; text-align: center; height:750px;color: white;">
      IN CORSO
      <hr style="height:2px; color:#424c57; background-color:#424c57;margin-top: 4%;">
    </div>

    <div style="width: 250px; float:left; margin-top: 4%; text-align: center; height:750;color: white;">
      COMPLETATI
      <hr style="height:2px; color:#424c57; background-color:#424c57;margin-top: 4%;">
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tendinaShow: false,
      imageURL: "src/assets/pulsanteGIU.PNG",
      fattoIncorso: false,
      fattoCompletati: false,
      fattoDafare: false,
      aggiungiBool: false,
      rimuoviBool: false
    }
  },
  methods: {

    tendina() {
      this.tendinaShow = !this.tendinaShow;
      this.imageURL = this.tendinaShow ? "src/assets/pulsanteSU.PNG" : "src/assets/pulsanteGIU.PNG";
      this.fattoCompletati = false;
      this.fattoIncorso = false;
      this.fattoDafare = false;
      this.aggiungiBool = false;
      this.rimuoviBool = false;

    },

    aggiungiPuls() {
      this.aggiungiBool = !this.aggiungiBool;
      this.fattoIncorso = false;
      this.fattoCompletati = false;
      this.fattoDafare = false;
      this.rimuoviBool = false;

    },

    rimuoviPuls() {
      this.rimuoviBool = !this.rimuoviBool;
      this.fattoIncorso = false;
      this.fattoCompletati = false;
      this.aggiungiBool = false;
      this.fattoDafare = false;
    },

    incorso() {
      this.fattoIncorso = !this.fattoIncorso;
      this.fattoCompletati = false;
      this.fattoDafare = false;
      this.aggiungiBool = false;
      this.rimuoviBool = false;

    },
    completati() {
      this.fattoCompletati = !this.fattoCompletati;
      this.fattoIncorso = false;
      this.fattoDafare = false;
      this.aggiungiBool = false;
      this.rimuoviBool = false;
    },
    dafare() {
      this.fattoDafare = !this.fattoDafare;
      this.fattoIncorso = false;
      this.fattoCompletati = false;
      this.aggiungiBool = false;
      this.rimuoviBool = false;
    }
  }
}
</script>