<template>
  <nav class="navbar navbar-expand-sm bg-dark navbar-dark">

    <a href="#close"><img width="30" height="30" src="src\assets\closeimg.PNG" alt="close"></a>
    <p style="color: white; margin-top: 15px; margin-left: 15px;">To-Do List</p>
    <div class="dropdown ml-auto">
      <button @click="tendina()" :style="{ backgroundImage: 'url(' + imageURL + ')' }" class="dropbtn"></button>
      <div v-if="tendinaShow" class="dropdown-content">

        <div class="group">
          <a v-if="aggiungiBool" class="aggiungiScd" href="#">
            <input class="taskInp" v-model="taskText" placeholder="Task"> <br>
            <button @click="aggiungiTask" class="aggiungiBtn">Aggiungi</button>
          </a>
          <a @click="aggiungiPuls()" class="bordoIntero" :class="{ riduci: !aggiungiBool }, { riduciAggiungi: aggiungiBool }"
            href="#">Aggiungi</a>

        </div>

        <a class="ml-auto bordoIntero" :class="{ riduciRimuovi: aggiungiBool }" @click="rimuoviPuls()" href="#">Rimuovi</a>

        <div class="group">
          <a v-if="fattoIncorso" class="fattoBtn fattoBtnPrim riduciBottone" href="#">Fatto</a>
          <a @click="incorsoPuls" class="bordoIntero" :class="{ riduci: !fattoIncorso }" href="#">Sposta in
            "In
            corso"</a>
        </div>
        <div class="group">
          <a v-if="fattoCompletati" class="fattoBtn riduciBottone" href="#">Fatto</a>
          <a @click="completatiPuls" class="bordoIntero" :class="{ riduci: !fattoCompletati }" href="#">Sposta
            in "Completati"</a>
        </div>
        <div class="group">
          <a v-if="fattoDafare" class="fattoBtn riduciBottone" href="#">Fatto</a>
          <a @click="dafarePuls" class="bordoIntero" :class="{ riduci: !fattoDafare }" href="#">Sposta in
            "Da
            fare"</a>
        </div>

      </div>
    </div>
  </nav>

  <div class="taskContainer">
    <div style="width: 250px;margin-top: 9px; text-align: center; height:679px;color: white;">
      DA FARE
      <hr>
      <div class="containerTFS">
        <ul>
          <li v-for="t in dafareTasks">
            {{ t.task }}
          </li>
        </ul>
      </div>
    </div>

    <div
      style="width: 250px;margin-top: 9px;border-left: 3px solid #424c57; border-right: 3px solid #424c57;text-align: center; height:679px;color: white;">
      IN CORSO
      <hr>
      <div class="containerTFS">
        <ul>
          <li v-for="t in incorsoTasks">
            {{ t.task }}
          </li>
        </ul>
      </div>
    </div>

    <div style="width: 250px;margin-top: 8.5px; text-align: center; height:679px;color: white;">
      COMPLETATI
      <hr>
      <div class="containerTFS">
        <ul>
          <li v-for="t in completatiTasks">
            {{ t.task }}
          </li>
        </ul>
      </div>
    </div>
  </div>


  <div class="taskContainer">
    <div style="margin-top: 10px; text-align: center; height:750;color: white;">
      DA FARE
      <hr>
      <div class="containerTFS">

      </div>
    </div>

    <div
      style=" margin-top: 9px;border-left: 3px solid #424c57; border-right: 3px solid #424c57;text-align: center; height:750px;color: white;">
      IN CORSO
      <hr>
      <div class="containerTFS">

      </div>
    </div>

    <div style="margin-top: 8.5px; text-align: center; height:750;color: white;">
      COMPLETATI
      <hr>
      <div class="containerTFS">

      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tasks: [{ task: "Cambiare i cuscinetti", dafare: true, incorso: false, completati: false }, { task: "Cambiare l'olio", dafare: true, incorso: false, completati: false }],
      tendinaShow: false,
      taskText: "",
      imageURL: "src/assets/pulsanteGIU.PNG",
      fattoIncorso: false,
      fattoCompletati: false,
      fattoDafare: false,
      aggiungiBool: false,
      rimuoviBool: false
    }
  },
  computed: {
    dafareTasks() {
      return this.tasks.filter((t) => t.dafare)
    },
    incorsoTasks() {
      return this.tasks.filter((t) => t.incorso)
    },
    completatiTasks() {
      return this.tasks.filter((t) => t.completati)
    }
  },
  created() {
    if (localStorage.getItem('tasks')) {
      this.tasks = JSON.parse(localStorage.getItem('tasks'));
    }
  },
  watch: {
    tasks: {
      handler(newTasks) {
        localStorage.setItem('tasks', JSON.stringify(newTasks));
      },
      deep: true
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

    incorsoPuls() {
      this.fattoIncorso = !this.fattoIncorso;
      this.fattoCompletati = false;
      this.fattoDafare = false;
      this.aggiungiBool = false;
      this.rimuoviBool = false;

    },
    completatiPuls() {
      this.fattoCompletati = !this.fattoCompletati;
      this.fattoIncorso = false;
      this.fattoDafare = false;
      this.aggiungiBool = false;
      this.rimuoviBool = false;
    },
    dafarePuls() {
      this.fattoDafare = !this.fattoDafare;
      this.fattoIncorso = false;
      this.fattoCompletati = false;
      this.aggiungiBool = false;
      this.rimuoviBool = false;
    },
    aggiungiTask() {
      if (this.taskText.length != 0) this.tasks.push({ task: this.taskText, dafare: true, incorso: false, completati: false })
      this.taskText = ''
    }
  }
}
</script>