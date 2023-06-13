<!--CIAOCIAOCIAOasdasd-->
<template>
  <!-- sezione di visualizzazione delle task -->
  <div class="showTsk" v-if="showTask">
    <!-- sezione sinistra(testo della task) -->
    <div class="sxShow">
      <div class="showTitle">
        <textarea class="modificaTesto" :class="{intempo: !isScadutoCompletati(oggetto) && (oggetto.dataFine !== 'undefined'), NotScaduto: isNotScaduto(oggetto), scaduto: !isNotScaduto(oggetto), inscadenza: isScadenzaOggi(oggetto)}" v-model="newContent" :readonly="!modificaBool">{{ newContent }}</textarea>
      </div>
    </div>
    <!-- sezione destra(pulsanti X e modifica e date) -->
    <div class="dxShow">
      <div class="showButton">
        <!-- sezione alta(pulsanti X e modifica) -->
        <div v-if="!taskCompletaShow">
          <button @click="" class="modifica">Rimuovi</button>
          <button v-if="modificaBool" @click="salvaPuls()" class="modifica">Salva</button>
          <button v-if="!modificaBool" @click="modificaPuls()" class="modifica">Modifica</button>
        </div>
        <div>
          <button @click="notShowTaskPuls()" class="esciShowTsk"></button>
        </div>
      </div>
      <!-- sezione nella quale si visualizzano le date -->
      <div class="dataShow">
        <div>
          <button class="spostainBtn">Sposta in "IN CORSO"</button>
        </div>
        <div>Data di creazione: <p>{{ oggetto.dataCreazione }}</p>
        </div>
        <div>Data di scadenza: 
          <p v-if="!modificaBool">{{ oggetto.dataScadenza }}</p>
          <input v-if="modificaBool" style="margin-right: 4px;z-index:999" type="date" v-model="scadenza" :min="todayStr">
        </div>
        <div v-if="taskCompletaShow">Data di fine: <p>{{ oggetto.dataFine }}</p>
        </div>
      </div>
    </div>
  </div>
  <!-- contenitore di tutte le task e dei loro stati -->
  <div v-if="!showTask" class="taskContainer">
    <!-- sezione DA FARE -->
    <div class="containerStati">
      <div style="height: 30.25px;margin-top: 6px;">DA FARE</div>
      <div class="containerTFS">
        <Board id="board-1" style="height: 97%;">
            <!-- stampa delle task "DA FARE" -->
            <li v-for="(t, index) in dafareTasks" :class="{ rmStyle: incorsoBool || rimuoviBool, scaduto: !isNotScaduto(t), inscadenza: isScadenzaOggi(t) }">
              <Card :id="`card-${index}`" :draggable="true">
                <div class="listaTask" @drop.prevent @dragover.prevent>
                  <button @click="rimuoviTask(t)" v-if="rimuoviBool" class="rimuoviBtn riduciMargineSx"></button>
                  <input class="checkbox riduciMargineSx" v-if="incorsoBool" type="checkbox" v-model="t.spostaincorso">
                  <p class="testoTask" @dblclick="showTaskPuls(t)">{{ t.task }}</p>
                  <p style="margin-left: 20px;">Scadenza: {{ t.dataScadenza }}</p>
                </div>
              </Card>
            </li>
        </Board>
      </div>
    </div>
    <!-- sezione IN CORSO -->
    <div class="containerStatiCentrale">
      <div style="height: 30.25px;margin-top: 6px;">IN CORSO</div>
      <div class="containerTFS">
        <Board id="board-2" style="height: 97%;">
            <!-- stampa delle task "IN CORSO" -->
            <li v-for="(t, index) in incorsoTasks" :class="{ rmStyle: completatiBool || dafareBool || rimuoviBool, scaduto: !isNotScaduto(t), inscadenza: isScadenzaOggi(t) }">
              <Card :id="`card-${index}`" :draggable="true">
                <div class="listaTask" @click="showTaskPuls(t)">
                  <button @click="rimuoviTask(t)" v-if="rimuoviBool" class="rimuoviBtnZindex riduciMargineSx"></button>
                  <input class="checkbox riduciMargineSx" v-if="completatiBool" type="checkbox" v-model="t.spostacompletati">
                  <input class="checkbox riduciMargineSx" v-if="dafareBool" type="checkbox" v-model="t.spostadafare">
                  <p class="testoTask" >{{ t.task }}</p>
                  <label @dblclick="showTaskPuls(t)">Scadenza: {{ t.dataScadenza }}</label>
                </div>
              </Card>
            </li>
        </Board>
      </div>
    </div>
    <!-- sezione COMPLETATI -->
    <div class="containerStati">
      <div class="contenitore">
        <div style="width: 63%; text-align: right;">COMPLETATI</div>
        <div style="margin-left:auto;margin-right: 10px">
          <!-- tendina delle funzioni -->
          <div class="dropdown float-right">
            <button @click="tendina()" :style="{ backgroundImage: 'url(' + imageURL + ')' }" class="dropbtn"></button>
            <div v-if="tendinaShow" class="dropdown-content">
              <div class="group">
                <!-- sezione Aggiungi -->
                <a v-if="aggiungiBool" class="aggiungiScd" href="#">
                  <form>
                    <input class="taskInp" v-model="taskText" placeholder="Task" required> <br>
                    <p style="color: white; margin-bottom: -15px; margin-top: 10px;margin-right: 4px;">Inserire la data di scadenza</p> <br>
                    <input style="margin-right: 4px;" type="date" v-model="scadenza" :min="todayStr" required>
                    <button @click="aggiungiTask" class="aggiungiBtn" type="submit">Aggiungi</button> <br>
                  </form>
                </a>
                <!-- pulsante Aggiungi -->
                <a @click="aggiungiPuls()" class="bordoIntero" :class="{ riduci: !aggiungiBool }, { riduciAggiungi: aggiungiBool }, { sfondochiaro: !aggiungiBool }, { sfondoscuro: aggiungiBool }" href="#">Aggiungi</a>
              </div>
              <!-- pulsante Rimuovi -->
              <a style="margin-left: -10px;" class="ml-auto bordoIntero" :class="{ riduciRimuovi: aggiungiBool }, { sfondochiaro: !rimuoviBool }, { sfondoscuro: rimuoviBool }" @click="rimuoviPuls()" href="#">
                <p class="margineSx">Rimuovi</p>
              </a>
              <div class="group">
                <!-- pulsante Fatto affiancato al pulsante Sposta in "In corso" -->
                <a v-if="fattoIncorso" class="fattoBtn riduciBottone" @click="spostaincorsoFatto()">Fatto</a>
                <!-- pulsante Sposta in "In corso" -->
                <a @click="incorsoPuls" class="bordoIntero" :class="{ riduci: !fattoIncorso }, { sfondochiaro: !fattoIncorso }, { sfondoscuro: fattoIncorso }" href="#">Sposta in "In corso"</a>
              </div>
              <div class="group">
                <!-- pulsante Fatto affiancato al pulsante Sposta in "Completati" -->
                <a v-if="fattoCompletati" class="fattoBtn riduciBottone" @click="spostacompletatiFatto()" href="#">Fatto</a>
                <!-- pulsante Sposta in "Completati" -->
                <a @click="completatiPuls" class="bordoIntero" :class="{ riduci: !fattoCompletati }, { sfondochiaro: !fattoCompletati }, { sfondoscuro: fattoCompletati }" href="#">Sposta in "Completati"</a>
              </div>
              <div class="group">
                <!-- pulsante Fatto affiancato al pulsante Sposta in "Da fare" -->
                <a v-if="fattoDafare" class="fattoBtn riduciBottone" @click="spostadafareFatto()" href="#">Fatto</a>
                <!-- Sposta in "Da fare" -->
                <a @click="dafarePuls" class="bordoIntero" :class="{ riduci: !fattoDafare }, { sfondochiaro: !fattoDafare }, { sfondoscuro: fattoDafare }" href="#">Sposta in "Da fare"</a>
              </div>
            </div>
          </div>
          <!-- fine della tendina -->
        </div>
      </div>
      <div class="containerTFS">
        <Board id="board-3" style="height: 97%;">
            <!-- stampa delle task "COMPLETATI" -->
            <li v-for="(t, index) in completatiTasks" class="taskStyle taskCompletate" :class="{ intempo: !isScadutoCompletati(t), scaduto: isScadutoCompletati(t) }">
              <Card :id="`card-${index}`" :draggable="true" >  
                <div class="listaTask">
                  <button @click="rimuoviTask(t)" class="rimuoviBtn  riduciMargineSx"></button>
                  <p class="testoTask" @dblclick="showTaskPuls(t)">{{ t.task }}</p>
                </div>
              </Card>
            </li>
        </Board>
      </div>
    </div>
  </div>
</template>
<script>

import axios from 'axios'
import Board from "./components/Board.vue"
import Card from "./components/Card.vue"
export default {
  data() {
    return {
      tasks: [],
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
    }
  },
  components: {
    Board,
    Card
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
    /* mostra la tendina */
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
    /* azione di quando si clicca il pulsante Sposta in "In corso" */
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
    /* azione di quando si clicca il pulsante Sposta in "Completati" */
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
    /* azione di quando si clicca il pulsante Sposta in "Da fare" */
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
    /* aggiunge la task all'array e aggiorna il DB  */
    aggiungiTask() {
      if (this.taskText.length != 0 && this.scadenza.length != 0 && this.isNotScadutoAdd(this.scadenza)) {
        this.tasks.push({ task: this.taskText, dafare: true, incorso: false, completati: false, spostaincorso: false, spostacompletati: false, spostadafare: false, dataCreazione: this.todayStr, dataScadenza: this.scadenza, scaduta: false })
        this.taskText = '';
        this.scadenza = '';
        this.writeTasks();
      }
    },
    /* rimuove la task dall'array e aggiorna il DB */
    rimuoviTask(e) {
      this.tasks = this.tasks.filter((t) => t !== e)
      this.writeTasks();
    },
    /* sposta nella sezione "IN CORSO" tutte le task presenti nella sezione "DA FARE" con la checkbox spuntata e aggiorna il DB */
    spostaincorsoFatto() {
      for (const t in this.tasks) {
        if (this.tasks.hasOwnProperty(t) && this.tasks[t].spostaincorso === true) {
          this.tasks[t].spostaincorso = false;
          this.tasks[t].dafare = false;
          this.tasks[t].incorso = true;
        }
      }
      this.writeTasks();
    },
    /* sposta nella sezione "COMPLETATI" tutte le task presenti nella sezione "IN CORSO" con la checkbox spuntata e aggiorna il DB */
    spostacompletatiFatto() {
      for (const t in this.tasks) {
        if (this.tasks.hasOwnProperty(t) && this.tasks[t].spostacompletati === true) {
          this.tasks[t].spostacompletati = false;
          this.tasks[t].incorso = false;
          this.tasks[t].completati = true;
          let oggi = new Date();
          let anno = oggi.getFullYear();
          let mese = (oggi.getMonth() + 1).toString().padStart(2, '0');
          let giorno = oggi.getDate().toString().padStart(2, '0');
          let dataYYYYMMDD = `${anno}-${mese}-${giorno}`;
          this.tasks[t].dataFine = dataYYYYMMDD;
        }
      }
      this.writeTasks();
    },
    /* sposta nella sezione "DA FARE" tutte le task presenti nella sezione "IN CORSO" con la checkbox spuntata e aggiorna il DB */
    spostadafareFatto() {
      for (const t in this.tasks) {
        console.log(t.task);
        if (this.tasks.hasOwnProperty(t) && this.tasks[t].spostadafare === true) {
          this.tasks[t].incorso = false;
          this.tasks[t].spostadafare = false;
          this.tasks[t].dafare = true;
        }
      }
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
      console.log(this.isScadenzaOggi(this.oggetto));
      console.log(this.isNotScaduto(this.oggetto));
      console.log(this.isScadutoCompletati(this.oggetto));

    },
    /* chiude la sezione che contiene le informazioni della task cliccata */
    notShowTaskPuls() {
      this.showTask = false;
      this.modificaBool = false;
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
    /* salva il testo della task in cambiamento */
    updateContent(event) {
      console.log(this.newContent);
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
        this.writeTasks();
      }
      if(this.scadenza==0 || modificaScadenza){
        this.scadenza = "";
        this.modificaBool=false;
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
  }
}
</script>