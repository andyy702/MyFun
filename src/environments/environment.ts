export const environment = {
    production: false,
    backendUrl: getBackendUrl()
  };
  
  function getBackendUrl(): string {
    // ✅ Si estás en celular, reemplaza "localhost" con la IP de tu PC
    const localIp = "192.168.0.163"; // <-- cámbialo por tu IPv4 real
  
    if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      return `http://${localIp}:3000`;
    } else {
      return "http://localhost:3000";
    }
  }
  