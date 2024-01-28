<script setup>
import { RouterView } from 'vue-router'
import axios from 'axios'
import HeaderComponent from './components/everyPage/Header.vue'
import FooterComponent from './components/everyPage/Footer.vue'

axios.defaults.baseURL = import.meta.env.VITE_API_ENDPOINT
axios.defaults.withCredentials = true
</script>

<template>
  <header id="header">
    <HeaderComponent 
      :sdatas="sdatas"
      :mdatas="mdatas"
      :tutor_bool="tutor_bool"
      @tutor_true="tutor_true"
      @login = "login"
      @logout = "logout"
      @gotoprofil ="gotoprofil"
      :button_actionne ="button_actionne"
    />
  </header>
  <main id="main">
    <RouterView 
      @checkconnexionmobile = "checkconnexionmobile"
      :check_connexion_mobile="check_connexion_mobile"
      @fc-method = "FCMethod"
      @login = "login"
      :mdatas = "mdatas"
      :sdatas = "sdatas"
      :sdatas_comp = "sdatas_comp"
      @load_data_fc = "loadDataFcCallback"
      @infos_patient = "infos_patient"
      :index_history_patient = "index_history_patient"
      @save_index_pac = "save_index_pac"
      :index_pac = "index_pac"
      @tutor_false = "tutor_false"
      @tutor_true = "tutor_true"
      :tutor_bool = "tutor_bool"
      @status_doctor = "status_doctor"
      @status_patient = "status_patient"
      @status_pharmacist = "status_pharmacist"
      :status = "status"
      @save_ordonnance = "save_ordonnance"
      @save_ordonnance_doctor = "save_ordonnance_doctor"
      :index_ordonnance = "index_ordonnance"
      :prescription_for_display = "prescription_for_display"
      @search_patient = "recherchePatient"
      :liste_patient_search = "liste_patient_search"
      @modify_profil = "modify_profil"
      :hide_length = "mutual_change_state"
      @search_drug = "search_drug"
      :liste_drug_search = "liste_drug_search"
      @sendprescription = "sendprescription"
      @sendpac = "sendpac"
      @scanprescription = "scanprescription"
      :scanprescription_bool = "scanprescription_bool"
    />
  </main>
  <footer id="footer">
    <FooterComponent 
      @footertobottom = "footertobottom"
    />
  </footer>
</template>

<script>
export default {
  name: 'App',
  data: () => ( 
  {
    sdatas: {Id_Person:0, first_name:'', last_name:'', profession:{id:0,name:""}, mail:'', workplace_name:''},
    sdatas_comp: [], //Liste uniquement utilisé pour le patient (contient ces ordonnances)
    mdatas: [],
    //==========================================================
    //Séparation entre les données obtenues de la base de données et les données utilisées dans les différentes pages
    //==========================================================
    index_history_patient: 0,
    index_pac: 0,
    tutor_bool: true,
    status: 0,
    index_ordonnance: 0, // voir si nécessaire
    prescription_for_display: {
      infos_patient: {first_name: '',last_name: ''},
      infos_prescription: {
        doctor_info: {first_name: '',last_name: '',specialty: '',phone: '',mail: ''}
      },
      drugs: [],
      services: [],
    },
    liste_patient_search: [],
    button_actionne: false, 
    check_connexion_mobile: false,
    mutual_change_state: "false",
    liste_drug_search: [],
    scanprescription_bool: false,
  }),
  async mounted () 
  {
    this.checkConnexion();
    this.changePageWidth('');
  },
  methods: 
  {
    //==========================================================
    //Méthode pour connexion
    //==========================================================
    
    async login(data)
    {
      var res = await axios.post('api/login', data);
      if(res.status == 200 && res.data.connected)
      {
        this.sdatas = res.data.sdatas;
        this.reloadData();
      }
      else
      {
        alert("Login ou mot de passe incorrect");
      }
    },
    async FCMethod()
    {
      window.location.href = "http://localhost:3000/login";
    },
    async loadDataFcCallback()
    {
      const res = await axios.get('api/retrieve_person');
      if (res.data.connected)
      {
        this.sdatas = res.data.sdatas;
        this.reloadData();
      }
      else
      {
        alert("Veuillez réessayer la connexion");
        //redirect to login
        this.$router.push('/login');
      }
    },
    async logout(){
      await axios.get('api/logout');
      this.sdatas = {
        Id_Person:0, 
        first_name:'', 
        last_name:'', 
        profession:{id:0,name:""}, 
        mail:'', 
        workplace_name:''
      };
      this.reloadData();
    },
    async checkconnexionmobile(){
      const res = await axios.post('/api/motapp/setconnexion',{Id_Patient : 10});//TODO TEMP
      this.check_connexion_mobile = res.status === 200? true : false;
    },

    //==========================================================
    //Méthode pour récupérer les données de la base de données au chargement de la page
    //==========================================================

    async getSdatas_Comp()
    {
      if (this.sdatas.profession.name == "Patient")
      {
        const res = await axios.get('api/patient_comp_datas');
        const res2 = await axios.get('api/patient_comp_datas_services');
        res.data.datas.forEach(element => {
          element.services = res2.data.datas.filter(service => service.Id_Prescription == element.infos_prescription.Id_Prescription);
        });
        return res.data.datas;
      }
    },
    async getMdatas()
    {
      if (this.sdatas.profession.name == "Patient")
      {
        const res = await axios.get('api/patient_mdatas');
        const res2 = await axios.get('api/patient_mdatas_services');
        res.data.datas.forEach(element => {
          element.prescriptions_pac.forEach(prescription => {
            prescription.services = res2.data.datas.filter(service => service.Id_Prescription == prescription.infos_prescription.Id_Prescription);
          });
        });
        return res.data.datas;
      }
      else if (this.sdatas.profession.name == "Doctor")
      {
        const res = await axios.get('api/doctor_mdatas');
        const res2 = await axios.get('api/doctor_mdatas_services');
        res.data.datas.forEach(element => {
          element.prescriptions.forEach(prescription => {
            let forservice = res2.data.datas.filter(service => service.Id_Prescription == prescription.infos_prescription.Id_Prescription);
            prescription.services = forservice.length > 0 ? forservice[0].services : [];
          });
        });
        return res.data.datas;
      }
    },

    //==========================================================
    //Fonctions pour le bon fonctionnement des pages
    //==========================================================
    async reloadData()
    {
      if (this.sdatas.Id_Person != 0)
      {
        this.sdatas_comp = await this.getSdatas_Comp();
        this.mdatas = await this.getMdatas();
        this.goToPage('/'+this.sdatas.profession.name+'_home');
      }
      else
      {
        this.sdatas_comp = [];
        this.mdatas = [];
        this.goToPage('/login');
      }
    },
    footertobottom(height)
    {
      var main = document.getElementById("main");
      main.style.paddingBottom = height;
    },
    goToPage(page){
      var current_url = window.location.href;
      current_url = current_url.substring(current_url.lastIndexOf('/'), current_url.length);
      if(page != current_url){
        this.changePageWidth(page);
        this.$router.push(page);
      }
      else
      {
        this.resetNonDBData();
      }
    },
    changePageWidth(page){
      var current_url = window.location.href;
      current_url = current_url.substring(current_url.lastIndexOf('/'), current_url.length);
      if(page == '/login' || (current_url == '/login' && page == '')){
        document.getElementById("main").style.width = "100%";
      }
      else{
        document.getElementById("main").style.width = "90%";
      }
    },
    resetNonDBData(){
      this.index_history_patient = 0;
      this.index_pac = 0;
      this.tutor_bool = true;
      this.index_ordonnance = 0;
      this.prescription_for_display = {
        infos_prescription: {},
        drugs: [],
        services: [],
        infos_patient : {
          first_name: '',
          last_name: '',
        },
      };
    },
    async checkConnexion()
    {
      var current_url = window.location.href;
      current_url = current_url.substring(current_url.lastIndexOf('/'), current_url.length);
      if (current_url.toLowerCase() != '/faq' && current_url.toLowerCase() != '/a_propos' && current_url.toLowerCase() != '/contact' && current_url.toLowerCase() != '/mobile_login'){
        const res = await axios.get('api/connected');
        if(res.data.connected)
        {
          this.sdatas = res.data.sdatas;
          this.reloadData();
        }
        else
        {
          if(current_url != '/mobile_login'){
            this.goToPage('/login');
          }
        }
      }
    },

    //==========================================================
    //Méthode pour intéragir avec la base de données durant le fonctionnement
    //==========================================================

    async recherchePatient(data)
    {
      const res = await axios.get('api/recherchePatient/'+data.first_name+'/'+data.last_name);
      this.liste_patient_search = res.data.datas;
    },

    async search_drug(data)
    {
      const res = await axios.get('api/drugs/'+data);
      this.liste_drug_search = res.data.datas;
    },

    async modify_profil(data)
    {
      const res = await axios.put('api/modifMutuelle', data);
      if(res.data.changed == true){
        this.sdatas.mutual_name = res.data.mutual_name;
        this.mutual_change_state = "changed";
      }
      else{
        this.mutual_change_state = "true";
      }
    },
    
    async sendprescription(data){
      const res = await axios.post('api/sendPrescription', data);
      if(res.data.sent == true){
        this.reloadData();
      }
      else{
        console.log("Je suis dans le vue application, c'est pas envoyé l'ordonnance");
      }
    },

    async sendpac(data){
      const res = await axios.post('api/sendPac', data);
      if(res.data.sent == true){
        this.reloadData();
      }
      else{
        console.log("Je suis dans le vue application, c'est pas envoyé le pac");
      }
    },

    async scanprescription(data){
      const res = await axios.get('api/pharmacist/'+data.prescription+'/'+data.check_security);
      if (res.data.state == true){
        this.prescription_for_display = res.data.prescription_for_display;
        this.scanprescription_bool = true;
      }
      else{
        this.scanprescription_bool = false;
      }
    },

    //==========================================================
    //Fonctions concernant les Emits, actions en local et le reste
    //==========================================================
    
    getPrescriptions(data)
    {
      this.patientID = data;
    },
    
    infos_patient(data)
    {
      this.index_history_patient = data.index;
    },
    save_index_pac(data){
      this.index_pac = data.index;
    },
    tutor_false(){
      this.tutor_bool = false;
    },
    tutor_true(){
      this.tutor_bool = true;
    },
    status_patient(){
      this.status = 0;
    },
    status_doctor(){
      this.status = 1;
    },
    status_pharmacist(){
      this.status = 2;
    },
    save_index_ordonnance(data){
      this.index_ordonnance = data.index;
    },
    save_ordonnance(data){
      this.prescription_for_display = data.prescription;
      this.prescription_for_display.infos_patient = data.infos_patient;
      this.$router.push("/Ordonnance");
    },
    save_ordonnance_doctor(data){
      this.prescription_for_display = data.prescription;
      this.prescription_for_display.infos_patient = data.infos_patient;
      this.prescription_for_display.infos_prescription.doctor_infos = data.doctor_infos;
      this.$router.push("/Ordonnance");
    },
    gotoprofil(){
      this.button_actionne = true;
    },
    OrdonnanceTutor()
    {
      this.tutor_true();
      this.goToPage('/Patient_home');
    }
  }
}
</script>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
  width: 100vw;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

</style>
