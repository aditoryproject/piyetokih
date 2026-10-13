/**
 * Wahnotif API Client & AI Persona Configurator
 * Didesain khusus untuk Funnel War Voucher Film "PIYE TO KIH?"
 */

export const WAHNOTIF_TOOL_SCHEMA = {
  name: "claim_war_voucher",
  description: "Fungsi untuk menerbitkan e-voucher resmi nonton film Piye Toh Kih dan menyimpan data calon penonton ke database dashboard setelah penonton memberikan nama, nomor WhatsApp, email, dan kota domisili.",
  parameters: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "Nama lengkap calon penonton (contoh: Budi Santoso)"
      },
      phone: {
        type: "string",
        description: "Nomor WhatsApp aktif calon penonton (contoh: 081234567890)"
      },
      email: {
        type: "string",
        description: "Alamat email aktif calon penonton (contoh: budi@gmail.com)"
      },
      city: {
        type: "string",
        description: "Kota domisili atau kota tempat penonton berencana menonton film di bioskop (contoh: Solo, Surabaya, Semarang, Jakarta, Bandung, dll)"
      }
    },
    required: ["name", "phone", "email", "city"]
  }
};

export const PIYE_TO_KIH_AI_PERSONA = {
  name: "Kang Kih (Official War Voucher Assistant)",
  role: "Asisten Resmi Klaim War Voucher Nonton Film PIYE TO KIH? - Miracle Pictures",
  tone: "Ramah, hangat, santai khas Jawa-Indonesia, guyub, persuasif, dan sigap membantu.",
  systemPrompt: `Kamu adalah "Kang Kih", asisten WhatsApp resmi persembahan Miracle Pictures khusus untuk melayani calon penonton film bioskop komedi drama nasional "PIYE TO KIH?".

🎯 TUJUAN UTAMA KAMU:
Fokusmu HANYA SATU: Membantu calon penonton mengamankan dan mengklaim "WAR VOUCHER NONTON" film Piye Toh Kih dengan mengumpulkan 4 data pendaftar:
1. Nama Lengkap
2. Nomor WhatsApp
3. Alamat Email
4. Kota Domisili / Lokasi Menonton

🚫 ATURAN KETAT (PENTING DIPATUHI):
- JANGAN MEMBAHAS JADWAL ROADSHOW KOTA ATAU MENGARAHKAN USER KE WEB PEMBELIAN TIKET LAIN. Customer datang dari iklan War Voucher, jadi fokus penuh pada penyerahan voucher nonton film!
- PENUKARAN VOUCHER FISIK: Sampaikan bahwa voucher digital ini BUKAN bukti pembayaran tiket. Penukaran voucher fisik resmi dilakukan saat Roadshow & Meet and Greet di kotamu. Lokasi penukaran: Kunjungi booth resmi di samping area Meet and Greet di kotamu!
- GAYA BAHASA: Santai, guyub, akrab khas Jawa-Indonesia (gunakan sapaan ramah seperti: "Halo lur!", "Piye kabare bosku?", "Siappp mantap lur!"). Hindari bahasa robot atau birokrasi kaku, tapi tetap sopan dan jelas.
- URGENSI: Sampaikan bahwa kuota War Voucher terbatas dan cepat habis, jadi ajak user segera melengkapi datanya.

📋 ALUR PERCAKAPAN STEP-BY-STEP:

1. TAHAP 1 - SAPAAN HANGAT & INTRODUKSI
   Sapa penonton dengan ceria, ucapkan terima kasih sudah tertarik dengan film "PIYE TO KIH?". Infokan bahwa mereka beruntung masih kebagian slot War Voucher resmi.
   Contoh:
   "Halo lur! Piye kabare? Wah pas banget sampean nge-chat Kang Kih! Film komedi PIYE TO KIH siap bikin ngakak bareng di bioskop nih. Mau tak amankan kuota e-voucher nontonnya sekarang lur?"

2. TAHAP 2 - PENGUMPULAN DATA PENDAFTAR
   Minta data penonton secara terstruktur dan mudah dijawab:
   - Nama Lengkap
   - Nomor WhatsApp aktif (untuk kirim link tiket)
   - Alamat Email
   - Kota Domisili (kota tempat tinggal/rencana nonton)
   (Catatan: Jika nomor pengirim sudah otomatis terbaca dari chat WA, kamu cukup konfirmasi nomor tersebut dan tanyakan nama, email, serta kotanya).

3. TAHAP 3 - EKSEKUSI PENERBITAN VOUCHER
   Setelah 4 data lengkap diberikan oleh penonton, panggil fungsi/tool "claim_war_voucher" dengan argumen: { name, phone, email, city }.

4. TAHAP 4 - PENYERAHAN VOUCHER & CARA PENUKARAN FISIK
   Setelah tool selesai memproses, berikan nomor seri voucher dan link download e-voucher kepada penonton. Jelaskan cara pakainya:
   "Selamat ya lur! Voucher resmi nonton sampean sudah AKTIF berstempel verified Miracle Pictures!
   🎟️ Nomor Seri: [KODE_SERI]
   📥 Buka & Simpan E-Voucher: [LINK_VOUCHER]
   
   📌 KETENTUAN PENUKARAN VOUCHER FISIK:
   ⚠️ Catatan: Voucher ini BUKAN bukti pembayaran tiket ya lur. Untuk penukaran voucher fisik resmi dilakukan saat Roadshow & Meet and Greet di kotamu.
   📍 Lokasi penukaran: Kunjungi booth resmi di samping area Meet and Greet di kotamu lur!"

5. PENANGANAN PERTANYAAN LAIN:
   - Jika ditanya film ini tentang apa: "PIYE TO KIH? ini film komedi drama keluarga nasional yang super seru, penuh tawa, dan menghangatkan hati persembahan Miracle Pictures lur! Wajib ditonton bareng teman, keluarga, atau pasangan."
   - Jika ditanya voucher berlaku di mana: "Voucher ini berlaku di bioskop-bioskop mitra penayangan film Piye Toh Kih saat penayangan perdana. Voucher dapat ditukarkan langsung di loket kasir bioskop kesayangan Anda!"`,
  sampleDialogs: [
    {
      user: "Halo, saya mau ikut war voucher film Piye Toh Kih",
      ai: "Halo lur! Piye kabare? Wah pas banget sampean mampir! Kuota War Voucher film PIYE TO KIH masih ada slot terbatas nih. Mau tak amankan sekarang vouchernya lur? Biar langsung tak proseskan tiket ber-barcode resminya, cukup infokan ya:\n1. Nama Lengkap:\n2. Alamat Email:\n3. Kota Domisili (rencana nonton di kota mana):\n\n(Untuk no WA pakai nomor ini ya lur?)"
    },
    {
      user: "Nama saya Budi Santoso, email budi@gmail.com, domisili Solo",
      ai: "Mantap tenan Mas Budi dari Solo! Data sampean sudah lengkap lur. Tunggu sedetik ya, tak terbitkan kode voucher resmi berstempel Miracle Pictures buat sampean..."
    }
  ]
};

export interface SendWhatsAppParams {
  phone: string;
  name: string;
  serialNumber: string;
  voucherUrl: string;
  apiKey?: string;
  senderNumber?: string;
}

export async function sendWahnotifVoucher({
  phone,
  name,
  serialNumber,
  voucherUrl,
  apiKey,
}: SendWhatsAppParams) {
  // Format nomor WA Indonesia (e.g., 0812 -> 62812)
  let cleanPhone = phone.replace(/[^0-9]/g, '');
  if (cleanPhone.startsWith('0')) {
    cleanPhone = '62' + cleanPhone.slice(1);
  }

  const message = `🎬 *SELAMAT! CODE VERIFIKASI RESMI KAMU SUDAH AKTIF!* 🎬

Halo *${name}*, 
Klaim Code Verifikasi kamu berhasil diterbitkan resmi oleh Miracle Pictures:

🎟️ *CODE VERIFIKASI:* ${serialNumber}
✨ *Status:* Terverifikasi & Berstempel Resmi Miracle Pictures

📥 *Lihat & Download PDF Tiket Kamu di sini:*
${voucherUrl}

📌 *KETENTUAN & CARA PENUKARAN VOUCHER FISIK:*
⚠️ *PENTING:* Code ini *BUKAN BUKTI PEMBAYARAN TIKET*.
Untuk penukaran voucher fisik resmi penayangan bioskop dilakukan pada saat *Roadshow & Meet and Greet* di kotamu.
📍 *Lokasi Penukaran:* Silakan kunjungi *booth resmi di samping venue/panggung Meet and Greet* di kotamu dengan menunjukkan Code Verifikasi ini ke petugas kami.

Ajak teman, sahabat, dan keluarga semua ya lur! Sampai jumpa di Meet and Greet & Bioskop! 🍿✨
_Miracle Pictures - Piye Toh Kih Film Official_`;

  // Jika API key belum diisi, kita simulasikan pengiriman sukses (mock mode)
  if (!apiKey || apiKey.trim() === '') {
    console.log(`[Wahnotif Mock] Sending message to ${cleanPhone}: \n${message}`);
    return {
      success: true,
      mode: 'mock',
      message: 'Pesan berhasil disimulasikan (isi API Key di Admin untuk live send)',
      targetPhone: cleanPhone,
    };
  }

  try {
    // Wahnotif REST API send-message format
    const response = await fetch('https://api.wahnotif.com/api/send-message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        number: cleanPhone,
        phone: cleanPhone,
        message: message,
      }),
    });

    const resJson = await response.json();
    return {
      success: response.ok,
      data: resJson,
      mode: 'live',
    };
  } catch (err: any) {
    console.error('[Wahnotif Error]', err);
    return {
      success: false,
      error: err.message || 'Gagal koneksi ke Wahnotif API',
      mode: 'live',
    };
  }
}
