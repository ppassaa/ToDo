<template>
  <div class="dropdown float-right">
  <button @click="tendina()" :style="{ backgroundImage: 'url(' + imageURL + ')' }" class="dropbtn"></button>
  <div v-if="tendinaShow" class="dropdown-content">

    <div class="group">
      <a v-if="aggiungiBool" class="aggiungiScd" href="#">
        <input class="taskInp" v-model="taskText" placeholder="Task"> <br>
        <button @click="aggiungiTask" class="aggiungiBtn">Aggiungi</button>
      </a>
      <a @click="aggiungiPuls()" class="bordoIntero"
        :class="{ riduci: !aggiungiBool }, { riduciAggiungi: aggiungiBool }, { sfondochiaro: !aggiungiBool }, { sfondoscuro: aggiungiBool }"
        href="#">Aggiungi</a>

    </div>

    <a class="ml-auto bordoIntero"
      :class="{ riduciRimuovi: aggiungiBool }, { sfondochiaro: !rimuoviBool }, { sfondoscuro: rimuoviBool }"
      @click="rimuoviPuls()" href="#">Rimuovi</a>

    <div class="group">
      <a v-if="fattoIncorso" class="fattoBtn riduciBottone" @click="spostaincorsoFatto()">Fatto</a>
      <a @click="incorsoPuls" class="bordoIntero"
        :class="{ riduci: !fattoIncorso }, { sfondochiaro: !fattoIncorso }, { sfondoscuro: fattoIncorso }"
        href="#">Sposta in
        "In corso"</a>
    </div>
    <div class="group">
      <a v-if="fattoCompletati" class="fattoBtn riduciBottone" @click="spostacompletatiFatto()" href="#">Fatto</a>
      <a @click="completatiPuls" class="bordoIntero"
        :class="{ riduci: !fattoCompletati }, { sfondochiaro: !fattoCompletati }, { sfondoscuro: fattoCompletati }"
        href="#">Sposta in "Completati"</a>
    </div>
    <div class="group">
      <a v-if="fattoDafare" class="fattoBtn riduciBottone" @click="spostadafareFatto()" href="#">Fatto</a>
      <a @click="dafarePuls" class="bordoIntero"
        :class="{ riduci: !fattoDafare }, { sfondochiaro: !fattoDafare }, { sfondoscuro: fattoDafare }"
        href="#">Sposta in "Da
        fare"</a>
    </div>
  </div>
</div>

  <div class="taskContainer">
    <div style="width: 250px;margin-top: 9px; text-align: center; height:750px;color: white;">
      DA FARE
      <hr>
      <div class="containerTFS">
        <ul>
          <li v-for="t in dafareTasks" :class="{ rmStyle: incorsoBool }">
            <input class="checkbox" v-if="incorsoBool" type="checkbox" v-model="t.spostaincorso"> {{ t.task }} <button
              @click="rimuoviTask(t)" v-if="rimuoviBool" class="rimuoviBtn"></button>
          </li>
        </ul>
      </div>
    </div>

    <div
      style="width: 250px;margin-top: 9px;border-left: 3px solid #424c57; border-right: 3px solid #424c57;text-align: center; height:750px;color: white;">
      IN CORSO
      <hr>
      <div class="containerTFS">
        <ul>
          <li v-for="t in incorsoTasks" :class="{ rmStyle: completatiBool || dafareBool }">
            <input class="checkbox" v-if="completatiBool" type="checkbox" v-model="t.spostacompletati"> <input
              class="checkbox" v-if="dafareBool" type="checkbox" v-model="t.spostadafare"> {{ t.task }}
            <button @click="rimuoviTask(t)" v-if="rimuoviBool" class="rimuoviBtnIncorso"></button>
          </li>
        </ul>
      </div>
    </div>

    <div style="width: 250px;margin-top: 8.5px; text-align: center; height:750px;color: white;">
      COMPLETATI
      <hr>
      <div class="containerTFS">
        <ul>
          <li v-for="t in completatiTasks">
            {{ t.task }} <button @click="rimuoviTask(t)" class="rimuoviBtn"></button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tasks: [{ task: "Cambiare i cuscinetti", dafare: true, incorso: false, completati: false, spostaincorso: false, spostacompletati: false, spostadafare: false }, { task: "Cambiare l'olio", dafare: true, incorso: false, completati: false, spostaincorso: false, spostacompletati: false, spostadafare: false }],
      tendinaShow: false,
      taskText: "",
      imageURL: "src/assets/pulsanteGIU.PNG",
      fattoIncorso: false,
      fattoCompletati: false,
      fattoDafare: false,
      aggiungiBool: false,
      rimuoviBool: false,
      incorsoBool: false,
      dafareBool: false,
      completatiBool: false,
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
      this.incorsoBool = false;
      this.dafareBool = false;
      this.completatiBool = false;

    },
    aggiungiPuls() {
      this.aggiungiBool = !this.aggiungiBool;
      this.fattoIncorso = false;
      this.fattoCompletati = false;
      this.fattoDafare = false;
      this.rimuoviBool = false;
      this.incorsoBool = false;
      this.dafareBool = false;
      this.completatiBool = false;

    },
    rimuoviPuls() {
      this.rimuoviBool = !this.rimuoviBool;
      this.fattoIncorso = false;
      this.fattoCompletati = false;
      this.aggiungiBool = false;
      this.fattoDafare = false;
      this.incorsoBool = false;
      this.dafareBool = false;
      this.completatiBool = false;
    },

    incorsoPuls() {
      this.fattoIncorso = !this.fattoIncorso;
      this.incorsoBool = !this.incorsoBool;
      this.fattoCompletati = false;
      this.fattoDafare = false;
      this.aggiungiBool = false;
      this.rimuoviBool = false;
      this.completatiBool = false;
      this.dafareBool = false;


    },
    completatiPuls() {
      this.fattoCompletati = !this.fattoCompletati;
      this.completatiBool = !this.completatiBool;
      this.fattoIncorso = false;
      this.incorsoBool = false;
      this.fattoDafare = false;
      this.aggiungiBool = false;
      this.rimuoviBool = false;
      this.dafareBool = false;
    },
    dafarePuls() {
      this.fattoDafare = !this.fattoDafare;
      this.dafareBool = !this.dafareBool;
      this.fattoIncorso = false;
      this.incorsoBool = false;
      this.fattoCompletati = false;
      this.aggiungiBool = false;
      this.rimuoviBool = false;
      this.completatiBool = false;

    },
    aggiungiTask() {
      if (this.taskText.length != 0) this.tasks.push({ task: this.taskText, dafare: true, incorso: false, completati: false, spostaincorso: false, spostacompletati: false, spostadafare: false })
      this.taskText = ''
    },
    rimuoviTask(e) {
      this.tasks = this.tasks.filter((t) => t !== e)
    },
    spostaincorsoFatto() {
      for (const t in this.tasks) {
        if (this.tasks.hasOwnProperty(t) && this.tasks[t].spostaincorso === true) {
          this.tasks[t].spostaincorso = false;
          this.tasks[t].dafare = false;
          this.tasks[t].incorso = true;
        }
      }
      this.tendina();
    },
    spostacompletatiFatto() {
      for (const t in this.tasks) {
        if (this.tasks.hasOwnProperty(t) && this.tasks[t].spostacompletati === true) {
          this.tasks[t].spostacompletati = false;
          this.tasks[t].incorso = false;
          this.tasks[t].completati = true;
        }
      }
      this.tendina();
    },
    spostadafareFatto() {
      for (const t in this.tasks) {
        if (this.tasks.hasOwnProperty(t) && this.tasks[t].spostadafare === true) {
          this.tasks[t].incorso = false;
          this.tasks[t].spostadafare = false;
          this.tasks[t].dafare = true;
        }
      }
      this.tendina();
    }
  }
}
</script>