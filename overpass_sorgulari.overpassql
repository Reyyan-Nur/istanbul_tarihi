[out:json][timeout:180];

area["name"="İstanbul"]["admin_level"="4"]->.searchArea;

(
  // =====================================================
  // 1. MÜZELER
  // =====================================================
  nwr["tourism"="museum"](area.searchArea);

  // =====================================================
  // 2. TARİHİ YAPILAR
  //    Wikipedia / Wikidata / Heritage bilgisi olanlar
  // =====================================================
  nwr["historic"]["wikipedia"](area.searchArea);
  nwr["historic"]["wikidata"](area.searchArea);
  nwr["historic"]["heritage"](area.searchArea);

  // =====================================================
  // 3. SARAYLAR
  // =====================================================
  nwr["historic"="palace"](area.searchArea);
  nwr["building"="palace"](area.searchArea);

  // =====================================================
  // 4. KALE / HİSAR / FORTRESS
  // =====================================================
  nwr["historic"="castle"](area.searchArea);
  nwr["historic"="fort"](area.searchArea);
  nwr["historic"="fortress"](area.searchArea);

  // =====================================================
  // 5. KULELER
  //    Sadece önemli olduğu gösterilebilen kuleler
  // =====================================================
  nwr["historic"="tower"]["wikipedia"](area.searchArea);
  nwr["historic"="tower"]["wikidata"](area.searchArea);
  nwr["historic"="tower"]["heritage"](area.searchArea);

  nwr["man_made"="tower"]["wikipedia"](area.searchArea);
  nwr["man_made"="tower"]["wikidata"](area.searchArea);
  nwr["man_made"="tower"]["heritage"](area.searchArea);

  // =====================================================
  // 6. TARİHİ ANITLAR
  // =====================================================
  nwr["historic"="monument"]["wikipedia"](area.searchArea);
  nwr["historic"="monument"]["wikidata"](area.searchArea);
  nwr["historic"="monument"]["heritage"](area.searchArea);

  // =====================================================
  // 7. ARKEOLOJİK ALANLAR
  // =====================================================
  nwr["historic"="archaeological_site"](area.searchArea);

  // =====================================================
  // 8. TARİHİ HARABELER
  // =====================================================
  nwr["historic"="ruins"]["name"](area.searchArea);
  nwr["historic"="ruins"]["wikipedia"](area.searchArea);
  nwr["historic"="ruins"]["wikidata"](area.searchArea);
  nwr["historic"="ruins"]["heritage"](area.searchArea);

  // =====================================================
  // 9. TARİHİ / ÖNEMLİ DİNİ YAPILAR
  //    Her camiyi almamak için önem filtresi
  // =====================================================
  nwr["amenity"="place_of_worship"]["wikipedia"](area.searchArea);
  nwr["amenity"="place_of_worship"]["wikidata"](area.searchArea);
  nwr["amenity"="place_of_worship"]["heritage"](area.searchArea);

  // =====================================================
  // 10. TARİHİ MEYDANLAR
  // =====================================================
  nwr["place"="square"]["wikipedia"](area.searchArea);
  nwr["place"="square"]["wikidata"](area.searchArea);
  nwr["place"="square"]["heritage"](area.searchArea);

  // =====================================================
  // 11. TARİHİ PARK / BAHÇE / ALANLAR
  //    Sadece kültürel/tarihi önemi belirtilenler
  // =====================================================
  nwr["leisure"="park"]["wikipedia"](area.searchArea);
  nwr["leisure"="park"]["wikidata"](area.searchArea);
  nwr["leisure"="park"]["heritage"](area.searchArea);

  // =====================================================
  // 12. KÜLTÜREL / TURİSTİK ÖNEMİ OLAN ATTRACTION
  // =====================================================
  nwr["tourism"="attraction"]["wikipedia"](area.searchArea);
  nwr["tourism"="attraction"]["wikidata"](area.searchArea);
  nwr["tourism"="attraction"]["heritage"](area.searchArea);
);

// =====================================================
// ÇIKTI
// =====================================================
out center tags;