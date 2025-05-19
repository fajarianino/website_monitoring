// import React, { useState, useEffect, useRef } from 'react';
// import './App.css';
// import L, { icon } from 'leaflet'; // Import Leaflet library
// import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS

// function App() {
//   const [surfaceImage, setSurfaceImage] = useState('');
//   const [surfaceImage1, setSurfaceImage1] = useState('');
//   const [activeStep, setActiveStep] = useState(0); // State untuk melacak langkah aktif
//   const videoRef = useRef(null);
//   const mapRef = useRef(null); // useRef untuk menyimpan referensi ke elemen peta

//   useEffect(() => {
//     const imgPaths = ['/pic.jpg', '/pic2.jpg']; // Tambahkan lebih banyak jalur gambar jika diperlukan
//     let currentIndex = 0;
//     let intervalId;

//     // Fungsi untuk memuat gambar dan menangani keberadaan gambar
//     const loadImage = (path) => {
//       const img = new Image();
//       img.onload = () => {
//         setSurfaceImage(path);
//         // Jika gambar yang dimuat adalah pic2.jpg, hentikan penggantian gambar
//         if (path === '/pic2.jpg') {
//           clearInterval(intervalId);
//         }
//       };
//       img.onerror = () => {
//         // Handle error jika gambar tidak ditemukan
//         console.error(`Gambar ${path} tidak ditemukan.`);
//       };
//       img.src = path;
//     };

//     // Fungsi untuk mengganti gambar secara berkala
//     const changeImage = () => {
//       currentIndex = (currentIndex + 1) % imgPaths.length;
//       loadImage(imgPaths[currentIndex]);
//     };

//     // Mulai dengan memuat gambar pertama kali saat komponen dimount
//     loadImage(imgPaths[currentIndex]);

//     // Mengatur interval untuk mengganti gambar
//     intervalId = setInterval(changeImage, 5000); // Ganti gambar setiap 5 detik

//     // Bersihkan interval saat komponen unmount
//     return () => clearInterval(intervalId);
//   }, []); // Dependency array kosong agar useEffect dipanggil hanya sekali saat komponen dimount

//   useEffect(() => {
//     const imgPaths = ['/pic.jpg', '/pic0.jpg']; // Tambahkan lebih banyak jalur gambar jika diperlukan
//     let currentIndex = 0;
//     let intervalId;

//     // Fungsi untuk memuat gambar dan menangani keberadaan gambar
//     const loadImage = (path) => {
//       const img = new Image();
//       img.onload = () => {
//         setSurfaceImage1(path);
//         // Jika gambar yang dimuat adalah pic2.jpg, hentikan penggantian gambar
//         if (path === '/pic0.jpg') {
//           clearInterval(intervalId);
//         }
//       };
//       img.onerror = () => {
//         // Handle error jika gambar tidak ditemukan
//         console.error(`Gambar ${path} tidak ditemukan.`);
//       };
//       img.src = path;
//     };

//     // Fungsi untuk mengganti gambar secara berkala
//     const changeImage = () => {
//       currentIndex = (currentIndex + 1) % imgPaths.length;
//       loadImage(imgPaths[currentIndex]);
//     };

//     // Mulai dengan memuat gambar pertama kali saat komponen dimount
//     loadImage(imgPaths[currentIndex]);

//     // Mengatur interval untuk mengganti gambar
//     intervalId = setInterval(changeImage, 5000); // Ganti gambar setiap 5 detik

//     // Bersihkan interval saat komponen unmount
//     return () => clearInterval(intervalId);
//   }, []); // Dependency array kosong agar useEffect dipanggil hanya sekali saat komponen dimount

//   useEffect(() => {
//     // Fungsi untuk mengakses webcam
//     const startVideo = () => {
//       navigator.mediaDevices
//         .getUserMedia({ video: true })
//         .then((stream) => {
//           if (videoRef.current) {
//             videoRef.current.srcObject = stream;
//           }
//         })
//         .catch((err) => {
//           console.error('Error accessing webcam: ', err);
//         });
//     };

//     startVideo();
//   }, []); // Dependency array kosong agar useEffect dipanggil hanya sekali saat komponen dimount

//   useEffect(() => {
//     const steps = 6; // Jumlah langkah
//     let stepIntervalId = setInterval(() => {
//       setActiveStep((prevStep) => (prevStep + 1) % steps); // Pindah ke langkah berikutnya setiap 5 detik
//     }, 5000);

//     return () => clearInterval(stepIntervalId); // Bersihkan interval saat komponen unmount
//   }, []);

//   useEffect(() => {
//     const initMap = () => {
//       if (!mapRef.current) {
//         mapRef.current = L.map('map-container').setView([51.505, -0.09], 13); // Initial map coordinates and zoom level
//         L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//           attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
//           maxZoom: 18,
//         }).addTo(mapRef.current);

//         const customIcon = L.icon({
//           iconUrl: 'leaflet/dist/images/marker-icon.png', 
//           iconSize: [32, 32], // Size of the icon
//           iconAnchor: [16, 32], // Anchor point of the icon
//         });
//         // Example marker (replace with actual logic to update marker position)
//         L.marker([51.5, -0.09],{icon: customIcon}).addTo(mapRef.current)
//           .bindPopup('A floating marker.')
//           .openPopup();
//       }
//     };

//     if (typeof window !== 'undefined') {
//       initMap();
//     }
//   }, []);

//   return (
//     <div className="container">
//       <div className="header">
//         <div className='nama-tim'>Nama Tim: SAFINAH-ONE PT: GAMANTARAY</div>
//         <div className='lintasan'>Lintasan: .... ( A / B )</div>
//       </div>
//       <div className="content">
//         <div className="position-log">
//           <div className='log-tittle'>Position-Log</div>
//           <div className='list1'>
//             <div className={activeStep === 0 ? 'active-step' : 'step'}>Preparation</div>
//             <div className={activeStep === 1 ? 'active-step' : 'step'}>Start</div>
//             <div className={activeStep === 2 ? 'active-step' : 'step'}>Floating ball set 1-10</div>
//             <div className={activeStep === 3 ? 'active-step' : 'step'}>Mission Surface Imaging</div>
//             <div className={activeStep === 4 ? 'active-step' : 'step'}>Mission Underwater Imaging</div>
//             <div className={activeStep === 5 ? 'active-step' : 'step'}>Finish</div>
//           </div>
//         </div>
//         <div className="scores">
//           <div className="score">
//             <img src={surfaceImage} alt="Surface Imaging" style={{ maxWidth: '100%', maxHeight: '100%', height: 'auto', width: 'auto' }} />
//           </div>
//           <div className="score">
//             <img src={surfaceImage1} alt="Surface Imagingg" style={{ maxWidth: '100%', maxHeight: '100%', height: 'auto', width: 'auto' }} />
//           </div>
//         </div>
//       </div>
//       <div className="attitudes">
//         <div className='video'>
//           <video ref={videoRef} autoPlay style={{ width: '100%', maxHeight: '100%' }}></video>
//           <div className='vidInfo'>Live Cam</div>
//           {/* video */}
//         </div>
//         <div className="attitudeinfo">
//           <div className='attitude-tittle'>Attitude Information</div>
//           <div className='list2'>
//             <div className='stats'>Trajectory graph</div>
//             <div className='stats'>SOG</div>
//             <div className='stats'>COG</div>
//           </div>
//         </div>
//         <div className="attitude">
//           <div id="map-container" style={{ width: '100%', height: '100%' }}></div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;

// Import React dan hooks yang digunakan
import React, { useState, useEffect } from 'react';
// Import file CSS untuk styling
import './App.css';

function App() {
  // State untuk menyimpan jalur gambar pertama
  const [surfaceImage, setSurfaceImage] = useState('');
  // State untuk menyimpan jalur gambar kedua
  const [surfaceImage1, setSurfaceImage1] = useState('');

  // useEffect untuk memuat gambar ketika komponen pertama kali dimuat
  useEffect(() => {
    // Memuat gambar pertama secara manual
    const img = new Image(); // Membuat objek gambar
    img.onload = () => setSurfaceImage('/pic.jpg'); // Jika gambar berhasil dimuat, set ke state surfaceImage
    img.onerror = () => console.error('Gambar /pic.jpg tidak ditemukan.'); // Jika ada error saat memuat gambar
    img.src = '/pic.jpg'; // Menetapkan jalur gambar

    // Memuat gambar kedua secara manual
    const img1 = new Image(); // Membuat objek gambar kedua
    img1.onload = () => setSurfaceImage1('/pic0.jpg'); // Jika gambar berhasil dimuat, set ke state surfaceImage1
    img1.onerror = () => console.error('Gambar /pic0.jpg tidak ditemukan.'); // Jika ada error saat memuat gambar
    img1.src = '/pic0.jpg'; // Menetapkan jalur gambar
  }, []); // Dependency array kosong memastikan efek ini hanya dijalankan sekali saat komponen dimuat

  return (
    <div className="container"> {/* Elemen utama yang membungkus semua konten */}
      <div className="header"> {/* Bagian header */}
        <div className='nama-tim'>HELLO WORLD</div> {/* Nama tim */}
        <div className='nama'>HELLO WORLD PT.2</div>
        <div className='lintasan'> WELCOME TO THE JUNGLE (  :D )</div> {/* Informasi lintasan */}
      </div>
      <div className="content"> {/* Bagian konten utama */}
        <div className="scores"> {/* Area untuk menampilkan skor atau gambar */}
          <div className="score"> {/* Div untuk gambar pertama */}
            {/* Menampilkan gambar pertama */}
            <img 
              src={surfaceImage} 
              alt="Surface Imaging" 
              style={{ maxWidth: '100%', maxHeight: '100%', height: 'auto', width: 'auto' }} 
            />
          </div>
          <div className="score"> {/* Div untuk gambar kedua */}
            {/* Menampilkan gambar kedua */}
            <img 
              src={surfaceImage1} 
              alt="Surface Imagingg" 
              style={{ maxWidth: '100%', maxHeight: '100%', height: 'auto', width: 'auto' }} 
            />
          </div>
          </div>
          <div className="video-container" style={{ marginTop: '20px', textAlign: 'center' }}>
          <h2>Video Output</h2>
          <video 
            width="800" 
            controls 
            style={{ border: '1px solid black', borderRadius: '10px' }}
          >
            <source src="/1122.mp4" type="video/MP4" />
            Your browser does not support the video tag.
          </video>
        </div>
        </div>
    </div>
  );
}

// Mengekspor komponen agar dapat digunakan di file lain
export default App;
