<template>
  <div class="showTsk" v-if="showTask">
    <div class="sxShow">
      <div class="showTitle" :contenteditable=modificaBool @input="updateContent">
        {{ oggetto.task }}
      </div>
    </div>
    <div class="dxShow">
      <div class="showButton">
        <div v-if="!taskCompletaShow">
          <button v-if="modificaBool" @click="salvaPuls()" class="modifica">Salva</button>
          <button v-if="!modificaBool" @click="modificaPuls()" class="modifica">Modifica</button>
        </div>
        <div>
          <button @click="notShowTaskPuls()" class="esciShowTsk"></button>
        </div>
      </div>
      <div class="dataShow">
        <div>Data di creazione: <p>{{ taskDataCreazioneShow.substr(0, 10) }}</p>
        </div>
        <div>Data di scadenza:
          <p v-if="!modificaBool">{{ taskDataScadenzaShow.substr(0, 10) }}</p>
          <input v-if="modificaBool" style="margin-right: 4px;z-index:999" type="date" v-model="scadenza" :min="todayStr">
        </div>
        <div v-if="taskCompletaShow">Data di fine: <p>{{ taskDataFineShow.substr(0, 10) }}</p>
        </div>
      </div>
    </div>
  </div>

  <div v-if="!showTask" class="taskContainer">
    <div class="containerStati">
      <div style="height: 30.25px;margin-top: 6px;">DA FARE</div>
      <div class="containerTFS">
        <ul>
          <li v-for="t in dafareTasks"
            :class="{ rmStyle: incorsoBool || rimuoviBool, scaduto: !isNotScaduto(t), inscadenza: isScadenzaOggi(t) }">
            <div class="listaTask">
              <button @click="rimuoviTask(t)" v-if="rimuoviBool" class="rimuoviBtn riduciMargineSx"></button>
              <input class="checkbox riduciMargineSx" v-if="incorsoBool" type="checkbox" v-model="t.spostaincorso">
              <p class="testoTask" @click="showTaskPuls(t)">{{ t.task }}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="containerStatiCentrale">
      <div style="height: 30.25px;margin-top: 6px;">IN CORSO</div>
      <div class="containerTFS">
        <ul>
          <li v-for="t in incorsoTasks"
            :class="{ rmStyle: completatiBool || dafareBool || rimuoviBool, scaduto: !isNotScaduto(t), inscadenza: isScadenzaOggi(t) }">
            <div class="listaTask">
              <button @click="rimuoviTask(t)" v-if="rimuoviBool" class="rimuoviBtnZindex riduciMargineSx"></button>
              <input class="checkbox riduciMargineSx" v-if="completatiBool" type="checkbox" v-model="t.spostacompletati">
              <input class="checkbox riduciMargineSx" v-if="dafareBool" type="checkbox" v-model="t.spostadafare">
              <p class="testoTask" @click="showTaskPuls(t)">{{ t.task }}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <div class="containerStati">
      <div class="contenitore">
        <div style="width: 63%; text-align: right;">COMPLETATI</div>
        <div style="margin-left:auto;margin-right: 10px">
          <div class="dropdown float-right">
            <button @click="tendina()" :style="{ backgroundImage: 'url(' + imageURL + ')' }" class="dropbtn"></button>
            <div v-if="tendinaShow" class="dropdown-content">

              <div class="group">
                <a v-if="aggiungiBool" class="aggiungiScd" href="#">
                  <input class="taskInp" v-model="taskText" placeholder="Task"> <br>
                  <button @click="aggiungiTask" class="aggiungiBtn">Aggiungi</button> <br>
                  <p style="color: white; margin-bottom: -15px; margin-top: 10px;margin-right: 4px;">
                    Inserire la data di scadenza</p> <br>
                  <input style="margin-right: 4px;" type="date" v-model="scadenza" :min="todayStr">
                </a>
                <a @click="aggiungiPuls()" class="bordoIntero"
                  :class="{ riduci: !aggiungiBool }, { riduciAggiungi: aggiungiBool }, { sfondochiaro: !aggiungiBool }, { sfondoscuro: aggiungiBool }"
                  href="#">Aggiungi</a>

              </div>

              <a style="margin-left: -10px;" class="ml-auto bordoIntero"
                :class="{ riduciRimuovi: aggiungiBool }, { sfondochiaro: !rimuoviBool }, { sfondoscuro: rimuoviBool }"
                @click="rimuoviPuls()" href="#">
                <p class="margineSx">Rimuovi</p>
              </a>

              <div class="group">
                <a v-if="fattoIncorso" class="fattoBtn riduciBottone" @click="spostaincorsoFatto()">Fatto</a>
                <a @click="incorsoPuls" class="bordoIntero"
                  :class="{ riduci: !fattoIncorso }, { sfondochiaro: !fattoIncorso }, { sfondoscuro: fattoIncorso }"
                  href="#">Sposta in
                  "In corso"</a>
              </div>
              <div class="group">
                <a v-if="fattoCompletati" class="fattoBtn riduciBottone" @click="spostacompletatiFatto()"
                  href="#">Fatto</a>
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
        </div>
      </div>
      <div class="containerTFS">
        <ul>
          <li v-for="t in completatiTasks" class="taskCompletate" :class="{ intempo: !isScadutoCompletati(t), scaduto: isScadutoCompletati(t) }">
            <div class="listaTask">
              <button @click="rimuoviTask(t)" class="rimuoviBtn  riduciMargineSx"></button>
              <p class="testoTask" @click="showTaskPuls(t)">{{ t.task }}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
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
  filters: {
    toDate: function (value) {
      return new Date(value);
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
    },

  },
  beforeMount() {
    this.tasks = [];
    this.readTasks();
    console.log(this.tasks);
  },
  methods: {
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
      if (this.taskText.length != 0 && this.scadenza.length != 0 && this.isNotScadutoAdd(this.scadenza)) {
        this.tasks.push({ task: this.taskText, dafare: true, incorso: false, completati: false, spostaincorso: false, spostacompletati: false, spostadafare: false, dataCreazione: this.todayStr, dataScadenza: this.scadenza, scaduta: false })
        this.taskText = '';
        this.scadenza = '';
        this.writeTasks();
      }

    },
    rimuoviTask(e) {
      this.tasks = this.tasks.filter((t) => t !== e)
      this.writeTasks();
    },
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
    showTaskPuls(e) {
      this.showTask = true;
      this.oggetto = e;
      this.taskDataCreazioneShow = "" + e.dataCreazione;
      this.taskDataScadenzaShow = "" + e.dataScadenza;
      this.taskDataFineShow = "" + e.dataFine;
      this.taskTitleShow = "" + e.task;
      this.taskCompletaShow = e.completati
    },
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
    modificaPuls() {
      this.modificaBool = true;
    },
    updateContent(event) {
      this.newContent = event.target.innerHTML;
    },
    salvaPuls() {
      const oggDiTasks = this.tasks.find(e => JSON.stringify(e) === JSON.stringify(this.oggetto));
      let modificaScadenza = false;
      if(this.newContent!=0){
        oggDiTasks.task=this.newContent;
        this.newContent = "";
      }
      if(this.scadenza.length != 0 && this.isNotScadutoAdd(this.scadenza)){
        oggDiTasks.dataScadenza=this.scadenza;
        modificaScadenza=true;
      }
      if(this.scadenza==0 || modificaScadenza){
        this.scadenza = "";
        this.modificaBool=false;
        this.writeTasks();
      }
    },
    isScadenzaOggi(e) {
      let str = "" + e.dataScadenza;
      let oggi = new Date();
      let anno = oggi.getFullYear();
      let mese = (oggi.getMonth() + 1).toString().padStart(2, '0');
      let giorno = oggi.getDate().toString().padStart(2, '0');
      let dataYYYYMMDD = `${anno}-${mese}-${giorno}`;
      return str.slice(0, 10) === dataYYYYMMDD;
    },
    isNotScadutoAdd(e) {
      let str = "" + e;
      let oggi = new Date();
      let anno = oggi.getFullYear();
      let mese = (oggi.getMonth() + 1).toString().padStart(2, '0');
      let giorno = oggi.getDate().toString().padStart(2, '0');
      let dataYYYYMMDD = `${anno}-${mese}-${giorno}`;
      return new Date().getTime() <= new Date(str.slice(0, 10)).getTime() || str.slice(0, 10) === dataYYYYMMDD;
    },
    isNotScaduto(e) {
      let str = "" + e.dataScadenza;
      let oggi = new Date();
      let anno = oggi.getFullYear();
      let mese = (oggi.getMonth() + 1).toString().padStart(2, '0');
      let giorno = oggi.getDate().toString().padStart(2, '0');
      let dataYYYYMMDD = `${anno}-${mese}-${giorno}`;
      return new Date().getTime() <= new Date(str.slice(0, 10)).getTime() || str.slice(0, 10) === dataYYYYMMDD;
    },
    isScadutoCompletati(e) {
      let str = "" + e.dataScadenza;
      let str1 = "" + e.dataFine;
      return new Date(str1.slice(0, 10)).getTime() > new Date(str.slice(0, 10)).getTime();
    },
  }
}
</script>