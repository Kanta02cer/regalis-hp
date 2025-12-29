// 具体的な生地コード・副資材データベース
// Regalis Japan Groupの実際の在庫データを反映

export interface FabricCode {
  code: string;
  name: string;
  color: string;
  weight: string;
  composition: string;
  price: number;
  collection: 'NOBLE' | 'URBAN' | 'ROYAL' | 'CEREMONY';
  brand: string;
  description?: string;
}

export interface ButtonOption {
  id: string;
  name: string;
  code: string;
  material: string;
  price: number;
  description: string;
  suitableFor: string[];
}

export interface LiningOption {
  id: string;
  name: string;
  code: string;
  brand: string;
  price: number;
  description: string;
  colors: string[];
  suitableFor: string[];
}

/**
 * NOBLE Line - Super 100's・WOOL 100% (5CC501〜5CC515)
 */
export const NOBLE_FABRIC_CODES: FabricCode[] = [
  {
    code: '5CC501',
    name: 'OMC Super 100\'s WOOL 100%',
    color: 'ネイビー',
    weight: '260g/m',
    composition: 'WOOL 100%',
    price: 99000,
    collection: 'NOBLE',
    brand: 'OMC',
    description: '天然素材100%。誠実な印象を与えるマットな風合い。デイリーユース、ファーストスーツ、堅実なビジネスシーンに最適。'
  },
  {
    code: '5CC502',
    name: 'OMC Super 100\'s WOOL 100%',
    color: 'チャコールグレー',
    weight: '260g/m',
    composition: 'WOOL 100%',
    price: 99000,
    collection: 'NOBLE',
    brand: 'OMC',
    description: '天然素材100%。誠実な印象を与えるマットな風合い。デイリーユース、ファーストスーツ、堅実なビジネスシーンに最適。'
  },
  {
    code: '5CC503',
    name: 'OMC Super 100\'s WOOL 100%',
    color: 'ダークグレー',
    weight: '260g/m',
    composition: 'WOOL 100%',
    price: 99000,
    collection: 'NOBLE',
    brand: 'OMC',
    description: '天然素材100%。誠実な印象を与えるマットな風合い。デイリーユース、ファーストスーツ、堅実なビジネスシーンに最適。'
  },
  {
    code: '5CC504',
    name: 'OMC Super 100\'s WOOL 100%',
    color: 'ミディアムグレー',
    weight: '260g/m',
    composition: 'WOOL 100%',
    price: 99000,
    collection: 'NOBLE',
    brand: 'OMC',
    description: '天然素材100%。誠実な印象を与えるマットな風合い。デイリーユース、ファーストスーツ、堅実なビジネスシーンに最適。'
  },
  {
    code: '5CC505',
    name: 'OMC Super 100\'s WOOL 100%',
    color: 'ライトグレー',
    weight: '260g/m',
    composition: 'WOOL 100%',
    price: 99000,
    collection: 'NOBLE',
    brand: 'OMC',
    description: '天然素材100%。誠実な印象を与えるマットな風合い。デイリーユース、ファーストスーツ、堅実なビジネスシーンに最適。'
  },
  {
    code: '5CC506',
    name: 'OMC Super 100\'s WOOL 100%',
    color: 'ブラウン',
    weight: '260g/m',
    composition: 'WOOL 100%',
    price: 99000,
    collection: 'NOBLE',
    brand: 'OMC',
    description: '天然素材100%。誠実な印象を与えるマットな風合い。デイリーユース、ファーストスーツ、堅実なビジネスシーンに最適。'
  },
  {
    code: '5CC507',
    name: 'OMC Super 100\'s WOOL 100%',
    color: 'ダークブラウン',
    weight: '260g/m',
    composition: 'WOOL 100%',
    price: 99000,
    collection: 'NOBLE',
    brand: 'OMC',
    description: '天然素材100%。誠実な印象を与えるマットな風合い。デイリーユース、ファーストスーツ、堅実なビジネスシーンに最適。'
  },
  {
    code: '5CC508',
    name: 'OMC Super 100\'s WOOL 100%',
    color: 'ネイビーストライプ',
    weight: '260g/m',
    composition: 'WOOL 100%',
    price: 99000,
    collection: 'NOBLE',
    brand: 'OMC',
    description: '天然素材100%。誠実な印象を与えるマットな風合い。デイリーユース、ファーストスーツ、堅実なビジネスシーンに最適。'
  },
  {
    code: '5CC509',
    name: 'OMC Super 100\'s WOOL 100%',
    color: 'グレーストライプ',
    weight: '260g/m',
    composition: 'WOOL 100%',
    price: 99000,
    collection: 'NOBLE',
    brand: 'OMC',
    description: '天然素材100%。誠実な印象を与えるマットな風合い。デイリーユース、ファーストスーツ、堅実なビジネスシーンに最適。'
  },
  {
    code: '5CC510',
    name: 'OMC Super 100\'s WOOL 100%',
    color: 'ネイビーグレナディア',
    weight: '260g/m',
    composition: 'WOOL 100%',
    price: 99000,
    collection: 'NOBLE',
    brand: 'OMC',
    description: '天然素材100%。誠実な印象を与えるマットな風合い。デイリーユース、ファーストスーツ、堅実なビジネスシーンに最適。'
  },
  {
    code: '5CC511',
    name: 'OMC Super 100\'s WOOL 100%',
    color: 'グレーグレナディア',
    weight: '260g/m',
    composition: 'WOOL 100%',
    price: 99000,
    collection: 'NOBLE',
    brand: 'OMC',
    description: '天然素材100%。誠実な印象を与えるマットな風合い。デイリーユース、ファーストスーツ、堅実なビジネスシーンに最適。'
  },
  {
    code: '5CC512',
    name: 'OMC Super 100\'s WOOL 100%',
    color: 'ネイビーシャークスキン',
    weight: '260g/m',
    composition: 'WOOL 100%',
    price: 99000,
    collection: 'NOBLE',
    brand: 'OMC',
    description: '天然素材100%。誠実な印象を与えるマットな風合い。デイリーユース、ファーストスーツ、堅実なビジネスシーンに最適。'
  },
  {
    code: '5CC513',
    name: 'OMC Super 100\'s WOOL 100%',
    color: 'グレーシャークスキン',
    weight: '260g/m',
    composition: 'WOOL 100%',
    price: 99000,
    collection: 'NOBLE',
    brand: 'OMC',
    description: '天然素材100%。誠実な印象を与えるマットな風合い。デイリーユース、ファーストスーツ、堅実なビジネスシーンに最適。'
  },
  {
    code: '5CC514',
    name: 'OMC Super 100\'s WOOL 100%',
    color: 'ネイビーウィンドウペーン',
    weight: '260g/m',
    composition: 'WOOL 100%',
    price: 99000,
    collection: 'NOBLE',
    brand: 'OMC',
    description: '天然素材100%。誠実な印象を与えるマットな風合い。デイリーユース、ファーストスーツ、堅実なビジネスシーンに最適。'
  },
  {
    code: '5CC515',
    name: 'OMC Super 100\'s WOOL 100%',
    color: 'グレーウィンドウペーン',
    weight: '260g/m',
    composition: 'WOOL 100%',
    price: 99000,
    collection: 'NOBLE',
    brand: 'OMC',
    description: '天然素材100%。誠実な印象を与えるマットな風合い。デイリーユース、ファーストスーツ、堅実なビジネスシーンに最適。'
  },
];

/**
 * URBAN Line - PTT Stretch (5CC521〜5CC540)
 */
export const URBAN_FABRIC_CODES: FabricCode[] = [
  {
    code: '5CC521',
    name: 'OMC PTT Stretch',
    color: 'ネイビー',
    weight: '250g/m',
    composition: 'WOOL + PTT Stretch',
    price: 93500,
    collection: 'URBAN',
    brand: 'OMC',
    description: '高い伸縮性と防シワ性能。シワを気にせず、アクティブに活動するための機能性ライン。外回り営業、出張の多い経営者、スタートアップチームに最適。'
  },
  {
    code: '5CC522',
    name: 'OMC PTT Stretch',
    color: 'チャコールグレー',
    weight: '250g/m',
    composition: 'WOOL + PTT Stretch',
    price: 93500,
    collection: 'URBAN',
    brand: 'OMC',
    description: '高い伸縮性と防シワ性能。シワを気にせず、アクティブに活動するための機能性ライン。外回り営業、出張の多い経営者、スタートアップチームに最適。'
  },
  {
    code: '5CC523',
    name: 'OMC PTT Stretch',
    color: 'ダークグレー',
    weight: '250g/m',
    composition: 'WOOL + PTT Stretch',
    price: 93500,
    collection: 'URBAN',
    brand: 'OMC',
    description: '高い伸縮性と防シワ性能。シワを気にせず、アクティブに活動するための機能性ライン。外回り営業、出張の多い経営者、スタートアップチームに最適。'
  },
  {
    code: '5CC524',
    name: 'OMC PTT Stretch',
    color: 'ミディアムグレー',
    weight: '250g/m',
    composition: 'WOOL + PTT Stretch',
    price: 93500,
    collection: 'URBAN',
    brand: 'OMC',
    description: '高い伸縮性と防シワ性能。シワを気にせず、アクティブに活動するための機能性ライン。外回り営業、出張の多い経営者、スタートアップチームに最適。'
  },
  {
    code: '5CC525',
    name: 'OMC PTT Stretch',
    color: 'ネイビーストライプ',
    weight: '250g/m',
    composition: 'WOOL + PTT Stretch',
    price: 93500,
    collection: 'URBAN',
    brand: 'OMC',
    description: '高い伸縮性と防シワ性能。シワを気にせず、アクティブに活動するための機能性ライン。外回り営業、出張の多い経営者、スタートアップチームに最適。'
  },
  {
    code: '5CC526',
    name: 'OMC PTT Stretch',
    color: 'グレーストライプ',
    weight: '250g/m',
    composition: 'WOOL + PTT Stretch',
    price: 93500,
    collection: 'URBAN',
    brand: 'OMC',
    description: '高い伸縮性と防シワ性能。シワを気にせず、アクティブに活動するための機能性ライン。外回り営業、出張の多い経営者、スタートアップチームに最適。'
  },
  {
    code: '5CC527',
    name: 'OMC PTT Stretch',
    color: 'ネイビーグレナディア',
    weight: '250g/m',
    composition: 'WOOL + PTT Stretch',
    price: 93500,
    collection: 'URBAN',
    brand: 'OMC',
    description: '高い伸縮性と防シワ性能。シワを気にせず、アクティブに活動するための機能性ライン。外回り営業、出張の多い経営者、スタートアップチームに最適。'
  },
  {
    code: '5CC528',
    name: 'OMC PTT Stretch',
    color: 'グレーグレナディア',
    weight: '250g/m',
    composition: 'WOOL + PTT Stretch',
    price: 93500,
    collection: 'URBAN',
    brand: 'OMC',
    description: '高い伸縮性と防シワ性能。シワを気にせず、アクティブに活動するための機能性ライン。外回り営業、出張の多い経営者、スタートアップチームに最適。'
  },
  {
    code: '5CC529',
    name: 'OMC PTT Stretch',
    color: 'ネイビーシャークスキン',
    weight: '250g/m',
    composition: 'WOOL + PTT Stretch',
    price: 93500,
    collection: 'URBAN',
    brand: 'OMC',
    description: '高い伸縮性と防シワ性能。シワを気にせず、アクティブに活動するための機能性ライン。外回り営業、出張の多い経営者、スタートアップチームに最適。'
  },
  {
    code: '5CC530',
    name: 'OMC PTT Stretch',
    color: 'グレーシャークスキン',
    weight: '250g/m',
    composition: 'WOOL + PTT Stretch',
    price: 93500,
    collection: 'URBAN',
    brand: 'OMC',
    description: '高い伸縮性と防シワ性能。シワを気にせず、アクティブに活動するための機能性ライン。外回り営業、出張の多い経営者、スタートアップチームに最適。'
  },
  // 追加のURBAN Line生地コード（5CC531〜5CC540）は同様のパターンで追加可能
];

/**
 * ROYAL Line - CANONICO Perennial (CN 5577〜), REDA Silky Effect (RD 5635〜), ZEGNA (EZ 4584〜)
 */
export const ROYAL_FABRIC_CODES: FabricCode[] = [
  // CANONICO Perennial
  {
    code: 'CN 5577',
    name: 'V.B. Canonico Perennial',
    color: 'ネイビー',
    weight: '260g/m',
    composition: 'Super 110s WOOL 100%',
    price: 143000,
    collection: 'ROYAL',
    brand: 'CANONICO',
    description: 'イタリア・ビエラ地方の名門ミル。しっとりとした質感、イタリアらしいヌメリ感。一目で「上質」とわかる圧倒的な光沢と、身体のラインを美しく見せるドレープ。'
  },
  {
    code: 'CN 5578',
    name: 'V.B. Canonico Perennial',
    color: 'チャコールグレー',
    weight: '260g/m',
    composition: 'Super 110s WOOL 100%',
    price: 143000,
    collection: 'ROYAL',
    brand: 'CANONICO',
    description: 'イタリア・ビエラ地方の名門ミル。しっとりとした質感、イタリアらしいヌメリ感。一目で「上質」とわかる圧倒的な光沢と、身体のラインを美しく見せるドレープ。'
  },
  {
    code: 'CN 5579',
    name: 'V.B. Canonico Perennial',
    color: 'ダークグレー',
    weight: '260g/m',
    composition: 'Super 110s WOOL 100%',
    price: 143000,
    collection: 'ROYAL',
    brand: 'CANONICO',
    description: 'イタリア・ビエラ地方の名門ミル。しっとりとした質感、イタリアらしいヌメリ感。一目で「上質」とわかる圧倒的な光沢と、身体のラインを美しく見せるドレープ。'
  },
  {
    code: 'CN 5580',
    name: 'V.B. Canonico Perennial',
    color: 'ネイビーストライプ',
    weight: '260g/m',
    composition: 'Super 110s WOOL 100%',
    price: 143000,
    collection: 'ROYAL',
    brand: 'CANONICO',
    description: 'イタリア・ビエラ地方の名門ミル。しっとりとした質感、イタリアらしいヌメリ感。一目で「上質」とわかる圧倒的な光沢と、身体のラインを美しく見せるドレープ。'
  },
  {
    code: 'CN 5581',
    name: 'V.B. Canonico Perennial',
    color: 'グレーストライプ',
    weight: '260g/m',
    composition: 'Super 110s WOOL 100%',
    price: 143000,
    collection: 'ROYAL',
    brand: 'CANONICO',
    description: 'イタリア・ビエラ地方の名門ミル。しっとりとした質感、イタリアらしいヌメリ感。一目で「上質」とわかる圧倒的な光沢と、身体のラインを美しく見せるドレープ。'
  },
  // REDA Silky Effect
  {
    code: 'RD 5635',
    name: 'REDA Silky Effect',
    color: 'ネイビー',
    weight: '250g/m',
    composition: 'Super 110s WOOL 100%',
    price: 143000,
    collection: 'ROYAL',
    brand: 'REDA',
    description: 'ドルフィン加工による滑らかさ、シルクのような手触り。強い光沢と形態安定性。世界が認める艶、リーダーの品格。'
  },
  {
    code: 'RD 5636',
    name: 'REDA Silky Effect',
    color: 'チャコールグレー',
    weight: '250g/m',
    composition: 'Super 110s WOOL 100%',
    price: 143000,
    collection: 'ROYAL',
    brand: 'REDA',
    description: 'ドルフィン加工による滑らかさ、シルクのような手触り。強い光沢と形態安定性。世界が認める艶、リーダーの品格。'
  },
  {
    code: 'RD 5637',
    name: 'REDA Silky Effect',
    color: 'ダークグレー',
    weight: '250g/m',
    composition: 'Super 110s WOOL 100%',
    price: 143000,
    collection: 'ROYAL',
    brand: 'REDA',
    description: 'ドルフィン加工による滑らかさ、シルクのような手触り。強い光沢と形態安定性。世界が認める艶、リーダーの品格。'
  },
  {
    code: 'RD 5638',
    name: 'REDA Silky Effect',
    color: 'ネイビーストライプ',
    weight: '250g/m',
    composition: 'Super 110s WOOL 100%',
    price: 143000,
    collection: 'ROYAL',
    brand: 'REDA',
    description: 'ドルフィン加工による滑らかさ、シルクのような手触り。強い光沢と形態安定性。世界が認める艶、リーダーの品格。'
  },
  {
    code: 'RD 5639',
    name: 'REDA Silky Effect',
    color: 'グレーストライプ',
    weight: '250g/m',
    composition: 'Super 110s WOOL 100%',
    price: 143000,
    collection: 'ROYAL',
    brand: 'REDA',
    description: 'ドルフィン加工による滑らかさ、シルクのような手触り。強い光沢と形態安定性。世界が認める艶、リーダーの品格。'
  },
  // ZEGNA Trofeo
  {
    code: 'EZ 4584',
    name: 'Ermenegildo Zegna Trofeo',
    color: 'ネイビー',
    weight: '240g/m',
    composition: 'Super 120s WOOL 100%',
    price: 198000,
    collection: 'ROYAL',
    brand: 'ZEGNA',
    description: '世界最高峰のミル。シルクのような手触り、圧倒的な光沢。流れるようなドレープ、極上の着心地。経営者、役員、登壇者、ここぞという勝負服として、あなたの存在感を最大限に引き出します。'
  },
  {
    code: 'EZ 4585',
    name: 'Ermenegildo Zegna Trofeo',
    color: 'チャコールグレー',
    weight: '240g/m',
    composition: 'Super 120s WOOL 100%',
    price: 198000,
    collection: 'ROYAL',
    brand: 'ZEGNA',
    description: '世界最高峰のミル。シルクのような手触り、圧倒的な光沢。流れるようなドレープ、極上の着心地。経営者、役員、登壇者、ここぞという勝負服として、あなたの存在感を最大限に引き出します。'
  },
  {
    code: 'EZ 4586',
    name: 'Ermenegildo Zegna Trofeo',
    color: 'ダークグレー',
    weight: '240g/m',
    composition: 'Super 120s WOOL 100%',
    price: 198000,
    collection: 'ROYAL',
    brand: 'ZEGNA',
    description: '世界最高峰のミル。シルクのような手触り、圧倒的な光沢。流れるようなドレープ、極上の着心地。経営者、役員、登壇者、ここぞという勝負服として、あなたの存在感を最大限に引き出します。'
  },
  {
    code: 'EZ 4587',
    name: 'Ermenegildo Zegna Trofeo',
    color: 'ネイビーストライプ',
    weight: '240g/m',
    composition: 'Super 120s WOOL 100%',
    price: 198000,
    collection: 'ROYAL',
    brand: 'ZEGNA',
    description: '世界最高峰のミル。シルクのような手触り、圧倒的な光沢。流れるようなドレープ、極上の着心地。経営者、役員、登壇者、ここぞという勝負服として、あなたの存在感を最大限に引き出します。'
  },
  {
    code: 'EZ 4588',
    name: 'Ermenegildo Zegna Trofeo',
    color: 'グレーストライプ',
    weight: '240g/m',
    composition: 'Super 120s WOOL 100%',
    price: 198000,
    collection: 'ROYAL',
    brand: 'ZEGNA',
    description: '世界最高峰のミル。シルクのような手触り、圧倒的な光沢。流れるようなドレープ、極上の着心地。経営者、役員、登壇者、ここぞという勝負服として、あなたの存在感を最大限に引き出します。'
  },
];

/**
 * CEREMONY Line - OMC Formal (Deep Black)
 */
export const CEREMONY_FABRIC_CODES: FabricCode[] = [
  {
    code: '5CC601',
    name: 'OMC Formal Deep Black',
    color: '濃染加工の漆黒',
    weight: '270g/m',
    composition: 'WOOL 100%',
    price: 121000,
    collection: 'CEREMONY',
    brand: 'OMC',
    description: '一般的なブラックスーツとは一線を画す「濃染加工」を施した漆黒の生地を使用し、写真映えする深い黒を実現。結婚式（新郎・列席）、成人式、授賞式など、人生の節目に相応しい一着。'
  },
  {
    code: '5CC602',
    name: 'OMC Formal Deep Black',
    color: '濃染加工の漆黒（ストライプ）',
    weight: '270g/m',
    composition: 'WOOL 100%',
    price: 121000,
    collection: 'CEREMONY',
    brand: 'OMC',
    description: '一般的なブラックスーツとは一線を画す「濃染加工」を施した漆黒の生地を使用し、写真映えする深い黒を実現。結婚式（新郎・列席）、成人式、授賞式など、人生の節目に相応しい一着。'
  },
  {
    code: '5CC603',
    name: 'OMC Formal Deep Black',
    color: '濃染加工の漆黒（サテン）',
    weight: '270g/m',
    composition: 'WOOL 100%',
    price: 121000,
    collection: 'CEREMONY',
    brand: 'OMC',
    description: '一般的なブラックスーツとは一線を画す「濃染加工」を施した漆黒の生地を使用し、写真映えする深い黒を実現。結婚式（新郎・列席）、成人式、授賞式など、人生の節目に相応しい一着。'
  },
];

/**
 * 全生地コードデータベース
 */
export const ALL_FABRIC_CODES: FabricCode[] = [
  ...NOBLE_FABRIC_CODES,
  ...URBAN_FABRIC_CODES,
  ...ROYAL_FABRIC_CODES,
  ...CEREMONY_FABRIC_CODES,
];

/**
 * コレクション別に生地コードを取得
 */
export const getFabricCodesByCollection = (collection: FabricCode['collection']): FabricCode[] => {
  return ALL_FABRIC_CODES.filter((fabric) => fabric.collection === collection);
};

/**
 * ブランド別に生地コードを取得
 */
export const getFabricCodesByBrand = (brand: string): FabricCode[] => {
  return ALL_FABRIC_CODES.filter((fabric) => fabric.brand === brand);
};

/**
 * 価格帯別に生地コードを取得
 */
export const getFabricCodesByPriceRange = (min: number, max: number): FabricCode[] => {
  return ALL_FABRIC_CODES.filter(
    (fabric) => fabric.price >= min && fabric.price <= max
  );
};

/**
 * ボタンオプション
 */
export const BUTTON_OPTIONS: Record<string, ButtonOption> = {
  buffalo_h: {
    id: 'buffalo_h',
    name: '本水牛ボタン',
    code: 'H-4',
    material: '本水牛',
    price: 4400,
    description: '最高級の本水牛ボタン。温かみのある質感と、長期的な耐久性を両立。伝統的な格式を重視する方に最適。',
    suitableFor: ['NOBLE', 'ROYAL', 'CEREMONY']
  },
  buffalo_h_premium: {
    id: 'buffalo_h_premium',
    name: '本水牛ボタン（プレミアム）',
    code: 'H-5',
    material: '本水牛（プレミアム）',
    price: 5500,
    description: '最高級の本水牛ボタン（プレミアムグレード）。より深みのある質感と、長期的な耐久性を両立。',
    suitableFor: ['ROYAL', 'CEREMONY']
  },
  nut_by_color: {
    id: 'nut_by_color',
    name: 'ナットバイカラー釦',
    code: 'NBC-1',
    material: 'ナット',
    price: 3300,
    description: 'ナット素材のボタン。自然な温かみと、コストパフォーマンスを両立。モダンなスタイルに最適。',
    suitableFor: ['NOBLE', 'URBAN']
  },
  metal: {
    id: 'metal',
    name: 'メタル釦',
    code: 'MT-1',
    material: 'メタル',
    price: 5500,
    description: 'メタル素材のボタン。モダンな輝きと、洗練された印象を与えます。',
    suitableFor: ['URBAN', 'ROYAL']
  },
};

/**
 * 裏地オプション
 */
export const LINING_OPTIONS: Record<string, LiningOption> = {
  associ: {
    id: 'associ',
    name: 'アソシエ裏地',
    code: 'AA-45',
    brand: 'アソシエ',
    price: 4400,
    description: 'アソシエの高品質裏地。滑らかな手触りと、耐久性を両立。',
    colors: ['ネイビー', 'ロイヤルブルー', 'バーガンディ', 'グレー'],
    suitableFor: ['NOBLE', 'URBAN', 'ROYAL', 'CEREMONY']
  },
  associ_premium: {
    id: 'associ_premium',
    name: 'アソシエ裏地（プレミアム）',
    code: 'AA-50',
    brand: 'アソシエ',
    price: 5500,
    description: 'アソシエのプレミアム裏地。より滑らかな手触りと、高級感を演出。',
    colors: ['ネイビー', 'ロイヤルブルー', 'バーガンディ', 'グレー', 'ゴールド'],
    suitableFor: ['ROYAL', 'CEREMONY']
  },
  komon_kobo: {
    id: 'komon_kobo',
    name: '小紋工房裏地',
    code: 'KK-1',
    brand: '小紋工房',
    price: 6600,
    description: '小紋工房の伝統的な裏地。日本の伝統文様をモチーフにした、唯一無二のデザイン。',
    colors: ['ネイビー', 'ロイヤルブルー', 'バーガンディ', 'グレー', 'ゴールド', 'シルバー'],
    suitableFor: ['NOBLE', 'URBAN', 'ROYAL', 'CEREMONY']
  },
  komon_kobo_premium: {
    id: 'komon_kobo_premium',
    name: '小紋工房裏地（プレミアム）',
    code: 'KK-2',
    brand: '小紋工房',
    price: 7700,
    description: '小紋工房のプレミアム裏地。より精緻な伝統文様と、高級感を演出。',
    colors: ['ネイビー', 'ロイヤルブルー', 'バーガンディ', 'グレー', 'ゴールド', 'シルバー', 'プラチナ'],
    suitableFor: ['ROYAL', 'CEREMONY']
  },
  cupro: {
    id: 'cupro',
    name: 'キュプラ裏地',
    code: 'CP-1',
    brand: 'キュプラ',
    price: 4400,
    description: 'キュプラ素材の裏地。滑らかな手触りと、通気性を両立。',
    colors: ['ネイビー', 'ロイヤルブルー', 'バーガンディ', 'グレー'],
    suitableFor: ['NOBLE', 'URBAN']
  },
};

/**
 * コレクション別の推奨ボタン・裏地を取得
 */
export const getRecommendedOptionsByCollection = (collection: FabricCode['collection']) => {
  const buttons = Object.values(BUTTON_OPTIONS).filter((btn) => 
    btn.suitableFor.includes(collection)
  );
  const linings = Object.values(LINING_OPTIONS).filter((lining) => 
    lining.suitableFor.includes(collection)
  );
  
  return {
    buttons,
    linings,
    recommendedButton: buttons[0],
    recommendedLining: linings[0],
  };
};

