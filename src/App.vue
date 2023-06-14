<template>
  <!-- sezione di visualizzazione delle task -->
  <div class="showTsk" v-if="showTask">
    <!-- sezione sinistra(testo della task) -->
    <div class="sxShow">
      <div class="showTitle">
        <textarea class="modificaTesto" style="color: white;" v-model="newContent" :readonly="!modificaBool">{{ newContent }}</textarea>
      </div>
    </div>
    <!-- sezione destra(pulsanti X e modifica e date) -->
    <div class="dxShow">
      <div class="showButton">
        <!-- sezione alta(pulsanti X e modifica) -->
        <div>
          <button @click="rimuoviPuls()" class="modifica">Rimuovi</button>
          <button v-if="modificaBool && !taskCompletaShow" @click="salvaPuls()" class="modifica">Salva</button>
          <button v-if="!modificaBool && !taskCompletaShow" @click="modificaPuls()" class="modifica">Modifica</button>
        </div>
        <div>
          <button @click="notShowTaskPuls()" class="esciShowTsk"></button>
        </div>
      </div>
      <!-- sezione nella quale si visualizzano le date -->
      <div class="dataShow">
        <div>
          aaaaaaaaaaaaaaaaaaaaaaaaa
        </div>
        <div style="margin-top: 5px;">Data di creazione: <p>{{ oggetto.dataCreazione }}</p>
        </div>
        <div :class="{riduciTop: oggetto.incorso}">Data di scadenza: 
          <p v-if="!modificaBool">{{ oggetto.dataScadenza }}</p>
          <input v-if="modificaBool" style="margin-right: 4px;z-index:999" type="date" v-model="scadenza" :min="todayStr">
        </div>
        <div v-if="taskCompletaShow">Data di fine: <p>{{ oggetto.dataFine }}</p>
        </div>
      </div>
    </div>
  </div>

  <div class="informazioni" v-if="showInfo">
    <div style="padding: 4px;">
      <h1 style="color:white">Informazioni d'uso</h1>
    </div>
    <div style="margin-top: 10px;">
      Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quam, aliquid fuga iste tempora consequuntur dolorem iure culpa aut distinctio natus rem repellat, nisi alias suscipit, laborum impedit magni earum ratione.
    </div>
  </div>
  
  <!-- sezione aggiungi task -->
    <form v-if="aggiungiBool">
      <div class="showTsk">
        <!-- sezione sinistra(testo della task) -->
        <div class="sxShow">
          <div class="showTitle">
            <textarea class="inserisciTesto" v-model="taskText" placeholder="Task" required>{{ taskText }}</textarea>
          </div>
        </div>
        <!-- sezione destra(pulsanti X e modifica e date) -->
        <div class="dxShow">
          <div class="showButton">
            <!-- sezione alta(pulsanti X e modifica) -->
            <div>
              <button @click="aggiungiTask()" class="modifica" type="submit">Aggiungi</button>
            </div>
            <div>
              <button @click="notShowTaskPuls()" class="esciShowTsk"></button>
            </div>
          </div>
          <!-- sezione nella quale si visualizzano le date -->
          <div class="dataShow" style="padding-top: 50px;">
            <div>Data di scadenza: 
              <input style="margin-right: 4px;z-index:999" type="date" v-model="scadenza" :min="todayStr" required>
            </div>
          </div>
        </div>
      </div>
    </form>

  <!-- allert di rimozione -->
  <div class="showRm" v-if="rimuoviBool">
        <!-- sezione sinistra(testo della task) -->
        <div style="width: 100%">
          <div class="showTitle" style="margin-top: 50px;font-size: 25px;">
            Conferma di <br> rimozione della <br> task
          </div>
        </div>
        <!-- sezione destra(pulsanti X) -->
        <div class="dxShow">
          <div class="showButton">
            <!-- sezione alta(pulsanti X) -->
            <div>
              <button @click="rimuoviPuls()" class="esciShowTsk"></button>
            </div>
          </div>
          <!-- sezione nella quale si visualizzano le date -->
          <div class="dataShow" style="padding-top: 50px;">
            <div>
              <button style="margin-top: 15px;width: 90px;height: 30px;z-index: 1001;background-color: #1B9DD9;" @click="rimuoviTask()">Rimuovi</button>
            </div>
          </div>
        </div>
      </div>

  <!-- contenitore di tutte le task e dei loro stati -->
    <div class="taskContainer">
      <!-- sezione DA FARE -->
      <div class="containerStati">
        <div style="display: flex; align-items: center;">
  <div style="margin-right: auto; margin-left: 10px;">
    <!-- button to add a note -->
    <button @click="showInfo = !showInfo" style="margin-top: 3px;" class="infoBtn"></button>
  </div>
  <div style="display: flex; justify-content: center; align-items: center; flex-grow: 1;">
    <span style="margin-right: 30px;">DA FARE</span>
  </div>
</div>
        <div class="containerTFS" @drop="onDrop($event, 'dafare')" @dragenter.prevent @dragover.prevent>
          <ul>
            <!-- stampa delle task "DA FARE" -->
            <li draggable="true" v-for="t in dafareTasks" @dragstart="startDrag($event, t)" :class="{ rmStyle: incorsoBool || rimuoviBool, scaduto: !isNotScaduto(t), inscadenza: isScadenzaOggi(t) }">
              <div class="listaTask" @dblclick="showTaskPuls(t)">
                <p class="testoTask">{{ t.task }}</p>
                <p style="margin-right: 4%;font-size: small; text-align: right">Scadenza: {{ t.dataScadenza }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <!-- sezione IN CORSO -->
      <div class="containerStatiCentrale">
        <div style="height: 30.25px;margin-top: 6px;">IN CORSO</div>
        <div class="containerTFS" @drop="onDrop($event, 'incorso')" @dragenter.prevent @dragover.prevent>
          <ul>
            <!-- stampa delle task "IN CORSO" -->
            <li draggable="true" v-for="t in incorsoTasks" @dragstart="startDrag($event, t)" :class="{ rmStyle: completatiBool || dafareBool || rimuoviBool, scaduto: !isNotScaduto(t), inscadenza: isScadenzaOggi(t) }">
              <div class="listaTask" @dblclick="showTaskPuls(t)">
                <p class="testoTask" >{{ t.task }}</p>
                <p style="margin-right: 4%;font-size: small; text-align: right">Scadenza: {{ t.dataScadenza }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <!-- sezione COMPLETATI -->
      <div class="containerStati">
        <div class="contenitore">
          <div style="width: 63%; text-align: right;">COMPLETATI</div>
          <div style="margin-left:auto;margin-right: 10px">
            <!-- bottone per aggiungere una nota -->
              <button @click="aggiungiPuls()" style="margin-top: 3px;" class="aggiungiBtn"></button>
          </div>
        </div>
        <div class="containerTFS" @drop="onDrop($event, 'completati')" @dragenter.prevent @dragover.prevent>
          <ul>
            <!-- stampa delle task "COMPLETATI" -->
            <li v-for="t in completatiTasks" class="taskStyle" :class="{ intempo: !isScadutoCompletati(t), scaduto: isScadutoCompletati(t) }">
              <div class="listaTask" @dblclick="showTaskPuls(t)">
                <p class="testoTask">{{ t.task }}</p>
                <p style="margin-right: 4%;font-size: small; text-align: right">Scadenza: {{ t.dataScadenza }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
</template>
<script>

import axios from 'axios';

export default {
  data() {
    return {
      tasks: [],
      tendinaShow: false,
      taskText: "",
      fattoIncorso: false,
      fattoCompletati: false,
      fattoDafare: false,
      aggiungiBool: false,
      rimuoviBool: false,
      incorsoBool: false,
      dafareBool: false,
      completatiBool: false,
      scadenzaStr: "",
      scadenza: "",
      showTask: false,
      taskTitleShow: "",
      taskDataCreazioneShow: "",
      taskDataScadenzaShow: "",
      taskDataFineShow: "",
      taskCompletaShow: false,
      modificaBool: false,
      todayStr: new Date().toISOString().split('T')[0],
      oggetto: '',
      newContent: "",
      oggettodragdrop:'',
      showInfo: false,
    }
  },
  filters: {
    toDate: function (value) {
      return new Date(value);
    }
  },
  computed: {
    /* restituisce le task "DA FARE" */
    dafareTasks() {
      return this.tasks.filter((t) => t.dafare)
    },
    /* restituisce le task "IN CORSO" */
    incorsoTasks() {
      return this.tasks.filter((t) => t.incorso)
    },
    /* restituisce le task "COMPLETATI" */
    completatiTasks() {
      return this.tasks.filter((t) => t.completati)
    },

  },
  beforeMount() {
    this.tasks = [];
    this.readTasks();
    this.sortTasks();
    console.log(this.tasks);
  },
  methods: {
    /* scrive nel DB */
    async writeTasks() {
      let data = JSON.stringify({
        "appCode": "ONOINT-0002",
        "dataName": "tasks",
        "dataValue": JSON.stringify({ tasks: this.tasks })
      });

      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://64.227.120.171:7576/grpc/SetONOAppData',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6LTEsImlzcyI6Im9ub1NlcnZlciIsInN1YiI6InNvbWVvbmUiLCJleHAiOjE2ODYzMDQwMDksIm5iZiI6MTY4NjIxOTQwOSwiaWF0IjoxNjg2MjE3NjA5LCJqdGkiOiJvbm8tc2VydmVyIn0.VtfbfToSXSekUVEKtViannwS2O4MUdkLKlQsqpuOnUY'
        },
        data: data
      };

      axios.request(config)
        .then((response) => {
          console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
          console.log(error);
        });
    },
    /* legge il DB */
    async readTasks() {
      let data = JSON.stringify({
        "appCode": "ONOINT-0002",
        "dataName": "tasks"
      });

      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://64.227.120.171:7576/grpc/GetONOAppDataFromCode',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6LTEsImlzcyI6Im9ub1NlcnZlciIsInN1YiI6InNvbWVvbmUiLCJleHAiOjE2ODYzMDQwMDksIm5iZiI6MTY4NjIxOTQwOSwiaWF0IjoxNjg2MjE3NjA5LCJqdGkiOiJvbm8tc2VydmVyIn0.VtfbfToSXSekUVEKtViannwS2O4MUdkLKlQsqpuOnUY'
        },
        data: data
      };
      let risposta = await axios.request(config);
      this.tasks = JSON.parse(risposta.data.data.data).tasks;
    },
    /* azione di quando si clicca il pulsante Aggiungi, apre la sezione Aggiungi */
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
    /* azione di quando si clicca il pulsante Rimuovi */
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
    /* aggiunge la task all'array e aggiorna il DB  */
    aggiungiTask() {
      if (this.taskText.length != 0 && this.scadenza.length != 0 && this.isNotScadutoAdd(this.scadenza)) {
        this.tasks.push({ task: this.taskText, dafare: true, incorso: false, completati: false, dataCreazione: this.todayStr, dataScadenza: this.scadenza, scaduta: false })
        this.taskText = '';
        this.scadenza = '';
        this.sortTasks();
        this.notShowTaskPuls();
        this.writeTasks();
      }
    },
    /* rimuove la task dall'array e aggiorna il DB */
    rimuoviTask() {
      this.tasks = this.tasks.filter((t) => t !== this.oggetto)
      this.notShowTaskPuls();
      this.rimuoviBool = false;
      this.sortTasks();
      this.writeTasks();
    },
    /* sposta nella sezione "IN CORSO" tutte le task presenti nella sezione "DA FARE" con la checkbox spuntata e aggiorna il DB */
    spostaincorsoFatto() {
      const temp = this.tasks.find(e => JSON.stringify(e) === JSON.stringify(this.oggetto));
      temp.dafare=false;
      temp.incorso=true;
      this.notShowTaskPuls();
      this.sortTasks();
      this.writeTasks();
    },
    /* sposta nella sezione "COMPLETATI" tutte le task presenti nella sezione "IN CORSO" con la checkbox spuntata e aggiorna il DB */
    spostacompletatiFatto() {
      const temp = this.tasks.find(e => JSON.stringify(e) === JSON.stringify(this.oggetto));
      temp.incorso=false;
      temp.completati=true;
      let oggi = new Date();
      let anno = oggi.getFullYear();
      let mese = (oggi.getMonth() + 1).toString().padStart(2, '0');
      let giorno = oggi.getDate().toString().padStart(2, '0');
      let dataYYYYMMDD = `${anno}-${mese}-${giorno}`;
      temp.dataFine = dataYYYYMMDD;
      this.notShowTaskPuls()
      this.sortTasks();
      this.writeTasks();
    },
    /* sposta nella sezione "DA FARE" tutte le task presenti nella sezione "IN CORSO" con la checkbox spuntata e aggiorna il DB */
    spostadafareFatto() {
      const temp = this.tasks.find(e => JSON.stringify(e) === JSON.stringify(this.oggetto));
      temp.incorso=false;
      temp.dafare=true;
      this.notShowTaskPuls()
      this.sortTasks();
      this.writeTasks();
    },
    /* mostra la sezione che contiene le informazioni della task cliccata */
    showTaskPuls(e) {
      this.showTask = true;
      this.oggetto = e;
      this.taskDataCreazioneShow = "" + e.dataCreazione;
      this.taskDataScadenzaShow = "" + e.dataScadenza;
      this.taskDataFineShow = "" + e.dataFine;
      this.taskTitleShow = "" + e.task;
      this.newContent = "" + e.task;
      this.taskCompletaShow = e.completati;

    },
    /* chiude la sezione che contiene le informazioni della task cliccata */
    notShowTaskPuls() {
      this.showTask = false;
      this.modificaBool = false;
      this.aggiungiBool = false;
      this.oggetto = '';
      this.newContent = ""
      this.taskDataCreazioneShow = "";
      this.taskDataScadenzaShow = "";
      this.taskDataFineShow = "";
      this.taskTitleShow = "";
    },
    /* attiva la modifica della relativa task */
    modificaPuls() {
      this.modificaBool = true;
    },
    /* salva le modifiche effettuate alla task */
    salvaPuls() {
      console.log(this.newContent);
      const oggDiTasks = this.tasks.find(e => JSON.stringify(e) === JSON.stringify(this.oggetto));
      let modificaScadenza = false;
      if(this.newContent!=0){
        oggDiTasks.task=this.newContent;
      }
      if(this.scadenza.length != 0 && this.isNotScadutoAdd(this.scadenza)){
        oggDiTasks.dataScadenza=this.scadenza;
        this.oggetto.dataScadenza=this.scadenza;
        modificaScadenza=true;
        this.sortTasks();
        this.writeTasks();
      }
      if(this.scadenza==0 || modificaScadenza){
        this.scadenza = "";
        this.modificaBool=false;
        this.sortTasks();
        this.writeTasks();
      }
    },
    /* controlla se la task scade oggi */
    isScadenzaOggi(e) {
      let str = "" + e.dataScadenza;
      let oggi = new Date();
      let anno = oggi.getFullYear();
      let mese = (oggi.getMonth() + 1).toString().padStart(2, '0');
      let giorno = oggi.getDate().toString().padStart(2, '0');
      let dataYYYYMMDD = `${anno}-${mese}-${giorno}`;
      return str.slice(0, 10) === dataYYYYMMDD;
    },
    /* controlla se la task non è scaduta(come parametro una stringa) */
    isNotScadutoAdd(e) {
      let str = "" + e;
      let oggi = new Date();
      let anno = oggi.getFullYear();
      let mese = (oggi.getMonth() + 1).toString().padStart(2, '0');
      let giorno = oggi.getDate().toString().padStart(2, '0');
      let dataYYYYMMDD = `${anno}-${mese}-${giorno}`;
      return new Date().getTime() <= new Date(str.slice(0, 10)).getTime() || str.slice(0, 10) === dataYYYYMMDD;
    },
    /* controlla se la task non è scaduta(come parametro un oggetto) */
    isNotScaduto(e) {
      let str = "" + e.dataScadenza;
      let oggi = new Date();
      let anno = oggi.getFullYear();
      let mese = (oggi.getMonth() + 1).toString().padStart(2, '0');
      let giorno = oggi.getDate().toString().padStart(2, '0');
      let dataYYYYMMDD = `${anno}-${mese}-${giorno}`;
      return new Date().getTime() <= new Date(str.slice(0, 10)).getTime() || str.slice(0, 10) === dataYYYYMMDD;
    },
    /* controlla se le task sono state completate in tempo */
    isScadutoCompletati(e) {
      if(typeof e.dataFine=='undefined'){
        return true;
      }
      let str = "" + e.dataScadenza;
      let str1 = "" + e.dataFine;
      return new Date(str1.slice(0, 10)).getTime() > new Date(str.slice(0, 10)).getTime();
    },
    sortTasks() {
      this.tasks.sort((a, b) => {
        return new Date(a.dataScadenza) - new Date(b.dataScadenza);
      });
    },
    startDrag (event, task) {
      console.log(task)
      event.dataTransfer.dropEffect = 'move'
      event.dataTransfer.effectAllowed = 'move'
      this.oggettodragdrop=task;
    },
    onDrop (event, dest) {
      console.log(this.oggettodragdrop)
      const task = this.tasks.find(e => JSON.stringify(e) === JSON.stringify(this.oggettodragdrop));
      if(this.oggettodragdrop.dafare == true && dest === "incorso"){
        task.incorso = true
        task.dafare = false
        this.sortTasks();
        this.writeTasks();
      }
      if(this.oggettodragdrop.incorso == true && dest === "completati"){
        let oggi = new Date();
        let anno = oggi.getFullYear();
        let mese = (oggi.getMonth() + 1).toString().padStart(2, '0');
        let giorno = oggi.getDate().toString().padStart(2, '0');
        let dataYYYYMMDD = `${anno}-${mese}-${giorno}`;
        task.dataFine = dataYYYYMMDD;
        task.completati = true
        task.incorso = false
        this.sortTasks();
        this.writeTasks();
      }
      if(this.oggettodragdrop.incorso == true && dest === "dafare"){
        task.incorso = false
        task.dafare = true
        this.sortTasks();
        this.writeTasks();
      }
    }
  }
}
</script>

<style>
    @import '../node_modules/@fontsource/roboto/index.css';
</style>