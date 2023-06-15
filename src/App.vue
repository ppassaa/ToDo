<template>
  <!-- sezione di visualizzazione delle task -->
  <div class="popup-overlay" v-if="showTask">
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
            <button @click="rimuoviPuls()" class="modifica" :disabled="rimuoviBool">Rimuovi</button>
            <button v-if="modificaBool && !taskCompletaShow" @click="salvaPuls()" class="modifica">Salva</button>
            <button v-if="!modificaBool && !taskCompletaShow" @click="modificaPuls()" class="modifica" :disabled="rimuoviBool">Modifica</button>
          </div>
          <div>
            <button @click="notShowTaskPuls()" class="esciShowTsk" :disabled="rimuoviBool"></button>
          </div>
        </div>
        <!-- sezione nella quale si visualizzano le date -->
        <div class="dataShow">
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
  </div>
  <!-- sezione aggiungi task -->
  <div class="popup-overlay" v-if="aggiungiBool">
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
  </div>
  <!-- sezione informazioni -->
  <div v-if="showInfo" class="popup-overlay">
    <div class="informazioni" style="height: 80%; width: 70%; max-width: 500px;">
      <div style="display: flex; align-items: center; padding: 10px;">
          <div style="display: flex; justify-content: center; align-items: center; flex-grow: 1;">
            <h1 style="color:white;margin-right: -40px;">Informazioni</h1> 
          </div>
          <div style="margin-left: auto;margin-right: 10px;">
            <button @click="showInfo = !showInfo" style="max-height: 30px;max-width: 30px;" class="esciShowTsk"></button>
          </div>
      </div>
      <div style="color:white; padding: 10px;text-align: justify;overflow-y: auto; margin-bottom: 20px;">
        <ol>
          <li>
            <b>Aggiungere una task</b> <br>
            Per aggiungere una task premere il pulsante in alto a destra:
            <br><img style="width: 100%;max-width: 435px;" src="src\assets\img1.PNG"><br><br>
            Nel riquadro sinistro andrà inserita la nostra task e nel riquadro destro la data di scadenza. Sono entrambi dei campi obbligatori
            <br><img style="width: 100%;max-width: 435px;" src="src\assets\img2.PNG"><br><br>
            In questo caso, come task è stata inserita "task1" e come data di scadenza il 15/06/2023. Premere il pulsante aggiungi per aggiungere la task.            
            <br><img style="width: 100%;max-width: 435px;" src="src\assets\img3.PNG"><br><br>
            Dopo aver premuto il pulsante aggiungi la lista sarà così:
            <br><img style="width: 100%;max-width: 435px;" src="src\assets\img4.PNG"><br><br>
          </li>
          <li>
            <b>Visualizzare le informazioni di una task</b> <br>
            Per visualizzare le informazioni di una task basterà effettuare un doppio tocco sulla task desiderata, in questo caso task1. Nel riquadro sinistro è visualizzata la task, nel riquadro destro è visualizzata la data di creazione e la data di scadenza. Inoltre è possibile modificare la nota ed eliminarla.
            <br><img style="width: 100%;max-width: 435px;" src="src\assets\img5.PNG"><br><br>
          </li>
          <li>
            <b>Modificare una task</b> <br>
            Per modificare le informazioni di una task premere sul tasto modifica. E' possibile modificare il testo della task e la data di scadenza.
            <br><img style="width: 100%;max-width: 435px;" src="src\assets\img6.PNG"><br><br>
            In questo caso è stato aggiunto il testo "modificata" a "task1" e modificata la data inserendo 16/062023. Successivamente è stato premuto il pulsante Salva. 
            <br><img style="width: 100%;max-width: 435px;" src="src\assets\img7.PNG"><br><br>
            Dopo che è stato premuto Salva, le informazioni saranno cambiate.
            <br><img style="width: 100%;max-width: 435px;" src="src\assets\img8.PNG"><br><br>
          </li>
        </ol>
      </div>
    </div>
  </div>
  <div v-if="showGruppiWindow" class="popup-overlay">
    <div class="informazioni" style="height: 80%; width: 70%; max-width: 500px;">
      <button @click="creaGruppo">crea</button>
      <button @click="eliminaGruppo">elimina</button>
      <select name="" id="" v-model="currentGroup" @change="showGruppiWindow = !showGruppiWindow">
        <option v-for="g in gruppi" :value="g">{{ g }}</option>
      </select>
    </div>
  </div>
  <!-- allert di rimozione -->
  <div class="showRm" v-if="rimuoviBool">
        <!-- sezione sinistra(testo della task) -->
          <div class="allertRmText" style="margin-top:20px;padding-left: 20px;padding-right: 20px;font-size: 25px;border-bottom:3px solid #A1A1A1;">
            Conferma di rimozione della task
          </div>
        <!-- sezione destra(pulsanti X) -->
          <div class="showButton">
            <!-- sezione alta(pulsanti X) -->
            <div>
              <button class="allertRmRimuovi" @click="rimuoviTask()">Rimuovi</button>
              <button class="allertRmAnnulla" @click="rimuoviPuls()">Annulla</button>
            </div>
        </div>
      </div>
  <!-- contenitore di tutte le task e dei loro stati -->
    <div class="taskContainer">
      <!-- sezione DA FARE -->
      <div class="containerStati">
        <div class="contenitore">
          <div style="margin-right: auto; margin-left: 12.5px;">
            <button @click="showInfo = !showInfo" style="margin-top: 3px;" class="infoBtn"></button>
            <button @click="rimuoviPuls()" style="margin-top: 3px;" class="confermaBtn" v-if="showCheckbox"></button>
            <button @click="showCheckbox = !showCheckbox" style="margin-top: 3px; margin-left: 4px;" class="selectBtn" v-else></button>
          </div>
          <div style="width: 58%; text-align: left;">DA FARE</div>
        </div>
        <div class="containerTFS" @drop="onDrop($event, 'dafare')" @dragenter.prevent @dragover.prevent @auxclick.prevent="gruppiHandler">
          <ul>
            <!-- stampa delle task "DA FARE" -->
            <li draggable="true" v-for="t in dafareTasks" @dragstart="startDrag($event, t)" :class="{ rmStyle: incorsoBool || rimuoviBool, scaduto: !isNotScaduto(t), inscadenza: isScadenzaOggi(t) }">
              <div class="listaTask" @dblclick="showTaskPuls(t)">
                <p class="testoTask">{{ t.task }}</p>
                <div style="max-height:35px;display: flex; align-items: center;justify-content: space-between;">
                  <div style="flex-grow: 1;">
                    <input type="checkbox" style="margin-left: 10px;width: 20px;height: 20px;" v-model="t.selezionatoDel" :class="{zindexBasso : showCheckbox, zindexAlto : !showCheckbox}" v-if="showCheckbox" @change="salvaselezione()">
                  </div>
                  <div style="width: 70%;margin-right: 10px;text-align: right;">
                    <p style="margin-right: 4%;font-size: small; text-align: right; margin-top: 15px;">Scadenza: {{ t.dataScadenza }} <p style="margin-right: 1%;">{{ `${t.nome} ${t.cognome}` }}</p></p>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <!-- sezione IN CORSO --> 
      <div class="containerStatiCentrale">
        <div class="contenitoreincorso">IN CORSO</div>
        <div class="containerTFS" @drop="onDrop($event, 'incorso')" @dragenter.prevent @dragover.prevent>
          <ul>
            <!-- stampa delle task "IN CORSO" -->
            <li draggable="true" v-for="t in incorsoTasks" @dragstart="startDrag($event, t)" :class="{ rmStyle: completatiBool || dafareBool || rimuoviBool, scaduto: !isNotScaduto(t), inscadenza: isScadenzaOggi(t) }">
              <div class="listaTask" @dblclick="showTaskPuls(t)">
                <p class="testoTask" >{{ t.task }}</p>
                <div style="max-height:35px;display: flex; align-items: center;justify-content: space-between;">
                  <div style="flex-grow: 1;">
                    <input type="checkbox" style="margin-left: 10px;width: 20px;height: 20px;" v-model="t.selezionatoDel" v-if="showCheckbox" @change="salvaselezione()">
                  </div>
                  <div style="width: 100%; text-align: right;">
                    <p style="margin-right: 4%;font-size: small; margin-top: 15px;">Scadenza: {{ t.dataScadenza }} <p style="margin-right: 1%;">{{ `${t.nome} ${t.cognome}` }}</p></p>
                  </div>
                </div>
                <p style="margin-right: 4%;font-size: small; text-align: right"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <!-- sezione COMPLETATI -->
      <div class="containerStati">
        <div class="contenitore">
          <div style="width: 63%; text-align: right;">COMPLETATI</div>
          <div style="margin-left:auto;margin-right: 10px;">
            <!-- bottone per aggiungere una nota -->
            <button @click="taskUtente = !taskUtente" style="margin-top: 3px; margin-right: 4px;" class="togglePubblico" v-if="taskUtente"></button>
            <button @click="taskUtente = !taskUtente" style="margin-top: 3px; margin-right: 4px;" class="toggleUtente" v-else></button>
            <button @click="aggiungiPuls()" style="margin-top: 3px;" class="aggiungiBtn"></button>
          </div>
        </div>
        <div class="containerTFS" @drop="onDrop($event, 'completati')" @dragenter.prevent @dragover.prevent>
          <ul>
            <!-- stampa delle task "COMPLETATI" -->
            <li v-for="t in completatiTasks" class="taskStyle" :class="{ intempo: !isScadutoCompletati(t), scaduto: isScadutoCompletati(t) }">
              <div class="listaTask" @dblclick="showTaskPuls(t)">
                <p class="testoTask">{{ t.task }}</p>
                <div style="max-height:35px;display: flex; align-items: center;justify-content: space-between;">
                  <div style="flex-grow: 1;">
                    <input type="checkbox" style="margin-left: 10px;width: 20px;height: 20px;" v-model="t.selezionatoDel" v-if="showCheckbox" @change="salvaselezione()">
                  </div>
                  <div style="width: 70%;margin-right: 10px;text-align: right;">
                    <p style="margin-right: 4%;font-size: small; text-align: right; margin-top: 15px;">Scadenza: {{ t.dataScadenza }} <p style="margin-right: 1%;">{{ `${t.nome} ${t.cognome}` }}</p></p>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
</template>
<script>

import axios from 'axios';
import { toRaw } from 'vue';

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
      mostraBottone: false,
      showInfo: false,
      showCheckbox: false,
      taskSelezionate: [],
      operatoreId: sessionStorage.getItem("operatorID"),
      operatoreNome: sessionStorage.getItem("operatorName"),
      operatoreCognome: sessionStorage.getItem("operatorSurname"),
      taskUtente: false,
      currentGroup: 1,
      timer: setInterval(() => {
        this.readTasks();
      }, 2000),
      showGruppiWindow: false,
      gruppi: [],
    }
  },
  mounted(){
    sessionStorage.setItem("operatorID", 104);
    sessionStorage.setItem("operatorName", "Silvio");
    sessionStorage.setItem("operatorSurname", "Berlusconi");
    setTimeout(() => {
      let maxGroup = 1;
      console.log(maxGroup);
      console.log(this.tasks);
      this.tasks.forEach(element => {
        maxGroup = (element.gruppo > maxGroup) ? element.gruppo : maxGroup;
      });
      console.log(maxGroup);
      for (let index = 0; index < maxGroup; index++) {
        this.gruppi.push(index+1);
      }
      console.log(this.gruppi);
    }, 2000);
  },
  filters: {
    toDate: function (value) {
      return new Date(value);
    }
  },
  computed: {
    /* restituisce le task "DA FARE" */
    dafareTasks() {
      if(this.taskUtente) return this.tasks.filter((t) => (t.dafare && t.id == this.operatoreId && t.gruppo === this.currentGroup));
      else return this.tasks.filter((t) => (t.dafare && !t.privata && t.gruppo === this.currentGroup))
    },
    /* restituisce le task "IN CORSO" */
    incorsoTasks() {
      if(this.taskUtente) return this.tasks.filter((t) => (t.incorso && t.id == this.operatoreId && t.gruppo === this.currentGroup));
      else return this.tasks.filter((t) => (t.incorso && !t.privata && t.gruppo === this.currentGroup))
    },
    /* restituisce le task "COMPLETATI" */
    completatiTasks() {
      if(this.taskUtente) return this.tasks.filter((t) => (t.completati && t.id == this.operatoreId && t.gruppo === this.currentGroup));
      else return this.tasks.filter((t) => (t.completati && !t.privata && t.gruppo === this.currentGroup))
    },
    /* restituisce le task con l'ID dell'utente, sezione "Da fare" */

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
        "dataValue": JSON.stringify({ tasks: this.tasks, gruppi:this.gruppi })
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
          // console.log(JSON.stringify(response.data));
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
      this.showCheckbox = false;
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
        this.tasks.push({ task: this.taskText, dafare: true, incorso: false, completati: false, dataCreazione: this.todayStr, dataScadenza: this.scadenza, scaduta: false, selezionatoDel: false, nome: this.operatoreNome, cognome: this.operatoreCognome, id: this.operatoreId, privata: this.taskUtente, gruppo: this.currentGroup})
        this.taskText = '';
        this.scadenza = '';
        this.sortTasks();
        this.notShowTaskPuls();
        this.writeTasks();
      }
      this.writeTasks();
    },
    /* rimuove la task dall'array e aggiorna il DB */
    rimuoviTask() {
      if(this.showCheckbox){
        this.confermaSelezione();
        this.rimuoviBool = false;
      } else{
        this.tasks = this.tasks.filter((t) => JSON.stringify(t) !== JSON.stringify(this.oggetto));
        this.notShowTaskPuls();
        this.rimuoviBool = false;
        this.sortTasks();
        this.writeTasks();
      }
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
      this.showRimButton();
      this.notShowTaskPuls();
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
      this.showCheckbox = false;
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
      clearInterval(this.timer);
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
      this.timer = setInterval(() => {
        this.readTasks();
      }, 2000);
    },
    showRimButton() {
      this.mostraBottone = true;
    },
    attivaSelezione(){
      this.showCheckbox = true;
    },
    salvaselezione(){
      this.writeTasks();
    },
    confermaSelezione(){
      this.showCheckbox = !this.showCheckbox; 
      this.tasks = this.tasks.filter((t) => t.selezionatoDel == false)
      this.writeTasks()
    },
    gruppiHandler(){
      this.showGruppiWindow = !this.showGruppiWindow;
    },
    creaGruppo(){
      this.gruppi.push(this.gruppi.length+1)
    },
    eliminaGruppo(){
      let gruppo = this.currentGroup;
      this.gruppi = this.gruppi.filter(g => g !== this.currentGroup);
      this.currentGroup = gruppo!=1 ? gruppo-1 : gruppo+1;
    },
  }
}
</script>

<style>
    @import '../node_modules/@fontsource/roboto/index.css';
</style>