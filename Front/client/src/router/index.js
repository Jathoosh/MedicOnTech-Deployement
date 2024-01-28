import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      alias: '/login',
      name: 'login',
      component: Login
    },

    // \/ Pages concernant le patient \/
    { 
      path: '/patient_home', 
      name:'PatientHome', 
      component: () => import('../views/PatientHome.vue')
    },
    { 
      path: '/patient_in_charge', 
      name:'PatientInCharge', 
      component: () => import('../views/PatientInCharge.vue') 
    },

    // \/ Pages concernant le docteur \/
    { 
      path: '/doctor_home', 
      name:'DoctorHome', 
      component: () => import('../views/DoctorHome.vue')
    },
    { 
      path: '/history_patient', 
      name:'HistoryPatient', 
      component: () => import('../views/HistoryPatient.vue')
    },
    { 
      path: '/edit_prescription', 
      name:'EditPrescription', 
      component: () => import('../views/EditPrescription.vue')
    },
    { 
      path: '/profil_pac', 
      name:'Profil_PAC', 
      component: () => import('../views/ProfilPAC.vue') 
    },

    // \/ Pages concernant le pharmacien \/
    { 
      path: '/pharmacist_home', 
      name:'PharmacienHome', 
      component: () => import('../views/PharmacistHome.vue') 
    },
    /*{ 
      // Inexistant ?
      path: '/dependent_patient', 
      name:'Dependent_patient', 
      component: () => import('../views/DependentPatient.vue')
    },*/

    // \/ Pages concernant l'application \/
    { 
      path: '/login_retrieve', 
      name:'login-retrieve', 
      component: () => import('../views-mobile/LoginRetrieve.vue') 
    },
    { 
      path: '/mobile_login', 
      name:'mobile-login', 
      component: () => import('../views-mobile/MobileLogin.vue') 
    },

    // \/ Pages concernant le général \/
    { 
      path: '/profil', 
      name:'Profil', 
      component: () => import('../views/Profil.vue') 
    },
    { 
      path: '/ordonnance', 
      name:'Ordonnance', 
      component: () => import('../components/professionalPage/Ordonnance.vue') 
    },
    { 
      path: '/contact', 
      name:'Contact', 
      component: () => import('../views/Contact.vue')
    },
    { 
      path: '/faq', 
      name:'Faq', 
      component: () => import('../views/Faq.vue') 
    },
    { 
      path: '/a_propos', 
      name:'APropos', 
      component: () => import('../views/APropos.vue') 
    }
  ]
})

export default router
