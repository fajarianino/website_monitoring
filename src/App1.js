import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import L from 'leaflet'; // Import Leaflet library
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS
// import io from 'socket.io-client'; // Import Socket.IO-client
// const socket = io('http://localhost:3001'); // Menghubungkan ke server backend

function App() {
  const [activeStep, setActiveStep] = useState(0); // State untuk melacak langkah aktif
  const mapRef = useRef(null); // useRef untuk menyimpan referensi ke elemen peta
  const [trajectoryData, setTrajectoryData] = useState([]); // Menyimpan data lintasan
  const [surfaceImage1, setSurfaceImage1] = useState('/image1.jpg');
  const [surfaceImage2, setSurfaceImage2] = useState('/image2.jpg');

  //Waktu dan Tanggal//
  const [showTime, setShowTime] = useState('');
  const [showDate, setShowDate] = useState('');
  const updateTime = () => {
    const date = new Date();
    const time =
      String(date.getHours()).padStart(2, '0') + ':' +
      String(date.getMinutes()).padStart(2, '0') + ':' +
      String(date.getSeconds()).padStart(2, '0');
    setShowTime(time);
  };
  const updateDate = () => {
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1; // Note: getMonth() is zero-based
    const year = date.getFullYear();
    const dayOfWeek = date.toLocaleString('default', { weekday: 'long' });
    setShowDate(`${dayOfWeek},${day}/${month}/${year}`);

  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      updateTime();
      updateDate();
    }, 1000); // Update setiap 1 detik
    return () => clearInterval(intervalId);
  }, []);

  // Gambar yang berganti otomatis
  
   useEffect(() => {
  //   // Menerima gambar pertama dari server
  //   socket.on('new-image1', (imageName1) => {
  //     const imageUrl1 = `http://localhost:3001/${imageName1}`;
  //     setSurfaceImage1(imageUrl1); // Update surfaceImage1
  //   });
  
  //   // Menerima gambar kedua dari server
  //   socket.on('new-image2', (imageName2) => {
  //     const imageUrl2 = `http://localhost:3001/${imageName2}`;
  //     setSurfaceImage2(imageUrl2); // Update surfaceImage2
  //   });
  
  //   return () => {
  //     socket.off('new-image1'); // Cleanup listener gambar pertama
  //     socket.off('new-image2'); // Cleanup listener gambar kedua
  //   };
  // }, []);
  

    const imgPaths1 = ['/pic.jpg', '/pic1_0.jpg'];
    let currentIndex1 = 0;
    let intervalId1;

    const loadImage1 = (path) => {
      const img = new Image();
      img.onload = () => {
        setSurfaceImage1(path);
      };
      img.onerror = () => {
        console.error('Gambar ${path} tidak ditemukan.');
      };
      img.src = path;
    };

    const changeImage1 = () => {
      currentIndex1++; // Tambah indeks
        if (currentIndex1 < imgPaths1.length) {
            loadImage1(imgPaths1[currentIndex1]);
        } else {
            clearInterval(intervalId1); // Hentikan interval jika sudah mencapai gambar terakhir
        }
    };

    loadImage1(imgPaths1[currentIndex1]);
    intervalId1 = setInterval(changeImage1, 5000); // Ganti gambar setiap 5 detik

    return () => clearInterval(intervalId1);
  }, []);

  useEffect(() => {
    const imgPaths2 = ['/pic.jpg', '/pic1_1.jpg'];
    let currentIndex2 = 0;
    let intervalId2;

    const loadImage2 = (path) => {
      const img = new Image();
      img.onload = () => {
        setSurfaceImage2(path);
      };
      img.onerror = () => {
        console.error('Gambar ${path} tidak ditemukan.');
      };
      img.src = path;
    };

    const changeImage2 = () => {
      currentIndex2++; // Tambah indeks
        if (currentIndex2 < imgPaths2.length) {
            loadImage2(imgPaths2[currentIndex2]);
        } else {
            clearInterval(intervalId2); // Hentikan interval jika sudah mencapai gambar terakhir
        }
    };

    loadImage2(imgPaths2[currentIndex2]);
    intervalId2 = setInterval(changeImage2, 5000); // Ganti gambar setiap 5 detik

    return () => clearInterval(intervalId2);
  }, []);

  // Step changer
  const StepChangerComponent = () => {
    const [coordinates, setCoordinates] = useState([]);
    
    useEffect(() => {
      // Load GPS data from file
      const loadGPSData = async () => {
        const response = await fetch('path/to/gps.txt'); // Ganti dengan path yang sesuai
        const gpsData = await response.json(); // Menganggap data dalam format JSON
        setCoordinates(gpsData);
      };
      
      loadGPSData();
    }, []);
  
    useEffect(() => {
      if (coordinates.length === 0) return;
  
      let currentStep = 0; // Langkah aktif
      const targetCoordinates = coordinates.map(coord => [coord.lat, coord.lng]); // Parsing koordinat dari data
  
      const stepThreshold = 0.0001; // Jarak toleransi untuk dianggap "sampai" di tujuan
  
      const isCloseToTarget = (currentPos, targetPos) => {
        const distance = Math.sqrt(
          Math.pow(currentPos[0] - targetPos[0], 2) +
          Math.pow(currentPos[1] - targetPos[1], 2)
        );
        return distance < stepThreshold;
      };
  
      const intervalId = setInterval(() => {
        if (currentStep < targetCoordinates.length) {
          const currentPos = coordinates[currentStep] || [0, 0]; // Ambil koordinat saat ini
          const targetPos = targetCoordinates[currentStep]; // Ambil koordinat target untuk langkah saat ini
          
          if (isCloseToTarget(currentPos, targetPos)) {
            currentStep++; // Jika dekat dengan target, naikkan langkah
            setActiveStep(currentStep); // Update langkah aktif
          }
        } else {
          clearInterval(intervalId); // Hentikan interval jika semua langkah sudah selesai
        }
      }, 5000); // Cek setiap 5 detik
  
      return () => clearInterval(intervalId); // Cleanup on unmount
    }, [coordinates]);
  
    return null; // No rendering from this component
  };
  


  // LEAFLET MAPPING TRAJECTORY
  useEffect(() => {
    const initMap = () => {
      if (!mapRef.current) {
        mapRef.current = L.map('map-container').setView([-7.7653708, 110.3703668], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 22,
        }).addTo(mapRef.current);
      }
    };
  
    const fetchGPSData = async () => {
      try {
        const response = await fetch('/gps.txt'); // Ganti path dengan lokasi file GPS
        const text = await response.text();
        const lines = text.trim().split('\n'); // Memecah file per baris
        return lines; // Mengembalikan array dari setiap baris
      } catch (error) {
        console.error('Error reading the file:', error);
        return [];
      }
    };
  
    const updateMapWithTrajectory = (position) => {
      if (mapRef.current && position.length > 0) {
        const polyline = L.polyline(position, { color: 'blue' }).addTo(mapRef.current); // Tambahkan titik lintasan ke peta
        mapRef.current.fitBounds(polyline.getBounds()); // Sesuaikan peta agar sesuai lintasan
      }
    };
  
    const startTrajectoryUpdates = async () => {
      const lines = await fetchGPSData(); // Ambil semua data GPS
      let index = 0; // Indeks untuk melacak baris GPS yang sedang diproses
      let trajectory = []; // Menyimpan lintasan yang sudah ditampilkan
  
      const intervalId = setInterval(() => {
        if (index < lines.length) {
          const [lat, lng] = lines[index].split(',').map(Number); // Ambil latitude dan longitude dari baris saat ini
          const newPoint = [lat, lng];
          
          // Tambahkan titik baru ke lintasan yang ada
          trajectory = [...trajectory, newPoint]; // Tambahkan titik baru ke array lintasan
          
          setTrajectoryData(trajectory); // Perbarui state trajectoryData dengan lintasan yang sudah ada
          updateMapWithTrajectory(trajectory); // Perbarui peta dengan lintasan terbaru
          
          index++; // Naikkan indeks untuk memproses baris berikutnya
        } else {
          clearInterval(intervalId); // Hentikan interval jika semua baris sudah diproses
        }
      }, 1000); // Ambil data GPS setiap 1 detik
  
      return () => clearInterval(intervalId); // Bersihkan interval ketika komponen di-unmount
    };
  
    initMap(); // Inisialisasi peta
    startTrajectoryUpdates(); // Mulai proses pembacaan lintasan
  
  }, []);
  
  
  // useEffect(() => {
  //   const initMap = () => {
  //     if (!mapRef.current) {
  //       mapRef.current = L.map('map-container').setView([-7.7653708, 110.3703668], 13);
  //       L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  //         attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  //         maxZoom: 20,
  //       }).addTo(mapRef.current);
  //     }
  //   };
  
  //   initMap();
  
  
  //   const updateTrajectoryFromFile = async () => {
  //     try {
  //       const response = await fetch('/gps.txt'); // Ganti path dengan lokasi file Anda
  //       const text = await response.text();
  
  //       // Parsing latitude dan longitude dari file txt
  //       const lines = text.trim().split('\n');
  //       const positions = lines.map(line => {
  //         const [lat, lng] = line.split(',').map(Number);
  //         return [lat, lng];
  //       });
  
  //       setTrajectoryData(positions);
  //     } catch (error) {
  //       console.error('Error reading the file:', error);
  //     }
  //   };
  
  //   const updateMapWithTrajectory = () => {
  //     if (mapRef.current && trajectoryData.length > 0) {
  //       const polyline = L.polyline(trajectoryData, { color: 'blue' }).addTo(mapRef.current);
  //       mapRef.current.fitBounds(polyline.getBounds());
  //     }
  //   };
  
  //   if (typeof window !== 'undefined') {
  //     initMap();
  //   }
  
  //   const intervalId = setInterval(() => {
  //     updateTrajectoryFromFile(); // Memperbarui trajectory dari file setiap 5 detik
  //     updateMapWithTrajectory();   // Memperbarui peta dengan trajectory terbaru
  //   }, 5000);
  
  //   return () => clearInterval(intervalId);
  // }, [trajectoryData]);

  // Membaca file .txt dan menampilkan isinya SOG
  const [sogData, setSogData] = useState([]); // State untuk menyimpan data SOG dari file
  const [currentSogIndex, setCurrentSogIndex] = useState(0); // State untuk melacak baris SOG yang aktif
  useEffect(() => {
    const fetchSOGData = () => {
      fetch('/sog.txt') // Path ke file SOG
        .then((response) => response.text())
        .then((text) => {
          const lines = text.trim().split('\n'); // Memecah file menjadi beberapa baris
          setSogData(lines); // Simpan seluruh baris ke dalam state sogData
        })
        .catch((error) => {
          console.error('Error reading the file:', error);
        });
    };

    fetchSOGData(); // Ambil data SOG pertama kali
  }, []); // Hanya dijalankan sekali saat komponen pertama kali dimuat

  // Update indeks SOG setiap 10 detik
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (sogData.length > 0) {
        setCurrentSogIndex((prevIndex) => (prevIndex + 1) % sogData.length); // Update ke indeks berikutnya dengan loop
      }
    }, 1000);

    return () => clearInterval(intervalId); // Cleanup interval saat komponen di-unmount
  }, [sogData]); // Efek dipicu saat sogData berubah


  //lama
  // const [fileContent, setFileContent] = useState('');

  // useEffect(() => {
  //   const fetchSOG = () => {
  //     fetch('/sog.txt') // Path ke file SOG
  //       .then((response) => response.text())
  //       .then((text) => {
  //         setFileContent(text.trim()); // Simpan data SOG dari file .txt
  //       })
  //       .catch((error) => {
  //         console.error('Error reading the file:', error);
  //       });
  //   };
  
  //   // Memperbarui data setiap 5 detik
  //   const intervalId = setInterval(fetchSOG, 10000);
  
  //   // Cleanup interval ketika komponen di-unmount
  //   return () => clearInterval(intervalId);
  // }, []); // Mengosongkan dependency array agar hanya dijalankan sekali
  
  // const sogInKnots = parseFloat(fileContent); // Konversi dari teks ke angka (knot)
  // const sogInKmPerHour = sogInKnots * 1.852; // Konversi ke km/h

  // Membaca file .txt dan menampilkan isinya COG
  const [cogData, setCogData] = useState([]); // State untuk menyimpan data COG dari file
  const [currentCogIndex, setCurrentCogIndex] = useState(0); // State untuk melacak baris COG yang aktif


  // Fetch data COG hanya sekali
  useEffect(() => {
    const fetchCOGData = () => {
      fetch('/cog.txt') // Path ke file COG
        .then((response) => response.text())
        .then((text) => {
          const lines = text.trim().split('\n'); // Memecah file menjadi beberapa baris
          setCogData(lines); // Simpan seluruh baris ke dalam state cogData
        })
        .catch((error) => {
          console.error('Error reading the file:', error);
        });
    };

    fetchCOGData(); // Ambil data COG pertama kali
  }, []); // Hanya dijalankan sekali saat komponen pertama kali dimuat

  // Update indeks COG setiap 10 detik
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (cogData.length > 0) {
        setCurrentCogIndex((prevIndex) => (prevIndex + 1) % cogData.length); // Update ke indeks berikutnya dengan loop
      }
    }, 10000);

    return () => clearInterval(intervalId); // Cleanup interval saat komponen di-unmount
  }, [cogData]); // Efek dipicu saat cogData beruba
  //lama
  // const [fileContent1, setFileContent1] = useState('');

  // useEffect(() => {
  //   const fetchCOG = () => {
  //     fetch('/cog.txt') // Path ke file COG
  //       .then((response) => response.text())
  //       .then((text) => {
  //         setFileContent1(text.trim()); // Simpan data COG dari file .txt
  //       })
  //       .catch((error) => {
  //         console.error('Error reading the file:', error);
  //       });
  //   };
  
  //   // Memperbarui data setiap 5 detik
  //   const intervalId = setInterval(fetchCOG, 10000);
  
  //   // Cleanup interval ketika komponen di-unmount
  //   return () => clearInterval(intervalId);
  // }, []); // Mengosongkan dependency array agar hanya dijalankan sekali

  return (
    <div className="container">
      <div className="header">
        <div className='nama-tim'>Nama Tim: SAFINAH-ONE   PT: GAMANTARAY</div>
        <div className='lintasan'>Lintasan: .... ( A / B )</div>
        <div className="hari">{showDate}</div> {showTime/* Menampilkan waktu saat ini */}
      </div>

      <div className="content">
        <div className="position-log">
          <div className='log-tittle'>Position-Log</div>
          <div className='list1'>
            <div className={activeStep === 0 ? 'active-step' : 'step'}>Preparation</div>
            <div className={activeStep === 1 ? 'active-step' : 'step'}>Start</div>
            <div className={activeStep === 2 ? 'active-step' : 'step'}>Floating ball set 1-10</div>
            <div className={activeStep === 3 ? 'active-step' : 'step'}>Mission Surface Imaging</div>
            <div className={activeStep === 4 ? 'active-step' : 'step'}>Mission Underwater Imaging</div>
            <div className={activeStep === 5 ? 'active-step' : 'step'}>Finish</div>
          </div>
            <div className="logo-box">
            <div className='logo'>
            <p>POWERED BY</p>
            <img src="LogoGamantaray.png" alt="New Section Image" style={{ width: '70%', height: 'auto' }} />
            </div>
        </div>
        </div>

        <div className="scores">
           <div className="score">
             {<img src={surfaceImage1} alt="Surface Imaging1" style={{ maxWidth: '100%', maxHeight: '100%', height: 'auto', width: 'auto' }} />}
             </div>
           <div className="score">
             {<img src={surfaceImage2} alt="Surface Imaging2" style={{ maxWidth: '100%', maxHeight: '100%', height: 'auto', width: 'auto' }} />}
           </div>
         </div>
       </div>

       <div className="attitudes">
          <div className="attitudeinfo">
            <div className="attitude-tittle">Attitude Information</div>
            <div className="list2">
              <div className="stats">Trajectory graph</div>
              <div className="stats">
                {/* Menampilkan nilai SOG */}
                  SOG: {sogData.length > 0 && currentSogIndex < sogData.length ? (
                    <>
                      {parseFloat(sogData[currentSogIndex])} knots / {(parseFloat(sogData[currentSogIndex]) * 1.852).toFixed(2)} km/h
                    </>
                  ) : 'Loading...'}
              </div>

              <div className="stats">
                {/* Menampilkan nilai COG */} 
                COG: {cogData.length > 0 ? (
                  <>
                    {parseFloat(cogData[currentCogIndex])}°
                  </>
                ) : 'Loading...'}
              </div>
          </div>
        </div>


         
         <div className="attitude">
            <div id="map-container" style={{ width: '50%', height: '250px' }}></div>
              <div className="grid-overlay">
                {/*lintasan A*/ }
                <table>
                  <thead>
                    <tr>
                      <th>E5</th>
                      <th>D5</th>
                      <th>C5</th>
                      <th>B5</th>
                      <th>A5</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>E4</td>
                      <td>D4</td>
                      <td>C4</td>
                      <td>B4</td>
                      <td>A4</td>                   
                    </tr>
                    <tr>
                      <td>E3</td>
                      <td>D3</td>
                      <td>C3</td>
                      <td>B3</td>
                      <td>A3</td>
                    </tr>
                    <tr>
                      <td>E2</td>
                      <td>D2</td>
                      <td>C2</td>
                      <td>B2</td>
                      <td>A2</td>                  
                    </tr>
                    <tr>
                      <td>E1</td>
                      <td>D1</td>
                      <td>C1</td>
                      <td>B1</td>
                      <td>A1</td>                   
                    </tr>
                  </tbody>
                </table> 
                {/*lintasan B*/ }
                {/* <table>
                  <thead>
                    <tr>
                      <th>A5</th>
                      <th>B5</th>
                      <th>C5</th>
                      <th>D5</th>
                      <th>E5</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>A4</td>
                      <td>B4</td>
                      <td>C4</td>
                      <td>D4</td>
                      <td>E4</td>                   
                    </tr>
                    <tr>
                      <td>A3</td>
                      <td>B3</td>
                      <td>C3</td>
                      <td>D3</td>
                      <td>E3</td>
                    </tr>
                    <tr>
                      <td>B2</td>
                      <td>D2</td>
                      <td>C2</td>
                      <td>D2</td>
                      <td>E2</td>                  
                    </tr>
                    <tr>
                      <td>A1</td>
                      <td>B1</td>
                      <td>C1</td>
                      <td>D1</td>
                      <td>E1</td> 
                                        
                    </tr>
                  </tbody>
                </table>  */}
              </div>
            </div>
       </div>
    </div>
  );
}

export default App;

// import { useState, useEffect, useRef } from 'react';
// import L from 'leaflet';

// const WaypointComponent = () => {
//   const [activeStep, setActiveStep] = useState(0);
//   const [trajectoryData, setTrajectoryData] = useState([]);
//   const mapRef = useRef(null);

//   // Waypoints yang mendefinisikan tiap step
//   const waypoints = [
//     [-7.7653708, 110.3703668], // Waypoint 0 (Preparation)
//     [-7.7663708, 110.3713668], // Waypoint 1 (Start)
//     [-7.7673708, 110.3723668], // Waypoint 2 (Floating ball set 1-10)
//     [-7.7683708, 110.3733668], // Waypoint 3 (Mission Surface Imaging)
//     [-7.7693708, 110.3743668], // Waypoint 4 (Mission Underwater Imaging)
//     [-7.7703708, 110.3753668], // Waypoint 5 (Finish)
//   ];

//   const distanceThreshold = 0.0005; // Ambang batas untuk mencapai waypoint dalam derajat GPS

//   // Fungsi menghitung jarak antara dua titik GPS (latitude, longitude)
//   const calculateDistance = (point1, point2) => {
//     const [lat1, lng1] = point1;
//     const [lat2, lng2] = point2;
//     return Math.sqrt((lat1 - lat2) ** 2 + (lng1 - lng2) ** 2);
//   };

//   // Fungsi untuk memperbarui activeStep berdasarkan posisi GPS dan waypoint
//   const updateActiveStep = (currentPosition) => {
//     for (let i = 0; i < waypoints.length; i++) {
//       if (calculateDistance(currentPosition, waypoints[i]) < distanceThreshold) {
//         setActiveStep(i); // Perbarui activeStep jika mendekati waypoint tertentu
//         break;
//       }
//     }
//   };

//   useEffect(() => {
//     const initMap = () => {
//       if (!mapRef.current) {
//         mapRef.current = L.map('map-container').setView([-7.7653708, 110.3703668], 13);
//         L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//           attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
//           maxZoom: 20,
//         }).addTo(mapRef.current);
//       }
//     };

//     const fetchGPSData = async () => {
//       try {
//         const response = await fetch('/gps.txt'); // Ganti path ini dengan lokasi file GPS Anda
//         const text = await response.text();
//         const lines = text.trim().split('\n'); // Pisahkan file per baris
//         return lines; // Mengembalikan array dari setiap baris (koordinat GPS)
//       } catch (error) {
//         console.error('Error reading the file:', error);
//         return [];
//       }
//     };

//     const updateMapWithTrajectory = (position) => {
//       if (mapRef.current && position.length > 0) {
//         const polyline = L.polyline(position, { color: 'blue' }).addTo(mapRef.current); // Tambahkan lintasan ke peta
//         mapRef.current.fitBounds(polyline.getBounds()); // Sesuaikan peta sesuai lintasan
//       }
//     };

//     const startTrajectoryUpdates = async () => {
//       const lines = await fetchGPSData(); // Ambil semua data GPS
//       let index = 0; // Indeks untuk melacak baris GPS yang sedang diproses
//       let trajectory = []; // Menyimpan lintasan yang sudah ditampilkan

//       const intervalId = setInterval(() => {
//         if (index < lines.length) {
//           const [lat, lng] = lines[index].split(',').map(Number); // Ambil latitude dan longitude dari baris saat ini
//           const newPoint = [lat, lng];
          
//           // Tambahkan titik baru ke lintasan
//           trajectory = [...trajectory, newPoint]; 
          
//           // Perbarui state trajectoryData dan peta
//           setTrajectoryData(trajectory); 
//           updateMapWithTrajectory(trajectory); 
          
//           // Cek apakah posisi ini mendekati waypoint dan perbarui activeStep
//           updateActiveStep(newPoint); 
          
//           index++; // Naikkan indeks untuk memproses baris berikutnya
//         } else {
//           clearInterval(intervalId); // Hentikan interval jika semua baris sudah diproses
//         }
//       }, 1000); // Ambil data GPS setiap 1 detik
  
//       return () => clearInterval(intervalId); // Cleanup interval ketika komponen di-unmount
//     };

//     initMap(); // Inisialisasi peta
//     startTrajectoryUpdates(); // Mulai proses pembacaan lintasan

//   }, []);

//   return (
//     <div>
//       <div id="map-container" style={{ height: '400px' }}></div>
//       <div className={activeStep === 0 ? 'active-step' : 'step'}>Preparation</div>
//       <div className={activeStep === 1 ? 'active-step' : 'step'}>Start</div>
//       <div className={activeStep === 2 ? 'active-step' : 'step'}>Floating ball set 1-10</div>
//       <div className={activeStep === 3 ? 'active-step' : 'step'}>Mission Surface Imaging</div>
//       <div className={activeStep === 4 ? 'active-step' : 'step'}>Mission Underwater Imaging</div>
//       <div className={activeStep === 5 ? 'active-step' : 'step'}>Finish</div>
//     </div>
//   );
// };

// export default WaypointComponent;
