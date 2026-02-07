(function () {
  if (typeof firebase === "undefined") return;

  const firebaseConfig = {
    apiKey: "AIzaSyAxm3uPecNMygSLocnpRuUTGZI8L85bX0I",
    authDomain: "running-club-1517.firebaseapp.com",
    projectId: "running-club-1517",
    storageBucket: "running-club-1517.firebasestorage.app",
    messagingSenderId: "866925654724",
    appId: "1:866925654724:web:383fa9ca2e585339ad0f91"
  };

  if (!firebase.apps || !firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  } else {
    firebase.app();
  }

  window.auth = firebase.auth();
  window.db = firebase.firestore();
})();
