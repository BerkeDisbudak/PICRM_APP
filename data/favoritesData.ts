export const favoritesData = [
  {
    id: 'report-001',
    title: '3. Çeyrek Gelir Tahmin Analizi',
    summary: 'Mevcut büyüme trendleri ve mevsimsel desenler baz alındığında, 3. çeyrek için yıllık bazda %12 gelir artışı öngörüyoruz. Ana etkenler arasında yeni ürün lansmanları ve genişleyen pazar erişimi yer alıyor.',
    date: '12 Haziran 2025',
    riskLevel: 'düşük' as const,
    confidence: 87,
    sentiment: 78,
    tags: ['Gelir', 'Büyüme', 'Tahmin', '3. Çeyrek', 'Ürün Lansmanı'],
    findings: [
      {
        title: 'Ürün Hattı Performansı',
        description: 'Premium ürün segmenti %23 büyürken, standart segment %15 büyüyor. Bu durum, premium ürün tekliflerinin genişletilmesi için bir fırsat olduğunu gösteriyor.',
        trend: 'yukarı' as const,
      },
      {
        title: 'Pazar Genişleme Etkisi',
        description: 'Avrupa pazarına giriş, yeni büyümenin %8’ini oluşturdu. Yatırım getirisi, ilk öngörüleri %12 oranında aştı.',
        trend: 'yukarı' as const,
      },
      {
        title: 'Mevsimsel Ayarlama',
        description: '3. çeyrek, tarihsel olarak yıllık ortalamaya kıyasla %4 daha yüksek büyüme gösteriyor. Mevcut tahmin bu deseni hesaba katıyor.',
        trend: 'yukarı' as const,
      },
    ],
    notes: 'Bu tahmin, ekonomik koşulların stabil kalacağı ve büyük bir tedarik zinciri bozulmasının yaşanmayacağı varsayımına dayanmaktadır. Güven puanı, güçlü tarihsel veri korelasyonu ve piyasa istikrar göstergelerine dayanmaktadır.',
  },
  {
    id: 'report-003',
    title: 'Tedarik Zinciri Kesinti Riski Değerlendirmesi',
    summary: 'Asya’daki üreticilerden tedarik edilen bileşenlerde önümüzdeki 45 gün içinde yüksek düzeyde kesinti riski var. Bu durum, 3. çeyrekteki ürün lansmanları için üretim planını etkileyebilir.',
    date: '8 Haziran 2025',
    riskLevel: 'yüksek' as const,
    confidence: 83,
    sentiment: 24,
    tags: ['Tedarik Zinciri', 'Üretim', 'Risk', 'Bileşenler', 'Üretim Süreci'],
    findings: [
      {
        title: 'Tedarikçi Fabrika Kapasitesi',
        description: 'Birincil tedarikçi, yerel kısıtlamalar nedeniyle %62 kapasiteyle çalışıyor, bu oran geçen ay %85’ti.',
        trend: 'aşağı' as const,
      },
      {
        title: 'Nakliye Lojistiği',
        description: 'Ortalama nakliye süresi %40 arttı ve yüksek değişkenlik gösteriyor. Liman sıkışıklığı son 12 ayın en yüksek seviyesinde.',
        trend: 'aşağı' as const,
      },
      {
        title: 'Stok Projeksiyonu',
        description: 'Mevcut bileşen stoğu, planlanan üretim hızında 38 gün yetecek düzeyde.',
        trend: 'aşağı' as const,
      },
    ],
    notes: 'Acil eylem önerilmektedir. Seçenekler arasında alternatif tedarikçilerin değerlendirilmesi, kritik bileşenler için hava taşımacılığı veya üretim planının ayarlanması yer almaktadır. Finansal etki analizi ek raporda sunulmuştur.',
  },
];
