<!-- yuhu -->
<template>
  <!-- contenitore di tutte le task e dei loro stati -->
  <div class="" style="color: white;display: flex;width: 100%; height: 6.5%; min-height: 30px;padding: 10px">
    <div class="dropdown" :class="{dropdownhover: clickTendina}" @mouseleave="clickTendina=false;cambiaFreccia()">
        <div style="display: flex; height: 100%; padding: 2px;" @click="clickTendina=!clickTendina;cambiaFreccia()">
          <div style="height: 100%;overflow-y: auto;">
            {{ gruppi.find(g => g.id == currentGroup) == undefined ? "Caricando..." : gruppi.find(g => g.id == currentGroup).nome}}
          </div>
          <div id="freccia" style="color:white; margin-left: auto;">{{ freccia }}</div>
        </div>
      <div class="dropdownContent" :class="{dropdownContentVisibile: clickTendina}">
        <button style="text-align: left;" v-for="g in myGruppi" @click="clickTendina = false;cambiaFreccia();currentGroup = g.id; createCalendar();">{{ g.nome }}</button>
        <button style="text-align: left;" @click="showGruppiWindow = true;clickTendina = false;cambiaFreccia()">Gestisci gruppi</button>
      </div>
    </div>
    <div style="margin-left: auto;">
      <button @click="aggiungiPuls()" style="margin-top: -5px;" class="aggiungiBtn"></button>
      <button @click="taskUtente = !taskUtente;" style="margin-right: 4px;" class="togglePubblico" v-if="taskUtente"></button>
      <button @click="taskUtente = !taskUtente;" style="margin-right: 4px;" class="toggleUtente" v-else></button>
      <button class="calendarioBtn" style="margin-right: 4px;" @click="showCalendarPuls();showCheckbox = false"></button>
      <button @click="if(taskAttuali.some(t => t.selezionatoDel)) rimuoviPuls(); else showCheckbox = false;" style="margin-right: 4px;" class="confermaBtn" v-if="showCheckbox"></button>
      <button style="margin-right: 4px" @click="showCheckbox = true" class="selectBtn" v-else :disabled="showCalendar"></button>
      <button @click="showInfo = !showInfo" class="infoBtn"></button>
    </div>
  </div>
  <!-- calendario -->
  <div class="calendar" v-if="showCalendar">
    <div style="display: flex; justify-content: space-between;">
  <div style="display: flex;">
    <button @click="meseMeno()" class="modificafrecce" style="max-width: 100px;margin-top: 8px;" :disabled="showTask || showGruppiWindow || showInfo || aggiungiBool">🡸</button>
    <button @click="mesePiu()" class="modificafrecce" style="max-width: 100px;margin-top: 8px;" :disabled="showTask || showGruppiWindow || showInfo || aggiungiBool">🡺</button>
    <h1 style="color: white; min-width: 300px; max-width: 300px; text-align: center;">{{ mesi[month] }} {{ year }}</h1> 
  </div>
  <div>
    <button @click="notShowTaskPuls();showCalendar = false;" class="esciShowTsk" style="max-width: 30px; max-height: 30px;margin-top: 8px" :disabled="rimuoviBool"></button>
  </div>
</div>
    <div style="display: flex;height: 100%">
    <table>
    <thead>
      <tr>
        <th>Lun</th>
        <th>Mar</th>
        <th>Mer</th>
        <th>Gio</th>
        <th>Ven</th>
        <th>Sab</th>
        <th>Dom</th>
      </tr>
    </thead>
    <tbody id="calendar-body">
    </tbody>
  </table>
  </div>
</div>
  <!-- sezione di visualizzazione delle task -->
  <div class="popup-overlay" v-if="showTask">
    <div class="showTsk" v-if="showTask">
      <!-- sezione sinistra(testo della task) -->
      <div class="sxShow">
        <div class="showTitle">
          <textarea class="modificaTesto" style="color: white;" v-model="newContent" :readonly="!modificaBool" maxlength="2000">{{ newContent }}</textarea>
          <div style="display: flex;">
            <button @click="showCommenti = true" class="commentiBtn" :disabled="rimuoviBool2 || rimuoviBool || modificaBool || showStorico"></button>
            <button @click="showStoricoPuls()" class="storicoBtn" :disabled="rimuoviBool2 || rimuoviBool || modificaBool || showStorico"></button>
          </div>
        </div>
      </div>
      <!-- sezione destra(pulsanti X e modifica e date) -->
      <div class="dxShow">
        <div class="showButton">
          <!-- sezione alta(pulsanti X e modifica) -->
          <div>
            <button @click="rimuoviPuls(); rimuoviBool2 = true" class="modifica" :disabled="rimuoviBool2 || rimuoviBool || showStorico">Rimuovi</button>
            <button v-if="modificaBool && !taskCompletaShow" @click="salvaPuls()" class="modifica">Salva</button>
            <button v-if="!modificaBool && !taskCompletaShow" @click="modificaPuls()" class="modifica" :disabled="rimuoviBool2 || rimuoviBool || showStorico">Modifica</button>
          </div>
          <div>
            <button @click="notShowTaskPuls()" class="esciShowTsk" :disabled="rimuoviBool2 || rimuoviBool || showStorico "></button>
          </div>
        </div>
        <!-- sezione nella quale si visualizzano le date -->
        <div class="dataShow">
          <div style="margin-top: 5px;">Data di creazione: <p>{{ oggetto.dataCreazione }}</p>
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
  </div>
  <!-- sezione commenti -->
  <div class="popup-overlay-commenti" v-if="showCommenti">
    <div class="showTsk" v-if="showCommenti">
      <div class="sxShowCommenti">
        <div style="border: 1px solid white; margin-right: 10px; margin-bottom: 10px; word-break: break-all; word-wrap: break-word; overflow-y: auto; max-height: 100px;" v-for="c in oggetto.commenti">
          {{ c.commento}} <br> 
          <span style="font-size: small; height: 20px;">
            {{ c.utente }} 
            <button @click="rmCommento(c)" class="esciShowTskCommenti" :disabled="c.idUtente != operatoreId" :hidden="c.idUtente != operatoreId"></button>
          </span>
        </div>
      </div>
      <div class="dxShowCommenti">
        <button @click="showCommenti = false; newCommento = ''" class="esciShowTsk float-right" style="margin-right: 10px;margin-top: 10px"></button>
        <div style="text-align: center;">
          <textarea v-model="newCommento" style="margin-top: 10px; width: 90%; max-height: 135px;min-height: 135px;" maxlength="500" minlength="1" placeholder="Commento(Max 500 caratteri)"></textarea>
          <button class="allertRmRimuovi" style="margin-left: 15px;" @click="addCommento();newCommento=''">Aggiungi</button>
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
            <textarea class="inserisciTesto" v-model="taskText" placeholder="Task" required maxlength="2000">{{ taskText }}</textarea>
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
            <button @click="showInfo =! showInfo" style="max-height: 30px;max-width: 30px;" class="esciShowTsk"></button>
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
    <div class="informazioni" style="padding: 10px; height: 15%; width: 25%; max-width: 500px; min-width: 350px;">
      <div style="display: flex;flex-direction: row;">
        <button :disabled="rimuoviBoolGruppi || showInputGruppo" @click="showInputGruppo = true" style="margin-left: auto; margin-right: 2px; margin-bottom: 2px; margin-top: 5px;" class="aggiungiBtn" ></button>
        <select :disabled="rimuoviBoolGruppi || showInputGruppo" class="select" name="" id="" v-model="currentGroup">
          <option v-for="g in myGruppi" :value="g.id">{{ g.nome }}</option>
        </select>
        <button :disabled="rimuoviBoolGruppi || showInputGruppo" @click="gruppiHandler()" class="esciShowTsk" style="position: inherit; margin-left: 2px; margin-top: 5px;"></button>
      </div>
      <div style="display: flex; flex-direction: row; justify-content: space-evenly; margin-top: 10px;">
        <button style="color: white; padding-left: 30px; padding-right: 30px; background-color: rgb(27,157,217);" :disabled="rimuoviBoolGruppi || showInputGruppo" @click="rimuoviBoolGruppi = true">Elimina</button>
        <button style="color: white; padding-left: 30px; padding-right: 30px; background-color: rgb(27,157,217);" :disabled="rimuoviBoolGruppi || showInputGruppo" @click="showInputPermessi = true">Permessi</button>
      </div>
      
    </div>
  </div>
  <!-- alert rimozione gruppi -->
  <div class="showRm" v-if="rimuoviBoolGruppi">
    <!-- sezione sinistra(testo della task) -->
    <div class="allertRmText" style="margin-top:20px;padding-left: 20px;padding-right: 20px;font-size: 25px;border-bottom:3px solid #A1A1A1;">
      Conferma di rimozione del gruppo
    </div>
    <!-- sezione destra(pulsanti X) -->
    <div class="showButton">
      <!-- sezione alta(pulsanti X) -->
      <div>
        <button class="allertRmRimuovi" @click="eliminaGruppo()">Rimuovi</button>
        <button class="allertRmAnnulla" @click="rimuoviBoolGruppi = false">Annulla</button>
      </div>
    </div>
  </div>

  <!-- Storico -->
  <div class="showSto" v-if="showStorico">
    <!-- sezione sinistra(testo della task) -->
    <b style="margin-left: 70px;">Storico della task</b>
    <button @click="showStoricoPuls()" class="esciShowTsk float-right" style="max-width: 30px; max-height: 30px;" :disabled="rimuoviBool"></button>
    <div class="storicoInfo">
      {{ oggetto.storico }}
    </div>
  </div>

  <!-- alert inserimento nome gruppo -->
  <div class="showRm" v-if="showInputGruppo">
        <!-- sezione sinistra(testo della task) -->
          <div class="allertRmText" style="margin-top:20px;padding-left: 20px;padding-right: 20px;font-size: 18px;border-bottom:3px solid #A1A1A1;">
            Inserisci il nome del gruppo
            <input type="text" v-model="nomeGruppo" style="margin-top: 10px; text-align: center;" maxlength="20" placeholder="Nome (max 20 caratteri)">
          </div>
        <!-- sezione destra(pulsanti X) -->
          <div class="showButton">
            <!-- sezione alta(pulsanti X) -->
            <div>
              <button class="allertRmRimuovi" @click="creaGruppo()">Conferma</button>
              <button class="allertRmAnnulla" @click="showInputGruppo = false">Annulla</button>
            </div>
        </div>
      </div>
  <!-- alert inserimento permessi -->
  <div class="showRm" v-if="showInputPermessi">
        <!-- sezione sinistra(testo della task) -->
          <div class="allertRmText" style="margin-top:20px;padding-left: 20px;padding-right: 20px;font-size: 18px;border-bottom:3px solid #A1A1A1;">
            Aggiungi utente
            <select name="" id="" v-model="utenteAggiunto">
              <option :value="op.id" v-for="op in operatori">{{ op.email }}</option>
            </select>
          </div>
        <!-- sezione destra(pulsanti X) -->
          <div class="showButton">
            <!-- sezione alta(pulsanti X) -->
            <div>
              <button class="allertRmRimuovi" @click="addPermesso()">Conferma</button>
              <button class="allertRmAnnulla" @click="showInputPermessi = false">Annulla</button>
            </div>
        </div>
      </div>
  <!-- allert di rimozione -->
  <div class="showRm" v-if="(rimuoviBool && tasks.some(t => t.selezionatoDel)) || rimuoviBool2">
        <!-- sezione sinistra(testo della task) -->
          <div class="allertRmText" style="margin-top:20px;padding-left: 20px;padding-right: 20px;font-size: 25px;border-bottom:3px solid #A1A1A1;">
            Conferma di rimozione della task
          </div>
        <!-- sezione destra(pulsanti X) -->
          <div class="showButton">
            <!-- sezione alta(pulsanti X) -->
            <div>
              <button class="allertRmRimuovi" @click="rimuoviTask()">Rimuovi</button>
              <button class="allertRmAnnulla" @click="rimuoviPuls(); rimuoviBool2 = false;">Annulla</button>
            </div>
        </div>
      </div>
    <div class="taskContainer" v-if="!showCalendar">
      <!-- sezione DA FARE -->
      <div class="containerStati">
        <div class="contenitorestati">DA FARE</div>
        <div class="containerTFS dafare" @drop="onDrop($event, 'dafare')" @dragenter.prevent @dragover.prevent >
          <ul>
            <!-- stampa delle task "DA FARE" -->
            <li draggable="true" v-for="t in dafareTasks" @touchstart="touchStartHandler(t)" @touchend="touchEndHandler($event)" @dragstart="startDrag($event, t)" :class="{ rmStyle: incorsoBool || rimuoviBool, scaduto: !isNotScaduto(t), inscadenza: isScadenzaOggi(t) }">
              <div class="listaTask" @click="showTaskPuls(t)">
                <p class="testoTask">{{ t.task }}</p>
                <div style="max-height:35px;display: flex; align-items: center;justify-content: space-between;">
                  <div style="flex-grow: 1;">
                    <input type="checkbox" style="margin-left: 10px;width: 20px;height: 20px;" v-model="t.selezionatoDel" :class="{zindexBasso : showCheckbox, zindexAlto : !showCheckbox}" v-if="showCheckbox" @change="salvaselezione()" @click.stop>
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
        <div class="contenitorestati">IN CORSO</div>
        <div class="containerTFS incorso" @drop="onDrop($event, 'incorso')" @dragenter.prevent @dragover.prevent>
          <ul>
            <!-- stampa delle task "IN CORSO" -->
            <li draggable="true" v-for="t in incorsoTasks" @touchstart="touchStartHandler(t)" @touchend="touchEndHandler($event)" @dragstart="startDrag($event, t)" :class="{ rmStyle: completatiBool || dafareBool || rimuoviBool, scaduto: !isNotScaduto(t), inscadenza: isScadenzaOggi(t) }">
              <div class="listaTask" @click="showTaskPuls(t)">
                <p class="testoTask" >{{ t.task }}</p>
                <div style="max-height:35px;display: flex; align-items: center;justify-content: space-between;">
                  <div style="flex-grow: 1;">
                    <input type="checkbox" style="margin-left: 10px;width: 20px;height: 20px;" v-model="t.selezionatoDel" v-if="showCheckbox" :class="{zindexBasso : showCheckbox, zindexAlto : !showCheckbox}" @change="salvaselezione()" @click.stop>
                  </div>
                  <div style="width: 70%; text-align: right;">
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
        <div class="contenitorestati">COMPLETATI</div>
        <div class="containerTFS completati" @drop="onDrop($event, 'completati')" @dragenter.prevent @dragover.prevent>
          <ul>
            <!-- stampa delle task "COMPLETATI" -->
            <li v-for="t in completatiTasks" class="taskStyle" :class="{ intempo: !isScadutoCompletati(t), scaduto: isScadutoCompletati(t) }">
              <div class="listaTask" @click="showTaskPuls(t)">
                <p class="testoTask">{{ t.task }}</p>
                <div style="max-height:35px;display: flex; align-items: center;justify-content: space-between;">
                  <div style="flex-grow: 1;">
                    <input type="checkbox" style="margin-left: 10px;width: 20px;height: 20px;" v-model="t.selezionatoDel" v-if="showCheckbox" :class="{zindexBasso : showCheckbox, zindexAlto : !showCheckbox}" @change="salvaselezione()" @click.stop>
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
      clickTendina: false,
      tendinaShow: false,
      taskText: "",
      month: new Date().getMonth(),
      year: new Date().getFullYear(),
      mesi: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"],
      fattoIncorso: false,
      fattoCompletati: false,
      fattoDafare: false,
      aggiungiBool: false,
      rimuoviBool: false,
      rimuoviBool2: false,
      incorsoBool: false,
      dafareBool: false,
      completatiBool: false,
      freccia: '▼',
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
      showStorico: false,
      showGruppiWindow: false,
      showCheckbox: false,
      taskSelezionate: [],
      operatoreId: sessionStorage.getItem("operatorID"),
      operatoreNome: sessionStorage.getItem("operatorName"),
      operatoreCognome: sessionStorage.getItem("operatorSurname"),
      taskUtente: false,
      showCalendar: false,
      scadenzaConfronto: "",
      currentGroup: 1,
      idCommenti: 0,
      timer: setInterval(() => {
        this.readTasks();
        this.readGroups();
      }, 1000),
      gruppi: [],
      rimuoviBoolGruppi : false,
      showInputGruppo : false,
      nomeGruppo : "",
      newCommento: "",
      showCommenti: false,
      showAddCommento : false,
      showInputPermessi: false,
      utenteAggiunto: null,
      refresh: true,
      operatori: [],
    }
  },
  mounted(){
    sessionStorage.setItem("operatorID", 104);
    sessionStorage.setItem("operatorName", "Silvio");
    sessionStorage.setItem("operatorSurname", "Berlusconi");
    // setTimeout(() => {
    //   let maxGroup = 1;
    //   console.log(maxGroup);
    //   console.log(this.tasks);
    //   this.tasks.forEach(element => {
    //     maxGroup = (element.gruppo > maxGroup) ? element.gruppo : maxGroup;
    //   });
    //   console.log(maxGroup);
    //   for (let index = 0; index < maxGroup; index++) {
    //     this.gruppi.push(index+1);
    //   }
    //   console.log(this.gruppi);
    // }, 2000);
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
    taskDataSelez(){
      return this.tasks.filter(t => t.dataScadenza == this.scadenzaConfronto);
    },
    myGruppi(){
      return this.gruppi.filter((gruppo) => gruppo.permessi.some(p => p == this.operatoreId));
    },
    taskAttuali(){
      return this.tasks.filter(t => t.gruppo === this.currentGroup);
    }

  },
  beforeMount() {
    this.tasks = [];
    this.readTasks();
    this.readGroups();
    this.sortTasks();
    this.getOperators();
  },
  watch: {
    showCalendar(newVal) {
      if (newVal) {
        this.$nextTick(() => {
          this.createCalendar();
        });
      }
    },
  },
  methods: {
    /* scrive nel DB */
    async writeTasks() {
      let data = JSON.stringify({
        "appCode": "ONOINT-0002",
        "dataName": "tasks",
        "dataValue": JSON.stringify({ tasks: this.tasks})
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

    async writeGroups() {
      let data = JSON.stringify({
        "appCode": "ONOINT-0002",
        "dataName": "groups",
        "dataValue": JSON.stringify({ groups: this.gruppi})
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
        this.refresh = true;
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
      this.tasks = JSON.parse(risposta.data.data.data).tasks ?? [];
    },

    async getOperators(){
      let data = JSON.stringify({
        "appCode" : "ONOINT-0002",
      });

      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: "http://64.227.120.171:7576/grpc/GetOperators",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6LTEsImlzcyI6Im9ub1NlcnZlciIsInN1YiI6InNvbWVvbmUiLCJleHAiOjE2ODYzMDQwMDksIm5iZiI6MTY4NjIxOTQwOSwiaWF0IjoxNjg2MjE3NjA5LCJqdGkiOiJvbm8tc2VydmVyIn0.VtfbfToSXSekUVEKtViannwS2O4MUdkLKlQsqpuOnUY'
        },
        data: data

      }

      let risposta = await axios.request(config);
      console.log(risposta.data.operators, "operatori");
      this.operatori = risposta.data.operators;
    },

    async readGroups() {
      let data = JSON.stringify({
        "appCode": "ONOINT-0002",
        "dataName": "groups"
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
      this.gruppi = JSON.parse(risposta.data.data.data).groups;
      if(this.refresh){ 
         let min = 9999;
        this.myGruppi.forEach(g => {
          if(g.id < min) min = g.id;
        });
        this.currentGroup = min;
        this.refresh = false;
      }
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
      this.rimuoviBoolGruppi = false;
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
      this.rimuoviBoolGruppi = false;
      if(!this.tasks.some(t => t.selezionatoDel)) {
        this.showCheckbox = false;
        this.rimuoviBool = false;
      };
    },
    /* aggiunge la task all'array e aggiorna il DB  */
    aggiungiTask() {
      if (this.taskText.trim() && this.scadenza.length != 0 && this.isNotScadutoAdd(this.scadenza)) {
        this.tasks.push({ task: this.taskText, dafare: true, incorso: false, completati: false, dataCreazione: this.todayStr, dataScadenza: this.scadenza, scaduta: false, selezionatoDel: false, nome: this.operatoreNome, cognome: this.operatoreCognome, id: this.operatoreId, privata: this.taskUtente, gruppo: this.currentGroup, commenti: [], storico: ""})
        this.taskText = '';
        this.scadenza = '';
        this.sortTasks();
        this.notShowTaskPuls();
        this.writeTasks();
      }
      else{
        alert("Il testo della task non deve essere vuoto");
      }
      this.createCalendar();
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
        this.rimuoviBool = this.rimuoviBool2 = false;
        this.sortTasks();
        this.writeTasks();
      }
      this.createCalendar();
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
      this.notShowTaskPuls();
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
    showCalendarPuls() {
      this.showCalendar = true;
    },
    showStoricoPuls() {
      this.showStorico = !this.showStorico;
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
      this.createCalendar();
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
      event.dataTransfer.dropEffect = 'move'
      event.dataTransfer.effectAllowed = 'move'
      this.oggettodragdrop=task;
    },
    onDrop (event, dest) {
      clearInterval(this.timer);
      const task = this.tasks.find(e => JSON.stringify(e) === JSON.stringify(this.oggettodragdrop));
      let oggi = new Date();
      let anno = oggi.getFullYear();
      let mese = (oggi.getMonth() + 1).toString().padStart(2, '0');
      let giorno = oggi.getDate().toString().padStart(2, '0');
      let dataYYYYMMDD = `${anno}-${mese}-${giorno}`;
      if(this.oggettodragdrop.dafare == true && dest === "incorso"){
        task.incorso = true
        task.dafare = false
        task.storico += 'Spostato in "IN CORSO" il ' + dataYYYYMMDD + "\n da " + this.operatoreNome + " " + this.operatoreCognome + "\n \n";
        this.sortTasks();
        this.writeTasks();
      }
      if(this.oggettodragdrop.incorso == true && dest === "completati"){
        task.dataFine = dataYYYYMMDD;
        task.completati = true
        task.incorso = false
        task.storico += 'Spostato in "COMPLETATI" il ' + dataYYYYMMDD + "\n da " + this.operatoreNome + " " + this.operatoreCognome + "\n \n";
        this.sortTasks();
        this.writeTasks();
      }
      if(this.oggettodragdrop.incorso == true && dest === "dafare"){
        task.incorso = false
        task.dafare = true
        task.storico += 'Spostato in "DA FARE" il ' + dataYYYYMMDD + "\n da " + this.operatoreNome + " " + this.operatoreCognome + "\n \n";
        this.sortTasks();
        this.writeTasks();
      }
      this.timer = setInterval(() => {
        this.readTasks();
        this.readGroups();
      }, 1000);
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

    mesePiu(){
      this.month++;
      if(this.month==12){
        this.month=0;
        this.year++;
      }
      this.createCalendar();
    },
    meseMeno(){
      this.month--;
      if(this.month==-1){
        this.month=11;
        this.year--;
      }
      this.createCalendar();
    },
    metodo(){
      console.log("clickSi")
    },
    stampaTaskCalendario(){
      let divFinale = '';
      for(let i=0;i<this.taskAttuali.length;i++){
        if(this.taskAttuali && Array.isArray(this.taskAttuali) && this.taskAttuali.length > 0){if(this.taskAttuali[i].dataScadenza == this.scadenzaConfronto){
          if(this.taskAttuali[i].task.length > 10){
            divFinale += '<div class="calendarTask" onclick="this.showTaskPuls(this.taskAttuali[' + i + '])">' + this.taskAttuali[i].task.substr(0,10) + '...</div>';
          } else {
            divFinale += '<div class="calendarTask" onclick="this.showTaskPuls(this.taskAttuali[' + i + '])">' + this.taskAttuali[i].task.substr(0,10) + '</div>';
          }
        }}
      }
      return divFinale;
    },
    createCalendar() {
      const calendarBody = document.getElementById('calendar-body');
      const firstDayOfMonth = new Date(this.year, this.month, 1);
      const lastDayOfMonth = new Date(this.year, this.month + 1, 0);
      const numDays = lastDayOfMonth.getDate();
      const firstDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7;
      let oggi = new Date();
      let anno = oggi.getFullYear();
      let mese = (oggi.getMonth() + 1).toString().padStart(2, '0');
      let giorno = oggi.getDate().toString().padStart(2, '0');
      let dataYYYYMMDD = `${anno}-${mese}-${giorno}`;

      let calendar = '';
      let week = '';
      let temp = "";
      let temp2 = "";
    
      for (let i = 0; i < firstDayOfWeek; i++) {
        week += '<td></td>';
      }
    
      for (let day = 1; day <= numDays; day++) {
        if(day < 10) temp="0"+day;
        else temp = day;
        if(this.month < 9) temp2="0"+(this.month+1);
        else temp2=(this.month+1);
        this.scadenzaConfronto=this.year+'-'+temp2+'-'+temp;
        if(this.scadenzaConfronto==dataYYYYMMDD) {
          week += '<td style="border: solid #1B9DD9;">' + '<p style="color: #1B9DD9;font-size: small;text-align: left;margin-bottom: -3px">'+ day +'</p>'+ '<div class="calendarBox">'+ this.stampaTaskCalendario() +'</div>' + '</td>';
        } else {
          week += '<td>' + '<p style="font-size: small;text-align: left;margin-bottom: -3px">'+ day +'</p>'+ '<div class="calendarBox">'+ this.stampaTaskCalendario() +'</div>' + '</td>';
        }
        if ((firstDayOfWeek + day) % 7 === 0) {
          calendar += '<tr>' + week + '</tr>';
          week = '';
        }
      }
    
      if (week !== '') {
        calendar += '<tr>' + week + '</tr>';
      }
    
      calendarBody.innerHTML = calendar;
      const taskElements = document.querySelectorAll('.calendarTask');
      var arrayDiStringhe = Array.from(taskElements).map(function(el) {
        return el.outerHTML;
      });
      console.log(arrayDiStringhe);
      for (let k = 0; k < taskElements.length; k++) {
        const taskElement = taskElements[k];
        let sium = arrayDiStringhe[k];
        let sium1 = sium.split("[")[1];
        let sium2 = sium1.split("]")[0];
        console.log(sium2);
        taskElement.addEventListener('click', () => {
          this.showTaskPuls(this.taskAttuali[sium2]);
        });
      }
    },
  
    gruppiHandler(){
      this.showGruppiWindow = !this.showGruppiWindow;
      console.log(this.myGruppi);
    },
    creaGruppo(){
      if(this.nomeGruppo.trim() && !this.gruppi.some(g => g.nome == this.nomeGruppo) && this.nomeGruppo.trim().toLowerCase() != "gestisci gruppi"){
        this.gruppi.push({id: this.gruppi[this.gruppi.length-1].id+1, nome:this.nomeGruppo, permessi: [this.operatoreId]});
        this.writeGroups();
        this.showInputGruppo = false;
        this.nomeGruppo = "";
      }
      else if(this.nomeGruppo.trim().toLowerCase() == "gestisci gruppi"){
        alert("Nome invalido");
      }
      else if(this.nomeGruppo.trim()){
        alert("Il nome del gruppo è già utilizzato");
        console.log(this.gruppi);
      }
      else{
        alert("Il nome del gruppo non deve essere vuoto");
      }
    },
    eliminaGruppo(){
      if(this.gruppi.length > 1){
        let gruppo = this.currentGroup;
        this.tasks = this.tasks.filter(task => task.gruppo !== this.currentGroup);
        this.writeTasks();
        this.gruppi = this.gruppi.filter(g => g.id !== this.currentGroup);
        this.writeGroups();
        console.log(gruppo);
        this.currentGroup = gruppo!=1 ? this.gruppi[this.gruppi.length - 1 ].id : gruppo+1;
        this.rimuoviBoolGruppi = false;
      }
    },
    touchEndHandler(e){
      console.log(e);
      console.log(document.elementFromPoint(e.changedTouches[0].pageX, e.changedTouches[0].pageY));
      let destinazione = this.getTfs(document.elementFromPoint(e.changedTouches[0].pageX, e.changedTouches[0].pageY));
      const task = this.tasks.find(e => JSON.stringify(e) === JSON.stringify(this.oggettodragdrop));
      let oggi = new Date();
      let anno = oggi.getFullYear();
      let mese = (oggi.getMonth() + 1).toString().padStart(2, '0');
      let giorno = oggi.getDate().toString().padStart(2, '0');
      let dataYYYYMMDD = `${anno}-${mese}-${giorno}`;
      if(destinazione === "dafare"){
        task.completati = false;
        task.incorso = false;
        task.dafare = true;
        task.storico += 'Spostato in "DA FARE" il ' + dataYYYYMMDD + "\n da " + this.operatoreNome + " " + this.operatoreCognome + "\n \n";
      }
      if(destinazione === "incorso"){
        task.completati = false;
        task.incorso = true;
        task.dafare = false;
        task.storico += 'Spostato in "IN CORSO" il ' + dataYYYYMMDD + "\n da " + this.operatoreNome + " " + this.operatoreCognome + "\n \n";
      }
      if(destinazione === "completati"){
        task.completati = true;
        task.incorso = false;
        task.dafare = false;
        task.dataFine = dataYYYYMMDD;
        task.storico += 'Spostato in "COMPLETATI" il ' + dataYYYYMMDD + "\n da " + this.operatoreNome + " " + this.operatoreCognome + "\n \n";
      }
      this.writeTasks();
      this.timer = setInterval(() => {
        this.readTasks();
        this.readGroups();
      }, 1000);
    },
    touchStartHandler(t){
      clearInterval(this.timer);
      this.oggettodragdrop = t;
      
    },
    getTfs(elemento){
      let id = elemento.classList[1] ?? "";
      let ids = ["dafare","incorso","completati"];
      if(ids.includes(id)) return id;
      else return this.getTfs(elemento.parentElement);
    },
    addCommento(){
      if(this.newCommento.trim()){
        console.log(this.newCommento);
        console.log({utente: `${this.operatoreNome} ${this.operatoreCognome}`, commento: this.newCommento, id: this.idCommenti, idUtente: this.operatoreId});

        this.idCommenti++;
        const task = this.tasks.find((t) => JSON.stringify(t) === JSON.stringify(this.oggetto));
        this.oggetto.commenti.push({utente: `${this.operatoreNome} ${this.operatoreCognome}`, commento: this.newCommento, id: this.idCommenti, idUtente: this.operatoreId});
        task.commenti.push({utente: `${this.operatoreNome} ${this.operatoreCognome}`, commento: this.newCommento, id: this.idCommenti, idUtente: this.operatoreId});
        this.writeTasks();
        this.newCommento = "";
        this.showAddCommento = false;
    }
    },
    addPermesso(){
      console.log(this.utenteAggiunto);
      if(this.utenteAggiunto){
        const gruppo = this.gruppi.find((g) => g.id == this.currentGroup);
        gruppo.permessi.push(this.utenteAggiunto);
        this.writeGroups();
        this.showInputPermessi = false;
      }
    },
    rmCommento(e){
      const task = this.tasks.find((t) => JSON.stringify(t) === JSON.stringify(this.oggetto));
      console.log(task.commenti);
      task.commenti = task.commenti.filter(el => JSON.stringify(el) !== JSON.stringify(e));
      this.oggetto.commenti = task.commenti;
      this.sortTasks();
      this.writeTasks();
    },
    cambiaFreccia(){
      this.showCheckbox = false;
      if(this.clickTendina){
        this.freccia='▲';
      } else {
        this.freccia='▼';
      }
    }
    
  }
}

</script>

<style>
    @import '../node_modules/@fontsource/roboto/index.css';
</style>