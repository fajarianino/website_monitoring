from ultralytics import YOLO
import cv2
# Correct the model path
model = YOLO(r'D:\D4TRIK23\GAMANTARAY\best.pt')  # Use raw string

# Correct the video and output paths
video_path = r'D:\D4TRIK23\GAMANTARAY\VIDEO.mp4'  # Use raw string

cap = cv2.VideoCapture(video_path)

# Memeriksa apakah video dapat dibuka
if not cap.isOpened():
    print("Error: Tidak dapat membuka video.")
    exit()

# Tentukan output video (opsional)
output_path = r'D:\D4TRIK23\GAMANTARAY\VIDEO-out.mp4'  ####
fourcc = cv2.VideoWriter_fourcc(*'mp4v')
fps = int(cap.get(cv2.CAP_PROP_FPS))
width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))

# Parameter untuk melewati frame
skip_frames = 1  # memproses setiap frame
frame_count = 0  # Counter untuk frame

# Proses setiap frame
while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        print("Tidak ada frame yang tersedia. Keluar dari video.")
        break

    # Melewati frame yang tidak perlu
    if frame_count % skip_frames != 0:
        frame_count += 1
        continue

    frame_count += 1

    # Jalankan deteksi objek
    results = model(frame, conf=0.05)

    # Proses deteksi
    buoym_largest = None
    buoyh_largest = None
    max_area_buoym = 0
    max_area_buoyh = 0

    for result in results[0].boxes:  # Akses hasil deteksi
        cls = int(result.cls[0])  # Kelas objek
        bbox = result.xyxy[0].cpu().numpy()  # Koordinat bounding box [x1, y1, x2, y2]
        x1, y1, x2, y2 = bbox
        area = (x2 - x1) * (y2 - y1)  # Hitung area bounding box

        if cls == 0:  # Ganti dengan indeks kelas buoym
            if area > max_area_buoym:
                max_area_buoym = area
                buoym_largest = (int((x1 + x2) / 2), int((y1 + y2) / 2))  # Titik tengah
        elif cls == 1:  # Ganti dengan indeks kelas buoyh
            if area > max_area_buoyh:
                max_area_buoyh = area
                buoyh_largest = (int((x1 + x2) / 2), int((y1 + y2) / 2))  # Titik tengah

    # Gambarkan garis dan titik tengah jika kedua objek ditemukan
    if buoym_largest and buoyh_largest:
        # Gambarkan garis
        cv2.line(frame, buoym_largest, buoyh_largest, (0, 255, 0), 2)

        # Hitung koordinat titik tengah
        midpoint = ((buoym_largest[0] + buoyh_largest[0]) // 2, (buoym_largest[1] + buoyh_largest[1]) // 2)

        # Gambarkan titik tengah
        cv2.circle(frame, midpoint, 5, (0, 0, 255), -1)  

    # Gambarkan bounding box dan anotasi deteksi
    annotated_frame = results[0].plot()

    # Resize frame untuk tampilan lebih kecil
    frame_resized = cv2.resize(annotated_frame, (640, 480))  # Ubah ukuran sesuai kebutuhan

    # Tampilkan frame yang telah diubah ukurannya
    cv2.imshow("Detection", frame_resized)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

    # Simpan frame yang telah di-annotasi ke output video
    out.write(annotated_frame)

# Tutup semua jendela dan release resource
cap.release()
out.release()
cv2.destroyAllWindows()

# Verifikasi apakah video output telah disimpan
print(f"Video output disimpan di: {output_path}") 