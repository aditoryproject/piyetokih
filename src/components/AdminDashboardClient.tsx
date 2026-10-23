'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import AdminLoginForm from '@/components/AdminLoginForm';
import {
  CITIES_DATA,
  cleanVenueToMallName,
  CityData,
  CinemaVenue,
  CityRundownItem,
  applyRoadshowOverride,
} from '@/lib/cities';
import { DEFAULT_MOVIE_SETTINGS, MovieSettings, MovieCastMember } from '@/lib/movie-types';
import { getYouTubeEmbedUrl } from '@/components/OfficialTrailerSection';
import {
  WAHNOTIF_TOOL_SCHEMA,
  WAHNOTIF_ALL_TOOLS,
  WAHNOTIF_TOOL_ROADSHOW_SCHEMA,
  WAHNOTIF_TOOL_TICKETS_SCHEMA,
  WAHNOTIF_TOOL_MOVIE_SCHEMA,
  WAHNOTIF_TOOL_VOUCHER_SCHEMA,
  WAHNOTIF_TOOL_PARTNERSHIP_SCHEMA,
  getWahnotifPersona,
  PIYE_TO_KIH_AI_PERSONA
} from '@/lib/wahnotif';
import {
  Users,
  Ticket,
  Calendar,
  Settings,
  Download,
  Search,
  ExternalLink,
  MessageSquare,
  Activity,
  Globe,
  Trash2,
  Save,
  CheckCircle,
  Copy,
  RefreshCw,
  Eye,
  Menu,
  X,
  MapPin,
  Film,
  Mail,
  Send,
  AlertCircle,
  Check,
  Newspaper,
  Plus,
  Edit,
  Image,
  LogOut,
  Key,
  Shield,
  Lock,
  Play,
  Share2,
  Upload,
  FolderUp,
  Bell,
  Filter,
  RotateCcw,
  Smartphone,
  Monitor,
  ShoppingCart,
  Power,
  AlertTriangle,
  Sparkles,
  Clock,
} from 'lucide-react';


export default function AdminDashboardClient() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'leads' | 'movie' | 'articles' | 'settings' | 'bogo' | 'email' | 'cities' | 'wahnotif' | 'analytics' | 'reminders'>('movie');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [siteOrigin, setSiteOrigin] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSiteOrigin(window.location.origin);
    }
  }, []);

  // Articles state
  const [articles, setArticles] = useState<any[]>([]);
  const [loadingArticles, setLoadingArticles] = useState(false);
  const [articleCategoryFilter, setArticleCategoryFilter] = useState('Semua');
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<any>(null);
  const [articleForm, setArticleForm] = useState({
    id: '',
    title: '',
    slug: '',
    category: 'Kabar Film',
    cityTag: '',
    publishedAt: new Date().toISOString().split('T')[0],
    readTime: '3 menit baca',
    author: 'Tim Media Miracle Pictures',
    summary: '',
    content: '',
    coverImage: '',
    galleryImagesText: '',
    isPublished: true,
    seoTitle: '',
    seoDescription: '',
    tag: '',
    featured: false,
    ctaText: '',
    ctaLink: '',
    pdfUrl: '',
    externalUrl: '',
    mediaName: '',
    videoUrl: '',
    videoDuration: '',
    photoCount: '',
    location: '',
  });
  const [savingArticle, setSavingArticle] = useState(false);

  // Leads state
  const [leads, setLeads] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');
  const [cityBreakdown, setCityBreakdown] = useState<Record<string, number>>({});
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(true);

  // BOGO Presale Reminders state
  const [bogoReminders, setBogoReminders] = useState<any[]>([]);
  const [loadingReminders, setLoadingReminders] = useState(false);
  const [blastingReminder, setBlastingReminder] = useState(false);
  const [blastResult, setBlastResult] = useState<{ total: number; sentWhatsapp: number; sentEmail: number } | null>(null);
  const [followingUpPresale, setFollowingUpPresale] = useState(false);
  const [followupResult, setFollowupResult] = useState<{ total: number; sent: number; failed: number } | null>(null);

  // Advanced Presale Follow-Up Modal State
  const [isFollowupModalOpen, setIsFollowupModalOpen] = useState(false);
  const [followupTarget, setFollowupTarget] = useState<'all' | 'leads' | 'reminders'>('all');
  const [followupCity, setFollowupCity] = useState<string>('all');
  const [followupStage, setFollowupStage] = useState<number>(1);
  const [followupDelay, setFollowupDelay] = useState<number>(8); // Safe anti-spam delay in seconds
  const [followupForceResend, setFollowupForceResend] = useState<boolean>(false);
  const [followupPreviewText, setFollowupPreviewText] = useState<string>('');
  const [followupEligibleCount, setFollowupEligibleCount] = useState<number>(0);
  const [loadingFollowupPreview, setLoadingFollowupPreview] = useState<boolean>(false);

  // Settings state
  const [settings, setSettings] = useState<any>({
    totalQuota: 500,
    isWarOpen: true,
    isMaintenanceMode: true,
    maintenanceHeadline: 'COMING SOON',
    maintenanceSubtitle: 'Website Resmi Film PIYE TO KIH? The Movie sedang mempersiapkan sesuatu yang istimewa. Nantikan jadwal roadshow 17 kota, penayangan bioskop, dan kejutan spesial!',
    countdownTarget: '2026-10-22T13:00:00+07:00',
    metaPixelId: '',
    wahnotifApiKey: '',
    wahnotifSenderNumber: '6285220954750',
    cityLinkOverrides: {},
    // Email defaults
    smtpHost: '',
    smtpPort: 465,
    smtpUser: '',
    smtpPass: '',
    smtpFrom: 'Miracle Pictures <ticket@piyetokihfilm.com>',
    emailSubject: '🎟️ E-Voucher Resmi Nonton Film PIYE TO KIH? - Miracle Pictures',
    // Premiere validity
    voucherValidDatesText: '19 - 20 November 2026 (Penayangan Perdana)',
    voucherValidStart: '2026-11-19',
    voucherValidEnd: '2026-11-20',
    voucherTermsText: 'Hanya dapat ditukarkan di loket kasir bioskop mitra pada periode penayangan perdana film Piye To Kih.',
    socialLinks: {
      instagram: 'https://www.instagram.com/piyetokihfilm.official/',
      tiktok: '',
      facebook: '',
      youtube: '',
    },
    kabarGaleriSettings: {
      heroCategory: 'KABAR & GALERI',
      heroTitle: 'PIYE TO KIH? RESMI RILIS OFFICIAL POSTER & TRAILER',
      heroQuote: '“Tentang kita, yang selalu mencari jalan pulang.”',
      heroExcerpt: 'Film PIYE TO KIH? akhirnya merilis official poster dan trailer perdana yang memperlihatkan kisah penuh makna tentang persahabatan, keluarga, dan pencarian jati diri di tanah Jawa.',
      heroCoverImage: '',
      heroCtaText: 'Baca Selengkapnya',
      heroCtaLink: '#kabar-film',
      mediaKitPosterUrl: '',
      mediaKitTeaserPosterUrl: '',
      mediaKitMainPosterUrl: '',
      mediaKitPressReleasePdfUrl: '',
      mediaKitStillsZipUrl: '',
      mediaKitFactSheetPdfUrl: '',
      mediaKitBtsZipUrl: '',
      mediaKitCastPhotosUrl: '',
      mediaKitLogoPtkUrl: '',
      mediaKitLogoMiracleUrl: '',
      mediaKitLogoPackZipUrl: '',
      mediaKitVideoFirstLookUrl: '',
      mediaKitVideoTeaserUrl: '',
      mediaKitVideoMainTrailerUrl: '',
      mediaKitFilterInstagramUrl: '',
      mediaKitFilterTiktokUrl: '',
      mediaKitSoundtrackSpotifyUrl: '',
      mediaKitSoundtrackYoutubeUrl: '',
      mediaKitTrailerYoutubeUrl: '',
      mediaKitContactEmail: 'pr@miraclepictures.id',
      mediaKitContactWa: '6285220952407',
    },
  });
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  const [uploadingPoster, setUploadingPoster] = useState(false);

  const activePersona = useMemo(() => {
    return getWahnotifPersona({
      xxi: settings.bogoCinemaLinks?.xxi,
      tixid: settings.bogoCinemaLinks?.tixid,
      cgv: settings.bogoCinemaLinks?.cgv,
      cinepolis: settings.bogoCinemaLinks?.cinepolis,
      website: siteOrigin || 'https://piyetokihfilm.com',
    });
  }, [settings.bogoCinemaLinks, siteOrigin]);
  const [uploadingBackdrop, setUploadingBackdrop] = useState(false);
  const [uploadingHeroCover, setUploadingHeroCover] = useState(false);
  const [uploadingCastIdx, setUploadingCastIdx] = useState<number | null>(null);
  const [uploadingArticleCover, setUploadingArticleCover] = useState(false);
  const [uploadingArticleGallery, setUploadingArticleGallery] = useState(false);
  const [galleryUploadProgress, setGalleryUploadProgress] = useState<string>('');
  const [uploadingBogoBanner, setUploadingBogoBanner] = useState(false);

  // Server uploads list
  const [serverUploads, setServerUploads] = useState<Array<{ name?: string; filename?: string; url: string; size?: number; mtime?: number }>>([]);
  const [loadingUploads, setLoadingUploads] = useState(false);
  const [copiedUploadUrl, setCopiedUploadUrl] = useState<string | null>(null);

  const fetchServerUploads = async () => {
    try {
      setLoadingUploads(true);
      const res = await fetch('/api/admin/upload');
      const data = await res.json();
      if (data.success && Array.isArray(data.files)) {
        setServerUploads(data.files);
      }
    } catch (err) {
      console.error('Failed to fetch server uploads', err);
    } finally {
      setLoadingUploads(false);
    }
  };

  const handleFileUpload = async (file: File, category: string = 'movie', skipRefresh: boolean = false): Promise<string | null> => {
    // 1. Validasi Ukuran (Maks 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert(`Ukuran file "${file.name}" terlalu besar (${(file.size / (1024 * 1024)).toFixed(1)}MB). Batas maksimal adalah 10MB per foto.`);
      return null;
    }

    // 2. Cegah upload file video mentah ke input gambar
    if (file.type.startsWith('video/')) {
      alert(`File "${file.name}" adalah file video. Video film ditautkan melalui Link YouTube pada tab/bidang yang tersedia, bukan diunggah langsung ke storage gambar.`);
      return null;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);
    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        if (!skipRefresh) fetchServerUploads();
        return data.url;
      } else {
        alert(data.error || 'Gagal mengunggah file.');
        return null;
      }
    } catch {
      alert('Terjadi kesalahan koneksi saat mengunggah gambar.');
      return null;
    }
  };

  const handleUploadMultipleGallery = async (files: File[]) => {
    if (files.length === 0) return;
    setUploadingArticleGallery(true);
    const validUrls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setGalleryUploadProgress(`Mengunggah foto ${i + 1} dari ${files.length}...`);
      const url = await handleFileUpload(file, 'article-gallery', true);
      if (url) validUrls.push(url);
    }
    setGalleryUploadProgress('');
    setUploadingArticleGallery(false);
    fetchServerUploads();
    if (validUrls.length > 0) {
      const existing = articleForm.galleryImagesText ? articleForm.galleryImagesText.trim() + '\n' : '';
      setArticleForm((prev) => ({
        ...prev,
        galleryImagesText: existing + validUrls.join('\n'),
      }));
    }
  };

  // Email test state
  const [testEmailTo, setTestEmailTo] = useState('');
  const [testingEmail, setTestingEmail] = useState(false);
  const [testEmailResult, setTestEmailResult] = useState<{ success: boolean; message: string } | null>(null);

  // Visitors state & filters
  const [visitors, setVisitors] = useState<any[]>([]);
  const [visitorCityFilter, setVisitorCityFilter] = useState('all');
  const [visitorEventFilter, setVisitorEventFilter] = useState('all');
  const [visitorPlatformFilter, setVisitorPlatformFilter] = useState('all');
  const [visitorSearch, setVisitorSearch] = useState('');

  // Copied states
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedWebhook, setCopiedWebhook] = useState(false);

  // 17 Roadshow Cities schedule editor state
  const [selectedCitySlug, setSelectedCitySlug] = useState<string>('semarang');
  const [citySearchQuery, setCitySearchQuery] = useState<string>('');
  const [expandedSection, setExpandedSection] = useState<'cinemas' | 'booth' | 'rundown'>('cinemas');


  // Security & Authentication state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState<{ success: boolean; msg: string } | null>(null);

  const handleLogout = async () => {
    if (!confirm('Apakah Anda yakin ingin keluar dari Dashboard Administrator?')) return;
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } finally {
      window.location.replace('/admin');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordStatus(null);
    setUpdatingPassword(true);

    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newUsername,
          newPassword,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setPasswordStatus({ success: true, msg: data.message || 'Kredensial berhasil diperbarui!' });
        setCurrentPassword('');
        setNewPassword('');
        setNewUsername('');
      } else {
        setPasswordStatus({ success: false, msg: data.error || 'Gagal mengubah password.' });
      }
    } catch (err: any) {
      setPasswordStatus({ success: false, msg: err.message || 'Terjadi kesalahan jaringan.' });
    } finally {
      setUpdatingPassword(false);
    }
  };

  const fetchLeads = () => {
    setLoadingLeads(true);
    fetch(`/api/admin/leads?search=${encodeURIComponent(search)}&source=${sourceFilter}&city=${cityFilter}`)
      .then(r => r.json())
      .then(data => {
        setLeads(data.leads || []);
        if (data.cityBreakdown) setCityBreakdown(data.cityBreakdown);
        if (data.availableCities) setAvailableCities(data.availableCities);
      })
      .finally(() => setLoadingLeads(false));
  };

  const fetchSettings = () => {
    fetch('/api/admin/settings')
      .then(r => {
        if (!r.ok) return null;
        return r.json();
      })
      .then(data => {
        if (data?.settings) setSettings(data.settings);
      })
      .catch((err) => {
        console.error('Error fetching settings:', err);
      });
  };

  const fetchVisitors = () => {
    fetch('/api/track')
      .then(r => r.json())
      .then(data => {
        setVisitors(data.visitors || []);
      });
  };

  const fetchArticles = () => {
    setLoadingArticles(true);
    fetch('/api/articles')
      .then(r => r.json())
      .then(data => {
        if (data.success && Array.isArray(data.articles)) {
          setArticles(data.articles);
        }
      })
      .finally(() => setLoadingArticles(false));
  };

  const fetchReminders = () => {
    setLoadingReminders(true);
    fetch('/api/bogo/reminder')
      .then(r => r.json())
      .then(data => {
        if (data.reminders) {
          setBogoReminders(data.reminders);
        }
      })
      .catch(err => console.error('Error fetching reminders:', err))
      .finally(() => setLoadingReminders(false));
  };

  const handleTriggerBlast = async () => {
    const unSent = bogoReminders.filter(r => r.reminderStatus !== 'sent').length;
    if (!confirm(`Kirim blast reminder sekarang ke ${unSent} pendaftar yang belum menerima reminder (via WhatsApp & Email)?`)) {
      return;
    }
    setBlastingReminder(true);
    setBlastResult(null);
    try {
      const res = await fetch('/api/cron/bogo-reminder', { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.success) {
        setBlastResult({
          total: data.totalProcessed,
          sentWhatsapp: data.sentWhatsapp,
          sentEmail: data.sentEmail,
        });
        alert(`Blast notifikasi selesai!\nTotal diproses: ${data.totalProcessed}\nWA terkirim: ${data.sentWhatsapp}\nEmail terkirim: ${data.sentEmail}`);
        fetchReminders();
      } else {
        alert(data.error || 'Gagal mengirim blast reminder');
      }
    } catch {
      alert('Terjadi kesalahan koneksi saat mengirim blast');
    } finally {
      setBlastingReminder(false);
    }
  };

  const fetchFollowupPreview = async (city: string, target: string, stage: number) => {
    setLoadingFollowupPreview(true);
    try {
      const res = await fetch(`/api/cron/presale-followup?city=${encodeURIComponent(city)}&target=${encodeURIComponent(target)}&stage=${stage}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setFollowupPreviewText(data.sampleMessagePreview || '');
        setFollowupEligibleCount(data.totalPendingFollowup || 0);
      }
    } catch (e) {
      console.error('Error fetching followup preview:', e);
    } finally {
      setLoadingFollowupPreview(false);
    }
  };

  const openFollowupModal = (target: 'all' | 'leads' | 'reminders' = 'all') => {
    setFollowupTarget(target);
    setIsFollowupModalOpen(true);
    fetchFollowupPreview(followupCity, target, followupStage);
  };

  const handleExecutePresaleFollowup = async () => {
    const targetLabel = followupCity === 'all' ? 'SEMUA KOTA' : `KOTA ${followupCity.toUpperCase()}`;
    if (!confirm(`Mulai kirim Follow-Up Presale (Stage ${followupStage}) ke ${targetLabel} dengan jeda aman ${followupDelay} detik per nomor?\n\nTarget: ${followupTarget.toUpperCase()}\nJumlah kontak siap kirim: ${followupEligibleCount} nomor`)) {
      return;
    }
    setFollowingUpPresale(true);
    setFollowupResult(null);
    try {
      const res = await fetch('/api/cron/presale-followup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target: followupTarget,
          city: followupCity,
          stage: followupStage,
          delaySeconds: followupDelay,
          forceResend: followupForceResend,
          limit: 250,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setFollowupResult({
          total: data.totalProcessed,
          sent: data.sentCount,
          failed: data.failCount,
        });
        alert(`Follow-up WA Selesai!\nTotal diproses: ${data.totalProcessed}\nBerhasil terkirim: ${data.sentCount}\nGagal: ${data.failCount}`);
        setIsFollowupModalOpen(false);
        fetchReminders();
        fetchLeads();
      } else {
        alert(data.error || 'Gagal mengirim follow-up WA');
      }
    } catch {
      alert('Terjadi kesalahan koneksi saat mengirim follow-up WA');
    } finally {
      setFollowingUpPresale(false);
    }
  };

  const handleTriggerPresaleFollowup = openFollowupModal;

  const handleExportRemindersCsv = () => {
    if (!bogoReminders.length) {
      alert('Belum ada data pendaftar reminder untuk diexport.');
      return;
    }
    const headers = ['Nama', 'WhatsApp', 'Email', 'Kota', 'Tanggal Daftar', 'Status Kirim', 'Waktu Kirim'];
    const rows = bogoReminders.map(r => [
      `"${(r.name || '').replace(/"/g, '""')}"`,
      `"${(r.phone || '').replace(/"/g, '""')}"`,
      `"${(r.email || '').replace(/"/g, '""')}"`,
      `"${(r.city || '').replace(/"/g, '""')}"`,
      `"${r.createdAt || ''}"`,
      `"${r.reminderStatus || 'pending'}"`,
      `"${r.sentAt || '-'}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `reminder_presale_bogo_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    fetchLeads();
    fetchSettings();
    fetchVisitors();
    fetchArticles();
    fetchReminders();
    fetchServerUploads();
  }, [search, sourceFilter, cityFilter]);

  const handleOpenNewArticle = () => {
    setEditingArticle(null);
    setArticleForm({
      id: '',
      title: '',
      slug: '',
      category: 'Kabar Film',
      cityTag: '',
      publishedAt: new Date().toISOString().split('T')[0],
      readTime: '3 menit baca',
      author: 'Tim Media Miracle Pictures',
      summary: '',
      content: '',
      coverImage: '',
      galleryImagesText: '',
      isPublished: true,
      seoTitle: '',
      seoDescription: '',
      tag: '',
      featured: false,
      ctaText: '',
      ctaLink: '',
      pdfUrl: '',
      externalUrl: '',
      mediaName: '',
      videoUrl: '',
      videoDuration: '',
      photoCount: '',
      location: '',
    });
    setIsArticleModalOpen(true);
  };

  const handleOpenEditArticle = (art: any) => {
    setEditingArticle(art);
    setArticleForm({
      id: art.id,
      title: art.title,
      slug: art.slug,
      category: art.category || 'Kabar Film',
      cityTag: art.cityTag || '',
      publishedAt: art.publishedAt || new Date().toISOString().split('T')[0],
      readTime: art.readTime || '3 menit baca',
      author: art.author || 'Tim Media Miracle Pictures',
      summary: art.summary || '',
      content: art.content || '',
      coverImage: art.coverImage || '',
      galleryImagesText: Array.isArray(art.galleryImages) ? art.galleryImages.join('\n') : '',
      isPublished: art.isPublished !== undefined ? art.isPublished : true,
      seoTitle: art.seoTitle || '',
      seoDescription: art.seoDescription || '',
      tag: art.tag || '',
      featured: !!art.featured,
      ctaText: art.ctaText || '',
      ctaLink: art.ctaLink || '',
      pdfUrl: art.pdfUrl || '',
      externalUrl: art.externalUrl || '',
      mediaName: art.mediaName || '',
      videoUrl: art.videoUrl || '',
      videoDuration: art.videoDuration || '',
      photoCount: art.photoCount || '',
      location: art.location || '',
    });
    setIsArticleModalOpen(true);
  };

  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!articleForm.title.trim()) {
      alert('Judul konten wajib diisi!');
      return;
    }
    setSavingArticle(true);

    try {
      const galleryImages = articleForm.galleryImagesText
        .split('\n')
        .map(url => url.trim())
        .filter(url => url.length > 0);

      const payload = {
        ...articleForm,
        galleryImages,
      };

      const res = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setIsArticleModalOpen(false);
        fetchArticles();
      } else {
        alert(data.error || 'Gagal menyimpan konten');
      }
    } catch (err: any) {
      alert('Terjadi kesalahan jaringan: ' + err.message);
    } finally {
      setSavingArticle(false);
    }
  };

  const handleDeleteArticle = async (id: string, title: string) => {
    if (!confirm(`Hapus konten "${title}"?`)) return;

    try {
      const res = await fetch(`/api/articles?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        fetchArticles();
      } else {
        alert(data.error || 'Gagal menghapus');
      }
    } catch (err: any) {
      alert('Terjadi kesalahan jaringan: ' + err.message);
    }
  };

  const handleDeleteAllArticles = async () => {
    if (!confirm('PERHATIAN: Apakah Anda yakin ingin MENGHAPUS SEMUA artikel, liputan, dan galeri dummy?\n\nTindakan ini akan mengosongkan semua data agar live website Anda benar-benar bersih (Clean Mode).')) return;

    try {
      const res = await fetch('/api/articles?deleteAll=true', {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        alert('Semua data berhasil dibersihkan! Dashboard dan website Anda kini dalam mode bersih.');
        fetchArticles();
      } else {
        alert(data.error || 'Gagal membersihkan data');
      }
    } catch (err: any) {
      alert('Terjadi kesalahan jaringan: ' + err.message);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsSuccess(false);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setSettingsSuccess(true);
        setTimeout(() => setSettingsSuccess(false), 3000);
      }
    } finally {
      setSavingSettings(false);
    }
  };

  const handleQuickToggleMaintenance = async (newVal: boolean) => {
    const confirmMsg = newVal
      ? 'Aktifkan Mode Coming Soon? Pengunjung umum hanya akan melihat halaman Coming Soon berlogo Piye To Kih.'
      : 'Matikan Mode Coming Soon? Seluruh landing page dan fitur roadshow akan langsung live untuk publik.';
    if (!confirm(confirmMsg)) return;

    setSavingSettings(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isMaintenanceMode: newVal }),
      });
      if (res.ok) {
        setSettings((prev: any) => ({ ...prev, isMaintenanceMode: newVal }));
        setSettingsSuccess(true);
        setTimeout(() => setSettingsSuccess(false), 3000);
      } else {
        alert('Gagal mengubah mode.');
      }
    } catch {
      alert('Terjadi kesalahan jaringan.');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleTestEmail = async () => {
    if (!testEmailTo) {
      alert('Masukkan alamat email penerima untuk pengujian!');
      return;
    }
    setTestingEmail(true);
    setTestEmailResult(null);
    try {
      const res = await fetch('/api/admin/email-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          host: settings.smtpHost,
          port: settings.smtpPort,
          user: settings.smtpUser,
          pass: settings.smtpPass,
          from: settings.smtpFrom,
          to: testEmailTo,
        }),
      });
      const data = await res.json();
      setTestEmailResult({
        success: data.success,
        message: data.success ? data.message : (data.error || 'Gagal mengirim email uji coba'),
      });
    } catch (err: any) {
      setTestEmailResult({
        success: false,
        message: err.message || 'Terjadi kesalahan jaringan.',
      });
    } finally {
      setTestingEmail(false);
    }
  };

  const handleDeleteLead = async (id: string) => {
    if (!confirm('Yakin ingin menghapus data lead ini?')) return;
    await fetch('/api/admin/leads', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    fetchLeads();
  };

  const handleClearAllLeads = async () => {
    if (!confirm('PERINGATAN: Apakah Anda yakin ingin MENGHAPUS SEMUA data leads pendaftar? Tindakan ini tidak dapat dibatalkan.')) return;
    await fetch('/api/admin/leads', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clearAll: true }),
    });
    fetchLeads();
  };

  const handleClearVisitors = async () => {
    if (!confirm('PERINGATAN: Bersihkan semua log riwayat trafik pengunjung?')) return;
    await fetch('/api/track', {
      method: 'DELETE',
    });
    fetchVisitors();
  };

  const handleExportVisitorsCsv = () => {
    if (!filteredVisitors.length) {
      alert('Tidak ada data log pengunjung untuk diexport.');
      return;
    }
    const headers = ['Waktu', 'Kota Terdeteksi', 'Perangkat', 'Halaman', 'Event', 'IP Address'];
    const rows = filteredVisitors.map(v => [
      `"${new Date(v.timestamp).toLocaleString('id-ID')}"`,
      `"${(v.city || '').replace(/"/g, '""')}"`,
      `"${(v.platform || '').replace(/"/g, '""')}"`,
      `"${(v.path || '').replace(/"/g, '""')}"`,
      `"${(v.event || '').replace(/"/g, '""')}"`,
      `"${(v.ip || '').replace(/"/g, '""')}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `log_pengunjung_${visitorCityFilter !== 'all' ? visitorCityFilter : 'semua'}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Unique filter options for Visitors
  const uniqueVisitorCities = React.useMemo(() => {
    const set = new Set<string>();
    visitors.forEach(v => {
      if (v.city) set.add(v.city);
    });
    return Array.from(set).sort();
  }, [visitors]);

  const uniqueVisitorPlatforms = React.useMemo(() => {
    const set = new Set<string>();
    visitors.forEach(v => {
      if (v.platform) set.add(v.platform);
    });
    return Array.from(set).sort();
  }, [visitors]);

  const uniqueVisitorEvents = React.useMemo(() => {
    const set = new Set<string>();
    visitors.forEach(v => {
      if (v.event) set.add(v.event);
    });
    return Array.from(set).sort();
  }, [visitors]);

  // Filtered visitors list
  const filteredVisitors = React.useMemo(() => {
    return visitors.filter(v => {
      // Filter Kota
      if (visitorCityFilter !== 'all' && v.city !== visitorCityFilter) {
        return false;
      }
      // Filter Perangkat
      if (visitorPlatformFilter !== 'all') {
        if (!v.platform?.toLowerCase().includes(visitorPlatformFilter.toLowerCase())) {
          return false;
        }
      }
      // Filter Event (Kategori atau Spesifik)
      if (visitorEventFilter !== 'all') {
        if (visitorEventFilter === 'AddToCart_ALL') {
          if (!v.event?.toLowerCase().includes('addtocart')) return false;
        } else if (visitorEventFilter === 'PageView_ALL') {
          if (!v.event?.toLowerCase().includes('pageview')) return false;
        } else if (visitorEventFilter === 'ViewCity_ALL') {
          if (!v.event?.toLowerCase().includes('viewcity')) return false;
        } else if (v.event !== visitorEventFilter) {
          return false;
        }
      }
      // Filter Pencarian Text
      if (visitorSearch.trim()) {
        const q = visitorSearch.toLowerCase();
        const matchIp = (v.ip || '').toLowerCase().includes(q);
        const matchPath = (v.path || '').toLowerCase().includes(q);
        const matchCity = (v.city || '').toLowerCase().includes(q);
        const matchEvent = (v.event || '').toLowerCase().includes(q);
        const matchPlatform = (v.platform || '').toLowerCase().includes(q);
        if (!matchIp && !matchPath && !matchCity && !matchEvent && !matchPlatform) {
          return false;
        }
      }
      return true;
    });
  }, [visitors, visitorCityFilter, visitorPlatformFilter, visitorEventFilter, visitorSearch]);

  // Dynamic statistics based on filtered visitors & overall
  const visitorStats = React.useMemo(() => {
    const totalDisplayed = filteredVisitors.length;
    let add_to_cart_count = 0;
    let page_view_count = 0;
    let view_city_count = 0;
    let other_count = 0;

    const eventCounts: Record<string, number> = {};

    filteredVisitors.forEach(v => {
      const evt = v.event || 'PageView';
      eventCounts[evt] = (eventCounts[evt] || 0) + 1;

      if (evt.toLowerCase().includes('addtocart')) {
        add_to_cart_count++;
      } else if (evt.toLowerCase().includes('pageview')) {
        page_view_count++;
      } else if (evt.toLowerCase().includes('viewcity')) {
        view_city_count++;
      } else {
        other_count++;
      }
    });

    return {
      totalDisplayed,
      add_to_cart_count,
      page_view_count,
      view_city_count,
      other_count,
      eventCounts,
    };
  }, [filteredVisitors]);

  const handleExportCsv = () => {
    const headers = ['Nomor Seri', 'Nama Lengkap', 'Nomor WA', 'Email', 'Kota', 'Lokasi Mall Penukaran', 'Sumber', 'Status WA', 'Waktu Klaim'];
    const rows = leads.map(l => [
      `"${l.serialNumber}"`,
      `"${l.name}"`,
      `"${l.phone}"`,
      `"${l.email}"`,
      `"${l.cityLocation || 'Nasional'}"`,
      `"${cleanVenueToMallName((l as any).venueLocation) || '-'}"`,
      `"${l.source}"`,
      `"${l.whatsappStatus}"`,
      `"${l.claimedAt}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `leads-war-voucher-${cityFilter !== 'all' ? cityFilter : 'semua-kota'}-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyToClipboard = (text: string, type: 'prompt' | 'webhook') => {
    navigator.clipboard.writeText(text);
    if (type === 'prompt') {
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    } else {
      setCopiedWebhook(true);
      setTimeout(() => setCopiedWebhook(false), 2000);
    }
  };

  // Helper to get city data merged with current settings.roadshowOverrides
  const getCurrentCityData = (slug: string): CityData => {
    const base = CITIES_DATA.find(c => c.slug === slug) || CITIES_DATA[0];
    const override = settings.roadshowOverrides?.[slug];
    return applyRoadshowOverride(base, override);
  };

  const activeCityData = useMemo<CityData>(() => {
    return getCurrentCityData(selectedCitySlug);
  }, [selectedCitySlug, settings.roadshowOverrides]);

  const isCityOverridden = (slug: string) => {
    const ov = settings.roadshowOverrides?.[slug];
    return Boolean(ov && Object.keys(ov).length > 0);
  };

  const updateSelectedCityField = <K extends keyof CityData>(field: K, value: CityData[K]) => {
    setSettings((prev: any) => ({
      ...prev,
      roadshowOverrides: {
        ...(prev.roadshowOverrides || {}),
        [selectedCitySlug]: {
          ...(prev.roadshowOverrides?.[selectedCitySlug] || {}),
          [field]: value,
        },
      },
    }));
  };

  const updateCinemaInSelectedCity = (cIdx: number, updatedFields: Partial<CinemaVenue>) => {
    const currentCinemas = [...(activeCityData.cinemas || [])];
    if (currentCinemas[cIdx]) {
      currentCinemas[cIdx] = { ...currentCinemas[cIdx], ...updatedFields };
      updateSelectedCityField('cinemas', currentCinemas);
      // Synchronize legacy cityLinkOverrides if ticketUrl changed
      if (updatedFields.ticketUrl !== undefined) {
        setSettings((prev: any) => ({
          ...prev,
          cityLinkOverrides: {
            ...(prev.cityLinkOverrides || {}),
            [`${selectedCitySlug}_${cIdx}`]: updatedFields.ticketUrl,
          },
        }));
      }
    }
  };

  const addCinemaToSelectedCity = () => {
    const currentCinemas = [...(activeCityData.cinemas || [])];
    const newCinema: CinemaVenue = {
      name: `${activeCityData.name.toUpperCase()} XXI`,
      chain: 'XXI',
      studio: 'Studio 1 Premiere Sound',
      seats: 150,
      showTimes: ['14.30 WIB'],
      ticketUrl: 'https://m.21cineplex.com',
      address: `Mall Kota ${activeCityData.name}`,
      remainingSeatsText: '±45 kursi tersisa',
      doorNote: 'Pintu teater dibuka 15 mnt sebelumnya',
      badgeText: 'SPECIAL SCREENING · GREETING CAST',
    };
    currentCinemas.push(newCinema);
    updateSelectedCityField('cinemas', currentCinemas);
  };

  const removeCinemaFromSelectedCity = (cIdx: number) => {
    if ((activeCityData.cinemas || []).length <= 1) {
      alert('Setiap kota harus memiliki minimal 1 bioskop penayangan.');
      return;
    }
    if (!confirm('Hapus bioskop ini dari jadwal roadshow kota?')) return;
    const currentCinemas = (activeCityData.cinemas || []).filter((_, idx) => idx !== cIdx);
    updateSelectedCityField('cinemas', currentCinemas);
  };

  const resetSelectedCityToDefault = () => {
    if (!confirm(`Kembalikan seluruh jadwal & bioskop Kota ${activeCityData.name} ke pengaturan default awal?`)) return;
    setSettings((prev: any) => {
      const nextOverrides = { ...(prev.roadshowOverrides || {}) };
      delete nextOverrides[selectedCitySlug];
      return {
        ...prev,
        roadshowOverrides: nextOverrides,
      };
    });
  };

  const updateBoothInfoInSelectedCity = (updatedFields: Partial<NonNullable<CityData['boothInfo']>>) => {
    const currentBooth = activeCityData.boothInfo || {
      venue: '',
      floor: '',
      timeStr: '',
      directions: '',
      exclusiveNotice: '',
    };
    updateSelectedCityField('boothInfo', { ...currentBooth, ...updatedFields });
  };

  const updateRundownItem = (rIdx: number, updatedFields: Partial<CityRundownItem>) => {
    const currentRundown = activeCityData.rundown
      ? { ...activeCityData.rundown }
      : { date: activeCityData.dateStr, voucherExchangeInfo: '', items: [] };
    const items = [...(currentRundown.items || [])];
    if (items[rIdx]) {
      items[rIdx] = { ...items[rIdx], ...updatedFields };
      updateSelectedCityField('rundown', { ...currentRundown, items });
    }
  };

  const addRundownItem = () => {
    const currentRundown = activeCityData.rundown
      ? { ...activeCityData.rundown }
      : { date: activeCityData.dateStr, voucherExchangeInfo: '', items: [] };
    const items = [...(currentRundown.items || [])];
    items.push({
      time: '14.00 – 16.00 WIB',
      category: 'Mall & Meet',
      title: 'Meet & Greet dan Penukaran Voucher Fisik',
      venue: activeCityData.boothInfo?.venue || `Mall Utama ${activeCityData.name}`,
    });
    updateSelectedCityField('rundown', { ...currentRundown, items });
  };

  const removeRundownItem = (rIdx: number) => {
    const currentRundown = activeCityData.rundown
      ? { ...activeCityData.rundown }
      : { date: activeCityData.dateStr, voucherExchangeInfo: '', items: [] };
    const items = (currentRundown.items || []).filter((_, idx) => idx !== rIdx);
    updateSelectedCityField('rundown', { ...currentRundown, items });
  };

  const remainingQuota = Math.max(0, (settings.totalQuota || 500) - leads.length);


  const menuItems = [
    { id: 'leads', label: 'Database Leads', icon: Users, badge: leads.length },
    { id: 'reminders', label: '🔔 Reminder Presale 15 Nov', icon: Bell, badge: bogoReminders.length },
    { id: 'movie', label: '🎬 Official Film & Media', icon: Film, badge: 'Global Sync' },
    { id: 'articles', label: '📰 Kabar & Galeri Hub', icon: Newspaper, badge: articles.length },
    { id: 'settings', label: 'Pengaturan Voucher & Tayang', icon: Settings },
    { id: 'bogo', label: 'Promo Buy 1 Get 1 (BOGO)', icon: Ticket, badge: 'Promo' },
    { id: 'email', label: 'Pengaturan Email Gateway', icon: Mail },
    { id: 'cities', label: 'Jadwal Roadshow 17 Kota', icon: Calendar, badge: '17 Kota' },
    { id: 'wahnotif', label: 'Wahnotif & Webhook', icon: MessageSquare },
    { id: 'analytics', label: 'Visitor Analytics', icon: Globe, badge: visitors.length },
  ];


  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col md:flex-row antialiased">
      {/* MOBILE HEADER BAR */}
      <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold">
            <Film className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-xs text-slate-900 tracking-tight">PIYE TO KIH ADMIN</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold border border-red-200 transition"
            title="Keluar dari sesi administrator"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar</span>
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* LEFT SIDEBAR NAVIGATION (CLEAN WHITE) */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {/* Brand header in sidebar */}
          <div className="p-6 border-b border-slate-100 shrink-0">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white font-black shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
                <Film className="w-5 h-5" />
              </div>
              <div className="leading-tight">
                <span className="block font-black text-sm tracking-tight text-slate-900">
                  PIYE TO KIH?
                </span>
                <span className="text-[10px] text-amber-600 font-bold tracking-widest uppercase">
                  MIRACLE PICTURES
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links (Scrollable) */}
          <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2 block">
              Menu Utama
            </span>

            {menuItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar Info & Logout (Always visible pinned at bottom) */}
        <div className="p-4 border-t border-slate-100 text-xs bg-slate-50/75 space-y-2 shrink-0">
          <div className="flex items-center justify-between px-1 mb-1">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-bold text-slate-700">Admin Aktif</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">v1.2</span>
          </div>

          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition font-bold shadow-sm text-xs"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Kunjungi Web</span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200/60 transition font-bold text-xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar (Logout)</span>
          </button>
        </div>
      </aside>

      {/* RIGHT MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* TOP BAR */}
        <header className="hidden md:flex bg-white border-b border-slate-200 px-8 py-4 items-center justify-between sticky top-0 z-30 shadow-sm">
          <div>
            <h2 className="text-lg font-black text-slate-900 capitalize tracking-tight">
              {menuItems.find(m => m.id === activeTab)?.label}
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Dashboard Operasional Roadshow & War Voucher Film Piye To Kih
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                fetchLeads();
                fetchSettings();
                fetchVisitors();
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition border border-slate-200 shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Muat Ulang Data</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition shadow-sm shadow-red-600/20 active:scale-95"
              title="Keluar dari sesi administrator"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar (Logout)</span>
            </button>
          </div>
        </header>

        {/* BODY PADDING */}
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl">
          {/* QUICK CONTROL: MODE COMING SOON / MAINTENANCE TOGGLE */}
          <div className={`p-4 sm:p-5 rounded-2xl border transition shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 ${
            settings.isMaintenanceMode
              ? 'bg-amber-500/10 border-amber-500/40'
              : 'bg-emerald-500/10 border-emerald-500/40'
          }`}>
            <div className="flex items-start sm:items-center gap-3">
              <div className={`p-2.5 rounded-xl text-white shrink-0 ${
                settings.isMaintenanceMode ? 'bg-amber-600' : 'bg-emerald-600'
              }`}>
                <Power className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                    Status Akses Publik Website:
                  </h4>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    settings.isMaintenanceMode
                      ? 'bg-amber-500/20 text-amber-900 border border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-900 border border-emerald-500/40'
                  }`}>
                    {settings.isMaintenanceMode ? '🟡 Mode Coming Soon Aktif' : '🟢 Website Live Penuh'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 max-w-2xl">
                  {settings.isMaintenanceMode
                    ? 'Pengunjung umum hanya melihat logo film Piye To Kih dan tulisan Coming Soon. Anda sedang login sehingga tetap bisa melihat & mengedit seluruh website secara normal.'
                    : 'Website live penuh dan dapat diakses terbuka oleh publik (halaman utama, jadwal roadshow per kota, promo BOGO, dan artikel).'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 flex-wrap">
              <Link
                href="/"
                target="_blank"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-bold transition shadow-sm"
                title="Buka Website Preview"
              >
                <Eye className="w-3.5 h-3.5 text-slate-500" />
                <span>Preview Web</span>
              </Link>

              <button
                type="button"
                onClick={() => handleQuickToggleMaintenance(!settings.isMaintenanceMode)}
                disabled={savingSettings}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider text-white shadow-md transition active:scale-95 disabled:opacity-50 ${
                  settings.isMaintenanceMode
                    ? 'bg-emerald-600 hover:bg-emerald-500'
                    : 'bg-amber-600 hover:bg-amber-500'
                }`}
              >
                <Power className="w-3.5 h-3.5" />
                <span>
                  {settings.isMaintenanceMode ? 'Publikasikan Web (Off)' : 'Aktifkan Coming Soon (On)'}
                </span>
              </button>
            </div>
          </div>

          {/* STATS TILES (CLEAN WHITE) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-1.5 font-medium">
                <span>Total Pendaftar</span>
                <Users className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{leads.length}</div>
              <div className="text-[11px] text-slate-500 mt-1">Calon Penonton Terkumpul</div>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-1.5 font-medium">
                <span>Sisa Kuota Voucher</span>
                <Ticket className="w-4 h-4 text-rose-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-rose-600 tracking-tight">{remainingQuota}</div>
              <div className="text-[11px] text-slate-500 mt-1">Dari Total {settings.totalQuota} Kuota</div>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-1.5 font-medium">
                <span>Leads WhatsApp</span>
                <MessageSquare className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-600 tracking-tight">
                {leads.filter(l => l.source === 'whatsapp').length}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Via Wahnotif Webhook</div>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-1.5 font-medium">
                <span>Pengunjung (Logs)</span>
                <Globe className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-blue-600 tracking-tight">{visitors.length}</div>
              <div className="text-[11px] text-slate-500 mt-1">Visitor Geo Tracking</div>
            </div>
          </div>

          {/* TAB 1: LEADS DENGAN FILTER KOTA DINAMIS */}
          {activeTab === 'leads' && (
            <div className="space-y-4">
              {/* REKAP / BREAKDOWN PER KOTA (HANYA MUNCUL DARI KOTA YANG MENGISI FORM) */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-extrabold uppercase text-slate-700 tracking-wider">
                      Rekap Kota dari Penonton Terdaftar:
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500">
                    Otomatis bertambah saat ada penonton baru
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setCityFilter('all')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                      cityFilter === 'all'
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/80'
                    }`}
                  >
                    <span>Semua Kota</span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${cityFilter === 'all' ? 'bg-white/20' : 'bg-slate-200'}`}>
                      {leads.length}
                    </span>
                  </button>

                  {Object.keys(cityBreakdown).length === 0 ? (
                    <span className="text-xs text-slate-400 italic py-1">
                      Belum ada kota yang tercatat dari formulir.
                    </span>
                  ) : (
                    Object.entries(cityBreakdown).map(([cName, count]) => (
                      <button
                        key={cName}
                        onClick={() => setCityFilter(cName)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                          cityFilter.toLowerCase() === cName.toLowerCase()
                            ? 'bg-slate-900 text-white shadow-sm'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/80'
                        }`}
                      >
                        <span>{cName}</span>
                        <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${cityFilter.toLowerCase() === cName.toLowerCase() ? 'bg-white/20' : 'bg-slate-200'}`}>
                          {count}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* SEARCH & FILTERS BAR */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex flex-1 items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs">
                  <Search className="w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Cari nama penonton, nomor WA, email, kode voucher..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="bg-transparent text-slate-800 outline-none w-full placeholder:text-slate-400 font-medium"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={cityFilter}
                    onChange={e => setCityFilter(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 outline-none font-medium cursor-pointer"
                  >
                    <option value="all">Semua Kota Terdaftar</option>
                    {availableCities.map(c => (
                      <option key={c} value={c}>
                        Kota: {c}
                      </option>
                    ))}
                  </select>

                  <select
                    value={sourceFilter}
                    onChange={e => setSourceFilter(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 outline-none font-medium cursor-pointer"
                  >
                    <option value="all">Semua Sumber</option>
                    <option value="web">Formulir Web</option>
                    <option value="whatsapp">WhatsApp (Wahnotif)</option>
                  </select>

                  <button
                    onClick={handleExportCsv}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download CSV / Excel</span>
                  </button>

                  <button
                    onClick={() => handleTriggerPresaleFollowup('leads')}
                    disabled={followingUpPresale}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-bold text-xs shadow-sm transition disabled:opacity-50"
                    title="Kirim follow-up WhatsApp hardselling presale roadshow ke semua pemegang kode booking voucher"
                  >
                    <Send className={`w-3.5 h-3.5 ${followingUpPresale ? 'animate-pulse' : ''}`} />
                    <span>{followingUpPresale ? 'Mengirim...' : '🔥 Follow-Up Presale (WA)'}</span>
                  </button>

                  {leads.length > 0 && (
                    <button
                      onClick={handleClearAllLeads}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 font-bold text-xs shadow-sm transition"
                      title="Hapus semua data lead yang masuk"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                      <span>Hapus Semua Leads</span>
                    </button>
                  )}
                </div>
              </div>

              {/* TABLE LEADS (CLEAN WHITE) */}
              <div className="overflow-x-auto bg-white border border-slate-200 rounded-2xl shadow-sm">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3.5 px-4">Kode Seri</th>
                      <th className="py-3.5 px-4">Nama Lengkap</th>
                      <th className="py-3.5 px-4">WhatsApp</th>
                      <th className="py-3.5 px-4">Email</th>
                      <th className="py-3.5 px-4">Kota Domisili</th>
                      <th className="py-3.5 px-4">Sumber</th>
                      <th className="py-3.5 px-4">Waktu Klaim</th>
                      <th className="py-3.5 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {loadingLeads ? (
                      <tr>
                        <td colSpan={8} className="text-center py-8 text-slate-400">
                          Memuat data leads...
                        </td>
                      </tr>
                    ) : leads.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center py-8 text-slate-400">
                          Tidak ada leads ditemukan untuk filter ini.
                        </td>
                      </tr>
                    ) : (
                      leads.map(l => (
                        <tr key={l.id} className="hover:bg-slate-50/70 transition">
                          <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                            {l.serialNumber}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-slate-900">
                            {l.name}
                          </td>
                          <td className="py-3.5 px-4">
                            <a
                              href={`https://wa.me/${l.phone.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-emerald-600 hover:text-emerald-700 font-mono font-bold hover:underline"
                            >
                              {l.phone}
                            </a>
                          </td>
                          <td className="py-3.5 px-4 text-slate-500 truncate max-w-[150px]">
                            {l.email}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 font-bold text-[11px] inline-block">
                              {l.cityLocation || 'Nasional'}
                            </span>
                            {(l as any).venueLocation && (
                              <div className="text-[10px] text-slate-500 font-semibold mt-1 truncate max-w-[140px]" title={cleanVenueToMallName((l as any).venueLocation)}>
                                📍 {cleanVenueToMallName((l as any).venueLocation)}
                              </div>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                l.source === 'whatsapp'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-blue-50 text-blue-700 border border-blue-200'
                              }`}
                            >
                              {l.source}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                            {new Date(l.claimedAt).toLocaleDateString('id-ID')}
                          </td>
                          <td className="py-3.5 px-4 text-right flex items-center justify-end gap-1.5">
                            <Link
                              href={`/voucher/${l.serialNumber}`}
                              target="_blank"
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                              title="Lihat Tiket"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </Link>
                            <button
                              onClick={() => handleDeleteLead(l.id)}
                              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition"
                              title="Hapus Lead"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: PENDAFTAR REMINDER PRESALE BOGO (15 NOV) */}
          {activeTab === 'reminders' && (
            <div className="space-y-6">
              {/* Header Box */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200">
                      Presale Buy 1 Get 1 (15 - 18 Nov)
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500 font-medium">Tayangan Perdana 19 Nov 2026</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <Bell className="w-6 h-6 text-amber-500" />
                    <span>Database Pendaftar Reminder War Presale</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
                    Daftar penonton yang meminta pengingat saat loket kuota Presale TIX ID (1.000 tiket) dan M-TIX (500 tiket) resmi dibuka pada 15 November 2026.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    onClick={fetchReminders}
                    disabled={loadingReminders}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition shadow-sm"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loadingReminders ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                  </button>

                  <button
                    onClick={handleExportRemindersCsv}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-600" />
                    <span>Export CSV</span>
                  </button>

                  <button
                    onClick={() => handleTriggerPresaleFollowup('reminders')}
                    disabled={followingUpPresale}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white text-xs font-black shadow-md shadow-rose-500/20 transition active:scale-95 disabled:opacity-50"
                    title="Kirim follow-up WhatsApp hardselling presale roadshow gaya Mas Kidi"
                  >
                    <Send className={`w-3.5 h-3.5 ${followingUpPresale ? 'animate-pulse' : ''}`} />
                    <span>{followingUpPresale ? 'Mengirim Follow-Up...' : '🔥 Follow-Up Presale (WA)'}</span>
                  </button>

                  <button
                    onClick={handleTriggerBlast}
                    disabled={blastingReminder}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-black shadow-md shadow-amber-500/20 transition active:scale-95 disabled:opacity-50"
                  >
                    <Send className={`w-3.5 h-3.5 ${blastingReminder ? 'animate-pulse' : ''}`} />
                    <span>{blastingReminder ? 'Mengirim Blast...' : '🚀 Blast Reminder (WA & Email)'}</span>
                  </button>
                </div>
              </div>

              {followupResult && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between">
                  <div>
                    <span className="font-bold">Laporan Follow-Up Presale Terakhir:</span> {followupResult.total} diproses • {followupResult.sent} Berhasil Terkirim • {followupResult.failed} Gagal.
                  </div>
                  <button onClick={() => setFollowupResult(null)} className="text-rose-600 hover:text-rose-900 font-bold ml-4">Tutup</button>
                </div>
              )}

              {/* Status Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Total Pendaftar</span>
                    <Bell className="w-5 h-5 text-amber-500" />
                  </div>
                  <div className="text-3xl font-black text-slate-900">{bogoReminders.length}</div>
                  <p className="text-[11px] text-slate-400 mt-1">Calon penonton siap war presale</p>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Menunggu Reminder</span>
                    <AlertCircle className="w-5 h-5 text-amber-500" />
                  </div>
                  <div className="text-3xl font-black text-amber-600">
                    {bogoReminders.filter(r => r.reminderStatus !== 'sent').length}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Siap dikirim otomatis saat 15 Nov</p>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Berhasil Terkirim</span>
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div className="text-3xl font-black text-emerald-600">
                    {bogoReminders.filter(r => r.reminderStatus === 'sent').length}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Notifikasi WA & Email terkirim</p>
                </div>
              </div>

              {blastResult && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
                  <div>
                    <span className="font-bold">Laporan Blast Terakhir:</span> {blastResult.total} diproses • {blastResult.sentWhatsapp} WA Terkirim • {blastResult.sentEmail} Email Terkirim.
                  </div>
                  <button onClick={() => setBlastResult(null)} className="text-emerald-600 hover:text-emerald-900 font-bold ml-4">Tutup</button>
                </div>
              )}

              {/* Table Card */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-800">
                    Daftar Kontak Reminder Presale ({bogoReminders.length})
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    Endpoint cron: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">POST /api/cron/bogo-reminder</code>
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        <th className="py-3 px-4">No</th>
                        <th className="py-3 px-4">Nama Lengkap</th>
                        <th className="py-3 px-4">No WhatsApp</th>
                        <th className="py-3 px-4">Email</th>
                        <th className="py-3 px-4">Kota</th>
                        <th className="py-3 px-4">Waktu Daftar</th>
                        <th className="py-3 px-4">Status Reminder</th>
                        <th className="py-3 px-4 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {loadingReminders ? (
                        <tr>
                          <td colSpan={8} className="text-center py-8 text-slate-400">
                            Memuat data pendaftar reminder...
                          </td>
                        </tr>
                      ) : bogoReminders.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="text-center py-8 text-slate-400">
                            Belum ada pendaftar reminder presale buy 1 get 1.
                          </td>
                        </tr>
                      ) : (
                        bogoReminders.map((r, idx) => (
                          <tr key={r.id || idx} className="hover:bg-slate-50/70 transition">
                            <td className="py-3.5 px-4 font-mono text-slate-400">{idx + 1}</td>
                            <td className="py-3.5 px-4 font-bold text-slate-900">{r.name}</td>
                            <td className="py-3.5 px-4 font-mono text-slate-700">
                              <a
                                href={`https://wa.me/${r.phone?.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-amber-600 hover:underline font-bold"
                              >
                                {r.phone}
                              </a>
                            </td>
                            <td className="py-3.5 px-4 text-slate-600">{r.email}</td>
                            <td className="py-3.5 px-4">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                                {r.city}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                              {r.createdAt ? new Date(r.createdAt).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' }) : '-'}
                            </td>
                            <td className="py-3.5 px-4">
                              {r.reminderStatus === 'sent' ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                                  <CheckCircle className="w-3 h-3 text-emerald-600" />
                                  Terkirim ({r.sentAt ? new Date(r.sentAt).toLocaleDateString('id-ID') : 'Done'})
                                </span>
                              ) : r.reminderStatus === 'failed' ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-800 border border-rose-200">
                                  Gagal Kirim
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-200">
                                  Menunggu 15 Nov
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <a
                                href={`https://wa.me/${r.phone?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Halo ${r.name}, info resmi Presale Buy 1 Get 1 tiket film PIYE TO KIH? sudah dibuka!`)}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[10px] transition"
                              >
                                <MessageSquare className="w-3 h-3" />
                                <span>WA</span>
                              </a>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: KABAR & GALERI HUB */}
          {activeTab === 'articles' && (
            <div className="space-y-6">
              {/* Header Box */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200">
                      CMS Kabar & Galeri Hub
                    </span>
                    <span className="text-xs text-slate-400">• Live Production Ready</span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">
                    Pusat Pengelolaan Kabar & Galeri
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
                    Kelola berita film, rilis pers resmi, liputan media nasional, galeri foto dokumentasi, dan video resmi film PIYE TO KIH. Atur juga spotlight hero dan download aset media kit.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  <Link
                    href="/kabar-galeri"
                    target="_blank"
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 bg-slate-50 hover:bg-slate-100 text-xs font-bold transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Lihat di Web</span>
                  </Link>
                  <button
                    onClick={handleDeleteAllArticles}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 text-xs font-bold transition active:scale-95"
                    title="Kosongkan semua data dummy agar live web clean"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Bersihkan Semua Dummy</span>
                  </button>
                  <button
                    onClick={handleOpenNewArticle}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black shadow-md shadow-amber-500/20 transition active:scale-95"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>Tulis Konten Baru</span>
                  </button>
                </div>
              </div>

              {/* Stats Overview */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                  <span className="text-[11px] font-bold text-slate-400 block mb-1">Total Konten Terbit</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-slate-900">{articles.length}</span>
                    <span className="text-xs text-emerald-600 font-bold">Live</span>
                  </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                  <span className="text-[11px] font-bold text-slate-400 block mb-1">Galeri Foto</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-slate-900">
                      {articles.filter(a => a.category === 'Galeri Foto').length}
                    </span>
                    <span className="text-xs text-amber-600 font-bold">Album</span>
                  </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                  <span className="text-[11px] font-bold text-slate-400 block mb-1">Galeri Video</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-slate-900">
                      {articles.filter(a => a.category === 'Galeri Video').length}
                    </span>
                    <span className="text-xs text-blue-600 font-bold">Video</span>
                  </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                  <span className="text-[11px] font-bold text-slate-400 block mb-1">Press & Media</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-slate-900">
                      {articles.filter(a => a.category === 'Press Release' || a.category === 'Media Coverage').length}
                    </span>
                    <span className="text-xs text-purple-600 font-bold">Rilis/Liputan</span>
                  </div>
                </div>
              </div>

              {/* PENGATURAN HERO SPOTLIGHT & MEDIA CENTER */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-900 text-amber-400">
                      Setting Tampilan
                    </span>
                    <h4 className="text-base font-black text-slate-900 mt-1">
                      Hero Spotlight & Media Center Kit
                    </h4>
                    <p className="text-xs text-slate-500">
                      Pengaturan banner utama di halaman /kabar-galeri dan tautan download aset pers untuk wartawan/media.
                    </p>
                  </div>
                  <button
                    onClick={handleSaveSettings}
                    disabled={savingSettings}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs shadow-sm transition active:scale-95 shrink-0"
                  >
                    <Save className="w-4 h-4" />
                    <span>{savingSettings ? 'Menyimpan...' : 'Simpan Pengaturan Hero & Media Kit'}</span>
                  </button>
                </div>

                {/* Sub-form: Hero Utama */}
                <div className="space-y-4">
                  <h5 className="text-xs font-black uppercase tracking-wider text-amber-600 flex items-center gap-1.5">
                    <Film className="w-3.5 h-3.5" /> 1. Spotlight Hero Banner (Bagian Teratas)
                  </h5>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Sub-Judul / Label Atas
                      </label>
                      <input
                        type="text"
                        value={settings.kabarGaleriSettings?.heroCategory || ''}
                        onChange={(e) => setSettings({
                          ...settings,
                          kabarGaleriSettings: {
                            ...settings.kabarGaleriSettings,
                            heroCategory: e.target.value
                          }
                        })}
                        placeholder="Contoh: KABAR & GALERI"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:border-amber-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Kutipan Puitis / Quote (Kanan Atas)
                      </label>
                      <input
                        type="text"
                        value={settings.kabarGaleriSettings?.heroQuote || ''}
                        onChange={(e) => setSettings({
                          ...settings,
                          kabarGaleriSettings: {
                            ...settings.kabarGaleriSettings,
                            heroQuote: e.target.value
                          }
                        })}
                        placeholder='“Tentang kita, yang selalu mencari jalan pulang.”'
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs italic font-medium focus:border-amber-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Judul Besar Hero Utama
                    </label>
                    <input
                      type="text"
                      value={settings.kabarGaleriSettings?.heroTitle || ''}
                      onChange={(e) => setSettings({
                        ...settings,
                        kabarGaleriSettings: {
                          ...settings.kabarGaleriSettings,
                          heroTitle: e.target.value
                        }
                      })}
                      placeholder="PIYE TO KIH? RESMI RILIS OFFICIAL POSTER & TRAILER"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-black focus:border-amber-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Deskripsi Ringkas Hero
                    </label>
                    <textarea
                      rows={2}
                      value={settings.kabarGaleriSettings?.heroExcerpt || ''}
                      onChange={(e) => setSettings({
                        ...settings,
                        kabarGaleriSettings: {
                          ...settings.kabarGaleriSettings,
                          heroExcerpt: e.target.value
                        }
                      })}
                      placeholder="Cuplikan ringkasan yang tampil di bawah judul hero..."
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:border-amber-500 outline-none"
                    />
                  </div>

                  {/* Hero Cover Image Upload */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Foto Background Banner Hero
                    </label>
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <input
                        type="text"
                        value={settings.kabarGaleriSettings?.heroCoverImage || ''}
                        onChange={(e) => setSettings({
                          ...settings,
                          kabarGaleriSettings: {
                            ...settings.kabarGaleriSettings,
                            heroCoverImage: e.target.value
                          }
                        })}
                        placeholder="URL Foto Banner atau Upload langsung di samping ->"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:border-amber-500 outline-none"
                      />
                      <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs whitespace-nowrap transition active:scale-95 shadow-sm">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{uploadingHeroCover ? 'Mengunggah...' : 'Upload Foto'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          disabled={uploadingHeroCover}
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            setUploadingHeroCover(true);
                            const url = await handleFileUpload(file, 'hero-cover');
                            setUploadingHeroCover(false);
                            if (url) {
                              setSettings((prev: any) => ({
                                ...prev,
                                kabarGaleriSettings: {
                                  ...prev.kabarGaleriSettings,
                                  heroCoverImage: url,
                                },
                              }));
                            }
                          }}
                        />
                      </label>
                    </div>
                    {settings.kabarGaleriSettings?.heroCoverImage && (
                      <div className="mt-2 relative w-full h-32 rounded-xl overflow-hidden border border-slate-200 bg-slate-900">
                        <img
                          src={settings.kabarGaleriSettings.heroCoverImage}
                          alt="Hero Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Sub-form: Media Center Kit */}
                <div className="space-y-6 pt-6 border-t border-slate-100">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div>
                      <h5 className="text-xs font-black uppercase tracking-wider text-purple-600 flex items-center gap-1.5">
                        <Download className="w-3.5 h-3.5" /> 2. Media Kit &amp; Press Center (Sinkronisasi Halaman /media)
                      </h5>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Kelola tautan unduhan Google Drive, berkas pers, dan video resmi agar sinkron persis dengan 7 kontainer di halaman <b>/media</b>.
                      </p>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-purple-50 text-purple-700 rounded border border-purple-200 self-start sm:self-auto font-bold">
                      7 CONTAINERS SYNC
                    </span>
                  </div>

                  {/* GROUP 1: KONTAINER UTAMA 01 - 06 */}
                  <div className="space-y-3">
                    <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
                      A. KONTEN UTAMA MEDIA KIT (KONTAINER 01 - 06)
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Kontainer 1: Poster Resmi Hi-Res */}
                      <div className="md:col-span-2 p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                        <div className="pb-2 border-b border-slate-200/60">
                          <label className="block text-xs font-bold text-slate-800">
                            [01] Poster Resmi Hi-Res (300 DPI)
                          </label>
                          <p className="text-[11px] text-slate-500">
                            Kelola tautan unduhan masing-masing poster vertikal dan tautan folder arsip untuk tombol unduh semua.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                          {/* 1A. Link Teaser Poster (Vertikal) */}
                          <div className="space-y-1">
                            <label className="block text-[11px] font-semibold text-slate-700">
                              • Link Teaser Poster (Vertikal)
                            </label>
                            <input
                              type="text"
                              value={settings.kabarGaleriSettings?.mediaKitTeaserPosterUrl || ''}
                              onChange={(e) => setSettings({
                                ...settings,
                                kabarGaleriSettings: {
                                  ...settings.kabarGaleriSettings,
                                  mediaKitTeaserPosterUrl: e.target.value
                                }
                              })}
                              placeholder="https://drive.google.com/file/d/.../view (Link Teaser Poster)"
                              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-mono bg-white focus:border-amber-500 outline-none"
                            />
                            <p className="text-[10px] text-slate-400">
                              Placeholder link unduh item Teaser Poster.
                            </p>
                          </div>

                          {/* 1B. Link Official Main Poster (Vertikal) */}
                          <div className="space-y-1">
                            <label className="block text-[11px] font-semibold text-slate-700">
                              • Link Official Main Poster (Vertikal)
                            </label>
                            <input
                              type="text"
                              value={settings.kabarGaleriSettings?.mediaKitMainPosterUrl || ''}
                              onChange={(e) => setSettings({
                                ...settings,
                                kabarGaleriSettings: {
                                  ...settings.kabarGaleriSettings,
                                  mediaKitMainPosterUrl: e.target.value
                                }
                              })}
                              placeholder="https://drive.google.com/file/d/.../view (Link Main Poster)"
                              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-mono bg-white focus:border-amber-500 outline-none"
                            />
                            <p className="text-[10px] text-slate-400">
                              Placeholder link unduh item Official Main Poster.
                            </p>
                          </div>

                          {/* 1C. Link Unduh Semua (Folder / ZIP) */}
                          <div className="space-y-1">
                            <label className="block text-[11px] font-semibold text-slate-700">
                              • Link Unduh Semua (Folder / ZIP)
                            </label>
                            <input
                              type="text"
                              value={settings.kabarGaleriSettings?.mediaKitPosterUrl || ''}
                              onChange={(e) => setSettings({
                                ...settings,
                                kabarGaleriSettings: {
                                  ...settings.kabarGaleriSettings,
                                  mediaKitPosterUrl: e.target.value
                                }
                              })}
                              placeholder="https://drive.google.com/drive/folders/... (Folder Semua Poster)"
                              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-mono bg-white focus:border-amber-500 outline-none"
                            />
                            <p className="text-[10px] text-slate-400">
                              Placeholder link tombol utama &quot;UNDUH SEMUA&quot;.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Kontainer 2: Press Release Resmi */}
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                        <label className="block text-xs font-bold text-slate-800">
                          [02] Siaran Pers Resmi / Press Release (PDF / GDrive)
                        </label>
                        <input
                          type="text"
                          value={settings.kabarGaleriSettings?.mediaKitPressReleasePdfUrl || ''}
                          onChange={(e) => setSettings({
                            ...settings,
                            kabarGaleriSettings: {
                              ...settings.kabarGaleriSettings,
                              mediaKitPressReleasePdfUrl: e.target.value
                            }
                          })}
                          placeholder="https://drive.google.com/file/d/.../view?usp=sharing atau /uploads/press-release.pdf"
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-mono bg-white focus:border-amber-500 outline-none"
                        />
                        <p className="text-[10px] text-slate-400">
                          Tautan berkas PDF / Google Drive siaran pers resmi.
                        </p>
                      </div>

                      {/* Kontainer 3: Film Stills */}
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                        <label className="block text-xs font-bold text-slate-800">
                          [03] Foto Produksi &amp; Still Cut (Google Drive)
                        </label>
                        <input
                          type="text"
                          value={settings.kabarGaleriSettings?.mediaKitStillsZipUrl || ''}
                          onChange={(e) => setSettings({
                            ...settings,
                            kabarGaleriSettings: {
                              ...settings.kabarGaleriSettings,
                              mediaKitStillsZipUrl: e.target.value
                            }
                          })}
                          placeholder="https://drive.google.com/drive/folders/... atau ZIP link"
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-mono bg-white focus:border-amber-500 outline-none"
                        />
                      </div>

                      {/* Kontainer 4: Behind the Scenes */}
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                        <label className="block text-xs font-bold text-slate-800">
                          [04] Behind The Scene / BTS Photos (Google Drive)
                        </label>
                        <input
                          type="text"
                          value={settings.kabarGaleriSettings?.mediaKitBtsZipUrl || ''}
                          onChange={(e) => setSettings({
                            ...settings,
                            kabarGaleriSettings: {
                              ...settings.kabarGaleriSettings,
                              mediaKitBtsZipUrl: e.target.value
                            }
                          })}
                          placeholder="https://drive.google.com/drive/folders/... atau arsip BTS"
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-mono bg-white focus:border-amber-500 outline-none"
                        />
                      </div>

                      {/* Kontainer 5: Fact Sheet & Film Info */}
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                        <label className="block text-xs font-bold text-slate-800">
                          [05] Fact Sheet &amp; Sinopsis Lengkap (PDF / GDrive)
                        </label>
                        <input
                          type="text"
                          value={settings.kabarGaleriSettings?.mediaKitFactSheetPdfUrl || ''}
                          onChange={(e) => setSettings({
                            ...settings,
                            kabarGaleriSettings: {
                              ...settings.kabarGaleriSettings,
                              mediaKitFactSheetPdfUrl: e.target.value
                            }
                          })}
                          placeholder="https://drive.google.com/file/d/.../view?usp=sharing"
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-mono bg-white focus:border-amber-500 outline-none"
                        />
                      </div>

                      {/* Kontainer 6: Foto Cast & Filmmaker */}
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                        <label className="block text-xs font-bold text-slate-800">
                          [06] Foto Cast &amp; Filmmaker (Google Drive)
                        </label>
                        <input
                          type="text"
                          value={settings.kabarGaleriSettings?.mediaKitCastPhotosUrl || ''}
                          onChange={(e) => setSettings({
                            ...settings,
                            kabarGaleriSettings: {
                              ...settings.kabarGaleriSettings,
                              mediaKitCastPhotosUrl: e.target.value
                            }
                          })}
                          placeholder="https://drive.google.com/drive/folders/... (Foto profil cast & sutradara)"
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-mono bg-white focus:border-amber-500 outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* GROUP 2: KONTAINER 07 - VIDEO & BRAND ASSETS */}
                  <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-amber-200/80 pb-2.5 gap-2">
                      <span className="text-xs font-black uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
                        <Film className="w-4 h-4 text-amber-600" /> [07] VIDEO &amp; BRAND ASSETS (SUB-A &amp; SUB-B)
                      </span>
                      <span className="text-[10px] font-mono text-amber-900 bg-amber-200/70 px-2 py-0.5 rounded font-bold self-start sm:self-auto">
                        3 LINK VIDEO + 3 LINK BRAND ASSETS
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Sub-A: Video Assets */}
                      <div className="space-y-3">
                        <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1">
                          <Play className="w-3.5 h-3.5 text-red-600" /> SUB-A: Tautan Video YouTube (3 Tautan)
                        </span>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                            1. First Look Teaser (YouTube)
                          </label>
                          <input
                            type="text"
                            value={settings.kabarGaleriSettings?.mediaKitVideoFirstLookUrl || ''}
                            onChange={(e) => setSettings({
                              ...settings,
                              kabarGaleriSettings: {
                                ...settings.kabarGaleriSettings,
                                mediaKitVideoFirstLookUrl: e.target.value
                              }
                            })}
                            placeholder="Contoh: https://www.youtube.com/watch?v=... (First Look Teaser)"
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-mono bg-white focus:border-amber-500 outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                            2. Official Teaser Trailer (YouTube)
                          </label>
                          <input
                            type="text"
                            value={settings.kabarGaleriSettings?.mediaKitVideoTeaserUrl || ''}
                            onChange={(e) => setSettings({
                              ...settings,
                              kabarGaleriSettings: {
                                ...settings.kabarGaleriSettings,
                                mediaKitVideoTeaserUrl: e.target.value
                              }
                            })}
                            placeholder="Contoh: https://www.youtube.com/watch?v=... (Official Teaser Trailer)"
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-mono bg-white focus:border-amber-500 outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                            3. Official Main Trailer (YouTube)
                          </label>
                          <input
                            type="text"
                            value={settings.kabarGaleriSettings?.mediaKitVideoMainTrailerUrl || settings.kabarGaleriSettings?.mediaKitTrailerYoutubeUrl || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              setSettings({
                                ...settings,
                                kabarGaleriSettings: {
                                  ...settings.kabarGaleriSettings,
                                  mediaKitVideoMainTrailerUrl: val,
                                  mediaKitTrailerYoutubeUrl: val,
                                }
                              });
                            }}
                            placeholder="Contoh: https://www.youtube.com/watch?v=... (Official Main Trailer)"
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-mono bg-white focus:border-amber-500 outline-none"
                          />
                        </div>
                      </div>

                      {/* Sub-B: Logo & Brand Assets */}
                      <div className="space-y-3">
                        <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1">
                          <Image className="w-3.5 h-3.5 text-amber-600" /> SUB-B: Identitas Visual Transparan (3 Link Download)
                        </span>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                            1. Logo Resmi PIYE TO KIH? (PNG Transparan)
                          </label>
                          <input
                            type="text"
                            value={settings.kabarGaleriSettings?.mediaKitLogoPtkUrl || ''}
                            onChange={(e) => setSettings({
                              ...settings,
                              kabarGaleriSettings: {
                                ...settings.kabarGaleriSettings,
                                mediaKitLogoPtkUrl: e.target.value
                              }
                            })}
                            placeholder="Contoh: https://drive.google.com/file/d/.../view atau /logo-ptk.png"
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-mono bg-white focus:border-amber-500 outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                            2. Logo PT Mirakel Sinema Imaji / Miracle Pictures (PNG Transparan)
                          </label>
                          <input
                            type="text"
                            value={settings.kabarGaleriSettings?.mediaKitLogoMiracleUrl || ''}
                            onChange={(e) => setSettings({
                              ...settings,
                              kabarGaleriSettings: {
                                ...settings.kabarGaleriSettings,
                                mediaKitLogoMiracleUrl: e.target.value
                              }
                            })}
                            placeholder="Contoh: https://drive.google.com/file/d/.../view atau /logo-miracle-pictures.png"
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-mono bg-white focus:border-amber-500 outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                            3. Brand Pack Lengkap (ZIP / Google Drive Folder)
                          </label>
                          <input
                            type="text"
                            value={settings.kabarGaleriSettings?.mediaKitLogoPackZipUrl || ''}
                            onChange={(e) => setSettings({
                              ...settings,
                              kabarGaleriSettings: {
                                ...settings.kabarGaleriSettings,
                                mediaKitLogoPackZipUrl: e.target.value
                              }
                            })}
                            placeholder="Contoh: https://drive.google.com/drive/folders/... (Folder GDrive / ZIP Aset Brand)"
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-mono bg-white focus:border-amber-500 outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* GROUP 3: PROMOSI SOSMED, FILTER AR & SOUNDTRACK */}
                  <div className="space-y-3">
                    <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
                      B. FILTER AR &amp; OFFICIAL SOUNDTRACK
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Link Filter AR Instagram
                        </label>
                        <input
                          type="text"
                          value={settings.kabarGaleriSettings?.mediaKitFilterInstagramUrl || ''}
                          onChange={(e) => setSettings({
                            ...settings,
                            kabarGaleriSettings: {
                              ...settings.kabarGaleriSettings,
                              mediaKitFilterInstagramUrl: e.target.value
                            }
                          })}
                          placeholder="https://instagram.com/ar/..."
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:border-amber-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Link Filter AR TikTok
                        </label>
                        <input
                          type="text"
                          value={settings.kabarGaleriSettings?.mediaKitFilterTiktokUrl || ''}
                          onChange={(e) => setSettings({
                            ...settings,
                            kabarGaleriSettings: {
                              ...settings.kabarGaleriSettings,
                              mediaKitFilterTiktokUrl: e.target.value
                            }
                          })}
                          placeholder="https://vm.tiktok.com/..."
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:border-amber-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Link Official Soundtrack (Spotify)
                        </label>
                        <input
                          type="text"
                          value={settings.kabarGaleriSettings?.mediaKitSoundtrackSpotifyUrl || ''}
                          onChange={(e) => setSettings({
                            ...settings,
                            kabarGaleriSettings: {
                              ...settings.kabarGaleriSettings,
                              mediaKitSoundtrackSpotifyUrl: e.target.value
                            }
                          })}
                          placeholder="https://open.spotify.com/track/..."
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:border-amber-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Link Official Soundtrack (YouTube)
                        </label>
                        <input
                          type="text"
                          value={settings.kabarGaleriSettings?.mediaKitSoundtrackYoutubeUrl || ''}
                          onChange={(e) => setSettings({
                            ...settings,
                            kabarGaleriSettings: {
                              ...settings.kabarGaleriSettings,
                              mediaKitSoundtrackYoutubeUrl: e.target.value
                            }
                          })}
                          placeholder="https://www.youtube.com/@miraclepictures-r0v"
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:border-amber-500 outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* GROUP 4: KONTAK HUMAS & MEDIA RELATIONS */}
                  <div className="space-y-3">
                    <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
                      C. KONTAK HUBUNGAN MEDIA &amp; KEMITRAAN PERS
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Email Kontak PR / Media Relations
                        </label>
                        <input
                          type="email"
                          value={settings.kabarGaleriSettings?.mediaKitContactEmail || ''}
                          onChange={(e) => setSettings({
                            ...settings,
                            kabarGaleriSettings: {
                              ...settings.kabarGaleriSettings,
                              mediaKitContactEmail: e.target.value
                            }
                          })}
                          placeholder="hello@miraclepictures.id"
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:border-amber-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          WhatsApp Kontak PR / Media Relations
                        </label>
                        <input
                          type="text"
                          value={settings.kabarGaleriSettings?.mediaKitContactWa || ''}
                          onChange={(e) => setSettings({
                            ...settings,
                            kabarGaleriSettings: {
                              ...settings.kabarGaleriSettings,
                              mediaKitContactWa: e.target.value
                            }
                          })}
                          placeholder="+62 852-2095-2407"
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:border-amber-500 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* DAFTAR ARTIKEL & KONTEN */}
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Newspaper className="w-4 h-4 text-amber-500" />
                    <h4 className="text-sm font-black text-slate-900">Daftar Konten & Galeri</h4>
                  </div>
                  <button
                    onClick={fetchArticles}
                    disabled={loadingArticles}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition self-start sm:self-auto"
                    title="Refresh data"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loadingArticles ? 'animate-spin text-amber-500' : ''}`} />
                  </button>
                </div>

                {/* Category Filter Tabs */}
                <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto text-xs">
                  {['Semua', 'Kabar Film', 'Press Release', 'Media Coverage', 'Galeri Foto', 'Galeri Video'].map((cat) => {
                    const count = cat === 'Semua' ? articles.length : articles.filter(a => a.category === cat).length;
                    const isActive = articleCategoryFilter === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => setArticleCategoryFilter(cat)}
                        className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                          isActive
                            ? 'bg-amber-500 text-slate-950 shadow-sm'
                            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                        }`}
                      >
                        <span>{cat}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                          isActive ? 'bg-black/20 text-slate-950 font-black' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-black uppercase tracking-wider text-slate-500">
                        <th className="py-3 px-4">Cover & Judul</th>
                        <th className="py-3 px-4">Kategori & Tag</th>
                        <th className="py-3 px-4">Waktu Terbit</th>
                        <th className="py-3 px-4">Detail Konten</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {loadingArticles ? (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-slate-400 font-medium">
                            Memuat daftar konten...
                          </td>
                        </tr>
                      ) : (() => {
                        const filtered = articles.filter(art => {
                          if (articleCategoryFilter === 'Semua') return true;
                          return art.category === articleCategoryFilter;
                        });

                        if (filtered.length === 0) {
                          return (
                            <tr>
                              <td colSpan={6} className="py-16 text-center">
                                <Newspaper className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                                <p className="text-slate-600 font-bold mb-1">
                                  Belum ada konten untuk kategori {articleCategoryFilter}
                                </p>
                                <p className="text-slate-400 text-xs mb-4">
                                  Klik tombol di bawah untuk menambahkan rilis resmi, liputan, galeri foto, atau video baru.
                                </p>
                                <button
                                  onClick={handleOpenNewArticle}
                                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs"
                                >
                                  <Plus className="w-4 h-4" /> Tambah Konten Baru
                                </button>
                              </td>
                            </tr>
                          );
                        }

                        return filtered.map((art) => (
                          <tr key={art.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3 max-w-md">
                                <div className="w-16 h-11 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0 relative">
                                  {art.coverImage ? (
                                    <img
                                      src={art.coverImage}
                                      alt={art.title}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                                      <Image className="w-4 h-4" />
                                    </div>
                                  )}
                                  {art.featured && (
                                    <div className="absolute top-0.5 right-0.5 bg-amber-500 text-slate-950 text-[9px] px-1 font-black rounded">
                                      ★
                                    </div>
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <Link
                                    href={`/artikel/${art.slug}`}
                                    target="_blank"
                                    className="font-bold text-slate-900 hover:text-amber-600 transition block truncate"
                                    title={art.title}
                                  >
                                    {art.title}
                                  </Link>
                                  <span className="text-[11px] text-slate-400 font-mono block truncate">
                                    /artikel/{art.slug}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              <div className="flex flex-col gap-1 items-start">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  art.category === 'Galeri Video'
                                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                    : art.category === 'Galeri Foto'
                                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                    : art.category === 'Press Release'
                                    ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                    : art.category === 'Media Coverage'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : 'bg-slate-100 text-slate-700 border border-slate-200'
                                }`}>
                                  {art.category || 'Kabar Film'}
                                </span>
                                {art.tag && (
                                  <span className="text-[10px] text-amber-600 font-semibold">
                                    #{art.tag}
                                  </span>
                                )}
                                {art.cityTag && (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600 flex items-center gap-1">
                                    <MapPin className="w-2.5 h-2.5 text-amber-500" />
                                    {art.cityTag}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-3.5 px-4 whitespace-nowrap text-slate-600">
                              <span className="font-medium block">{art.publishedAt}</span>
                              <span className="text-[11px] text-slate-400">{art.author || 'Tim Media'}</span>
                            </td>
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              {art.category === 'Galeri Video' ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700">
                                  🎬 {art.videoDuration || 'Video'}
                                </span>
                              ) : art.category === 'Media Coverage' ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700">
                                  📰 {art.mediaName || 'Media'}
                                </span>
                              ) : art.category === 'Press Release' ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700">
                                  📄 {art.pdfUrl ? 'PDF Ready' : 'Press Kit'}
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                                  <Image className="w-3 h-3 text-slate-400" />
                                  {art.galleryImages?.length || 0} Foto
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-4 whitespace-nowrap">
                              {art.isPublished ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  <Check className="w-3 h-3" /> Published
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                                  Draft
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-4 whitespace-nowrap text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <Link
                                  href={`/artikel/${art.slug}`}
                                  target="_blank"
                                  className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-amber-600 hover:bg-slate-100 transition"
                                  title="Lihat Halaman Publik"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </Link>
                                <button
                                  onClick={() => handleOpenEditArticle(art)}
                                  className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
                                  title="Edit Konten"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteArticle(art.id, art.title)}
                                  className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition"
                                  title="Hapus Konten"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ));
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: OFFICIAL FILM & MEDIA CONFIGURATION (GLOBAL SYNC) */}
          {activeTab === 'movie' && (
            <form onSubmit={handleSaveSettings} className="max-w-4xl bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-8 shadow-sm">
              <div className="border-b border-slate-100 pb-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 border border-amber-500/20 text-[10px] font-black uppercase tracking-widest inline-block mb-1.5">
                      GLOBAL INHERITANCE SYSTEM
                    </span>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">
                      🎬 Pengaturan Resmi Film, Media &amp; Tracking
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Sekali atur di sini, poster, trailer, sinopsis, cast, dan tracking otomatis sinkron ke <b>Halaman Utama</b> dan <b>SELURUH 17 Halaman Kota Roadshow</b> tanpa perlu update satu per satu!
                    </p>
                  </div>
                  <button
                    type="submit"
                    disabled={savingSettings}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition active:scale-95 shrink-0"
                  >
                    <Save className="w-4 h-4" />
                    <span>{savingSettings ? 'Menyimpan...' : 'Simpan Semua'}</span>
                  </button>
                </div>
              </div>

              {settingsSuccess && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs flex items-center gap-3 animate-in fade-in">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-black block">Perubahan Berhasil Disimpan &amp; Sinkron!</span>
                    <span className="text-[11px] text-emerald-700">Main page dan seluruh 17 halaman kota langsung menampilkan poster, trailer, dan cast terbaru secara otomatis.</span>
                  </div>
                </div>
              )}

              {/* 1. VISUAL POSTER & BACKDROP TEASER */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-5">
                <div className="border-b border-slate-200/60 pb-3">
                  <div className="flex items-center gap-2 text-slate-900 mb-1">
                    <FolderUp className="w-4 h-4 text-amber-500" />
                    <label className="text-xs font-black uppercase tracking-wider">
                      1. Upload Poster Resmi Film &amp; Backdrop Layar Lebar
                    </label>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Pilih file gambar langsung dari komputer atau HP Anda. File otomatis disimpan di server pada folder <code>/public/uploads/</code>.
                  </p>
                </div>

                {/* Quick Auto-Restore Alert if Unsplash placeholder is active but real poster is on server */}
                {(() => {
                  const detectedPoster = serverUploads.find(f => (f?.filename || f?.name || '').toLowerCase().includes('poster'));
                  const posterDisplayName = detectedPoster ? (detectedPoster.filename || detectedPoster.name || '') : '';
                  const isUnsplash = settings.movieSettings?.posterUrl?.includes('images.unsplash.com');
                  if (isUnsplash && detectedPoster) {
                    return (
                      <div className="p-4 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 border-2 border-amber-500/50 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md animate-in fade-in">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-amber-500 text-slate-950 rounded-xl font-bold shrink-0">
                            <AlertCircle className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-xs font-black text-slate-900">File Poster Asli Ditemukan di Server VPS!</h4>
                            <p className="text-[11px] text-slate-600 mt-0.5">
                              File upload Anda <strong className="text-amber-900 font-mono">{posterDisplayName}</strong> masih tersimpan aman di server. Klik tombol di samping untuk langsung memasangnya kembali tanpa upload ulang.
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setSettings({
                              ...settings,
                              movieSettings: {
                                ...(settings.movieSettings || DEFAULT_MOVIE_SETTINGS),
                                posterUrl: detectedPoster.url,
                              },
                            });
                          }}
                          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-xl shadow-lg transition active:scale-95 shrink-0 whitespace-nowrap"
                        >
                          ⚡ Terapkan Poster Asli ({posterDisplayName})
                        </button>
                      </div>
                    );
                  }
                  return null;
                })()}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Poster Vertikal Input & Preview */}
                  <div className="space-y-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-black text-slate-900">
                          Poster Vertikal Film (Sinopsis &amp; Roadshow)
                        </label>
                        <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-bold border border-amber-200">
                          Rasio 2:3 / Vertikal Portrait
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mb-3">
                        Poster tegak resmi film bioskop yang tampil di samping sinopsis cerita film (Layar Lebar 2026) dan halaman 17 kota.
                      </p>

                      {/* Direct Upload Button */}
                      <div>
                        <label className="cursor-pointer w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold transition shadow-md active:scale-95 group">
                          <Upload className="w-4 h-4 text-amber-400 group-hover:-translate-y-0.5 transition-transform" />
                          <span>{uploadingPoster ? 'Sedang Mengunggah Poster...' : '📁 Pilih & Upload Poster Vertikal'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            disabled={uploadingPoster}
                            className="hidden"
                            onChange={async e => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              setUploadingPoster(true);
                              const url = await handleFileUpload(file, 'poster');
                              setUploadingPoster(false);
                              if (url) {
                                setSettings({
                                  ...settings,
                                  movieSettings: {
                                    ...(settings.movieSettings || DEFAULT_MOVIE_SETTINGS),
                                    posterUrl: url,
                                  },
                                });
                              }
                            }}
                          />
                        </label>
                      </div>

                      {/* URL Path Box */}
                      <div className="space-y-1 mt-3">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Jalur File Gambar Aktif</span>
                        <input
                          type="text"
                          value={settings.movieSettings?.posterUrl || ''}
                          onChange={e =>
                            setSettings({
                              ...settings,
                              movieSettings: {
                                ...(settings.movieSettings || DEFAULT_MOVIE_SETTINGS),
                                posterUrl: e.target.value,
                              },
                            })
                          }
                          placeholder="/uploads/poster-....jpg atau https://..."
                          className="w-full bg-slate-50 border border-slate-200 focus:border-amber-500 rounded-xl px-3 py-2 text-[11px] text-slate-800 font-mono outline-none"
                        />
                      </div>
                    </div>

                    {/* Preview Box - Real Vertical Cinema Poster Ratio 2:3 */}
                    <div className="relative aspect-[2/3] max-w-[220px] w-full mx-auto rounded-xl overflow-hidden border border-slate-300 bg-slate-900 flex items-center justify-center shadow-md mt-3">
                      {settings.movieSettings?.posterUrl ? (
                        <>
                          <img
                            key={settings.movieSettings.posterUrl}
                            src={settings.movieSettings.posterUrl}
                            alt="Preview Poster Vertikal"
                            className="w-full h-full object-cover"
                            onError={(e: any) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = '/kabar-galeri-hero.jpg';
                            }}
                          />
                          <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/75 text-amber-400 text-[10px] font-bold">
                            Live Poster Vertikal
                          </div>
                        </>
                      ) : (
                        <div className="text-center p-4 text-slate-500 text-xs">
                          <Image className="w-8 h-8 mx-auto mb-1 opacity-40" />
                          <span>Preview Poster Belum Diatur</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Backdrop Teaser Input & Preview */}
                  <div className="space-y-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-black text-slate-900">
                        Backdrop Layar Teaser Player
                      </label>
                      <span className="text-[10px] text-slate-400 font-bold">Rasio 16:9 Bioskop</span>
                    </div>

                    {/* Direct Upload Button */}
                    <div>
                      <label className="cursor-pointer w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold transition shadow-md active:scale-95 group">
                        <Upload className="w-4 h-4 text-amber-400 group-hover:-translate-y-0.5 transition-transform" />
                        <span>{uploadingBackdrop ? 'Sedang Mengunggah Backdrop...' : '📁 Pilih & Upload File Backdrop'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          disabled={uploadingBackdrop}
                          className="hidden"
                          onChange={async e => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            setUploadingBackdrop(true);
                            const url = await handleFileUpload(file, 'backdrop');
                            setUploadingBackdrop(false);
                            if (url) {
                              setSettings({
                                ...settings,
                                movieSettings: {
                                  ...(settings.movieSettings || DEFAULT_MOVIE_SETTINGS),
                                  backdropUrl: url,
                                },
                              });
                            }
                          }}
                        />
                      </label>
                    </div>

                    {/* URL Path Box */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Jalur File Gambar Aktif</span>
                      <input
                        type="text"
                        value={settings.movieSettings?.backdropUrl || ''}
                        onChange={e =>
                          setSettings({
                            ...settings,
                            movieSettings: {
                              ...(settings.movieSettings || DEFAULT_MOVIE_SETTINGS),
                              backdropUrl: e.target.value,
                            },
                          })
                        }
                        placeholder="/uploads/backdrop-....jpg atau https://..."
                        className="w-full bg-slate-50 border border-slate-200 focus:border-amber-500 rounded-xl px-3 py-2 text-[11px] text-slate-800 font-mono outline-none"
                      />
                    </div>

                    {/* Preview Box */}
                    <div className="relative aspect-[16/9] rounded-xl overflow-hidden border border-slate-300 bg-slate-900 flex items-center justify-center shadow-inner">
                      {settings.movieSettings?.backdropUrl ? (
                        <>
                          <img
                            key={settings.movieSettings.backdropUrl}
                            src={settings.movieSettings.backdropUrl}
                            alt="Preview Backdrop"
                            className="w-full h-full object-cover"
                            onError={(e: any) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = '/kabar-galeri-hero.jpg';
                            }}
                          />
                          <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/75 text-amber-400 text-[10px] font-bold">
                            Live Backdrop Preview
                          </div>
                        </>
                      ) : (
                        <div className="text-center p-4 text-slate-500 text-xs">
                          <Image className="w-8 h-8 mx-auto mb-1 opacity-40" />
                          <span>Preview Backdrop Teaser</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Galeri File Tersimpan di Server VPS */}
                <div className="mt-5 pt-5 border-t border-slate-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div>
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                        <Image className="w-4 h-4 text-amber-500" />
                        Galeri Media di Server VPS ({serverUploads.length} File)
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        File tersimpan permanen di folder server (<code className="text-slate-700 font-mono">/public/uploads/</code> &amp; external backup). Klik untuk langsung pasang:
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={fetchServerUploads}
                      disabled={loadingUploads}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold transition shadow-xs self-start sm:self-auto"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${loadingUploads ? 'animate-spin' : ''}`} />
                      <span>{loadingUploads ? 'Memuat...' : 'Segarkan File'}</span>
                    </button>
                  </div>

                  {serverUploads.length === 0 ? (
                    <div className="bg-white border border-dashed border-slate-300 rounded-xl p-6 text-center text-slate-500 text-xs">
                      Belum ada file yang diunggah ke server. Gunakan tombol upload di atas untuk mengunggah poster atau backdrop.
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                      {serverUploads.map(file => {
                        const fileName = file.filename || file.name || 'file';
                        const isCurrentPoster = settings.movieSettings?.posterUrl === file.url;
                        const isCurrentBackdrop = settings.movieSettings?.backdropUrl === file.url;
                        const sizeKb = file.size ? Math.round(file.size / 1024) : 0;

                        return (
                          <div
                            key={fileName}
                            className={`group relative bg-white rounded-xl border overflow-hidden flex flex-col transition hover:shadow-md ${
                              isCurrentPoster || isCurrentBackdrop ? 'border-amber-500 ring-2 ring-amber-400/30' : 'border-slate-200'
                            }`}
                          >
                            {/* Image Thumbnail */}
                            <div className="relative aspect-square bg-slate-950 overflow-hidden">
                              <img
                                src={file.url}
                                alt={fileName}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                onError={(e: any) => {
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.src = '/kabar-galeri-hero.jpg';
                                }}
                              />
                              {isCurrentPoster && (
                                <span className="absolute top-1 left-1 bg-amber-500 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded shadow">
                                  POSTER AKTIF
                                </span>
                              )}
                              {isCurrentBackdrop && (
                                <span className="absolute top-1 right-1 bg-blue-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow">
                                  BACKDROP AKTIF
                                </span>
                              )}
                            </div>

                            {/* Info & Actions */}
                            <div className="p-2 flex-1 flex flex-col justify-between text-[10px] space-y-1.5">
                              <div>
                                <p className="font-mono text-slate-700 truncate font-bold text-[10px]" title={fileName}>
                                  {fileName}
                                </p>
                                <p className="text-slate-400 text-[9px]">{sizeKb} KB</p>
                              </div>

                              <div className="space-y-1 pt-1 border-t border-slate-100">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSettings({
                                      ...settings,
                                      movieSettings: {
                                        ...(settings.movieSettings || DEFAULT_MOVIE_SETTINGS),
                                        posterUrl: file.url,
                                      },
                                    });
                                  }}
                                  className={`w-full py-1 px-1.5 rounded text-[10px] font-bold text-center transition ${
                                    isCurrentPoster
                                      ? 'bg-amber-100 text-amber-800'
                                      : 'bg-slate-100 hover:bg-amber-500 hover:text-slate-950 text-slate-700'
                                  }`}
                                >
                                  {isCurrentPoster ? '✓ Poster Ini Aktif' : '📌 Jadi Poster'}
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setSettings({
                                      ...settings,
                                      movieSettings: {
                                        ...(settings.movieSettings || DEFAULT_MOVIE_SETTINGS),
                                        backdropUrl: file.url,
                                      },
                                    });
                                  }}
                                  className={`w-full py-1 px-1.5 rounded text-[10px] font-bold text-center transition ${
                                    isCurrentBackdrop
                                      ? 'bg-blue-100 text-blue-800'
                                      : 'bg-slate-100 hover:bg-slate-800 hover:text-white text-slate-700'
                                  }`}
                                >
                                  {isCurrentBackdrop ? '✓ Backdrop Aktif' : '🎬 Jadi Backdrop'}
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText(file.url);
                                    setCopiedUploadUrl(file.url);
                                    setTimeout(() => setCopiedUploadUrl(null), 2000);
                                  }}
                                  className="w-full py-0.5 px-1 rounded text-[9px] text-slate-400 hover:text-slate-700 text-center"
                                >
                                  {copiedUploadUrl === file.url ? '✓ Tersalin!' : 'Salin URL'}
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* 2. TEASER & TRAILER YOUTUBE PLAYER */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                <div className="border-b border-slate-200/60 pb-3">
                  <label className="block text-xs font-black uppercase text-slate-900 tracking-wider">
                    2. Link Video Teaser / Trailer YouTube
                  </label>
                  <p className="text-[11px] text-slate-500">
                    Masukkan URL video YouTube resmi (contoh: <code>https://www.youtube.com/watch?v=VIDEO_ID</code> atau <code>https://youtu.be/VIDEO_ID</code>).
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={settings.movieSettings?.trailerYoutubeUrl || ''}
                      onChange={e =>
                        setSettings({
                          ...settings,
                          movieSettings: {
                            ...(settings.movieSettings || DEFAULT_MOVIE_SETTINGS),
                            trailerYoutubeUrl: e.target.value,
                          },
                        })
                      }
                      placeholder="Contoh: https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                      className="flex-1 bg-white border border-slate-300 focus:border-amber-500 rounded-xl px-4 py-2.5 text-xs text-slate-900 font-mono outline-none"
                    />
                  </div>

                  {/* Live Embedded Video Test Player */}
                  <div className="border border-slate-300 rounded-2xl overflow-hidden bg-black shadow-inner">
                    <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 text-[11px] text-slate-300 font-bold flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-amber-400">
                        <Play className="w-3.5 h-3.5 fill-amber-400" />
                        Live Embedded Player Test
                      </span>
                      <span className="text-slate-400 text-[10px]">Tes putar sebelum rilis ke publik</span>
                    </div>
                    <div className="relative aspect-video w-full">
                      <iframe
                        src={getYouTubeEmbedUrl(settings.movieSettings?.trailerYoutubeUrl, false, false)}
                        title="Live Preview Trailer"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                        className="w-full h-full border-0"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. INFO FILM, TANGGAL RILIS & SINOPSIS */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                <div className="border-b border-slate-200/60 pb-3">
                  <label className="block text-xs font-black uppercase text-slate-900 tracking-wider">
                    3. Keterangan Judul, Tanggal Rilis &amp; Cerita Sinopsis
                  </label>
                  <p className="text-[11px] text-slate-500">
                    Informasi narasi film yang tampil pada bagian Hero dan Sinopsis Cerita.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Judul Film
                    </label>
                    <input
                      type="text"
                      value={settings.movieSettings?.title || 'PIYE TO KIH? THE MOVIE'}
                      onChange={e =>
                        setSettings({
                          ...settings,
                          movieSettings: {
                            ...(settings.movieSettings || DEFAULT_MOVIE_SETTINGS),
                            title: e.target.value,
                          },
                        })
                      }
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-bold outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Teks Tanggal Penayangan Perdana
                    </label>
                    <input
                      type="text"
                      value={settings.movieSettings?.releaseDateText || '19 November 2026'}
                      onChange={e =>
                        setSettings({
                          ...settings,
                          movieSettings: {
                            ...(settings.movieSettings || DEFAULT_MOVIE_SETTINGS),
                            releaseDateText: e.target.value,
                          },
                        })
                      }
                      placeholder="Contoh: 19 November 2026"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-bold outline-none"
                    />
                  </div>

                  {/* PENGATURAN BADGE LSF (ON / OFF FITUR) */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-red-600/15 text-red-600 border border-red-600/30 text-[10px] font-black uppercase tracking-wider">
                            {settings.movieSettings?.lsfRatingText || 'LSF 13+'}
                          </span>
                          <span className="text-xs font-bold text-slate-800">
                            Badge Rating LSF (Lembaga Sensor Film)
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">
                          Aktifkan untuk memunculkan badge klasifikasi LSF di atas trailer, atau matikan jika rating belum fix.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setSettings({
                            ...settings,
                            movieSettings: {
                              ...(settings.movieSettings || DEFAULT_MOVIE_SETTINGS),
                              showLsfBadge: !settings.movieSettings?.showLsfBadge,
                            },
                          })
                        }
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          settings.movieSettings?.showLsfBadge ? 'bg-emerald-500' : 'bg-slate-300'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            settings.movieSettings?.showLsfBadge ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    {settings.movieSettings?.showLsfBadge && (
                      <div className="pt-3 mt-3 border-t border-slate-200">
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Teks Label Rating LSF
                        </label>
                        <input
                          type="text"
                          value={settings.movieSettings?.lsfRatingText || 'LSF 13+'}
                          onChange={e =>
                            setSettings({
                              ...settings,
                              movieSettings: {
                                ...(settings.movieSettings || DEFAULT_MOVIE_SETTINGS),
                                lsfRatingText: e.target.value,
                              },
                            })
                          }
                          placeholder="Contoh: LSF 13+, LSF SU, LSF 17+"
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold outline-none"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Sutradara
                    </label>
                    <input
                      type="text"
                      value={settings.movieSettings?.director || 'Ito Mavin'}
                      onChange={e =>
                        setSettings({
                          ...settings,
                          movieSettings: {
                            ...(settings.movieSettings || DEFAULT_MOVIE_SETTINGS),
                            director: e.target.value,
                          },
                        })
                      }
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Penulis Skenario
                    </label>
                    <input
                      type="text"
                      value={settings.movieSettings?.writer || 'Endik Koeswoyo & Ito Mavin'}
                      onChange={e =>
                        setSettings({
                          ...settings,
                          movieSettings: {
                            ...(settings.movieSettings || DEFAULT_MOVIE_SETTINGS),
                            writer: e.target.value,
                          },
                        })
                      }
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kutipan Dialog Sinematik (Quote Block)
                  </label>
                  <input
                    type="text"
                    value={settings.movieSettings?.quoteDialog || ''}
                    onChange={e =>
                      setSettings({
                        ...settings,
                        movieSettings: {
                          ...(settings.movieSettings || DEFAULT_MOVIE_SETTINGS),
                          quoteDialog: e.target.value,
                        },
                      })
                    }
                    placeholder="Contoh: Niat ati golek omah murah gawe rabi..."
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 italic outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Sinopsis Cerita Film
                  </label>
                  <textarea
                    rows={4}
                    value={settings.movieSettings?.synopsis || ''}
                    onChange={e =>
                      setSettings({
                        ...settings,
                        movieSettings: {
                          ...(settings.movieSettings || DEFAULT_MOVIE_SETTINGS),
                          synopsis: e.target.value,
                        },
                      })
                    }
                    placeholder="Tuliskan sinopsis resmi film di sini..."
                    className="w-full bg-white border border-slate-300 rounded-xl p-3.5 text-xs text-slate-900 leading-relaxed outline-none"
                  />
                </div>
              </div>

              {/* 4. CAST & PEMERAN RESMI */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
                  <div>
                    <label className="block text-xs font-black uppercase text-slate-900 tracking-wider">
                      4. Jajaran Pemeran Resmi (Cast &amp; Characters)
                    </label>
                    <p className="text-[11px] text-slate-500">
                      Kelola profil foto dan deskripsi aktor utama Woko Channel &amp; bintang film.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const currentCast = settings.movieSettings?.cast || DEFAULT_MOVIE_SETTINGS.cast;
                      const newMember: MovieCastMember = {
                        id: `cast-${Date.now()}`,
                        actorName: '',
                        characterName: '',
                        badge: 'BINTANG FILM',
                        photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
                        bio: '',
                      };
                      setSettings({
                        ...settings,
                        movieSettings: {
                          ...(settings.movieSettings || DEFAULT_MOVIE_SETTINGS),
                          cast: [...currentCast, newMember],
                        },
                      });
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Pemeran</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(settings.movieSettings?.cast || DEFAULT_MOVIE_SETTINGS.cast).map((c: MovieCastMember, idx: number) => (
                    <div
                      key={c.id || idx}
                      className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3 relative group"
                    >
                      <div className="flex items-start gap-3">
                        {/* Thumbnail Photo */}
                        <div className="w-16 h-20 rounded-xl overflow-hidden bg-slate-900 border border-slate-200 shrink-0">
                          <img
                            src={c.photoUrl}
                            alt={c.actorName}
                            className="w-full h-full object-cover"
                            onError={(e: any) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        </div>

                        {/* Actor & Role Inputs */}
                        <div className="flex-1 space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <span className="text-[10px] font-bold text-slate-400 uppercase block">Nama Aktor</span>
                              <input
                                type="text"
                                value={c.actorName}
                                onChange={e => {
                                  const updated = [...(settings.movieSettings?.cast || DEFAULT_MOVIE_SETTINGS.cast)];
                                  updated[idx] = { ...updated[idx], actorName: e.target.value };
                                  setSettings({
                                    ...settings,
                                    movieSettings: {
                                      ...(settings.movieSettings || DEFAULT_MOVIE_SETTINGS),
                                      cast: updated,
                                    },
                                  });
                                }}
                                placeholder="Heri Chandra"
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-900 outline-none"
                              />
                            </div>
                            <div>
                              <span className="text-[10px] font-bold text-slate-400 uppercase block">Karakter</span>
                              <input
                                type="text"
                                value={c.characterName}
                                onChange={e => {
                                  const updated = [...(settings.movieSettings?.cast || DEFAULT_MOVIE_SETTINGS.cast)];
                                  updated[idx] = { ...updated[idx], characterName: e.target.value };
                                  setSettings({
                                    ...settings,
                                    movieSettings: {
                                      ...(settings.movieSettings || DEFAULT_MOVIE_SETTINGS),
                                      cast: updated,
                                    },
                                  });
                                }}
                                placeholder="MUKIDI"
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-amber-600 outline-none"
                              />
                            </div>
                          </div>

                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase block">Badge Label</span>
                            <input
                              type="text"
                              value={c.badge}
                              onChange={e => {
                                  const updated = [...(settings.movieSettings?.cast || DEFAULT_MOVIE_SETTINGS.cast)];
                                  updated[idx] = { ...updated[idx], badge: e.target.value };
                                  setSettings({
                                    ...settings,
                                    movieSettings: {
                                      ...(settings.movieSettings || DEFAULT_MOVIE_SETTINGS),
                                      cast: updated,
                                    },
                                  });
                              }}
                              placeholder="PEMERAN UTAMA • WOKO CHANNEL"
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-[11px] font-semibold text-slate-700 outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Photo Upload & URL */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Foto Aktor</span>
                          <label className="cursor-pointer text-[10px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-md flex items-center gap-1 transition">
                            <Upload className="w-3 h-3" />
                            <span>{uploadingCastIdx === idx ? 'Mengunggah...' : 'Upload Foto File'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              disabled={uploadingCastIdx === idx}
                              className="hidden"
                              onChange={async e => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                setUploadingCastIdx(idx);
                                const url = await handleFileUpload(file, 'cast');
                                setUploadingCastIdx(null);
                                if (url) {
                                  const updated = [...(settings.movieSettings?.cast || DEFAULT_MOVIE_SETTINGS.cast)];
                                  updated[idx] = { ...updated[idx], photoUrl: url };
                                  setSettings({
                                    ...settings,
                                    movieSettings: {
                                      ...(settings.movieSettings || DEFAULT_MOVIE_SETTINGS),
                                      cast: updated,
                                    },
                                  });
                                }
                              }}
                            />
                          </label>
                        </div>
                        <input
                          type="text"
                          value={c.photoUrl}
                          onChange={e => {
                            const updated = [...(settings.movieSettings?.cast || DEFAULT_MOVIE_SETTINGS.cast)];
                            updated[idx] = { ...updated[idx], photoUrl: e.target.value };
                            setSettings({
                              ...settings,
                              movieSettings: {
                                ...(settings.movieSettings || DEFAULT_MOVIE_SETTINGS),
                                cast: updated,
                              },
                            });
                          }}
                          placeholder="/uploads/cast-....jpg atau https://..."
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-[11px] font-mono text-slate-800 outline-none"
                        />
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Bio / Deskripsi Karakter</span>
                        <textarea
                          rows={2}
                          value={c.bio}
                          onChange={e => {
                            const updated = [...(settings.movieSettings?.cast || DEFAULT_MOVIE_SETTINGS.cast)];
                            updated[idx] = { ...updated[idx], bio: e.target.value };
                            setSettings({
                              ...settings,
                              movieSettings: {
                                ...(settings.movieSettings || DEFAULT_MOVIE_SETTINGS),
                                cast: updated,
                              },
                            });
                          }}
                          placeholder="Deskripsi peran dalam film..."
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-[11px] text-slate-700 outline-none"
                        />
                      </div>

                      {/* Delete Button */}
                      <div className="pt-1 flex justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            const currentCast = settings.movieSettings?.cast || DEFAULT_MOVIE_SETTINGS.cast;
                            if (currentCast.length <= 1) {
                              alert('Minimal harus ada 1 pemeran film!');
                              return;
                            }
                            const updated = currentCast.filter((_: any, cIdx: number) => cIdx !== idx);
                            setSettings({
                              ...settings,
                              movieSettings: {
                                ...(settings.movieSettings || DEFAULT_MOVIE_SETTINGS),
                                cast: updated,
                              },
                            });
                          }}
                          className="text-rose-600 hover:text-rose-700 text-[11px] font-bold flex items-center gap-1 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Hapus Pemeran Ini</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. TRACKING PIXEL & ANALYTICS TERPUSAT */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                <div className="border-b border-slate-200/60 pb-3">
                  <label className="block text-xs font-black uppercase text-slate-900 tracking-wider">
                    5. Pengaturan Tracking Pixel &amp; Ads (Otomatis Aktif di Semua Halaman)
                  </label>
                  <p className="text-[11px] text-slate-500">
                    Masukkan Pixel ID Anda. Sistem otomatis mencatat event <b>PageView</b>, <b>AddToCart</b> (saat klik beli tiket), dan <b>Lead</b> (saat klaim e-voucher) di halaman utama &amp; seluruh 17 kota.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Meta Pixel ID (FB / IG Ads)
                    </label>
                    <input
                      type="text"
                      value={settings.metaPixelId || ''}
                      onChange={e => setSettings({ ...settings, metaPixelId: e.target.value })}
                      placeholder="Contoh: 123456789012345"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono outline-none"
                    />
                    <span className="text-[10px] text-slate-500 block">Digunakan untuk optimasi iklan Meta</span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      TikTok Pixel ID
                    </label>
                    <input
                      type="text"
                      value={settings.tiktokPixelId || ''}
                      onChange={e => setSettings({ ...settings, tiktokPixelId: e.target.value })}
                      placeholder="Contoh: C123456789ABC"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono outline-none"
                    />
                    <span className="text-[10px] text-slate-500 block">Opsional untuk iklan TikTok</span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Google Analytics ID (GA4)
                    </label>
                    <input
                      type="text"
                      value={settings.googleAnalyticsId || ''}
                      onChange={e => setSettings({ ...settings, googleAnalyticsId: e.target.value })}
                      placeholder="Contoh: G-XXXXXXXXXX"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono outline-none"
                    />
                    <span className="text-[10px] text-slate-500 block">Opsional untuk web traffic GA4</span>
                  </div>
                </div>
              </div>

              {/* BOTTOM SAVE BUTTON */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-slate-500">
                  ⚡ <b>Pemberitahuan:</b> Perubahan akan langsung aktif secara live pada domain utama dan seluruh subdomain/kota.
                </div>
                <button
                  type="submit"
                  disabled={savingSettings}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/25 active:scale-95 transition"
                >
                  <Save className="w-4 h-4" />
                  <span>{savingSettings ? 'Menyimpan & Menyinkronkan...' : 'Simpan Semua Pengaturan Film & Media'}</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: PENGATURAN VOUCHER (CLEAN WHITE) */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSaveSettings} className="max-w-3xl bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-8 shadow-sm">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-lg font-black text-slate-900 tracking-tight">
                  Kontrol Kuota & Waktu Klaim War Voucher
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Atur batas kuota, durasi countdown, dan status buka/tutup war voucher secara mudah dan real-time.
                </p>
              </div>

              {settingsSuccess && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2.5">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span className="font-bold">Pengaturan berhasil disimpan dan langsung aktif di website!</span>
                </div>
              )}

              {/* SECTION: KONTROL MODE COMING SOON / MAINTENANCE */}
              <div className="bg-amber-500/10 border-2 border-amber-500/40 rounded-2xl p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-500/20 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="p-1 rounded bg-amber-600 text-white">
                        <Power className="w-4 h-4" />
                      </span>
                      <label className="block text-xs font-black uppercase text-slate-900 tracking-wider">
                        Mode Maintenance / Coming Soon Website
                      </label>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1">
                      Tampilkan halaman Coming Soon resmi dengan logo Piye To Kih kepada publik selagi materi/aset live dipersiapkan.
                    </p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                    settings.isMaintenanceMode ? 'bg-amber-600 text-white shadow-sm' : 'bg-emerald-600 text-white shadow-sm'
                  }`}>
                    {settings.isMaintenanceMode ? '🟡 Sedang Aktif' : '🟢 Non-Aktif (Live)'}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSettings({ ...settings, isMaintenanceMode: true })}
                    className={`flex-1 py-3 px-4 rounded-xl font-black text-xs border transition flex items-center justify-center gap-2 ${
                      settings.isMaintenanceMode
                        ? 'bg-amber-600 text-white border-amber-600 shadow-md'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <span>🟡 AKTIFKAN MODE COMING SOON</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSettings({ ...settings, isMaintenanceMode: false })}
                    className={`flex-1 py-3 px-4 rounded-xl font-black text-xs border transition flex items-center justify-center gap-2 ${
                      !settings.isMaintenanceMode
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <span>🟢 MATIKAN (WEBSITE LIVE PENUH)</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-800 mb-1">
                      Judul Headline Coming Soon
                    </label>
                    <input
                      type="text"
                      value={settings.maintenanceHeadline || 'COMING SOON'}
                      onChange={e => setSettings({ ...settings, maintenanceHeadline: e.target.value })}
                      placeholder="COMING SOON"
                      className="w-full bg-white border border-slate-300 focus:border-slate-900 rounded-xl px-4 py-2 text-slate-900 text-xs font-bold outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-800 mb-1">
                      Teks Penjelasan / Subtitle Coming Soon
                    </label>
                    <textarea
                      rows={2}
                      value={settings.maintenanceSubtitle || ''}
                      onChange={e => setSettings({ ...settings, maintenanceSubtitle: e.target.value })}
                      placeholder="Website Resmi Film PIYE TO KIH? The Movie sedang mempersiapkan sesuatu yang istimewa..."
                      className="w-full bg-white border border-slate-300 focus:border-slate-900 rounded-xl px-4 py-2 text-slate-900 text-xs outline-none"
                    />
                  </div>
                </div>

                <div className="p-3 bg-white/70 border border-amber-500/30 rounded-xl text-[11px] text-slate-600">
                  💡 <b>Catatan Akses:</b> Meskipun mode ini aktif, Anda sebagai Admin yang sedang login tetap dapat membuka dan melihat seluruh halaman website (Landing page utama, Jadwal Roadshow Kota, dll) dengan banner preview khusus di bagian atas.
                </div>
              </div>

              {/* 1. KONTROL JUMLAH KUOTA */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-3">
                  <div>
                    <label className="block text-xs font-black uppercase text-slate-900 tracking-wider">
                      1. Jumlah Kuota War Voucher
                    </label>
                    <p className="text-[11px] text-slate-500">
                      Batas maksimal penonton yang dapat mengklaim voucher.
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-xs bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm">
                    <span className="text-slate-500">Terklaim: <b className="text-slate-900">{leads.length}</b></span>
                    <span className="text-slate-300">|</span>
                    <span className="text-slate-500">Sisa: <b className="text-rose-600">{remainingQuota}</b></span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="flex-1">
                    <input
                      type="number"
                      min={leads.length}
                      value={settings.totalQuota}
                      onChange={e => setSettings({ ...settings, totalQuota: Number(e.target.value) })}
                      className="w-full bg-white border border-slate-300 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 rounded-xl px-4 py-2.5 text-slate-900 text-base font-bold outline-none"
                    />
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => setSettings({ ...settings, totalQuota: (settings.totalQuota || 0) + 50 })}
                      className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-800 rounded-xl text-xs font-bold border border-slate-200 shadow-sm transition"
                    >
                      +50 Stok
                    </button>
                    <button
                      type="button"
                      onClick={() => setSettings({ ...settings, totalQuota: (settings.totalQuota || 0) + 100 })}
                      className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-800 rounded-xl text-xs font-bold border border-slate-200 shadow-sm transition"
                    >
                      +100 Stok
                    </button>
                  </div>
                </div>

                {/* Preset Kuota Cepat */}
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                    Preset Kuota Cepat (Klik untuk memilih):
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {[100, 250, 500, 1000, 2500].map(amt => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setSettings({ ...settings, totalQuota: amt })}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                          settings.totalQuota === amt
                            ? 'bg-slate-900 text-white shadow-sm'
                            : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {amt.toLocaleString('id-ID')} Voucher
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 2. KONTROL WAKTU KLAIM (COUNTDOWN TIMER) */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                <div className="border-b border-slate-200/60 pb-3">
                  <label className="block text-xs font-black uppercase text-slate-900 tracking-wider">
                    2. Batas Waktu Klaim (Countdown Timer)
                  </label>
                  <p className="text-[11px] text-slate-500">
                    Pilih tanggal & jam hitung mundur berakhirnya war voucher.
                  </p>
                </div>

                <div>
                  <input
                    type="datetime-local"
                    value={(() => {
                      try {
                        const d = new Date(settings.countdownTarget || Date.now());
                        if (isNaN(d.getTime())) return '';
                        const pad = (n: number) => String(n).padStart(2, '0');
                        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
                      } catch {
                        return '';
                      }
                    })()}
                    onChange={e => {
                      if (!e.target.value) return;
                      const dateObj = new Date(e.target.value);
                      setSettings({ ...settings, countdownTarget: dateObj.toISOString() });
                    }}
                    className="w-full bg-white border border-slate-300 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 rounded-xl px-4 py-2.5 text-slate-900 text-sm font-semibold outline-none cursor-pointer"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Target Aktif Saat Ini: <b className="text-slate-900 font-mono">{new Date(settings.countdownTarget).toLocaleString('id-ID')}</b>
                  </span>
                </div>

                {/* Preset Waktu Cepat */}
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                    Preset Durasi Hitung Mundur Cepat:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const target = new Date(Date.now() + 2 * 3600 * 1000);
                        setSettings({ ...settings, countdownTarget: target.toISOString() });
                      }}
                      className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition shadow-sm"
                    >
                      ⏱️ 2 Jam Lagi
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const target = new Date(Date.now() + 6 * 3600 * 1000);
                        setSettings({ ...settings, countdownTarget: target.toISOString() });
                      }}
                      className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition shadow-sm"
                    >
                      ⏱️ 6 Jam Lagi
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const target = new Date(Date.now() + 24 * 3600 * 1000);
                        setSettings({ ...settings, countdownTarget: target.toISOString() });
                      }}
                      className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition shadow-sm"
                    >
                      📅 24 Jam (Besok)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const target = new Date(Date.now() + 72 * 3600 * 1000);
                        setSettings({ ...settings, countdownTarget: target.toISOString() });
                      }}
                      className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition shadow-sm"
                    >
                      📅 3 Hari (Weekend)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSettings({ ...settings, countdownTarget: '2026-10-22T13:00:00+07:00' });
                      }}
                      className="px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs font-bold transition shadow-sm"
                    >
                      🎬 Roadshow 22 Okt 2026
                    </button>
                  </div>
                </div>
              </div>

              {/* 3. SAKLAR STATUS BUKA/TUTUP */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <label className="block text-xs font-black uppercase text-slate-900 tracking-wider">
                    3. Status Form War Voucher
                  </label>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {settings.isWarOpen
                      ? '🟢 SEDANG DIBUKA — Formulir aktif dan penonton bisa klaim voucher.'
                      : '🔴 DITUTUP — Formulir dinonaktifkan sementara.'}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSettings({ ...settings, isWarOpen: true })}
                    className={`px-4 py-2 rounded-xl text-xs font-extrabold transition shadow-sm ${
                      settings.isWarOpen
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white text-slate-600 border border-slate-200'
                    }`}
                  >
                    Buka Klaim
                  </button>
                  <button
                    type="button"
                    onClick={() => setSettings({ ...settings, isWarOpen: false })}
                    className={`px-4 py-2 rounded-xl text-xs font-extrabold transition shadow-sm ${
                      !settings.isWarOpen
                        ? 'bg-rose-600 text-white'
                        : 'bg-white text-slate-600 border border-slate-200'
                    }`}
                  >
                    Tutup Klaim
                  </button>
                </div>
              </div>

              {/* 4. META PIXEL */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-2">
                <label className="block text-xs font-black uppercase text-slate-900 tracking-wider">
                  4. Meta Pixel ID (Facebook / Instagram Ads)
                </label>
                <input
                  type="text"
                  value={settings.metaPixelId}
                  onChange={e => setSettings({ ...settings, metaPixelId: e.target.value })}
                  placeholder="Contoh: 123456789012345"
                  className="w-full bg-white border border-slate-300 focus:border-slate-900 rounded-xl px-4 py-2.5 text-slate-900 text-xs outline-none font-mono"
                />
                <span className="text-[11px] text-slate-500 block">
                  Event PageView, Lead, dan TicketIntent otomatis terhubung ke Pixel ID ini.
                </span>
              </div>

              {/* 5. MASA BERLAKU REDEEM VOUCHER (PENAYANGAN PERDANA DI BIOSKOP) */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                <div className="border-b border-slate-200/60 pb-3">
                  <label className="block text-xs font-black uppercase text-slate-900 tracking-wider">
                    5. Masa Berlaku Voucher di Bioskop (Penayangan Perdana)
                  </label>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Atur tanggal berlaku penukaran tiket di kasir bioskop mitra secara fleksibel sesuai timeline film.
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Teks Tampilan Masa Berlaku (Tercetak di E-Voucher & Email)
                    </label>
                    <input
                      type="text"
                      value={settings.voucherValidDatesText || ''}
                      onChange={e => setSettings({ ...settings, voucherValidDatesText: e.target.value })}
                      placeholder="Contoh: 19 - 20 November 2026 (Penayangan Perdana)"
                      className="w-full bg-white border border-slate-300 focus:border-slate-900 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 outline-none"
                    />
                  </div>

                  {/* Preset Cepat Tanggal Tayang */}
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                      Pilihan Preset Tanggal Cepat:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setSettings({
                            ...settings,
                            voucherValidDatesText: '19 - 20 November 2026 (Penayangan Perdana)',
                            voucherValidStart: '2026-11-19',
                            voucherValidEnd: '2026-11-20',
                          })
                        }
                        className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition shadow-sm"
                      >
                        🎬 19 - 20 Nov 2026 (Penayangan Perdana)
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setSettings({
                            ...settings,
                            voucherValidDatesText: '19 - 25 November 2026 (Minggu Pertama Tayang)',
                            voucherValidStart: '2026-11-19',
                            voucherValidEnd: '2026-11-25',
                          })
                        }
                        className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition shadow-sm"
                      >
                        📅 19 - 25 Nov 2026 (Pekan Pertama)
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setSettings({
                            ...settings,
                            voucherValidDatesText: '19 November - 02 Desember 2026 (2 Pekan Penayangan)',
                            voucherValidStart: '2026-11-19',
                            voucherValidEnd: '2026-12-02',
                          })
                        }
                        className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition shadow-sm"
                      >
                        📅 19 Nov - 02 Des 2026 (2 Pekan)
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                        Tanggal Mulai Tayang
                      </label>
                      <input
                        type="date"
                        value={settings.voucherValidStart || '2026-11-19'}
                        onChange={e => setSettings({ ...settings, voucherValidStart: e.target.value })}
                        className="w-full bg-white border border-slate-300 focus:border-slate-900 rounded-xl px-4 py-2 text-xs font-bold text-slate-900 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                        Tanggal Batas Akhir Redeem
                      </label>
                      <input
                        type="date"
                        value={settings.voucherValidEnd || '2026-11-20'}
                        onChange={e => setSettings({ ...settings, voucherValidEnd: e.target.value })}
                        className="w-full bg-white border border-slate-300 focus:border-slate-900 rounded-xl px-4 py-2 text-xs font-bold text-slate-900 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Petunjuk / Syarat Penukaran di Loket Bioskop
                    </label>
                    <textarea
                      rows={2}
                      value={settings.voucherTermsText || ''}
                      onChange={e => setSettings({ ...settings, voucherTermsText: e.target.value })}
                      placeholder="Contoh: Voucher dapat ditukarkan di bioskop kesayangan Anda pada periode penayangan film Piye To Kih."
                      className="w-full bg-white border border-slate-300 focus:border-slate-900 rounded-xl px-4 py-2.5 text-xs text-slate-900 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* 6. MEDIA SOSIAL RESMI (FOOTER SYNC) */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                <div className="border-b border-slate-200/60 pb-3">
                  <label className="block text-xs font-black uppercase text-slate-900 tracking-wider">
                    6. Link Media Sosial Resmi Film (Muncul di Footer Website)
                  </label>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Tautkan akun media sosial resmi produksi &amp; film agar penonton dapat mengikuti update terbaru.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Instagram Official
                    </label>
                    <input
                      type="text"
                      value={settings.socialLinks?.instagram || ''}
                      onChange={e =>
                        setSettings({
                          ...settings,
                          socialLinks: { ...(settings.socialLinks || {}), instagram: e.target.value },
                        })
                      }
                      placeholder="https://www.instagram.com/piyetokihfilm.official/"
                      className="w-full bg-white border border-slate-300 focus:border-slate-900 rounded-xl px-4 py-2 text-xs text-slate-900 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      TikTok Official
                    </label>
                    <input
                      type="text"
                      value={settings.socialLinks?.tiktok || ''}
                      onChange={e =>
                        setSettings({
                          ...settings,
                          socialLinks: { ...(settings.socialLinks || {}), tiktok: e.target.value },
                        })
                      }
                      placeholder="https://www.tiktok.com/@piyetokihfilm.official"
                      className="w-full bg-white border border-slate-300 focus:border-slate-900 rounded-xl px-4 py-2 text-xs text-slate-900 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Facebook Fanspage Official
                    </label>
                    <input
                      type="text"
                      value={settings.socialLinks?.facebook || ''}
                      onChange={e =>
                        setSettings({
                          ...settings,
                          socialLinks: { ...(settings.socialLinks || {}), facebook: e.target.value },
                        })
                      }
                      placeholder="https://www.facebook.com/piyetokihfilm.official"
                      className="w-full bg-white border border-slate-300 focus:border-slate-900 rounded-xl px-4 py-2 text-xs text-slate-900 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      YouTube Official
                    </label>
                    <input
                      type="text"
                      value={settings.socialLinks?.youtube || ''}
                      onChange={e =>
                        setSettings({
                          ...settings,
                          socialLinks: { ...(settings.socialLinks || {}), youtube: e.target.value },
                        })
                      }
                      placeholder="https://www.youtube.com/@piyetokihfilm"
                      className="w-full bg-white border border-slate-300 focus:border-slate-900 rounded-xl px-4 py-2 text-xs text-slate-900 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* 7. KEAMANAN & KREDENSIAL LOGIN DASHBOARD */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                <div className="border-b border-slate-200/60 pb-3 flex items-center justify-between">
                  <div>
                    <label className="text-xs font-black uppercase text-slate-900 tracking-wider flex items-center gap-1.5">
                      <Shield className="w-4 h-4 text-emerald-600" />
                      <span>5. Keamanan & Kredensial Akses Administrator</span>
                    </label>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Ubah kata sandi login dashboard untuk menjamin keamanan operasional server.
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    HTTP-Only Protected
                  </span>
                </div>

                {passwordStatus && (
                  <div
                    className={`p-3 rounded-xl text-xs font-medium border flex items-center gap-2 ${
                      passwordStatus.success
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-red-50 text-red-800 border-red-200'
                    }`}
                  >
                    {passwordStatus.success ? <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />}
                    <span>{passwordStatus.msg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Username Baru (Opsional)
                    </label>
                    <input
                      type="text"
                      value={newUsername}
                      onChange={e => setNewUsername(e.target.value)}
                      placeholder="admin"
                      className="w-full bg-white border border-slate-300 focus:border-slate-900 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Password Saat Ini <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={e => setCurrentPassword(e.target.value)}
                      placeholder="Kata sandi lama"
                      className="w-full bg-white border border-slate-300 focus:border-slate-900 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Password Baru <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      placeholder="Min. 8 karakter"
                      className="w-full bg-white border border-slate-300 focus:border-slate-900 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 outline-none"
                    />
                  </div>
                </div>

                <div className="pt-1 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">
                    Default awal: <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-700 font-mono">admin</code> / <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-700 font-mono">PiyeToKih#2026</code>
                  </span>
                  <button
                    type="button"
                    onClick={handleChangePassword}
                    disabled={updatingPassword || !currentPassword || !newPassword}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition disabled:opacity-40"
                  >
                    <Key className="w-3.5 h-3.5 text-amber-400" />
                    <span>{updatingPassword ? 'Memproses...' : 'Ubah Kredensial Sekarang'}</span>
                  </button>
                </div>
              </div>

              {/* TOMBOL SIMPAN */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={savingSettings}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs py-3.5 px-8 rounded-xl shadow-md transition-transform active:scale-95 disabled:opacity-50"
                >
                  <Save className="w-4 h-4 text-amber-400" />
                  <span>{savingSettings ? 'Menyimpan Pengaturan...' : 'SIMPAN SEMUA PENGATURAN'}</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB: PENGATURAN PROMO BUY 1 GET 1 (CLEAN WHITE) */}
          {activeTab === 'bogo' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <Ticket className="w-5 h-5 text-amber-500" />
                    <span>Pengaturan Halaman Promo Buy 1 Get 1 (BOGO)</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Atur tautan tombol tiket bioskop mitra untuk kampanye iklan nonton berdua di halaman <code>/bogo</code>.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href="/bogo"
                    target="_blank"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-bold transition shadow-sm"
                  >
                    <span>Lihat Halaman /bogo</span>
                    <ExternalLink className="w-3.5 h-3.5 text-amber-600" />
                  </Link>
                </div>
              </div>

              {settingsSuccess && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2.5">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span className="font-bold">Pengaturan promo Buy 1 Get 1 berhasil disimpan!</span>
                </div>
              )}

              <form onSubmit={handleSaveSettings} className="space-y-6">
                {/* 1. STATUS AKTIF PROMO BOGO */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase text-slate-900 tracking-wider">
                      1. Status Promo Buy 1 Get 1
                    </label>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {settings.isBogoActive !== false
                        ? '🟢 SEDANG AKTIF — Tombol dan halaman /bogo dapat diakses langsung oleh audiens.'
                        : '🔴 DINONAKTIFKAN — Promo sementara ditutup.'}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setSettings({ ...settings, isBogoActive: true })}
                      className={`px-4 py-2 rounded-xl text-xs font-extrabold transition shadow-sm ${
                        settings.isBogoActive !== false
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white text-slate-600 border border-slate-200'
                      }`}
                    >
                      Aktifkan Promo
                    </button>
                    <button
                      type="button"
                      onClick={() => setSettings({ ...settings, isBogoActive: false })}
                      className={`px-4 py-2 rounded-xl text-xs font-extrabold transition shadow-sm ${
                        settings.isBogoActive === false
                          ? 'bg-rose-600 text-white'
                          : 'bg-white text-slate-600 border border-slate-200'
                      }`}
                    >
                      Nonaktifkan
                    </button>
                  </div>
                </div>

                {/* 2. BANNER VISUAL PROMO BOGO (UPLOAD LANGSUNG / OTOMATIS IKUT POSTER FILM) */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <label className="block text-xs font-black uppercase text-slate-900 tracking-wider">
                        2. Banner Visual Promosi Halaman /bogo
                      </label>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {settings.bogoBannerUrl
                          ? 'Menggunakan banner khusus promo BOGO yang diunggah.'
                          : 'Otomatis mewarisi Poster Resmi Film yang telah Anda atur di tab 🎬 Official Film & Media.'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {settings.bogoBannerUrl && (
                        <button
                          type="button"
                          onClick={() => setSettings({ ...settings, bogoBannerUrl: '' })}
                          className="text-[11px] font-bold text-red-600 hover:text-red-700 flex items-center gap-1 transition"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Gunakan Poster Film</span>
                        </button>
                      )}

                      <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-sm active:scale-95 shrink-0">
                        <Upload className="w-3.5 h-3.5 text-amber-400" />
                        <span>{uploadingBogoBanner ? 'Mengunggah Banner...' : '📁 Upload Banner BOGO'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          disabled={uploadingBogoBanner}
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            setUploadingBogoBanner(true);
                            const url = await handleFileUpload(file, 'bogo-banner');
                            setUploadingBogoBanner(false);
                            if (url) {
                              setSettings((prev: any) => ({ ...prev, bogoBannerUrl: url }));
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  {/* Visual Banner Preview */}
                  {(() => {
                    const activeBanner =
                      settings.bogoBannerUrl ||
                      settings.movieSettings?.posterUrl ||
                      settings.movieSettings?.backdropUrl ||
                      'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80';

                    return (
                      <div className="relative aspect-[16/9] max-w-xl rounded-xl overflow-hidden border border-slate-300 bg-slate-900 shadow-inner">
                        <img
                          src={activeBanner}
                          alt="Banner BOGO Preview"
                          className="w-full h-full object-cover"
                          onError={(e: any) => (e.target.style.display = 'none')}
                        />
                        <div className="absolute top-2 left-2 px-2.5 py-1 rounded bg-black/80 text-amber-400 text-[10px] font-bold">
                          {settings.bogoBannerUrl ? '★ Banner Khusus BOGO Aktif' : '🎬 Poster Film Aktif (Otomatis)'}
                        </div>
                        <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded bg-black/80 text-slate-300 font-mono text-[10px] truncate max-w-[85%]">
                          {activeBanner}
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* 3. LINK TIKET UTAMA / DEFAULT */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-xs font-black uppercase text-slate-900 tracking-wider">
                        3. Link Tiket Utama (Tombol Banner Besar)
                      </label>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Tautan default saat penonton menekan tombol utama &quot;BELI TIKET BUY 1 GET 1 BIOSKOP SEKARANG&quot;.
                      </p>
                    </div>
                    {settings.bogoDefaultTicketLink && (
                      <a
                        href={settings.bogoDefaultTicketLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-amber-600 hover:text-amber-700 font-bold flex items-center gap-1 shrink-0"
                      >
                        <span>Test Link</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                  <input
                    type="url"
                    value={settings.bogoDefaultTicketLink || ''}
                    onChange={e => setSettings({ ...settings, bogoDefaultTicketLink: e.target.value })}
                    placeholder="Contoh: https://m.21cineplex.com atau link presale khusus"
                    className="w-full bg-white border border-slate-300 focus:border-slate-900 rounded-xl px-4 py-2.5 text-xs text-slate-900 outline-none font-mono"
                  />
                </div>

                {/* 4. LINK TIKET SPESIFIK PER BIOSKOP MITRA & TOMBOL HALAMAN UTAMA */}
                <div className="bg-amber-500/5 border-2 border-amber-400/30 rounded-2xl p-5 space-y-4 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-500/20 pb-3">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-900 font-black text-[10px] uppercase tracking-wider mb-1">
                        <Sparkles className="w-3 h-3 text-amber-600" />
                        <span>Tautan Tombol Landing Page &amp; Halaman Promo</span>
                      </div>
                      <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                        Link Tombol Beli Tiket BOGO (TIX ID &amp; M-TIX Cinema XXI)
                      </h4>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        Ubah tautan ini untuk mengganti tujuan link pada 2 tombol promo Buy 1 Get 1 di <b>Halaman Utama</b> dan <b>halaman /bogo</b>.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* TIX ID */}
                    <div className="bg-white border border-slate-300 rounded-xl p-3.5 space-y-2 shadow-sm">
                      <div className="flex items-center justify-between">
                        <label className="block text-[11px] font-black text-slate-900 uppercase">
                          🎟️ Link Tombol TIX ID:
                        </label>
                        {settings.bogoCinemaLinks?.tixid && (
                          <a
                            href={settings.bogoCinemaLinks.tixid}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-emerald-600 hover:underline flex items-center gap-0.5 font-bold"
                          >
                            <span>Test Buka</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500">
                        Dipakai di tombol: <i>&quot;Beli tiket Buy 1 Get 1 di TIX ID selama persediaan masih ada&quot;</i>
                      </p>
                      <input
                        type="url"
                        value={settings.bogoCinemaLinks?.tixid || ''}
                        onChange={e =>
                          setSettings({
                            ...settings,
                            bogoCinemaLinks: { ...settings.bogoCinemaLinks, tixid: e.target.value },
                          })
                        }
                        placeholder="Contoh: https://rb.gy/l28pzj atau https://www.tix.id"
                        className="w-full bg-slate-50 border border-slate-300 focus:border-amber-500 rounded-lg px-3 py-2 text-xs text-slate-900 outline-none font-mono"
                      />
                    </div>

                    {/* M-TIX XXI */}
                    <div className="bg-white border border-slate-300 rounded-xl p-3.5 space-y-2 shadow-sm">
                      <div className="flex items-center justify-between">
                        <label className="block text-[11px] font-black text-slate-900 uppercase">
                          🎟️ Link Tombol M-TIX (Cinema XXI):
                        </label>
                        {settings.bogoCinemaLinks?.xxi && (
                          <a
                            href={settings.bogoCinemaLinks.xxi}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-amber-600 hover:underline flex items-center gap-0.5 font-bold"
                          >
                            <span>Test Buka</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500">
                        Dipakai di tombol: <i>&quot;Beli tiket Buy 1 Get 1 di M-TIX selama persediaan masih ada&quot;</i>
                      </p>
                      <input
                        type="url"
                        value={settings.bogoCinemaLinks?.xxi || ''}
                        onChange={e =>
                          setSettings({
                            ...settings,
                            bogoCinemaLinks: { ...settings.bogoCinemaLinks, xxi: e.target.value },
                          })
                        }
                        placeholder="Contoh: https://m.21cineplex.com/id/movies/16PTKH"
                        className="w-full bg-slate-50 border border-slate-300 focus:border-amber-500 rounded-lg px-3 py-2 text-xs text-slate-900 outline-none font-mono"
                      />
                    </div>

                    {/* CGV (Opsional untuk /bogo) */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-200 md:border-t-0">
                      <div className="flex items-center justify-between">
                        <label className="block text-[11px] font-bold text-slate-700 uppercase">
                          CGV Cinemas URL (Khusus Halaman /bogo):
                        </label>
                        {settings.bogoCinemaLinks?.cgv && (
                          <a
                            href={settings.bogoCinemaLinks.cgv}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-slate-600 hover:underline flex items-center gap-0.5"
                          >
                            <span>Buka</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                      <input
                        type="url"
                        value={settings.bogoCinemaLinks?.cgv || ''}
                        onChange={e =>
                          setSettings({
                            ...settings,
                            bogoCinemaLinks: { ...settings.bogoCinemaLinks, cgv: e.target.value },
                          })
                        }
                        placeholder="Contoh: https://www.cgv.id"
                        className="w-full bg-white border border-slate-300 focus:border-slate-900 rounded-xl px-3.5 py-2 text-xs text-slate-900 outline-none font-mono"
                      />
                    </div>

                    {/* Cinepolis (Opsional untuk /bogo) */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-200 md:border-t-0">
                      <div className="flex items-center justify-between">
                        <label className="block text-[11px] font-bold text-slate-700 uppercase">
                          Cinépolis URL (Khusus Halaman /bogo):
                        </label>
                        {settings.bogoCinemaLinks?.cinepolis && (
                          <a
                            href={settings.bogoCinemaLinks.cinepolis}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-slate-600 hover:underline flex items-center gap-0.5"
                          >
                            <span>Buka</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                      <input
                        type="url"
                        value={settings.bogoCinemaLinks?.cinepolis || ''}
                        onChange={e =>
                          setSettings({
                            ...settings,
                            bogoCinemaLinks: { ...settings.bogoCinemaLinks, cinepolis: e.target.value },
                          })
                        }
                        placeholder="Contoh: https://cinepolis.co.id"
                        className="w-full bg-white border border-slate-300 focus:border-slate-900 rounded-xl px-3.5 py-2 text-xs text-slate-900 outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* 5. SUBJUDUL PENAWARAN */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-2">
                  <label className="block text-xs font-black uppercase text-slate-900 tracking-wider">
                    5. Teks Subjudul Promo BOGO di Halaman Web
                  </label>
                  <input
                    type="text"
                    value={settings.bogoSubtitle || ''}
                    onChange={e => setSettings({ ...settings, bogoSubtitle: e.target.value })}
                    placeholder="Contoh: Ajak pasangan, keluarga, atau bestie nonton film PIYE TO KIH di bioskop!"
                    className="w-full bg-white border border-slate-300 focus:border-slate-900 rounded-xl px-4 py-2.5 text-xs text-slate-900 outline-none"
                  />
                </div>

                {/* TOMBOL SIMPAN */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={savingSettings}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs py-3.5 px-8 rounded-xl shadow-md transition-transform active:scale-95 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4 text-amber-400" />
                    <span>{savingSettings ? 'Menyimpan...' : 'SIMPAN PENGATURAN PROMO BOGO'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB: PENGATURAN EMAIL GATEWAY (CLEAN WHITE) */}
          {activeTab === 'email' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="border-b border-slate-100 pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                      <Mail className="w-5 h-5 text-amber-500" />
                      <span>Pengaturan Email Gateway (SMTP Delivery)</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Kirimkan e-voucher resmi langsung ke alamat email penonton sesaat setelah formulir dikirimkan.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold ${
                        settings.smtpHost && settings.smtpUser
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          settings.smtpHost && settings.smtpUser ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                        }`}
                      />
                      {settings.smtpHost && settings.smtpUser ? 'SMTP Siap Digunakan' : 'Mode Simulasi (Mock Log)'}
                    </span>
                  </div>
                </div>
              </div>

              {settingsSuccess && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2.5">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span className="font-bold">Pengaturan email berhasil disimpan!</span>
                </div>
              )}

              <form onSubmit={handleSaveSettings} className="space-y-6">
                {/* SMTP Server Configuration */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                  <h4 className="text-xs font-black uppercase text-slate-900 tracking-wider">
                    Konfigurasi Server SMTP
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2 space-y-1.5">
                      <label className="block text-[11px] font-bold text-slate-700 uppercase">
                        SMTP Host / Server
                      </label>
                      <input
                        type="text"
                        value={settings.smtpHost || ''}
                        onChange={e => setSettings({ ...settings, smtpHost: e.target.value })}
                        placeholder="Contoh: smtp.hostinger.com / smtp.gmail.com"
                        className="w-full bg-white border border-slate-300 focus:border-slate-900 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none font-mono"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-bold text-slate-700 uppercase">
                        Port SMTP
                      </label>
                      <select
                        value={settings.smtpPort || 465}
                        onChange={e => setSettings({ ...settings, smtpPort: Number(e.target.value) })}
                        className="w-full bg-white border border-slate-300 focus:border-slate-900 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none font-mono"
                      >
                        <option value={465}>465 (SSL / Secure - Rekomendasi)</option>
                        <option value={587}>587 (TLS / STARTTLS)</option>
                        <option value={25}>25 (Standard)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-bold text-slate-700 uppercase">
                        SMTP Username / Email Akun
                      </label>
                      <input
                        type="text"
                        value={settings.smtpUser || ''}
                        onChange={e => setSettings({ ...settings, smtpUser: e.target.value })}
                        placeholder="Contoh: ticket@piyetokihfilm.com"
                        className="w-full bg-white border border-slate-300 focus:border-slate-900 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none font-mono"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-bold text-slate-700 uppercase">
                        SMTP Password / App Password
                      </label>
                      <input
                        type="password"
                        value={settings.smtpPass || ''}
                        onChange={e => setSettings({ ...settings, smtpPass: e.target.value })}
                        placeholder="••••••••••••"
                        className="w-full bg-white border border-slate-300 focus:border-slate-900 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-bold text-slate-700 uppercase">
                        Nama & Email Pengirim (From)
                      </label>
                      <input
                        type="text"
                        value={settings.smtpFrom || 'Miracle Pictures <ticket@piyetokihfilm.com>'}
                        onChange={e => setSettings({ ...settings, smtpFrom: e.target.value })}
                        placeholder='Contoh: Miracle Pictures <ticket@piyetokihfilm.com>'
                        className="w-full bg-white border border-slate-300 focus:border-slate-900 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-bold text-slate-700 uppercase">
                        Subjek Email Pengiriman Voucher
                      </label>
                      <input
                        type="text"
                        value={settings.emailSubject || '🎟️ E-Voucher Resmi Nonton Film PIYE TO KIH? - Miracle Pictures'}
                        onChange={e => setSettings({ ...settings, emailSubject: e.target.value })}
                        placeholder="Subjek email..."
                        className="w-full bg-white border border-slate-300 focus:border-slate-900 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={savingSettings}
                    className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs py-3 px-6 rounded-xl shadow-sm transition active:scale-95 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4 text-amber-400" />
                    <span>{savingSettings ? 'Menyimpan...' : 'SIMPAN PENGATURAN EMAIL'}</span>
                  </button>
                </div>
              </form>

              {/* UJI COBA PENGIRIMAN EMAIL */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                <div className="border-b border-slate-200/60 pb-2">
                  <h4 className="text-xs font-black uppercase text-slate-900 tracking-wider flex items-center gap-2">
                    <Send className="w-4 h-4 text-amber-600" />
                    <span>Uji Coba Pengiriman Email (Live Test)</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Kirimkan satu email uji coba untuk memverifikasi bahwa host, port, dan password SMTP Anda bekerja dengan lancar.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="flex-1">
                    <input
                      type="email"
                      value={testEmailTo}
                      onChange={e => setTestEmailTo(e.target.value)}
                      placeholder="Masukkan email penerima (contoh: emailanda@gmail.com)"
                      className="w-full bg-white border border-slate-300 focus:border-slate-900 rounded-xl px-4 py-2.5 text-xs text-slate-900 outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleTestEmail}
                    disabled={testingEmail || !testEmailTo}
                    className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs py-2.5 px-5 rounded-xl shadow-sm transition disabled:opacity-50 active:scale-95 shrink-0"
                  >
                    {testingEmail ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Mengirim Tes...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Kirim Email Tes</span>
                      </>
                    )}
                  </button>
                </div>

                {testEmailResult && (
                  <div
                    className={`p-3.5 rounded-xl text-xs font-medium flex items-start gap-2.5 ${
                      testEmailResult.success
                        ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                        : 'bg-rose-50 border border-rose-200 text-rose-800'
                    }`}
                  >
                    {testEmailResult.success ? (
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    )}
                    <span>{testEmailResult.message}</span>
                  </div>
                )}
              </div>

              {/* PANDUAN PENGATURAN HOSTINGER & GMAIL */}
              <div className="bg-amber-50/50 border border-amber-200/80 rounded-2xl p-5 space-y-3 text-xs text-amber-900">
                <h5 className="font-extrabold uppercase text-[11px] tracking-wider text-amber-950 flex items-center gap-2">
                  <span>💡 Rekomendasi Pengaturan SMTP:</span>
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] text-amber-800 leading-relaxed">
                  <div className="bg-white/80 p-3 rounded-xl border border-amber-200/60">
                    <b className="text-slate-900 block mb-1">Hostinger Email / Custom Domain:</b>
                    Host: <code className="font-bold text-slate-800">smtp.hostinger.com</code><br />
                    Port: <code className="font-bold text-slate-800">465</code> (SSL)<br />
                    User: Email domain lengkap Anda (misal: info@piyetokihfilm.com)
                  </div>
                  <div className="bg-white/80 p-3 rounded-xl border border-amber-200/60">
                    <b className="text-slate-900 block mb-1">Gmail SMTP:</b>
                    Host: <code className="font-bold text-slate-800">smtp.gmail.com</code><br />
                    Port: <code className="font-bold text-slate-800">465</code> (SSL) atau 587 (TLS)<br />
                    Pass: Gunakan <i>App Password</i> (Sandi Aplikasi 16 karakter dari Google Account).
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PENGATURAN JADWAL ROADSHOW & BIOSKOP 17 KOTA */}
          {activeTab === 'cities' && (
            <div className="space-y-6">
              {/* Header Box */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                  <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center shrink-0">
                      <Calendar className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-black text-slate-900">
                          Pusat Kendali Jadwal Roadshow &amp; Bioskop (17 Kota)
                        </h3>
                        <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                          17 Kota Roadshow
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
                        Kelola jam tayang Special Screening (nonton duluan), info studio, ketersediaan kursi, alamat, link tiket bioskop, titik booth mall, dan rundown harian untuk seluruh kota roadshow secara langsung (real-time).
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSaveSettings}
                      disabled={savingSettings}
                      className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs py-2.5 px-5 rounded-xl transition shadow-sm active:scale-95 disabled:opacity-50"
                    >
                      {savingSettings ? <RefreshCw className="w-4 h-4 animate-spin text-amber-400" /> : <Save className="w-4 h-4 text-amber-400" />}
                      <span>{savingSettings ? 'Menyimpan...' : 'Simpan Semua'}</span>
                    </button>
                  </div>
                </div>

                {/* Search & City Filter Bar */}
                <div className="mt-5 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-700">
                      PILIH KOTA YANG INGIN DIEDIT:
                    </span>
                    <div className="relative w-full sm:w-64">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={citySearchQuery}
                        onChange={e => setCitySearchQuery(e.target.value)}
                        placeholder="Cari nama kota..."
                        className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 outline-none focus:border-slate-900"
                      />
                    </div>
                  </div>

                  {/* 17 Cities Quick Selector Pills */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {CITIES_DATA.filter(c => {
                      if (!citySearchQuery.trim()) return true;
                      const q = citySearchQuery.toLowerCase();
                      return c.name.toLowerCase().includes(q) || c.province.toLowerCase().includes(q);
                    }).map(c => {
                      const isSelected = c.slug === selectedCitySlug;
                      const overridden = isCityOverridden(c.slug);
                      const currentCity = getCurrentCityData(c.slug);

                      return (
                        <button
                          key={c.slug}
                          type="button"
                          onClick={() => setSelectedCitySlug(c.slug)}
                          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                            isSelected
                              ? 'bg-slate-900 text-amber-400 shadow-md ring-2 ring-amber-400/40'
                              : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700 border border-slate-200/60'
                          }`}
                        >
                          <span>{c.name}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                            isSelected ? 'bg-white/10 text-slate-300' : 'bg-white text-slate-500'
                          }`}>
                            {currentCity.dateStr.split(' ')[0]} {currentCity.dateStr.split(' ')[1]?.slice(0, 3)}
                          </span>
                          {overridden && (
                            <span className="w-2 h-2 rounded-full bg-amber-400" title="Ada jadwal kustom tersimpan" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* City Active Workspace */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-8 shadow-sm">
                {/* Active City Title & Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xl font-black text-slate-900 uppercase">
                        KOTA {activeCityData.name} ({activeCityData.province})
                      </h4>
                      {isCityOverridden(activeCityData.slug) ? (
                        <span className="bg-amber-500/10 border border-amber-500/30 text-amber-700 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                          Jadwal Kustom Aktif
                        </span>
                      ) : (
                        <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                          Default Awal
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Slug URL: <code className="text-amber-600 font-mono">/city/{activeCityData.slug}</code>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/city/${activeCityData.slug}`}
                      target="_blank"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition"
                    >
                      <span>Lihat Halaman Publik</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                    </Link>
                    <button
                      type="button"
                      onClick={resetSelectedCityToDefault}
                      title="Kembalikan ke jadwal default awal"
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Reset Default</span>
                    </button>
                  </div>
                </div>

                {/* 1. TANGGAL ROADSHOW KOTA */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
                  <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm">
                    <Calendar className="w-4 h-4 text-amber-600" />
                    <span>Tanggal Pelaksanaan Roadshow Kota</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Tanggal Tampil (Bahasa Indonesia)
                      </label>
                      <input
                        type="text"
                        value={activeCityData.dateStr}
                        onChange={e => updateSelectedCityField('dateStr', e.target.value)}
                        placeholder="Contoh: 22 Oktober 2026"
                        className="w-full bg-white border border-slate-300 focus:border-slate-900 rounded-xl px-4 py-2.5 text-slate-900 font-bold text-xs outline-none"
                      />
                      <p className="text-[11px] text-slate-500 mt-1">
                        Tanggal ini akan otomatis diperbarui di seluruh kartu bioskop, hero kota, dan balasan CS AI WhatsApp.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 2. DAFTAR BIOSKOP SPECIAL SCREENING (INTI REVISI USER) */}
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <Film className="w-4 h-4 text-amber-600" />
                        <h5 className="font-extrabold text-sm text-slate-900 uppercase">
                          Bioskop &amp; Jam Tayang Special Screening (Nonton Duluan)
                        </h5>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Kelola bioskop, jam tayang, catatan pintu, kuota kursi, dan link pembelian tiket resmi.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={addCinemaToSelectedCity}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition shadow-sm active:scale-95"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Tambah Bioskop di {activeCityData.name}</span>
                    </button>
                  </div>

                  {/* List of Cinema Cards */}
                  <div className="space-y-4">
                    {(activeCityData.cinemas || []).map((cinema, cIdx) => (
                      <div
                        key={cIdx}
                        className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4 relative"
                      >
                        <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-lg bg-slate-900 text-white text-xs font-black flex items-center justify-center">
                              {cIdx + 1}
                            </span>
                            <span className="font-extrabold text-sm text-slate-900 uppercase">
                              {cinema.name || `Bioskop #${cIdx + 1}`}
                            </span>
                            <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2 py-0.5 rounded">
                              {cinema.chain}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeCinemaFromSelectedCity(cIdx)}
                            className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-bold px-2.5 py-1 rounded-lg hover:bg-red-50 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Hapus</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                          {/* Nama Bioskop */}
                          <div>
                            <label className="block font-bold text-slate-700 uppercase mb-1">
                              Nama Bioskop
                            </label>
                            <input
                              type="text"
                              value={cinema.name}
                              onChange={e => updateCinemaInSelectedCity(cIdx, { name: e.target.value })}
                              placeholder="Contoh: THE PARK XXI SEMARANG"
                              className="w-full bg-white border border-slate-300 focus:border-slate-900 rounded-lg px-3 py-2 text-slate-900 font-bold outline-none"
                            />
                          </div>

                          {/* Chain */}
                          <div>
                            <label className="block font-bold text-slate-700 uppercase mb-1">
                              Jaringan (Chain)
                            </label>
                            <select
                              value={cinema.chain}
                              onChange={e => updateCinemaInSelectedCity(cIdx, { chain: e.target.value as any })}
                              className="w-full bg-white border border-slate-300 focus:border-slate-900 rounded-lg px-3 py-2 text-slate-900 font-bold outline-none"
                            >
                              <option value="XXI">XXI (Cinema 21)</option>
                              <option value="Cinepolis">Cinépolis</option>
                              <option value="CGV">CGV Cinemas</option>
                              <option value="Platinum">Platinum Cineplex</option>
                              <option value="NSC">New Star Cineplex (NSC)</option>
                              <option value="Indie">Bioskop Independen / Lainnya</option>
                            </select>
                          </div>

                          {/* Nama Studio */}
                          <div>
                            <label className="block font-bold text-slate-700 uppercase mb-1">
                              Nama Studio / Audi
                            </label>
                            <input
                              type="text"
                              value={cinema.studio}
                              onChange={e => updateCinemaInSelectedCity(cIdx, { studio: e.target.value })}
                              placeholder="Contoh: Studio 1 Premiere Sound / Audi 2 Super Screen"
                              className="w-full bg-white border border-slate-300 focus:border-slate-900 rounded-lg px-3 py-2 text-slate-900 outline-none"
                            />
                          </div>

                          {/* Jam Tayang */}
                          <div>
                            <label className="block font-bold text-slate-700 uppercase mb-1">
                              Jam Tayang (Showtime)
                            </label>
                            <input
                              type="text"
                              value={Array.isArray(cinema.showTimes) ? cinema.showTimes.join(', ') : (cinema.showTimes || '')}
                              onChange={e => {
                                const val = e.target.value;
                                const times = val.split(',').map(s => s.trim()).filter(Boolean);
                                updateCinemaInSelectedCity(cIdx, { showTimes: times });
                              }}
                              placeholder="Contoh: 14.30 WIB atau 14.30 WIB, 19.00 WIB"
                              className="w-full bg-white border border-slate-300 focus:border-slate-900 rounded-lg px-3 py-2 text-slate-900 font-mono font-bold outline-none"
                            />
                            <span className="text-[10px] text-slate-500 mt-0.5 block">
                              Pisahkan koma jika ada lebih dari 1 jam tayang.
                            </span>
                          </div>

                          {/* Catatan Pintu */}
                          <div>
                            <label className="block font-bold text-slate-700 uppercase mb-1">
                              Catatan Pintu Teater
                            </label>
                            <input
                              type="text"
                              value={cinema.doorNote || ''}
                              onChange={e => updateCinemaInSelectedCity(cIdx, { doorNote: e.target.value })}
                              placeholder="Contoh: Pintu teater dibuka 15 mnt sebelumnya"
                              className="w-full bg-white border border-slate-300 focus:border-slate-900 rounded-lg px-3 py-2 text-slate-900 outline-none"
                            />
                          </div>

                          {/* Sisa Kursi Text Badge */}
                          <div>
                            <label className="block font-bold text-slate-700 uppercase mb-1">
                              Teks Sisa Kursi (Badge)
                            </label>
                            <input
                              type="text"
                              value={cinema.remainingSeatsText || ''}
                              onChange={e => updateCinemaInSelectedCity(cIdx, { remainingSeatsText: e.target.value })}
                              placeholder="Contoh: ±42 kursi tersisa"
                              className="w-full bg-white border border-slate-300 focus:border-slate-900 rounded-lg px-3 py-2 text-slate-900 font-mono outline-none"
                            />
                          </div>

                          {/* Alamat Bioskop */}
                          <div className="sm:col-span-2">
                            <label className="block font-bold text-slate-700 uppercase mb-1">
                              Alamat Lengkap / Lokasi Mall
                            </label>
                            <input
                              type="text"
                              value={cinema.address || ''}
                              onChange={e => updateCinemaInSelectedCity(cIdx, { address: e.target.value })}
                              placeholder="Contoh: The Park Mall Semarang Lt. 3, Jl. Madukoro Raya No. 1"
                              className="w-full bg-white border border-slate-300 focus:border-slate-900 rounded-lg px-3 py-2 text-slate-900 outline-none"
                            />
                          </div>

                          {/* Badge Text Atas */}
                          <div>
                            <label className="block font-bold text-slate-700 uppercase mb-1">
                              Badge Header Kartu
                            </label>
                            <input
                              type="text"
                              value={cinema.badgeText || 'SPECIAL SCREENING · GREETING CAST'}
                              onChange={e => updateCinemaInSelectedCity(cIdx, { badgeText: e.target.value })}
                              placeholder="Contoh: SPECIAL SCREENING · GREETING CAST"
                              className="w-full bg-white border border-slate-300 focus:border-slate-900 rounded-lg px-3 py-2 text-slate-900 font-mono outline-none text-[11px]"
                            />
                          </div>

                          {/* Link Tiket URL */}
                          <div className="sm:col-span-2 lg:col-span-3">
                            <label className="block font-bold text-slate-700 uppercase mb-1 flex items-center justify-between">
                              <span>Link Tiket (URL Pembelian Langsung ke Bioskop)</span>
                              {cinema.ticketUrl && (
                                <a
                                  href={cinema.ticketUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[11px] text-amber-600 hover:text-amber-700 font-bold inline-flex items-center gap-1"
                                >
                                  <span>Test Link Tiket</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                            </label>
                            <input
                              type="text"
                              value={cinema.ticketUrl || ''}
                              onChange={e => updateCinemaInSelectedCity(cIdx, { ticketUrl: e.target.value })}
                              placeholder="https://m.21cineplex.com/... atau https://tix.id/..."
                              className="w-full bg-white border border-slate-300 focus:border-slate-900 rounded-lg px-3 py-2 text-slate-900 font-mono text-[11px] outline-none"
                            />
                            <span className="text-[10px] text-slate-500 mt-0.5 block">
                              URL ini menjadi target tombol &quot;NONTON DULUAN DI {cinema.name}&quot; dan dikirimkan oleh CS AI WhatsApp ke penonton.
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. LIVE PREVIEW KARTU BIOSKOP (PERSIS SCREENSHOT USER) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <h5 className="font-extrabold text-sm text-slate-900 uppercase">
                        Live Preview: Tampilan Kartu di Halaman Publik
                      </h5>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Real-time Preview (Persis seperti yang dilihat pengunjung)
                    </span>
                  </div>

                  <div className="bg-[#0b0f17] border border-white/10 rounded-2xl p-6 sm:p-8">
                    <div className="text-center mb-6">
                      <span className="text-[11px] font-black uppercase tracking-[0.25em] text-amber-400">
                        PILIHAN LOKASI NONTON DULUAN
                      </span>
                      <h4 className="text-2xl font-black text-white uppercase tracking-tight mt-1 mb-1">
                        PILIH LOKASI NONTON DULUAN!
                      </h4>
                      <p className="text-xs text-slate-400 max-w-lg mx-auto">
                        Beli tiket sekarang dan nonton duluan di tanggal {activeCityData.dateStr}. Jangan sampai kehabisan, persediaan tiket terbatas!
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                      {(activeCityData.cinemas || []).map((cinema, idx) => (
                        <div
                          key={idx}
                          className="bg-[#121620] border border-white/10 hover:border-amber-500/50 rounded-2xl p-6 sm:p-7 flex flex-col justify-between shadow-2xl relative overflow-hidden transition-all"
                        >
                          <div>
                            {/* Badges */}
                            <div className="flex items-center justify-between gap-2 mb-3">
                              <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider text-amber-400">
                                {cinema.badgeText || 'SPECIAL SCREENING · GREETING CAST'}
                              </span>
                              {cinema.remainingSeatsText && (
                                <span className="text-[11px] font-mono font-bold text-slate-400 bg-white/5 px-2.5 py-0.5 rounded border border-white/10">
                                  {cinema.remainingSeatsText}
                                </span>
                              )}
                            </div>

                            {/* Cinema Name & Studio */}
                            <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                              {cinema.name}
                            </h3>
                            <p className="text-xs sm:text-sm text-slate-400 font-medium mb-5">
                              {cinema.studio}
                            </p>

                            {/* Info List */}
                            <div className="bg-[#161c28] border border-white/5 rounded-2xl p-4 space-y-2.5 mb-6 text-xs sm:text-sm text-slate-200">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                                <span className="font-semibold">{activeCityData.dateStr}</span>
                              </div>

                              <div className="flex items-start gap-2">
                                <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                                <span>
                                  <b className="text-amber-300 font-mono text-xs sm:text-sm">
                                    {Array.isArray(cinema.showTimes) ? cinema.showTimes.join(', ') : cinema.showTimes}
                                  </b>{' '}
                                  <span className="text-slate-400 text-xs">
                                    ({cinema.doorNote || 'Pintu teater dibuka 15 mnt sebelumnya'})
                                  </span>
                                </span>
                              </div>

                              {cinema.address && (
                                <div className="flex items-start gap-2 text-slate-300">
                                  <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                                  <span className="text-xs">{cinema.address}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* CTA Button */}
                          <div>
                            <div className="w-full bg-[#f59e0b] hover:bg-[#d97706] text-slate-950 font-black py-3.5 px-5 rounded-xl shadow-lg flex items-center justify-center gap-2 text-center uppercase tracking-wide text-xs sm:text-sm cursor-pointer">
                              <span>NONTON DULUAN DI {cinema.name}</span>
                              <ExternalLink className="w-4 h-4" />
                            </div>
                            <p className="text-[11px] text-slate-400 text-center mt-2.5 flex items-center justify-center gap-1">
                              <span>Kamu akan diarahkan ke platform ticketing resmi.</span>
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 4. BOOTH MALL ROADSHOW & PENUKARAN VOUCHER */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-amber-600" />
                      <h5 className="font-extrabold text-sm text-slate-900 uppercase">
                        Titik Booth Mall &amp; Pengambilan Voucher Fisik
                      </h5>
                    </div>
                    <span className="text-[11px] text-slate-500">
                      Lokasi offline jumpa pemain &amp; konter booth resmi
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">
                        Nama Mall / Venue
                      </label>
                      <input
                        type="text"
                        value={activeCityData.boothInfo?.venue || ''}
                        onChange={e => updateBoothInfoInSelectedCity({ venue: e.target.value })}
                        placeholder="Contoh: THE PARK MALL SEMARANG"
                        className="w-full bg-white border border-slate-300 focus:border-slate-900 rounded-lg px-3 py-2 text-slate-900 font-bold outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">
                        Lantai / Posisi Booth
                      </label>
                      <input
                        type="text"
                        value={activeCityData.boothInfo?.floor || ''}
                        onChange={e => updateBoothInfoInSelectedCity({ floor: e.target.value })}
                        placeholder="Contoh: Lantai 2 (Area Atrium Depan Eskalator)"
                        className="w-full bg-white border border-slate-300 focus:border-slate-900 rounded-lg px-3 py-2 text-slate-900 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">
                        Jam Standby Booth
                      </label>
                      <input
                        type="text"
                        value={activeCityData.boothInfo?.timeStr || ''}
                        onChange={e => updateBoothInfoInSelectedCity({ timeStr: e.target.value })}
                        placeholder="Contoh: 16.00 – 17.00 WIB"
                        className="w-full bg-white border border-slate-300 focus:border-slate-900 rounded-lg px-3 py-2 text-slate-900 font-mono outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 uppercase mb-1">
                        Petunjuk Arah (Directions)
                      </label>
                      <input
                        type="text"
                        value={activeCityData.boothInfo?.directions || ''}
                        onChange={e => updateBoothInfoInSelectedCity({ directions: e.target.value })}
                        placeholder="Contoh: Dekat eskalator tengah lantai 2, cari spanduk oranye..."
                        className="w-full bg-white border border-slate-300 focus:border-slate-900 rounded-lg px-3 py-2 text-slate-900 outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-bold text-slate-700 uppercase mb-1">
                        Peringatan Khusus Penukaran (Notice)
                      </label>
                      <textarea
                        rows={2}
                        value={activeCityData.boothInfo?.exclusiveNotice || ''}
                        onChange={e => updateBoothInfoInSelectedCity({ exclusiveNotice: e.target.value })}
                        placeholder="Contoh: Penukaran voucher fisik resmi hanya berada di The Park Mall Lantai 2... DILARANG menukar di kasir bioskop manapun."
                        className="w-full bg-white border border-slate-300 focus:border-slate-900 rounded-lg px-3 py-2 text-slate-900 outline-none text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* 5. RUNDOWN JADWAL ACARA HARI ITU */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-600" />
                      <h5 className="font-extrabold text-sm text-slate-900 uppercase">
                        Rundown Agenda Hari H Roadshow ({activeCityData.name})
                      </h5>
                    </div>

                    <button
                      type="button"
                      onClick={addRundownItem}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5 text-amber-400" />
                      <span>Tambah Agenda</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {(activeCityData.rundown?.items || []).map((item, rIdx) => (
                      <div
                        key={rIdx}
                        className="bg-white border border-slate-200/80 rounded-xl p-3.5 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center text-xs"
                      >
                        <div className="sm:col-span-2">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                            Jam
                          </label>
                          <input
                            type="text"
                            value={item.time}
                            onChange={e => updateRundownItem(rIdx, { time: e.target.value })}
                            placeholder="09.00 - 11.00 WIB"
                            className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 font-mono text-slate-900 font-bold outline-none"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                            Kategori
                          </label>
                          <select
                            value={item.category}
                            onChange={e => updateRundownItem(rIdx, { category: e.target.value as any })}
                            className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1.5 text-slate-900 font-bold outline-none text-[11px]"
                          >
                            <option value="Sekolah">Sekolah</option>
                            <option value="Kampus">Kampus</option>
                            <option value="Radio">Radio</option>
                            <option value="Mall & Meet">Mall &amp; Meet</option>
                            <option value="Screening">Screening</option>
                            <option value="Acara">Acara</option>
                          </select>
                        </div>

                        <div className="sm:col-span-4">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                            Judul Agenda
                          </label>
                          <input
                            type="text"
                            value={item.title}
                            onChange={e => updateRundownItem(rIdx, { title: e.target.value })}
                            placeholder="Contoh: Kunjungan Sekolah & Tebar Semangat"
                            className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-slate-900 font-bold outline-none"
                          />
                        </div>

                        <div className="sm:col-span-3">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                            Lokasi / Venue
                          </label>
                          <input
                            type="text"
                            value={item.venue}
                            onChange={e => updateRundownItem(rIdx, { venue: e.target.value })}
                            placeholder="Contoh: SMK Negeri 7 Semarang"
                            className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-slate-900 outline-none"
                          />
                        </div>

                        <div className="sm:col-span-1 flex justify-end">
                          <button
                            type="button"
                            onClick={() => removeRundownItem(rIdx)}
                            className="text-red-500 hover:text-red-700 p-1.5 rounded hover:bg-red-50 transition"
                            title="Hapus agenda ini"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 6. BOTTOM SAVE BAR */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      Perubahan jadwal Kota <b>{activeCityData.name}</b> akan tersimpan ke server database dan langsung live.
                    </span>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={handleSaveSettings}
                      disabled={savingSettings}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs py-3.5 px-7 rounded-xl transition shadow-lg shadow-emerald-600/20 active:scale-95 disabled:opacity-50"
                    >
                      {savingSettings ? <RefreshCw className="w-4 h-4 animate-spin text-white" /> : <Save className="w-4 h-4 text-white" />}
                      <span>{savingSettings ? 'Menyimpan Perubahan...' : `Simpan Jadwal ${activeCityData.name.toUpperCase()}`}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}


          {/* TAB 4: WAHNOTIF & SCRIPT CHAT (CLEAN WHITE) */}
          {activeTab === 'wahnotif' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
                <h3 className="text-base font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-emerald-600" />
                  <span>Koneksi Wahnotif API & Webhook</span>
                </h3>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold uppercase text-slate-700 mb-1">
                      Wahnotif API Key
                    </label>
                    <input
                      type="password"
                      value={settings.wahnotifApiKey || ''}
                      onChange={e => setSettings({ ...settings, wahnotifApiKey: e.target.value })}
                      placeholder="Masukkan API Key Wahnotif"
                      className="w-full bg-slate-50 border border-slate-300 focus:border-slate-900 rounded-xl px-4 py-2.5 text-slate-900 text-xs outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold uppercase text-slate-700 mb-1">
                      Nomor Pengirim (Sender)
                    </label>
                    <input
                      type="text"
                      value={settings.wahnotifSenderNumber || ''}
                      onChange={e => setSettings({ ...settings, wahnotifSenderNumber: e.target.value })}
                      placeholder="6285220954750"
                      className="w-full bg-slate-50 border border-slate-300 focus:border-slate-900 rounded-xl px-4 py-2.5 text-slate-900 text-xs outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold uppercase text-slate-700 mb-1 flex items-center justify-between">
                      <span>Google Gemini API Key (Vision AI Baca Foto / Gambar)</span>
                      <span className="text-[10px] text-amber-600 font-semibold lowercase">Opsional / Disarankan</span>
                    </label>
                    <input
                      type="password"
                      value={settings.geminiApiKey || ''}
                      onChange={e => setSettings({ ...settings, geminiApiKey: e.target.value })}
                      placeholder="AIzaSy... (Opsional, untuk membaca screenshot bukti transfer/e-ticket/denah kursi)"
                      className="w-full bg-slate-50 border border-slate-300 focus:border-slate-900 rounded-xl px-4 py-2.5 text-slate-900 text-xs outline-none font-mono"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      Memungkinkan Mas Kidi menganalisis isi gambar/screenshot foto barcode e-ticket, denah kursi bioskop, atau bukti bayar yang dikirim penonton di WhatsApp secara cerdas.
                    </p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <span className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      URL Webhook Inbound:
                    </span>
                    <div className="flex items-center gap-2">
                      <code className="bg-white border border-slate-200 px-2.5 py-1.5 rounded text-slate-900 text-xs font-mono flex-1 truncate">
                        {siteOrigin ? `${siteOrigin}/api/webhook/wahnotif` : '/api/webhook/wahnotif'}
                      </code>
                      <button
                        onClick={() =>
                          copyToClipboard(
                            `${siteOrigin || ''}/api/webhook/wahnotif`,
                            'webhook'
                          )
                        }
                        className="p-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition"
                        title="Salin Webhook URL"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    {copiedWebhook && (
                      <span className="text-[11px] text-emerald-600 font-bold mt-1 block">
                        ✓ Webhook URL tersalin!
                      </span>
                    )}
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={handleSaveSettings}
                      className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-3 px-4 rounded-xl transition shadow-sm"
                    >
                      <Save className="w-4 h-4" />
                      <span>Simpan Pengaturan Wahnotif</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => openFollowupModal('all')}
                      className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-extrabold text-xs py-3 px-4 rounded-xl transition shadow-sm"
                    >
                      <Send className="w-4 h-4" />
                      <span>🔥 Broadcast & Follow-Up Presale</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Script Asisten Chat & Custom AI Tool */}
              <div className="space-y-6">
                {/* 🚨 ALERT PENTING: PANDUAN ANTI AYAH/BUNDA & LIVE AGENT HANDOVER */}
                <div className="p-4 sm:p-5 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-950 text-xs shadow-sm space-y-3">
                  <div className="flex items-start gap-2.5">
                    <span className="text-xl leading-none">🚨</span>
                    <div>
                      <h4 className="font-black text-sm text-rose-950 uppercase tracking-wide">
                        PANDUAN HAPUS BALASAN &quot;AYAH/BUNDA&quot; &amp; &quot;KAK ADMIN&quot; DARI WAHNOTIF
                      </h4>
                      <p className="text-[12px] text-rose-900 mt-1 leading-relaxed">
                        Jika bot pernah membalas: <i>&quot;Baik Ayah/Bunda, percakapan ini sudah langsung saya teruskan ke nomor WhatsApp Tim CS/Admin kami (Kak Admin)...&quot;</i>, itu adalah <b>template bawaan bawaan Wahnotif</b> saat terjadi pengalihan ke live human CS (Ambil Alih / Eskalasi).
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 bg-white/90 rounded-xl border border-rose-200 text-[11px] text-slate-800 space-y-2">
                    <p className="font-bold text-rose-950">Cara Mengubah / Menghapusnya di Dashboard Wahnotif Anda:</p>
                    <ol className="list-decimal pl-4 space-y-1.5 text-slate-700">
                      <li>Buka dashboard Wahnotif Anda di <b>wahnotif.com</b>.</li>
                      <li>Masuk ke menu <b>AI CS Assistant &gt; Pengaturan Handover / Eskalasi CS (Ambil Alih AI)</b>.</li>
                      <li>
                        Cari input field <b>&quot;Pesan Pengalihan ke Admin / Template Eskalasi&quot;</b>. Ubah teks default tersebut menjadi gaya Mas Kidi:
                        <span className="block font-mono bg-slate-100 p-2 rounded mt-1 border text-rose-900 text-[11px]">
                          Siap bolo asik! Mas Kidi sambungkan langsung obrolan ini ke Tim Partnership &amp; Admin Miracle Pictures ya lur. Tunggu sebentar nggih, tim kami bakal segera balas chat sampean langsung di sini! 🍿✨
                        </span>
                      </li>
                      <li>Klik <b>Simpan</b> di Wahnotif. Webhook kami juga sudah otomatis menangani kata kunci kemitraan/nobar/admin agar langsung dibalas Mas Kidi!</li>
                    </ol>
                  </div>
                </div>

                {/* 🎟️ ALERT KHUSUS: PANDUAN MENJAWAB HARGA TIKET (30-50 RIBU) & HAPUS KATA "KATALOG / ADMIN TOKO" */}
                <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-950 text-xs shadow-sm space-y-3">
                  <div className="flex items-start gap-2.5">
                    <span className="text-xl leading-none">🎟️</span>
                    <div>
                      <h4 className="font-black text-sm text-emerald-950 uppercase tracking-wide">
                        PANDUAN HARGA TIKET (RENTANG RP 30.000 – RP 50.000) &amp; ELIMINASI KATA &quot;KATALOG / TOKO KAMI&quot;
                      </h4>
                      <p className="text-[12px] text-emerald-900 mt-1 leading-relaxed">
                        Jika penonton bertanya seputar harga tiket di WhatsApp (misal: <i>&quot;berapa harganya tiket nya bosku&quot;</i>), AI <b>DILARANG KERAS</b> membalas dengan istilah e-commerce (seperti <i>&quot;cek di katalog/website toko kami atau admin toko&quot;</i>).
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 bg-white/95 rounded-xl border border-emerald-200 text-[11px] text-slate-800 space-y-2">
                    <p className="font-bold text-emerald-950">Standar Jawaban Resmi Mas Kidi Saat Tanya Harga Tiket (HTM):</p>
                    <ul className="list-disc pl-4 space-y-1 text-slate-700">
                      <li><b>Rentang Perkiraan Harga:</b> Berikan perkiraan <b>Rp 30.000 s/d Rp 50.000</b> per tiket (tergantung bioskop XXI/CGV/Cinepolis/Platinum/NSC, kota, dan hari biasa/weekend).</li>
                      <li><b>Tautan Bioskop Langsung:</b> Arahkan langsung ke tautan resmi bioskop yang ada di landing page (Cinema XXI/M-TIX, TIX ID, CGV, Cinépolis, atau link kota yang bersangkutan) untuk cek harga pasti dan pilih kursi.</li>
                      <li><b>Info Promo:</b> Sisipkan info Nonton Duluan (Special Screening) sebelum 19 Nov, promo Buy 1 Get 1 (19 Nov), dan voucher booth mall Rp 10.000.</li>
                      <li><b>Action Admin:</b> Salin ulang <b>4 Isian Wahnotif</b> atau <b>Master System Prompt</b> di bawah ini dan simpan di dashboard Wahnotif Anda agar prompt terbaru langsung aktif!</li>
                    </ul>
                  </div>
                </div>

                {/* Banner Panduan 4 Isian Wahnotif */}
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
                  <div>
                    <h4 className="font-extrabold text-sm text-amber-950 flex items-center gap-1.5">
                      <span>🤖 4 Isian Wajib di Wahnotif (AI CS Assistant)</span>
                    </h4>
                    <p className="text-[11px] text-amber-800 mt-1 leading-relaxed">
                      Di panel Wahnotif menu <b>AI CS Assistant &gt; Persona &amp; Knowledge</b>, isi 4 kolom di bawah ini. Cukup klik tombol <b>Salin</b> di masing-masing kartu lalu paste ke Wahnotif.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href="/api/wahnotif/persona"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Buka JSON Auto-Sync API</span>
                    </a>
                  </div>
                </div>

                {/* Grid 3 Isian Pendek: Nama, Role, Tone */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* 1. Nama Bot */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">1. Nama Bot / Asisten</span>
                        <button
                          onClick={() => copyToClipboard(activePersona.botName, 'prompt')}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] transition"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Salin</span>
                        </button>
                      </div>
                      <p className="text-xs font-black text-slate-900 mt-2">{activePersona.botName}</p>
                    </div>
                    <p className="text-[10px] text-slate-400">Tempel di field: <b>Bot Name / Nama Asisten</b></p>
                  </div>

                  {/* 2. Role / Peran */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">2. Peran / Role Identity</span>
                        <button
                          onClick={() => copyToClipboard(activePersona.role, 'prompt')}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] transition"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Salin</span>
                        </button>
                      </div>
                      <p className="text-xs font-semibold text-slate-800 mt-2 leading-snug">{activePersona.role}</p>
                    </div>
                    <p className="text-[10px] text-slate-400">Tempel di field: <b>Role / Peran Utama</b></p>
                  </div>

                  {/* 3. Tone of Voice */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">3. Tone of Voice</span>
                        <button
                          onClick={() => copyToClipboard(activePersona.tone, 'prompt')}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] transition"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Salin</span>
                        </button>
                      </div>
                      <p className="text-xs text-slate-700 mt-2 leading-snug">{activePersona.tone}</p>
                    </div>
                    <p className="text-[10px] text-slate-400">Tempel di field: <b>Tone of Voice / Karakter Bicara</b></p>
                  </div>
                </div>

                {/* 4. System Prompt & Knowledge Base A-Z */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-black text-[10px] uppercase">Isian 4</span>
                        <h3 className="text-sm font-black text-slate-900">
                          System Prompt &amp; Knowledge Base (A–Z Terintegrasi)
                        </h3>
                      </div>
                      <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">
                        ✓ Filter Jadwal 17 Kota, Nonton Duluan Presale, BOGO 15 Nov, Tiket Bioskop &amp; Voucher Booth
                      </p>
                    </div>

                    <button
                      onClick={() => copyToClipboard(activePersona.systemPrompt, 'prompt')}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs transition shadow-sm"
                    >
                      <Copy className="w-4 h-4" />
                      <span>{copiedPrompt ? 'Tersalin ke Clipboard!' : 'Salin System Prompt Lengkap'}</span>
                    </button>
                  </div>

                  <textarea
                    readOnly
                    value={activePersona.systemPrompt}
                    rows={12}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-700 text-xs font-mono outline-none leading-relaxed"
                  />
                </div>

                {/* 4 Isian Khusus Panel Wahnotif (Konteks Bisnis, Closing, Persona, Pengetahuan) */}
                <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-6 space-y-4">
                  <div className="border-b border-amber-200/70 pb-3">
                    <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-black text-[10px] uppercase">
                      4 Kolom Panel Wahnotif AI Agent
                    </span>
                    <h3 className="text-sm font-black text-slate-900 mt-1">
                      Salin per Kolom ke Dashboard Wahnotif (AI CS Assistant &gt; Setup AI)
                    </h3>
                    <p className="text-xs text-amber-900 mt-0.5">
                      Gunakan 4 isian terpisah ini jika panel Wahnotif Anda memisahkan kolom Konteks, Teknik Closing, Karakter Persona, dan Data Pengetahuan.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Kolom 1: Konteks Bisnis */}
                    <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2 shadow-sm">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <div>
                          <span className="text-[10px] font-black uppercase text-amber-600 block">Kolom 1</span>
                          <h4 className="text-xs font-bold text-slate-900">Konteks Bisnis / Profil Toko</h4>
                        </div>
                        <button
                          onClick={() => copyToClipboard(activePersona.konteksBisnis, 'prompt')}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-[11px] transition"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Salin</span>
                        </button>
                      </div>
                      <textarea
                        readOnly
                        value={activePersona.konteksBisnis}
                        rows={5}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-[11px] font-mono text-slate-700 outline-none"
                      />
                    </div>

                    {/* Kolom 2: Teknik Closing */}
                    <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2 shadow-sm">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <div>
                          <span className="text-[10px] font-black uppercase text-amber-600 block">Kolom 2 (Filter Kota Expired)</span>
                          <h4 className="text-xs font-bold text-slate-900">Teknik Closing &amp; Filter Tanggal</h4>
                        </div>
                        <button
                          onClick={() => copyToClipboard(activePersona.teknikClosing, 'prompt')}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-[11px] transition"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Salin</span>
                        </button>
                      </div>
                      <textarea
                        readOnly
                        value={activePersona.teknikClosing}
                        rows={5}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-[11px] font-mono text-slate-700 outline-none"
                      />
                    </div>

                    {/* Kolom 3: Karakter Persona */}
                    <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2 shadow-sm">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <div>
                          <span className="text-[10px] font-black uppercase text-amber-600 block">Kolom 3</span>
                          <h4 className="text-xs font-bold text-slate-900">Persona &amp; Karakter CS (Mas Kidi)</h4>
                        </div>
                        <button
                          onClick={() => copyToClipboard(activePersona.karakterPersona, 'prompt')}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-[11px] transition"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Salin</span>
                        </button>
                      </div>
                      <textarea
                        readOnly
                        value={activePersona.karakterPersona}
                        rows={5}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-[11px] font-mono text-slate-700 outline-none"
                      />
                    </div>

                    {/* Kolom 4: Data Pengetahuan / FAQ */}
                    <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2 shadow-sm">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <div>
                          <span className="text-[10px] font-black uppercase text-amber-600 block">Kolom 4</span>
                          <h4 className="text-xs font-bold text-slate-900">Data Pengetahuan &amp; FAQ Lengkap</h4>
                        </div>
                        <button
                          onClick={() => copyToClipboard(activePersona.dataPengetahuanFAQ, 'prompt')}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-[11px] transition"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Salin</span>
                        </button>
                      </div>
                      <textarea
                        readOnly
                        value={activePersona.dataPengetahuanFAQ}
                        rows={5}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-[11px] font-mono text-slate-700 outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 5. KOLEKSI MULTI-WEBHOOK KHUSUS & SKEMA TOOLS WAHNOTIF */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
                    <div>
                      <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                        <span>⚡ Koleksi Webhook Khusus &amp; Otak CS AI (Multi-Webhook Endpoints)</span>
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Wahnotif Anda kini memiliki <b>endpoint webhook terpisah untuk setiap kebutuhan data</b> agar AI tidak kaku dan dapat menarik jadwal roadshow, roster cast aktual, link tiket langsung, info film, serta voucher secara lengkap!
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(JSON.stringify(WAHNOTIF_ALL_TOOLS, null, 2));
                        alert('Semua Skema Tools (Multi-Tools JSON) berhasil disalin!');
                      }}
                      className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin Semua 4 Tools (Array JSON)</span>
                    </button>
                  </div>

                  {/* Grid 4 Webhook Khusus */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* WEBHOOK 1: ROADSHOW & JADWAL */}
                    <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 space-y-2.5">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="px-2 py-0.5 rounded bg-blue-500 text-white font-black text-[10px] uppercase">
                            Webhook 1: Jadwal &amp; Roster Cast
                          </span>
                          <h4 className="text-xs font-black text-slate-900 mt-1">
                            📍 Roadshow 17 Kota &amp; Roster Pemain
                          </h4>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                          get_roadshow_schedule
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        Menarik rundown jam, lokasi (sekolah, kampus, radio, meet &amp; greet mall, bioskop greeting / nonton duluan) serta <b>roster cast aktual yang benar-benar hadir</b> per kota dari dokumen Flyer Scripts!
                      </p>
                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center gap-2">
                          <code className="bg-white border border-blue-200 px-2.5 py-1 rounded text-slate-800 text-[11px] font-mono flex-1 truncate">
                            {siteOrigin ? `${siteOrigin}/api/webhook/roadshow` : 'https://piyetokihfilm.com/api/webhook/roadshow'}
                          </code>
                          <button
                            onClick={() => copyToClipboard(`${siteOrigin || 'https://piyetokihfilm.com'}/api/webhook/roadshow`, 'webhook')}
                            className="p-1.5 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded transition"
                            title="Salin URL Webhook Roadshow"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(JSON.stringify(WAHNOTIF_TOOL_ROADSHOW_SCHEMA, null, 2));
                            alert('Skema JSON Tool Roadshow berhasil disalin!');
                          }}
                          className="w-full py-1 text-center bg-white hover:bg-blue-100 border border-blue-200 text-blue-800 font-bold text-[10px] rounded transition"
                        >
                          Salin Skema Tool JSON (get_roadshow_schedule)
                        </button>
                      </div>
                    </div>

                    {/* WEBHOOK 2: LINK TIKET, PRESALE & BOGO */}
                    <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 space-y-2.5">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-black text-[10px] uppercase">
                            Webhook 2: Link Pembelian Langsung
                          </span>
                          <h4 className="text-xs font-black text-slate-900 mt-1">
                            🎟️ Tiket Bioskop, Presale &amp; Promo BOGO
                          </h4>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                          get_ticket_links
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        Memberikan <b>link resmi langsung</b> ke Cinema XXI (M-TIX), TIX ID, CGV, Cinépolis, dan info promo Buy 1 Get 1 agar penonton tidak perlu repot mencari manual di aplikasi.
                      </p>
                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center gap-2">
                          <code className="bg-white border border-amber-200 px-2.5 py-1 rounded text-slate-800 text-[11px] font-mono flex-1 truncate">
                            {siteOrigin ? `${siteOrigin}/api/webhook/tickets` : 'https://piyetokihfilm.com/api/webhook/tickets'}
                          </code>
                          <button
                            onClick={() => copyToClipboard(`${siteOrigin || 'https://piyetokihfilm.com'}/api/webhook/tickets`, 'webhook')}
                            className="p-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded transition"
                            title="Salin URL Webhook Tiket"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(JSON.stringify(WAHNOTIF_TOOL_TICKETS_SCHEMA, null, 2));
                            alert('Skema JSON Tool Tiket berhasil disalin!');
                          }}
                          className="w-full py-1 text-center bg-white hover:bg-amber-100 border border-amber-200 text-amber-900 font-bold text-[10px] rounded transition"
                        >
                          Salin Skema Tool JSON (get_ticket_links)
                        </button>
                      </div>
                    </div>

                    {/* WEBHOOK 3: INFO FILM, CAST & OST */}
                    <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/40 space-y-2.5">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="px-2 py-0.5 rounded bg-purple-600 text-white font-black text-[10px] uppercase">
                            Webhook 3: Fakta Film &amp; OST
                          </span>
                          <h4 className="text-xs font-black text-slate-900 mt-1">
                            🎬 Sinopsis, 13 Cast &amp; 4 Soundtrack
                          </h4>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                          get_movie_info
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        Menarik sinopsis resmi, arti judul "Piye To Kih?", detail 13 karakter pemain, 4 OST ciptaan Lek Dahlan + YouTube link klip, dan 25 bioskop mitra penayangan.
                      </p>
                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center gap-2">
                          <code className="bg-white border border-purple-200 px-2.5 py-1 rounded text-slate-800 text-[11px] font-mono flex-1 truncate">
                            {siteOrigin ? `${siteOrigin}/api/webhook/movie-info` : 'https://piyetokihfilm.com/api/webhook/movie-info'}
                          </code>
                          <button
                            onClick={() => copyToClipboard(`${siteOrigin || 'https://piyetokihfilm.com'}/api/webhook/movie-info`, 'webhook')}
                            className="p-1.5 bg-purple-100 hover:bg-purple-200 text-purple-900 rounded transition"
                            title="Salin URL Webhook Info Film"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(JSON.stringify(WAHNOTIF_TOOL_MOVIE_SCHEMA, null, 2));
                            alert('Skema JSON Tool Info Film berhasil disalin!');
                          }}
                          className="w-full py-1 text-center bg-white hover:bg-purple-100 border border-purple-200 text-purple-900 font-bold text-[10px] rounded transition"
                        >
                          Salin Skema Tool JSON (get_movie_info)
                        </button>
                      </div>
                    </div>

                    {/* WEBHOOK 4: KLAIM VOUCHER & REGISTRASI LEADS */}
                    <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-2.5">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-black text-[10px] uppercase">
                            Webhook 4: Registrasi &amp; Voucher
                          </span>
                          <h4 className="text-xs font-black text-slate-900 mt-1">
                            🎁 Klaim Voucher &amp; Reminder BOGO
                          </h4>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                          claim_war_voucher
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        Menerbitkan Kode Booking voucher fisik Rp10.000 untuk 17 kota aktif, atau mendaftarkan nomor penonton ke Pengingat Prioritas BOGO untuk kota expired / non-roadshow.
                      </p>
                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center gap-2">
                          <code className="bg-white border border-emerald-200 px-2.5 py-1 rounded text-slate-800 text-[11px] font-mono flex-1 truncate">
                            {siteOrigin ? `${siteOrigin}/api/webhook/voucher` : 'https://piyetokihfilm.com/api/webhook/voucher'}
                          </code>
                          <button
                            onClick={() => copyToClipboard(`${siteOrigin || 'https://piyetokihfilm.com'}/api/webhook/voucher`, 'webhook')}
                            className="p-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 rounded transition"
                            title="Salin URL Webhook Voucher"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(JSON.stringify(WAHNOTIF_TOOL_VOUCHER_SCHEMA, null, 2));
                            alert('Skema JSON Tool Klaim Voucher berhasil disalin!');
                          }}
                          className="w-full py-1 text-center bg-white hover:bg-emerald-100 border border-emerald-200 text-emerald-900 font-bold text-[10px] rounded transition"
                        >
                          Salin Skema Tool JSON (claim_war_voucher)
                        </button>
                      </div>
                    </div>

                    {/* TOOL 5: PARTNERSHIP, NOBAR & HUMAN HANDOVER */}
                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-violet-600 text-white font-bold text-[10px] flex items-center justify-center">
                            5
                          </span>
                          <span className="font-extrabold text-xs text-slate-900">
                            Tool Kemitraan &amp; Eskalasi CS (contact_partnership_and_team)
                          </span>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-violet-100 text-violet-800">
                          Partnership &amp; Handover
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600">
                        Menangani obrolan yang menanyakan kerjasama, sponsorship, nobar (nonton bareng), media partner, atau ingin berbicara langsung dengan tim/admin manusia (100% bebas dari sebutan Ayah/Bunda!).
                      </p>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            readOnly
                            value={`${siteOrigin || 'https://piyetokihfilm.com'}/api/webhook/wahnotif`}
                            className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-mono text-[11px] text-slate-700 select-all"
                          />
                          <button
                            onClick={() => copyToClipboard(`${siteOrigin || 'https://piyetokihfilm.com'}/api/webhook/wahnotif`, 'webhook')}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-bold transition"
                            title="Salin URL"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(JSON.stringify(WAHNOTIF_TOOL_PARTNERSHIP_SCHEMA, null, 2));
                            alert('Skema JSON Tool Kemitraan & Handover berhasil disalin!');
                          }}
                          className="w-full py-1 text-center bg-white hover:bg-violet-100 border border-violet-200 text-violet-900 font-bold text-[10px] rounded transition"
                        >
                          Salin Skema Tool JSON (contact_partnership_and_team)
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* MASTER WEBHOOK ALL-IN-ONE (DISPATCHER) */}
                  <div className="p-4 rounded-xl border-2 border-slate-900 bg-slate-900 text-white space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-black text-[10px] uppercase">
                            Master All-In-One
                          </span>
                          <h4 className="text-sm font-black text-white">
                            ⚡ Master Webhook Utama Wahnotif (Multi-Tools Dispatcher)
                          </h4>
                        </div>
                        <p className="text-[11px] text-slate-300 mt-1">
                          Cukup pasang 1 URL ini jika Wahnotif Anda mendukung auto-discovery tools. Endpoint ini cerdas mendeteksi apakah pesan menanyakan jadwal kota, link tiket, fakta film, atau klaim voucher!
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => copyToClipboard(`${siteOrigin || 'https://piyetokihfilm.com'}/api/webhook/wahnotif`, 'webhook')}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>Salin Master Webhook URL</span>
                        </button>
                      </div>
                    </div>

                    <div className="bg-slate-800 p-2.5 rounded-lg flex items-center justify-between gap-2 border border-slate-700">
                      <code className="text-xs font-mono text-amber-300 truncate">
                        {siteOrigin ? `${siteOrigin}/api/webhook/wahnotif` : 'https://piyetokihfilm.com/api/webhook/wahnotif'}
                      </code>
                      <a
                        href="/api/webhook/wahnotif"
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-slate-300 hover:text-white underline flex items-center gap-1 shrink-0"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Test GET Schema</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: VISITOR ANALYTICS DENGAN FILTER KOTA, EVENT & PERANGKAT */}
          {activeTab === 'analytics' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
              {/* Header Box */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-100 pb-4 gap-3">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-amber-500" />
                    <span>Log Pengunjung & Deteksi Kota (IP Geo-Location)</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Catatan pengunjung real-time dengan filter kota, perangkat, event (AddToCart, PageView), dan statistik total.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={fetchVisitors}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition shadow-sm"
                    title="Refresh data trafik"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Refresh</span>
                  </button>

                  <button
                    onClick={handleExportVisitorsCsv}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition shadow-sm"
                    title="Export data log pengunjung ke CSV"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-600" />
                    <span>Export CSV</span>
                  </button>

                  {visitors.length > 0 && (
                    <button
                      onClick={handleClearVisitors}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 font-bold text-xs shadow-sm transition"
                      title="Bersihkan seluruh log riwayat trafik"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                      <span>Bersihkan Log</span>
                    </button>
                  )}
                </div>
              </div>

              {/* LIVE METRIC CARDS SESUAI FILTER */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {/* Total Log */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center justify-between text-slate-400 mb-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Log Trafik</span>
                    <Activity className="w-4 h-4 text-slate-600" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900">
                    {visitorStats.totalDisplayed}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {visitorStats.totalDisplayed === visitors.length
                      ? `Semua log tercatat`
                      : `Difilter dari total ${visitors.length} log`}
                  </p>
                </div>

                {/* Total Add to Cart */}
                <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center justify-between text-amber-600 mb-1.5">
                    <span className="text-[11px] font-black uppercase tracking-wider text-amber-800">Total Add To Cart</span>
                    <ShoppingCart className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-amber-600">
                    {visitorStats.add_to_cart_count}
                  </div>
                  <p className="text-[11px] text-amber-700/80 mt-1 font-semibold">
                    {visitorCityFilter !== 'all' ? `Di ${visitorCityFilter}` : `Semua kota`}
                  </p>
                </div>

                {/* Total PageView */}
                <div className="bg-sky-50/70 border border-sky-200 rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center justify-between text-sky-600 mb-1.5">
                    <span className="text-[11px] font-black uppercase tracking-wider text-sky-800">Total PageView</span>
                    <Eye className="w-4 h-4 text-sky-600" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-sky-600">
                    {visitorStats.page_view_count}
                  </div>
                  <p className="text-[11px] text-sky-700/80 mt-1 font-semibold">
                    {visitorCityFilter !== 'all' ? `Di ${visitorCityFilter}` : `Kunjungan halaman`}
                  </p>
                </div>

                {/* Total ViewCity / Lainnya */}
                <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center justify-between text-emerald-600 mb-1.5">
                    <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800">Event Interaksi Lain</span>
                    <MapPin className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-600">
                    {visitorStats.view_city_count + visitorStats.other_count}
                  </div>
                  <p className="text-[11px] text-emerald-700/80 mt-1 font-semibold">
                    ViewCity, Lead & Intent
                  </p>
                </div>
              </div>

              {/* QUICK EVENT FILTER CHIPS */}
              <div className="space-y-2 pt-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Quick Filter Event:
                </span>
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    onClick={() => setVisitorEventFilter('all')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                      visitorEventFilter === 'all'
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    Semua ({visitors.length})
                  </button>

                  <button
                    onClick={() => setVisitorEventFilter('AddToCart_ALL')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                      visitorEventFilter === 'AddToCart_ALL'
                        ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                        : 'bg-amber-100/70 hover:bg-amber-100 text-amber-900'
                    }`}
                  >
                    <ShoppingCart className="w-3 h-3" />
                    <span>Semua AddToCart ({visitors.filter(v => v.event?.toLowerCase().includes('addtocart')).length})</span>
                  </button>

                  <button
                    onClick={() => setVisitorEventFilter('PageView_ALL')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                      visitorEventFilter === 'PageView_ALL'
                        ? 'bg-sky-600 text-white shadow-sm'
                        : 'bg-sky-100/70 hover:bg-sky-100 text-sky-900'
                    }`}
                  >
                    <Eye className="w-3 h-3" />
                    <span>Semua PageView ({visitors.filter(v => v.event?.toLowerCase().includes('pageview')).length})</span>
                  </button>

                  {uniqueVisitorEvents
                    .filter(evt => evt !== 'PageView' && !evt.startsWith('PageView'))
                    .slice(0, 6)
                    .map(evt => (
                      <button
                        key={evt}
                        onClick={() => setVisitorEventFilter(evt)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                          visitorEventFilter === evt
                            ? 'bg-slate-900 text-white shadow-sm'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {evt} ({visitors.filter(v => v.event === evt).length})
                      </button>
                    ))}
                </div>
              </div>

              {/* TOOLBAR FILTERS (KOTA, PERANGKAT, EVENT, SEARCH) */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* 1. Filter Kota */}
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    📍 Filter Kota:
                  </label>
                  <select
                    value={visitorCityFilter}
                    onChange={e => setVisitorCityFilter(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-amber-500"
                  >
                    <option value="all">Semua Kota ({visitors.length})</option>
                    {uniqueVisitorCities.map(city => {
                      const count = visitors.filter(v => v.city === city).length;
                      return (
                        <option key={city} value={city}>
                          {city} ({count})
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* 2. Filter Event Dropdown */}
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    ⚡ Filter Event:
                  </label>
                  <select
                    value={visitorEventFilter}
                    onChange={e => setVisitorEventFilter(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-amber-500"
                  >
                    <option value="all">Semua Event</option>
                    <option value="AddToCart_ALL">🛒 Semua AddToCart</option>
                    <option value="PageView_ALL">👁 Semua PageView</option>
                    <option value="ViewCity_ALL">📍 Semua ViewCity</option>
                    <optgroup label="Event Spesifik">
                      {uniqueVisitorEvents.map(evt => (
                        <option key={evt} value={evt}>
                          {evt} ({visitors.filter(v => v.event === evt).length})
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                {/* 3. Filter Perangkat */}
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    💻 Filter Perangkat:
                  </label>
                  <select
                    value={visitorPlatformFilter}
                    onChange={e => setVisitorPlatformFilter(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-amber-500"
                  >
                    <option value="all">Semua Perangkat</option>
                    <option value="Mobile">📱 Semua Mobile ({visitors.filter(v => v.platform?.toLowerCase().includes('mobile')).length})</option>
                    <option value="Desktop">💻 Semua Desktop ({visitors.filter(v => v.platform?.toLowerCase().includes('desktop')).length})</option>
                    <optgroup label="Tipe Detail">
                      {uniqueVisitorPlatforms.map(p => (
                        <option key={p} value={p}>
                          {p} ({visitors.filter(v => v.platform === p).length})
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                {/* 4. Pencarian */}
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    🔍 Cari IP / Halaman:
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Cari IP, URL..."
                      value={visitorSearch}
                      onChange={e => setVisitorSearch(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-800 outline-none focus:border-amber-500"
                    />
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  </div>
                </div>
              </div>

              {/* RESET FILTER BAR (JIKA ADA FILTER AKTIF) */}
              {(visitorCityFilter !== 'all' || visitorEventFilter !== 'all' || visitorPlatformFilter !== 'all' || visitorSearch.trim()) && (
                <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs">
                  <div className="text-amber-900 font-medium">
                    Filter aktif: {visitorCityFilter !== 'all' && <span className="font-bold underline mr-2">Kota: {visitorCityFilter}</span>}
                    {visitorEventFilter !== 'all' && <span className="font-bold underline mr-2">Event: {visitorEventFilter}</span>}
                    {visitorPlatformFilter !== 'all' && <span className="font-bold underline mr-2">Perangkat: {visitorPlatformFilter}</span>}
                    {visitorSearch.trim() && <span className="font-bold underline mr-2">Keyword: &quot;{visitorSearch}&quot;</span>}
                    <span className="text-slate-500 ml-1">({filteredVisitors.length} log ditemukan)</span>
                  </div>
                  <button
                    onClick={() => {
                      setVisitorCityFilter('all');
                      setVisitorEventFilter('all');
                      setVisitorPlatformFilter('all');
                      setVisitorSearch('');
                    }}
                    className="flex items-center gap-1 text-amber-800 hover:text-black font-extrabold hover:underline"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset Semua Filter</span>
                  </button>
                </div>
              )}

              {/* TABEL LOG PENGUNJUNG TERFILTER */}
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Waktu</th>
                      <th className="py-3 px-4">Kota Terdeteksi</th>
                      <th className="py-3 px-4">Perangkat</th>
                      <th className="py-3 px-4">Halaman</th>
                      <th className="py-3 px-4">Event</th>
                      <th className="py-3 px-4">IP Address</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredVisitors.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-12 text-slate-400 space-y-2">
                          <p className="font-semibold">Tidak ada log pengunjung yang cocok dengan filter ini.</p>
                          {(visitorCityFilter !== 'all' || visitorEventFilter !== 'all' || visitorPlatformFilter !== 'all' || visitorSearch.trim()) && (
                            <button
                              onClick={() => {
                                setVisitorCityFilter('all');
                                setVisitorEventFilter('all');
                                setVisitorPlatformFilter('all');
                                setVisitorSearch('');
                              }}
                              className="text-amber-600 hover:underline font-bold text-xs"
                            >
                              Klik untuk Reset Filter
                            </button>
                          )}
                        </td>
                      </tr>
                    ) : (
                      filteredVisitors.map(v => {
                        const isAddToCart = v.event?.toLowerCase().includes('addtocart');
                        const isPageView = v.event?.toLowerCase().includes('pageview');
                        const isViewCity = v.event?.toLowerCase().includes('viewcity');
                        const isLead = v.event === 'Lead' || v.event === 'TicketIntent';

                        return (
                          <tr key={v.id} className="hover:bg-slate-50/70 transition">
                            <td className="py-3 px-4 text-slate-500 whitespace-nowrap font-mono text-[11px]">
                              {new Date(v.timestamp).toLocaleTimeString('id-ID')}
                              <span className="block text-[10px] text-slate-400">
                                {new Date(v.timestamp).toLocaleDateString('id-ID')}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-bold text-slate-900">
                              <span className="inline-flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-amber-500 shrink-0" />
                                <span>{v.city}</span>
                              </span>
                            </td>
                            <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                              <span className="inline-flex items-center gap-1.5">
                                {v.platform?.toLowerCase().includes('mobile') ? (
                                  <Smartphone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                ) : (
                                  <Monitor className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                )}
                                <span>{v.platform}</span>
                              </span>
                            </td>
                            <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                              <span className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200">
                                {v.path || '/'}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold border ${
                                  isAddToCart
                                    ? 'bg-amber-100 text-amber-900 border-amber-300 font-black'
                                    : isLead
                                    ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                    : isViewCity
                                    ? 'bg-purple-100 text-purple-900 border-purple-300'
                                    : isPageView
                                    ? 'bg-slate-100 text-slate-600 border-slate-200'
                                    : 'bg-blue-100 text-blue-800 border-blue-200'
                                }`}
                              >
                                {isAddToCart && <ShoppingCart className="w-3 h-3 text-amber-600" />}
                                <span>{v.event}</span>
                              </span>
                            </td>
                            <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">
                              {v.ip}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* MODAL FORM ARTIKEL & GALERI */}
      {isArticleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                  <Newspaper className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 tracking-tight">
                    {editingArticle ? 'Edit Kabar / Galeri Roadshow' : 'Tulis Kabar & Galeri Baru'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Otomatis terindeks Google, sitemap.xml, dan tampil di halaman publik.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsArticleModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSaveArticle} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto text-xs">
              {/* Judul & Slug */}
              <div className="space-y-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Judul Artikel / Liputan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={articleForm.title}
                    onChange={(e) => {
                      const newTitle = e.target.value;
                      setArticleForm((prev) => ({
                        ...prev,
                        title: newTitle,
                        slug: prev.slug || newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
                      }));
                    }}
                    placeholder="Contoh: Nobar & Meet Greet Piye To Kih di Solo Pecah, Dihadiri Ribuan Penonton!"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none text-slate-900 text-xs font-semibold transition"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    URL Slug (Alamat Halaman)
                  </label>
                  <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-slate-500 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20">
                    <span className="text-[11px] font-mono text-slate-400 shrink-0">/artikel/</span>
                    <input
                      type="text"
                      value={articleForm.slug}
                      onChange={(e) => setArticleForm({ ...articleForm, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                      placeholder="antusiasme-roadshow-solo"
                      className="w-full bg-transparent outline-none text-xs font-mono text-slate-900 pl-1"
                    />
                  </div>
                </div>
              </div>

              {/* Kategori, Kota, Tanggal, Read Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kategori Konten</label>
                  <select
                    value={articleForm.category}
                    onChange={(e) => setArticleForm({ ...articleForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-amber-500 outline-none bg-white font-medium"
                  >
                    <option value="Kabar Film">Kabar Film (Berita / Rilis Artikel)</option>
                    <option value="Press Release">Press Release (Siaran Pers Resmi)</option>
                    <option value="Media Coverage">Media Coverage (Liputan Media Luar)</option>
                    <option value="Galeri Foto">Galeri Foto (Album Dokumentasi)</option>
                    <option value="Galeri Video">Galeri Video (Trailer / Video Teaser / BTS)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kota Terkait</label>
                  <select
                    value={articleForm.cityTag}
                    onChange={(e) => setArticleForm({ ...articleForm, cityTag: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-amber-500 outline-none bg-white font-medium"
                  >
                    <option value="">Nasional / Semua Kota</option>
                    {CITIES_DATA.map((c) => (
                      <option key={c.slug} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tanggal Terbit</label>
                  <input
                    type="date"
                    value={articleForm.publishedAt}
                    onChange={(e) => setArticleForm({ ...articleForm, publishedAt: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-amber-500 outline-none bg-white font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Waktu Baca / Label</label>
                  <input
                    type="text"
                    value={articleForm.readTime}
                    onChange={(e) => setArticleForm({ ...articleForm, readTime: e.target.value })}
                    placeholder="3 menit baca"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-amber-500 outline-none bg-white font-medium"
                  />
                </div>
              </div>

              {/* Tag Label, Penulis, & Featured Toggle */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tag / Label Badge</label>
                  <input
                    type="text"
                    value={articleForm.tag}
                    onChange={(e) => setArticleForm({ ...articleForm, tag: e.target.value })}
                    placeholder="Contoh: OFFICIAL, EXCLUSIVE, ROADSHOW"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-amber-500 outline-none text-slate-900 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Penulis / Sumber Berita</label>
                  <input
                    type="text"
                    value={articleForm.author}
                    onChange={(e) => setArticleForm({ ...articleForm, author: e.target.value })}
                    placeholder="Tim Media Miracle Pictures"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-amber-500 outline-none text-slate-900 text-xs font-semibold"
                  />
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl border border-amber-200 bg-amber-50/60">
                  <input
                    type="checkbox"
                    id="featuredCheck"
                    checked={articleForm.featured}
                    onChange={(e) => setArticleForm({ ...articleForm, featured: e.target.checked })}
                    className="w-4 h-4 rounded border-amber-300 text-amber-500 focus:ring-amber-500"
                  />
                  <label htmlFor="featuredCheck" className="text-xs font-bold text-amber-900 cursor-pointer select-none">
                    ⭐ Sorotan / Berita Utama
                  </label>
                </div>
              </div>

              {/* FIELD KHUSUS BERDASARKAN KATEGORI */}
              {articleForm.category === 'Galeri Video' && (
                <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-3">
                  <div className="flex items-center gap-2 text-blue-900 font-bold">
                    <Film className="w-4 h-4" />
                    <span>Pengaturan Khusus Video</span>
                  </div>
                  <div className="p-3 rounded-xl bg-blue-100/80 border border-blue-300 text-blue-950 text-[11px] leading-relaxed">
                    <strong>🎬 Catatan Video:</strong> Untuk performa website cepat dan hemat bandwidth, video film (Teaser, Trailer, BTS) ditautkan via <strong>URL YouTube</strong>. Anda tidak perlu mengunggah file video mentah. Gambar cover/thumbnail video dapat diunggah pada bagian Foto Cover di bawah.
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block font-bold text-slate-700 mb-1">URL Video YouTube</label>
                      <input
                        type="text"
                        value={articleForm.videoUrl}
                        onChange={(e) => setArticleForm({ ...articleForm, videoUrl: e.target.value })}
                        placeholder="Contoh: https://www.youtube.com/watch?v=..."
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:border-blue-500 outline-none font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Durasi Video</label>
                      <input
                        type="text"
                        value={articleForm.videoDuration}
                        onChange={(e) => setArticleForm({ ...articleForm, videoDuration: e.target.value })}
                        placeholder="02:15"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:border-blue-500 outline-none text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {articleForm.category === 'Media Coverage' && (
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold">
                    <Newspaper className="w-4 h-4" />
                    <span>Pengaturan Liputan Media Luar</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Nama Media Pers</label>
                      <input
                        type="text"
                        value={articleForm.mediaName}
                        onChange={(e) => setArticleForm({ ...articleForm, mediaName: e.target.value })}
                        placeholder="Contoh: Kompas.com, DetikHot, Liputan6"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:border-emerald-500 outline-none text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">URL Link Berita Asli</label>
                      <input
                        type="text"
                        value={articleForm.externalUrl}
                        onChange={(e) => setArticleForm({ ...articleForm, externalUrl: e.target.value })}
                        placeholder="https://..."
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:border-emerald-500 outline-none font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {articleForm.category === 'Press Release' && (
                <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-3">
                  <div className="flex items-center gap-2 text-purple-900 font-bold">
                    <Download className="w-4 h-4" />
                    <span>Dokumen Press Release</span>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Link File PDF Siaran Pers Resmi</label>
                    <input
                      type="text"
                      value={articleForm.pdfUrl}
                      onChange={(e) => setArticleForm({ ...articleForm, pdfUrl: e.target.value })}
                      placeholder="Contoh: /docs/siaran-pers-piyetokih-01.pdf atau link Google Drive"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:border-purple-500 outline-none font-mono text-xs"
                    />
                  </div>
                </div>
              )}

              {articleForm.category === 'Galeri Foto' && (
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
                  <div className="flex items-center gap-2 text-amber-900 font-bold">
                    <Image className="w-4 h-4" />
                    <span>Pengaturan Album Galeri Foto</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Lokasi Foto</label>
                      <input
                        type="text"
                        value={articleForm.location}
                        onChange={(e) => setArticleForm({ ...articleForm, location: e.target.value })}
                        placeholder="Contoh: Solo & Jogja, Bioskop XXI Paragon"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:border-amber-500 outline-none text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Keterangan Jumlah Foto</label>
                      <input
                        type="text"
                        value={articleForm.photoCount}
                        onChange={(e) => setArticleForm({ ...articleForm, photoCount: e.target.value })}
                        placeholder="Contoh: 24 Foto Dokumentasi"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:border-amber-500 outline-none text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Cover Foto Utama Artikel (Direct Upload) */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-extrabold text-slate-900 block text-xs">
                      Cover Foto Utama Artikel
                    </label>
                    <p className="text-[11px] text-slate-500">
                      Foto banner yang tampil di kartu liputan dan bagian atas halaman artikel.
                    </p>
                  </div>
                  {articleForm.coverImage && (
                    <button
                      type="button"
                      onClick={() => setArticleForm((prev) => ({ ...prev, coverImage: '' }))}
                      className="text-[11px] font-bold text-red-600 hover:text-red-700 flex items-center gap-1 transition"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Hapus Cover</span>
                    </button>
                  )}
                </div>

                {articleForm.coverImage ? (
                  <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-300 bg-slate-900 group shadow-sm">
                    <img
                      src={articleForm.coverImage}
                      alt="Cover Preview"
                      className="w-full h-full object-cover"
                      onError={(e: any) => (e.target.style.display = 'none')}
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <label className="cursor-pointer px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg transition active:scale-95">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{uploadingArticleCover ? 'Sedang Mengunggah...' : 'Ganti Foto Cover'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          disabled={uploadingArticleCover}
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            setUploadingArticleCover(true);
                            const url = await handleFileUpload(file, 'article-cover');
                            setUploadingArticleCover(false);
                            if (url) {
                              setArticleForm((prev) => ({ ...prev, coverImage: url }));
                            }
                          }}
                        />
                      </label>
                    </div>
                    <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg bg-black/80 text-amber-400 font-mono text-[10px] truncate max-w-[85%]">
                      {articleForm.coverImage}
                    </div>
                  </div>
                ) : (
                  <label className="cursor-pointer border-2 border-dashed border-slate-300 hover:border-amber-500 hover:bg-amber-50/50 rounded-xl p-6 flex flex-col items-center justify-center text-center transition group bg-white shadow-sm">
                    <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 group-hover:scale-110 transition-transform mb-2">
                      <Upload className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-black text-slate-900">
                      {uploadingArticleCover ? 'Sedang Mengunggah Cover...' : '📁 Klik untuk Pilih & Upload Foto Cover'}
                    </span>
                    <span className="text-[11px] text-slate-500 mt-1">
                      Pilih dari galeri foto HP atau folder laptop (Format: JPG, PNG, WebP)
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploadingArticleCover}
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setUploadingArticleCover(true);
                        const url = await handleFileUpload(file, 'article-cover');
                        setUploadingArticleCover(false);
                        if (url) {
                          setArticleForm((prev) => ({ ...prev, coverImage: url }));
                        }
                      }}
                    />
                  </label>
                )}
              </div>

              {/* Galeri Foto Dokumentasi (Multiple Upload) */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label className="font-extrabold text-slate-900 block text-xs">
                      Galeri Foto Dokumentasi Roadshow / Acara
                    </label>
                    <p className="text-[11px] text-slate-500">
                      Upload foto-foto liputan langsung dari galeri HP atau laptop. Foto otomatis disimpan di server.
                    </p>
                  </div>

                  {/* Multi Upload Button */}
                  <label className="cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black transition shadow-sm active:scale-95 shrink-0 group">
                    <Upload className="w-3.5 h-3.5 text-amber-400 group-hover:-translate-y-0.5 transition-transform" />
                    <span>{uploadingArticleGallery ? (galleryUploadProgress || 'Mengunggah Foto-Foto...') : '📁 Upload Banyak Foto Sekaligus'}</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      disabled={uploadingArticleGallery}
                      className="hidden"
                      onChange={(e) => {
                        handleUploadMultipleGallery(Array.from(e.target.files || []));
                        e.target.value = '';
                      }}
                    />
                  </label>
                </div>

                {/* Live Gallery Thumbnail Grid */}
                {(() => {
                  const galleryUrls = articleForm.galleryImagesText
                    .split('\n')
                    .map((l) => l.trim())
                    .filter((l) => l.length > 0);

                  return (
                    <div className="space-y-3">
                      {galleryUrls.length > 0 ? (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] font-bold text-slate-700">
                              📸 {galleryUrls.length} Foto Dokumentasi Terpasang
                            </span>
                            <button
                              type="button"
                              onClick={() => setArticleForm((prev) => ({ ...prev, galleryImagesText: '' }))}
                              className="text-[11px] font-bold text-red-600 hover:text-red-700 flex items-center gap-1 transition"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Hapus Semua Foto</span>
                            </button>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
                            {galleryUrls.map((url, gIdx) => (
                              <div
                                key={gIdx}
                                className="relative aspect-video rounded-xl overflow-hidden border border-slate-300 bg-slate-900 shadow-sm group"
                              >
                                <img
                                  src={url}
                                  alt={`Galeri ${gIdx + 1}`}
                                  className="w-full h-full object-cover"
                                  onError={(e: any) => (e.target.style.display = 'none')}
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const filtered = galleryUrls.filter((_, idx) => idx !== gIdx);
                                      setArticleForm((prev) => ({
                                        ...prev,
                                        galleryImagesText: filtered.join('\n'),
                                      }));
                                    }}
                                    className="p-1.5 rounded-lg bg-red-600 text-white font-bold text-[10px] flex items-center gap-1 shadow-lg hover:bg-red-700 transition"
                                    title="Hapus foto ini"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                    <span>Hapus</span>
                                  </button>
                                </div>
                                <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/70 text-white text-[9px] font-mono">
                                  #{gIdx + 1}
                                </div>
                              </div>
                            ))}

                            {/* Add more tile */}
                            <label className="cursor-pointer aspect-video rounded-xl border-2 border-dashed border-slate-300 hover:border-amber-500 hover:bg-amber-50/50 flex flex-col items-center justify-center text-slate-500 hover:text-amber-700 transition text-center p-2 bg-white shadow-sm">
                              <Plus className="w-5 h-5 mb-0.5" />
                              <span className="text-[10px] font-bold leading-tight">
                                {uploadingArticleGallery ? (galleryUploadProgress || 'Mengunggah...') : 'Tambah Foto'}
                              </span>
                              <input
                                type="file"
                                multiple
                                accept="image/*"
                                disabled={uploadingArticleGallery}
                                className="hidden"
                                onChange={(e) => {
                                  handleUploadMultipleGallery(Array.from(e.target.files || []));
                                  e.target.value = '';
                                }}
                              />
                            </label>
                          </div>
                        </div>
                      ) : (
                        <label className="cursor-pointer border-2 border-dashed border-slate-300 hover:border-amber-500 hover:bg-amber-50/50 rounded-xl p-6 flex flex-col items-center justify-center text-center transition group bg-white shadow-sm">
                          <div className="w-12 h-12 rounded-full bg-slate-100 group-hover:bg-amber-100 flex items-center justify-center text-slate-600 group-hover:text-amber-700 transition mb-2">
                            <Upload className="w-5 h-5" />
                          </div>
                          <span className="text-xs font-black text-slate-900">
                            {uploadingArticleGallery ? (galleryUploadProgress || 'Sedang Mengunggah...') : '📁 Klik untuk Pilih Foto-Foto Galeri Sekaligus'}
                          </span>
                          <span className="text-[11px] text-slate-500 mt-1">
                            Bisa pilih banyak foto sekaligus dari HP atau laptop (Maks 10MB/foto)
                          </span>
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            disabled={uploadingArticleGallery}
                            className="hidden"
                            onChange={(e) => {
                              handleUploadMultipleGallery(Array.from(e.target.files || []));
                              e.target.value = '';
                            }}
                          />
                        </label>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* Ringkasan */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Ringkasan Singkat (Lead Paragraph / Cuplikan)
                </label>
                <textarea
                  rows={2}
                  value={articleForm.summary}
                  onChange={(e) => setArticleForm({ ...articleForm, summary: e.target.value })}
                  placeholder="Ringkasan 1-2 kalimat untuk kartu artikel dan cuplikan mesin pencari Google..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-amber-500 outline-none"
                />
              </div>

              {/* Konten Lengkap */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Isi Berita / Liputan Lengkap
                </label>
                <textarea
                  rows={6}
                  value={articleForm.content}
                  onChange={(e) => setArticleForm({ ...articleForm, content: e.target.value })}
                  placeholder="Tuliskan berita lengkap liputan roadshow, kesan penonton, kutipan cast, dan keseruan acara. Pisahkan antar-paragraf dengan baris baru (Enter)..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 outline-none leading-relaxed"
                />
              </div>

              {/* SEO Optimasi (Collapsible-like Box) */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-slate-800">Optimasi SEO Mesin Pencari Google</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-600 mb-1 text-[11px]">
                      SEO Meta Title (Opsional)
                    </label>
                    <input
                      type="text"
                      value={articleForm.seoTitle}
                      onChange={(e) => setArticleForm({ ...articleForm, seoTitle: e.target.value })}
                      placeholder={articleForm.title || 'Judul di hasil pencarian Google'}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white focus:border-amber-500 outline-none text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-600 mb-1 text-[11px]">
                      SEO Meta Description (Opsional)
                    </label>
                    <input
                      type="text"
                      value={articleForm.seoDescription}
                      onChange={(e) => setArticleForm({ ...articleForm, seoDescription: e.target.value })}
                      placeholder={articleForm.summary || 'Deskripsi singkat saat muncul di Google'}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white focus:border-amber-500 outline-none text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Publikasikan Checkbox */}
              <div className="flex items-center gap-2.5 pt-1">
                <input
                  type="checkbox"
                  id="isPublishedCheck"
                  checked={articleForm.isPublished}
                  onChange={(e) => setArticleForm({ ...articleForm, isPublished: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-500"
                />
                <label htmlFor="isPublishedCheck" className="font-bold text-slate-800 cursor-pointer select-none">
                  Publikasikan artikel ini sekarang (Aktif di Web & Sitemap)
                </label>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsArticleModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={savingArticle}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black shadow-md shadow-amber-500/20 transition disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{savingArticle ? 'Menyimpan...' : 'Simpan & Publikasikan'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Advanced Presale Follow-Up Modal */}
      {isFollowupModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-3xl my-8 bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-6 sm:p-8 text-slate-100">
            {/* Header */}
            <div className="flex items-center justify-between pb-5 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-rose-500/20">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white flex items-center gap-2">
                    Follow-Up Presale Roadshow
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Anti-Spam Safe
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Broadcast nurturing ramah ke kontak terdaftar dengan filter kota, jeda aman, dan auto-stop saat audiens merespons.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsFollowupModalOpen(false)}
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Form */}
            <div className="mt-6 space-y-6">
              {/* Target & City Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Target Audience */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-amber-400" />
                    Target Audiens
                  </label>
                  <select
                    value={followupTarget}
                    onChange={(e) => {
                      const newTarget = e.target.value as 'all' | 'leads' | 'reminders';
                      setFollowupTarget(newTarget);
                      fetchFollowupPreview(followupCity, newTarget, followupStage);
                    }}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="all">Semua Kontak (Leads Booking + Reminder BOGO)</option>
                    <option value="leads">Hanya Pemegang Voucher / Leads (Booking Code)</option>
                    <option value="reminders">Hanya Pendaftar Pengingat Tiket (BOGO Reminder)</option>
                  </select>
                </div>

                {/* City Filter */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-rose-400" />
                    Filter Kota Roadshow
                  </label>
                  <select
                    value={followupCity}
                    onChange={(e) => {
                      const newCity = e.target.value;
                      setFollowupCity(newCity);
                      fetchFollowupPreview(newCity, followupTarget, followupStage);
                    }}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="all">Semua Kota (17 Kota Roadshow)</option>
                    {CITIES_DATA.map((c) => (
                      <option key={c.city} value={c.city}>
                        {c.city} ({c.date} - {c.status === 'done' ? 'Selesai' : c.status === 'today' ? 'Hari Ini' : 'Mendatang'})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Stage Nurturing Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  Pilih Stage Nurturing Follow-Up
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setFollowupStage(1);
                      fetchFollowupPreview(followupCity, followupTarget, 1);
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition ${
                      followupStage === 1
                        ? 'bg-amber-500/10 border-amber-500/50 text-white shadow-lg shadow-amber-500/10'
                        : 'bg-slate-800/50 border-slate-700/60 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-black text-amber-400">STAGE 1</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">Soft Nudge</span>
                    </div>
                    <div className="text-xs font-bold text-slate-200">Cek Tiket & Sapa Santai</div>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                      Menyapa bolo asik, infokan presale special screening bareng cast sudah dibuka di kotanya.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFollowupStage(2);
                      fetchFollowupPreview(followupCity, followupTarget, 2);
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition ${
                      followupStage === 2
                        ? 'bg-rose-500/10 border-rose-500/50 text-white shadow-lg shadow-rose-500/10'
                        : 'bg-slate-800/50 border-slate-700/60 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-black text-rose-400">STAGE 2</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold">Urgensi Kuota</span>
                    </div>
                    <div className="text-xs font-bold text-slate-200">Kursi Studio Menipis</div>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                      Eskalasi urgensi: kursi nonton bareng makin tipis, amankan kursi tengah sebelum ludes.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFollowupStage(3);
                      fetchFollowupPreview(followupCity, followupTarget, 3);
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition ${
                      followupStage === 3
                        ? 'bg-emerald-500/10 border-emerald-500/50 text-white shadow-lg shadow-emerald-500/10'
                        : 'bg-slate-800/50 border-slate-700/60 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-black text-emerald-400">STAGE 3</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">Closing Final</span>
                    </div>
                    <div className="text-xs font-bold text-slate-200">Konfirmasi (SUDAH/MAU/SKIP)</div>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                      Minta kepastian singkat: balas SUDAH (sudah beli), MAU (butuh link), atau SKIP (batal/lewatkan).
                    </p>
                  </button>
                </div>
              </div>

              {/* Safe Delay & Anti-Spam Safeguards */}
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/70 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                      Pengaturan Anti-Spam & Jeda Waktu (Delay)
                    </span>
                  </div>
                  <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Auto-Jitter 0-2 dtk aktif
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { label: '8 Detik', value: 8, tag: 'Standar Cepat' },
                    { label: '20 Detik', value: 20, tag: 'Sangat Aman' },
                    { label: '45 Detik', value: 45, tag: 'Human Pace' },
                    { label: '360 Detik (6 Menit)', value: 360, tag: 'Ultra Safe Meta' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setFollowupDelay(opt.value)}
                      className={`p-2.5 rounded-xl border text-center transition ${
                        followupDelay === opt.value
                          ? 'bg-emerald-500/20 border-emerald-500 text-white font-bold'
                          : 'bg-slate-900/60 border-slate-700 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      <div className="text-xs font-bold">{opt.label}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{opt.tag}</div>
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-1 text-xs text-slate-400">
                  <input
                    type="checkbox"
                    id="forceResendCheck"
                    checked={followupForceResend}
                    onChange={(e) => setFollowupForceResend(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500 bg-slate-900 border-slate-700 focus:ring-amber-500 focus:ring-offset-slate-900"
                  />
                  <label htmlFor="forceResendCheck" className="cursor-pointer">
                    Paksa kirim ulang (abaikan jika nomor sudah pernah dikirimi stage ini)
                  </label>
                </div>

                <div className="bg-emerald-950/40 border border-emerald-500/20 rounded-xl p-3 text-[11px] text-emerald-300/90 leading-relaxed flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong>Sistem Anti-Spam & Auto-Stop Pintar:</strong> Setiap pesan menggunakan variasi guyonan khas Mukidi dan sapaan personal ramah. Jika audiens membalas (misal: <em>&quot;sudah beli&quot;, &quot;oke&quot;, &quot;skip&quot;, &quot;tidak jadi&quot;</em>), AI CS otomatis menandai kontak dan <strong>langsung menghentikan follow-up selanjutnya</strong> agar tidak mengganggu penonton.
                  </div>
                </div>
              </div>

              {/* Message Live Preview */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-emerald-400" />
                    Preview Pesan WhatsApp (Contoh Personal di {followupCity === 'all' ? 'Semua Kota' : followupCity})
                  </label>
                  <button
                    type="button"
                    onClick={() => fetchFollowupPreview(followupCity, followupTarget, followupStage)}
                    className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium"
                  >
                    <RefreshCw className={`w-3 h-3 ${loadingFollowupPreview ? 'animate-spin' : ''}`} />
                    Refresh Preview
                  </button>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs font-mono text-slate-200 whitespace-pre-wrap max-h-56 overflow-y-auto leading-relaxed shadow-inner">
                  {loadingFollowupPreview ? (
                    <div className="py-6 text-center text-slate-400 flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-amber-400" /> Memuat preview pesan & link tiket...
                    </div>
                  ) : (
                    followupPreviewText || 'Pilih target dan kota untuk melihat preview pesan.'
                  )}
                </div>
              </div>

              {/* Status Bar: Target Count */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Nomor Siap Dikirimi Follow-Up:</div>
                    <div className="text-lg font-black text-amber-400">
                      {followupEligibleCount} Nomor
                      <span className="text-xs font-normal text-slate-400 ml-2">
                        ({followupCity === 'all' ? 'Semua Kota' : `Kota ${followupCity}`} • Target: {followupTarget.toUpperCase()})
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setIsFollowupModalOpen(false)}
                    className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 font-bold text-xs transition"
                  >
                    Tutup
                  </button>
                  <button
                    type="button"
                    disabled={followingUpPresale || followupEligibleCount === 0}
                    onClick={handleExecutePresaleFollowup}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-black text-xs shadow-lg shadow-rose-600/20 transition disabled:opacity-50"
                  >
                    <Send className={`w-3.5 h-3.5 ${followingUpPresale ? 'animate-spin' : ''}`} />
                    <span>{followingUpPresale ? 'Sedang Memproses...' : '🚀 Mulai Kirim Follow-Up'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
