import numpy as np
import matplotlib.pyplot as plt
from control import tf, rlocus

# Define the transfer function G(s) = K / [(s+1)(s+2)(s+3)(s+4)]
numerator = [1]  # K is implicit in root locus
denominator = np.poly([-1, -2, -3, -4])  # Roots correspond to poles at -1, -2, -3, -4
G = tf(numerator, denominator)

# Plot the root locus
plt.figure(figsize=(10, 6))
rlocus(G, grid=True)
plt.title("Root Locus of G(s) = K / [(s+1)(s+2)(s+3)(s+4)]")
plt.xlabel("Real Axis")
plt.ylabel("Imaginary Axis")
plt.axhline(0, color='black', linewidth=0.8)
plt.axvline(0, color='black', linewidth=0.8)
plt.show()

# import numpy as np
# import control
# import matplotlib.pyplot as plt

# # Fungsi untuk membuat transfer function dengan penguatan K
# def create_transfer_function(K):
#     num = [K]  # Pembilang dengan penguatan K
#     den = [1, 10, 35, 50, 24]  # Penyebut tetap
#     return control.TransferFunction(num, den)

# # Siapkan plot
# plt.figure(figsize=(12, 10))

# # Beberapa variasi penguatan K
# K_values = [1, 5, 10, 50, 100]

# # Warna untuk setiap plot
# colors = ['blue', 'red', 'green', 'purple', 'orange']

# # Plot root locus untuk setiap nilai K
# for K, color in zip(K_values, colors):
#     # Buat sistem dengan penguatan K
#     sys = create_transfer_function(K)
    
#     # Gambar root locus
#     control.root_locus(sys, plot=True, color=color, label=f'K = {K}')

# # Konfigurasi plot
# plt.title('Root Locus Sistem Orde 4 dengan Variasi Penguatan K')
# plt.xlabel('Real')
# plt.ylabel('Imajiner')
# plt.grid(True, linestyle='--', alpha=0.7)

# # Tambahkan garis sumbu
# plt.axhline(y=0, color='k', linestyle='--')
# plt.axvline(x=0, color='k', linestyle='--')

# plt.legend()
# plt.tight_layout()
# plt.show()