// 全16アーキタイプの完全な定義
// 8つの学問領域に基づく包括的な分析を含む

import { Briefcase, Zap, Anchor, Feather, UserCircle2 } from 'lucide-react';

export interface ArchetypeDetails {
  fashion: {
    title: string;
    text: string;
    items: string[];
  };
  psychology: {
    title: string;
    text: string;
    tag: string;
  };
  romance: {
    title: string;
    text: string;
    lucky: string;
  };
  philosophy: {
    title: string;
    text: string;
  };
}

export interface ArchetypeDefinition {
  id: string;
  name: string;
  nameJa: string;
  group: string;
  desc: string;
  catchphrase?: string;
  icon: any;
  color: string;
  recOptions: {
    button: { name: string; price: number };
    lining: { name: string; price: number };
  };
  details?: ArchetypeDetails;
}

export const ARCHETYPE_DEFINITIONS: Record<string, ArchetypeDefinition> = {
  '01': {
    id: '01',
    name: "The Sovereign",
    nameJa: "至高の君主",
    group: "Rulers",
    desc: "権威と格式を極めた、最高の統治者。",
    catchphrase: "言葉よりも雄弁な、圧倒的風格。",
    icon: Briefcase,
    color: "from-[#0a0f18] to-[#151515]",
    recOptions: { button: { name: "本水牛釦", price: 4400 }, lining: { name: "キュプラ", price: 4400 } },
    details: {
      fashion: {
        title: "英国式構築美学 (Morphology)",
        text: "あなたの骨格（Linear）は、英国サヴィル・ロウの伝統的な『ドレープカット』と完全に調和します。パッドで肩を強調し、ウェストを絞った砂時計型のシルエットが、あなたの権威（Authority）を物理的に拡張します。",
        items: ["スリーピーススーツ", "ピークドラペル", "350g以上のヘビーウェイト生地"]
      },
      psychology: {
        title: "秩序と支配 (Identity)",
        text: "あなたは混沌とした状況に秩序をもたらす存在です。心理学的には『統制への欲求』が高く、不確実性を嫌います。自らのアイデンティティを『守護者』あるいは『導く者』と定義しており、その責任感こそが動力源です。",
        tag: "ESTJ / ISTJ (指揮官・幹部型)"
      },
      romance: {
        title: "ロマンティックな覇者 (Evol. Psych)",
        text: "恋愛においても主導権を握る傾向があります。進化心理学的に言えば、あなたは『資源保持能力』と『庇護欲』をアピールすることでパートナーを獲得します。相性が良いのは、あなたを支える献身的なサポータータイプです。",
        lucky: "クラシックな革のIDケース"
      },
      philosophy: {
        title: "Noblesse Oblige (Theology)",
        text: "あなたの人生における神とは『正義』と『規律』です。カトリック神学のように、階層と役割が明確な世界でこそ、あなたは救済を見出します。無秩序な自由よりも、高潔な義務に生きることに美を感じるでしょう。"
      }
    }
  },
  '02': {
    id: '02',
    name: "The Strategist",
    nameJa: "冷徹な戦略家",
    group: "Rulers",
    desc: "冷徹な戦略家。静寂の中に宿る、鋭利な知性。",
    catchphrase: "静寂の中に宿る、鋭利な知性。",
    icon: Zap,
    color: "from-[#374151] via-[#4b5563] to-[#1f2937]",
    recOptions: { button: { name: "メタル釦", price: 5500 }, lining: { name: "柄裏地", price: 6600 } },
    details: {
      fashion: {
        title: "モダニズムと機能美",
        text: "装飾を排除したミニマリズムこそが至高。直線的（Linear）なラインに、彩度を抑えた（Blend）グレーやチャコールを合わせることで、あなたの知性（Intellect）へのノイズを遮断します。",
        items: ["比翼仕立てのコート", "チャコールグレースーツ", "シルバータイ"]
      },
      psychology: {
        title: "論理的完結 (Analyst)",
        text: "あなたは世界の構造を理解したいと願う『解析者』です。感情よりも論理的整合性を重視し、独りで思考する時間をエネルギー源とします。対人関係ではクールに見えますが、内面には熱い理論体系を持っています。",
        tag: "INTJ / ISTJ (建築家・管理者)"
      },
      romance: {
        title: "慎重なる契約者",
        text: "恋愛を『コストとリターン』や『将来の安定性』で評価しがちです。失敗を恐れるあまり奥手になりますが、一度信頼関係（契約）を結ぶと、誰よりも誠実で浮気をしません。",
        lucky: "万年筆"
      },
      philosophy: {
        title: "Stoicism (Philosophy)",
        text: "ストア派哲学があなたの指針です。「変えられるものと変えられないものを区別せよ」。感情の揺らぎを理性で統御することに、人生の平安（アパテイア）があります。神は数式の中にいます。"
      }
    }
  },
  '03': {
    id: '03',
    name: "The Aristocrat",
    nameJa: "貴族",
    group: "Rulers",
    desc: "優雅さと格式を兼ね備えた、貴族の風格。",
    catchphrase: "伝統の中に宿る、洗練された優雅さ。",
    icon: Anchor,
    color: "from-[#081021] to-[#151515]",
    recOptions: { button: { name: "本水牛釦", price: 4400 }, lining: { name: "キュプラ", price: 4400 } },
    details: {
      fashion: {
        title: "貴族の美学 (Aesthetics)",
        text: "英国の伝統的なサヴィル・ロウスタイルが、あなたの格式を完璧に表現します。高級な生地（Super 120s以上）と、細部へのこだわり（手縫いのボタンホール、本切羽）が、あなたの社会的地位を視覚的に伝えます。",
        items: ["ダブルブレスト", "ピークドラペル", "本切羽（袖ボタンが開く）"]
      },
      psychology: {
        title: "階層的アイデンティティ (Social Psychology)",
        text: "あなたは社会的階層と役割を重視します。『自分は何者か』という問いに対して、『伝統を継承する者』『格式を保つ者』という答えを持っています。周囲からの尊敬と承認が、あなたの行動の原動力です。",
        tag: "ENFJ / ESFJ (主人公・領事官型)"
      },
      romance: {
        title: "格式ある求愛",
        text: "恋愛においても、格式と伝統を重んじます。派手なアプローチよりも、丁寧で洗練された方法を選びます。長期的な関係性を重視し、パートナーとの社会的地位の調和を大切にします。",
        lucky: "アンティークのカフリンクス"
      },
      philosophy: {
        title: "Conservatism (Political Philosophy)",
        text: "保守主義があなたの価値観の根底にあります。『伝統は試行錯誤の結晶である』という考えから、急激な変化よりも、時間をかけて築かれた価値を尊重します。"
      }
    }
  },
  '04': {
    id: '04',
    name: "The Futurist Executive",
    nameJa: "未来主義者エグゼクティブ",
    group: "Rulers",
    desc: "未来を見据えた、革新的な経営者。",
    catchphrase: "未来を創る、先見の明。",
    icon: Zap,
    color: "from-[#1f080f] to-[#151515]",
    recOptions: { button: { name: "メタル釦", price: 5500 }, lining: { name: "赤裏地", price: 4400 } },
    details: {
      fashion: {
        title: "モダンエグゼクティブスタイル",
        text: "伝統的な格式を保ちながら、モダンな要素を取り入れたスタイルが最適です。機能性と美しさを両立した、未来志向のデザインが、あなたの革新性を表現します。",
        items: ["シングル2つボタン", "ノッチドラペル", "機能性生地（ストレッチ混）"]
      },
      psychology: {
        title: "革新への情熱 (Innovation Psychology)",
        text: "あなたは『可能性』と『未来』に強い関心を持ちます。現状維持よりも、新しい価値の創造を重視します。リスクを恐れず、挑戦する姿勢が、あなたのアイデンティティの核心です。",
        tag: "ENTP / ENFP (討論者・運動家型)"
      },
      romance: {
        title: "刺激的な関係性",
        text: "恋愛においても、刺激と成長を求めます。パートナーとの関係性を通じて、新しい自分を発見したいと願います。伝統的な関係性よりも、自由で創造的な関係を好みます。",
        lucky: "モダンな時計"
      },
      philosophy: {
        title: "Progressivism (Modern Philosophy)",
        text: "進歩主義があなたの哲学です。『未来は過去よりも良くなる』という信念を持ち、社会の進歩と個人の成長を信じています。"
      }
    }
  },
  '05': {
    id: '05',
    name: "The Iron Commander",
    nameJa: "鉄の指揮官",
    group: "Challengers",
    desc: "強固な意志と実用性を備えた、現場の指揮官。",
    catchphrase: "現場で勝つ、実践の美学。",
    icon: Briefcase,
    color: "from-[#0a0f18] to-[#151515]",
    recOptions: { button: { name: "本水牛釦", price: 4400 }, lining: { name: "キュプラ", price: 4400 } },
    details: {
      fashion: {
        title: "実用性と格式の融合",
        text: "現場で動きやすく、かつ格式も保てるスタイルが最適です。耐久性の高い生地と、実用的なディテール（サイドベンツ、機能的なポケット）が、あなたの実践的なリーダーシップを表現します。",
        items: ["シングル2つボタン", "サイドベンツ", "耐久性の高い生地（300g以上）"]
      },
      psychology: {
        title: "実践的リーダーシップ (Leadership Psychology)",
        text: "あなたは『現場で結果を出す』ことを重視します。理論よりも実践、計画よりも実行を優先します。チームを率いて目標を達成することに、深い満足感を覚えます。",
        tag: "ESTJ / ISTJ (幹部・管理者型)"
      },
      romance: {
        title: "実直な関係性",
        text: "恋愛においても、実直で誠実なアプローチを取ります。派手なロマンスよりも、安定した関係性を重視します。パートナーとの信頼関係を築くことを最優先します。",
        lucky: "実用的な革製品"
      },
      philosophy: {
        title: "Pragmatism (Practical Philosophy)",
        text: "実用主義があなたの哲学です。『理論は実践によって検証される』という考えから、実際に機能するもの、結果を生むものを重視します。"
      }
    }
  },
  '06': {
    id: '06',
    name: "The Tech Strategist",
    nameJa: "テック・ストラテジスト",
    group: "Challengers",
    desc: "テクノロジーと戦略を融合する、現代の軍師。",
    catchphrase: "データが語る、未来の戦略。",
    icon: Zap,
    color: "from-[#1a1a1a] to-[#151515]",
    recOptions: { button: { name: "メタル釦", price: 5500 }, lining: { name: "柄裏地", price: 6600 } },
    details: {
      fashion: {
        title: "テクノロジーとモダニズム",
        text: "機能性とモダンなデザインを融合したスタイルが最適です。最新の素材技術（ストレッチ、防シワ加工）と、クリーンなシルエットが、あなたの革新的な思考を表現します。",
        items: ["モダンなシルエット", "機能性生地", "ミニマルなディテール"]
      },
      psychology: {
        title: "分析的思考 (Cognitive Psychology)",
        text: "あなたはデータと論理に基づいて意思決定を行います。感情よりも事実を重視し、システム思考で問題を解決します。テクノロジーを通じて、世界をより良くしたいと願っています。",
        tag: "INTJ / ISTP (建築家・職人型)"
      },
      romance: {
        title: "論理的な関係性",
        text: "恋愛においても、論理とデータを重視します。相性を分析し、長期的な関係性の可能性を評価します。感情的な衝動よりも、理性的な判断を優先します。",
        lucky: "スマートウォッチ"
      },
      philosophy: {
        title: "Technological Determinism",
        text: "技術決定論があなたの哲学です。『テクノロジーが社会を変える』という信念を持ち、イノベーションを通じて人類の進歩を実現したいと願います。"
      }
    }
  },
  '07': {
    id: '07',
    name: "The Heritage Hunter",
    nameJa: "ヘリテッジ・ハンター",
    group: "Challengers",
    desc: "伝統を探求し、実用性を追求する冒険家。",
    catchphrase: "過去から学び、未来を創る。",
    icon: Anchor,
    color: "from-[#081021] to-[#151515]",
    recOptions: { button: { name: "本水牛釦", price: 4400 }, lining: { name: "キュプラ", price: 4400 } },
    details: {
      fashion: {
        title: "伝統と実用性の融合",
        text: "伝統的な技術と実用的な機能を融合したスタイルが最適です。クラシックなデザインに、現代的な機能性を加えることで、あなたの探求心を表現します。",
        items: ["クラシックなシルエット", "実用的なディテール", "伝統的な生地"]
      },
      psychology: {
        title: "探求者の精神 (Explorer Psychology)",
        text: "あなたは『なぜ』と『どのように』を追求する探求者です。伝統的な価値と現代的な実用性の両方を理解し、最適なバランスを見つけ出すことに長けています。",
        tag: "ISTP / ISFP (職人・冒険家型)"
      },
      romance: {
        title: "深い理解を求める",
        text: "恋愛においても、表面的な関係よりも深い理解を求めます。パートナーとの共通の価値観や興味を探求し、長期的な関係性を築きます。",
        lucky: "アンティークのアクセサリー"
      },
      philosophy: {
        title: "Eclecticism (Philosophical Synthesis)",
        text: "折衷主義があなたの哲学です。『過去と現在、伝統と革新を統合する』という考えから、多様な価値観を受け入れ、最適な解を見つけ出します。"
      }
    }
  },
  '08': {
    id: '08',
    name: "The Urban Maverick",
    nameJa: "都会の異端児",
    group: "Challengers",
    desc: "都市の自由と革新を体現する、反逆の精神。",
    catchphrase: "常識を超える、自由の表現。",
    icon: Zap,
    color: "from-[#1f080f] to-[#151515]",
    recOptions: { button: { name: "メタル釦", price: 5500 }, lining: { name: "赤裏地", price: 4400 } },
    details: {
      fashion: {
        title: "アーバン・アヴァンギャルド",
        text: "伝統的なルールを破り、独自のスタイルを確立することが重要です。モダンなデザインと大胆な色彩が、あなたの反逆精神を表現します。",
        items: ["モダンなシルエット", "大胆な色彩", "個性的なディテール"]
      },
      psychology: {
        title: "反逆者のアイデンティティ (Rebel Psychology)",
        text: "あなたは『既存のルールに従わない』ことをアイデンティティの核心としています。常識を疑い、新しい可能性を追求します。自由と創造性を最優先します。",
        tag: "ENTP / ESTP (討論者・起業家型)"
      },
      romance: {
        title: "刺激的な関係性",
        text: "恋愛においても、刺激と冒険を求めます。伝統的な関係性よりも、自由で創造的な関係を好みます。パートナーとの関係性を通じて、新しい自分を発見したいと願います。",
        lucky: "個性的なアクセサリー"
      },
      philosophy: {
        title: "Existentialism (Freedom Philosophy)",
        text: "実存主義があなたの哲学です。『存在は本質に先立つ』という考えから、自分自身で意味を創造し、自由に選択することを重視します。"
      }
    }
  },
  '09': {
    id: '09',
    name: "The Classic Gentleman",
    nameJa: "クラシック・ジェントルマン",
    group: "Harmonizers",
    desc: "格式と親和性を両立する、真の紳士。",
    catchphrase: "優雅さと親しみやすさの調和。",
    icon: Anchor,
    color: "from-[#0a0f18] to-[#151515]",
    recOptions: { button: { name: "本水牛釦", price: 4400 }, lining: { name: "キュプラ", price: 4400 } },
    details: {
      fashion: {
        title: "クラシックな優雅さ",
        text: "伝統的な英国スタイルに、親しみやすい要素を加えたスタイルが最適です。格式を保ちながら、周囲との調和を大切にする姿勢が、あなたの紳士的な品格を表現します。",
        items: ["シングル2つボタン", "ノッチドラペル", "クラシックな色彩"]
      },
      psychology: {
        title: "調和のアイデンティティ (Harmony Psychology)",
        text: "あなたは『周囲との調和』を重視します。格式を保ちながら、親しみやすさも大切にします。チームワークと協調性が、あなたの行動の原動力です。",
        tag: "ESFJ / ISFJ (領事官・擁護者型)"
      },
      romance: {
        title: "誠実な関係性",
        text: "恋愛においても、誠実で安定した関係性を重視します。パートナーとの調和を大切にし、長期的な関係性を築きます。",
        lucky: "クラシックな時計"
      },
      philosophy: {
        title: "Virtue Ethics (Moral Philosophy)",
        text: "徳倫理学があなたの哲学です。『善い行いが善い人格を形成する』という考えから、日々の行動を通じて品格を高めることを重視します。"
      }
    }
  },
  '10': {
    id: '10',
    name: "The Mode Icon",
    nameJa: "モード・アイコン",
    group: "Harmonizers",
    desc: "モードと親和性を融合する、時代のアイコン。",
    catchphrase: "時代を先取りする、洗練された個性。",
    icon: Feather,
    color: "from-[#1a1a1a] to-[#151515]",
    recOptions: { button: { name: "ナット釦", price: 3300 }, lining: { name: "柄裏地", price: 6600 } },
    details: {
      fashion: {
        title: "モードと親和性の融合",
        text: "最新のトレンドを取り入れながら、周囲との調和も保つスタイルが最適です。個性的でありながら、過度に目立ちすぎないバランスが、あなたの洗練されたセンスを表現します。",
        items: ["モダンなシルエット", "トレンドカラー", "個性的なディテール"]
      },
      psychology: {
        title: "個性と調和のバランス (Identity Psychology)",
        text: "あなたは『個性を表現しながら、周囲と調和する』ことを重視します。最新のトレンドに敏感でありながら、過度に目立ちすぎないバランス感覚を持っています。",
        tag: "ISFP / INFJ (冒険家・提唱者型)"
      },
      romance: {
        title: "洗練された関係性",
        text: "恋愛においても、洗練された関係性を求めます。パートナーとの調和を大切にしながら、個性的な関係性を築きます。",
        lucky: "モダンなアクセサリー"
      },
      philosophy: {
        title: "Aesthetic Individualism",
        text: "美的個人主義があなたの哲学です。『個性と美しさを両立する』という考えから、自分らしさを表現しながら、周囲との調和も大切にします。"
      }
    }
  },
  '11': {
    id: '11',
    name: "The Elegant Dandy",
    nameJa: "優雅な伊達男",
    group: "Harmonizers",
    desc: "優雅さと個性を調和させる、洗練されたダンディ。",
    catchphrase: "優雅に、個性的に、自由に。",
    icon: Feather,
    color: "from-[#081021] to-[#151515]",
    recOptions: { button: { name: "ナット釦", price: 3300 }, lining: { name: "キュプラ", price: 4400 } },
    details: {
      fashion: {
        title: "ダンディズムの美学",
        text: "優雅さと個性を両立したスタイルが最適です。伝統的な格式を保ちながら、独自のセンスを表現するディテール（柄裏地、個性的なアクセサリー）が、あなたのダンディズムを表現します。",
        items: ["イタリアンシルエット", "柄裏地", "個性的なアクセサリー"]
      },
      psychology: {
        title: "表現者のアイデンティティ (Expression Psychology)",
        text: "あなたは『自分らしさを表現する』ことを重視します。優雅さと個性を両立し、周囲との調和を保ちながら、独自のセンスを表現します。",
        tag: "ENFJ / ESFP (主人公・エンターテイナー型)"
      },
      romance: {
        title: "魅力的な関係性",
        text: "恋愛においても、魅力的で洗練された関係性を求めます。パートナーとの調和を大切にしながら、個性的な関係性を築きます。",
        lucky: "個性的なアクセサリー"
      },
      philosophy: {
        title: "Aesthetic Hedonism",
        text: "美的快楽主義があなたの哲学です。『美しさと楽しさを両立する』という考えから、人生を芸術作品のように美しく、楽しく生きることを重視します。"
      }
    }
  },
  '12': {
    id: '12',
    name: "The Neo Classicist",
    nameJa: "ネオ・クラシシスト",
    group: "Harmonizers",
    desc: "伝統と革新を調和させる、新古典主義者。",
    catchphrase: "伝統を再解釈し、未来を創る。",
    icon: Zap,
    color: "from-[#1f080f] to-[#151515]",
    recOptions: { button: { name: "メタル釦", price: 5500 }, lining: { name: "赤裏地", price: 4400 } },
    details: {
      fashion: {
        title: "新古典主義の美学",
        text: "伝統的な要素を現代的な解釈で再構築したスタイルが最適です。クラシックな格式を保ちながら、モダンな要素を取り入れることで、あなたの革新的な思考を表現します。",
        items: ["クラシックなシルエット", "モダンなディテール", "伝統と革新の融合"]
      },
      psychology: {
        title: "統合者のアイデンティティ (Integration Psychology)",
        text: "あなたは『伝統と革新を統合する』ことを重視します。過去の価値を尊重しながら、未来への可能性を追求します。調和と創造性を両立します。",
        tag: "INFP / INFJ (仲介者・提唱者型)"
      },
      romance: {
        title: "深い理解と創造性",
        text: "恋愛においても、深い理解と創造性を求めます。パートナーとの関係性を通じて、新しい価値を創造したいと願います。",
        lucky: "アンティークとモダンの融合"
      },
      philosophy: {
        title: "Neo-Classicism (Aesthetic Philosophy)",
        text: "新古典主義があなたの哲学です。『伝統を再解釈し、現代的な意味を与える』という考えから、過去と未来を統合することを重視します。"
      }
    }
  },
  '13': {
    id: '13',
    name: "The Artisan",
    nameJa: "職人",
    group: "Innovators",
    desc: "職人魂と実用性を追求する、創造の職人。",
    catchphrase: "手で創る、本物の価値。",
    icon: Anchor,
    color: "from-[#0a0f18] to-[#151515]",
    recOptions: { button: { name: "本水牛釦", price: 4400 }, lining: { name: "キュプラ", price: 4400 } },
    details: {
      fashion: {
        title: "職人の美学",
        text: "手仕事の質感と実用性を重視したスタイルが最適です。伝統的な技術と現代的な機能性を融合し、本物の価値を追求する姿勢が、あなたの職人魂を表現します。",
        items: ["手縫いのディテール", "高品質な生地", "実用的な機能性"]
      },
      psychology: {
        title: "創造者のアイデンティティ (Creator Psychology)",
        text: "あなたは『手で創る』ことを重視します。職人魂と実用性を両立し、本物の価値を追求します。完成度の高い作品を創り出すことに、深い満足感を覚えます。",
        tag: "ISTP / ISFP (職人・冒険家型)"
      },
      romance: {
        title: "誠実な関係性",
        text: "恋愛においても、誠実で安定した関係性を重視します。パートナーとの関係性を、時間をかけて丁寧に築きます。",
        lucky: "手作りのアクセサリー"
      },
      philosophy: {
        title: "Craftsmanship (Work Philosophy)",
        text: "職人哲学があなたの哲学です。『手で創ることに価値がある』という考えから、完成度の高い作品を創り出すことを重視します。"
      }
    }
  },
  '14': {
    id: '14',
    name: "The Street Smart",
    nameJa: "ストリート・スマート",
    group: "Innovators",
    desc: "ストリート感覚と機能性を備えた、都市の賢者。",
    catchphrase: "街で学ぶ、実践の知恵。",
    icon: Zap,
    color: "from-[#1a1a1a] to-[#151515]",
    recOptions: { button: { name: "メタル釦", price: 5500 }, lining: { name: "柄裏地", price: 6600 } },
    details: {
      fashion: {
        title: "ストリートとフォーマルの融合",
        text: "ストリート感覚とフォーマルな格式を融合したスタイルが最適です。実用性と個性を両立し、都市での生活に最適化されたデザインが、あなたの実践的な知恵を表現します。",
        items: ["モダンなシルエット", "機能性生地", "ストリート感のあるディテール"]
      },
      psychology: {
        title: "実践的知恵 (Street Wisdom)",
        text: "あなたは『街で学ぶ』ことを重視します。理論よりも実践、形式よりも機能を優先します。都市での生活を通じて、実践的な知恵を身につけます。",
        tag: "ESTP / ENFP (起業家・運動家型)"
      },
      romance: {
        title: "自由な関係性",
        text: "恋愛においても、自由で創造的な関係性を求めます。伝統的な関係性よりも、自分らしい関係性を築きます。",
        lucky: "ストリート感のあるアクセサリー"
      },
      philosophy: {
        title: "Pragmatic Urbanism",
        text: "実践的都市主義があなたの哲学です。『街で学び、実践する』という考えから、都市での生活を通じて知恵を身につけることを重視します。"
      }
    }
  },
  '15': {
    id: '15',
    name: "The Naturalist",
    nameJa: "ナチュラリスト",
    group: "Innovators",
    desc: "自然体と伝統を融合する、本質を追求する者。",
    catchphrase: "自然に、本質的に、自由に。",
    icon: UserCircle2,
    color: "from-[#081021] to-[#151515]",
    recOptions: { button: { name: "ナット釦", price: 3300 }, lining: { name: "アンコン", price: 0 } },
    details: {
      fashion: {
        title: "ナチュラルな美学",
        text: "自然体で本質的なスタイルが最適です。過度な装飾を排除し、素材の質感と自然なシルエットを重視します。アンコン仕立てのような、自然な着心地が、あなたの本質的な価値観を表現します。",
        items: ["アンコン仕立て", "ナチュラルな素材", "シンプルなディテール"]
      },
      psychology: {
        title: "本質主義 (Essentialism)",
        text: "あなたは『本質的な価値』を重視します。過度な装飾や形式よりも、自然な美しさと実用性を追求します。自分らしさを自然に表現します。",
        tag: "ISFP / INFP (冒険家・仲介者型)"
      },
      romance: {
        title: "自然な関係性",
        text: "恋愛においても、自然で本質的な関係性を求めます。形式よりも本質を重視し、パートナーとの自然なつながりを大切にします。",
        lucky: "ナチュラルな素材のアクセサリー"
      },
      philosophy: {
        title: "Naturalism (Philosophy of Nature)",
        text: "自然主義があなたの哲学です。『自然に従う』という考えから、過度な装飾や形式を排除し、本質的な価値を追求します。"
      }
    }
  },
  '16': {
    id: '16',
    name: "The Gentle Creator",
    nameJa: "創造的ミニマリスト",
    group: "Innovators",
    desc: "穏やかな創造者。風のように軽やかに、常識を超える。",
    catchphrase: "風のように軽やかに、常識を超える。",
    icon: Zap,
    color: "from-[#3f6212] via-[#65a30d] to-[#1a2e05]",
    recOptions: { button: { name: "メタル釦", price: 5500 }, lining: { name: "赤裏地", price: 4400 } },
    details: {
      fashion: {
        title: "Natural Harmony (Ecology)",
        text: "ナポリ仕立てのような柔らかさと自由な発想。ルールに縛られないアースカラーやリネン素材が、あなたの内なる感性を解放し、周囲との調和（Blend）を生み出します。",
        items: ["リネン混ジャケット", "ニットタイ", "アースカラー"]
      },
      psychology: {
        title: "内なる調和 (Artist)",
        text: "あなたは独自の価値観を大切にする『芸術家』です。競争よりも調和を好み、感受性が豊かです。言葉にできない微細なニュアンスを感じ取る力を持っています。",
        tag: "INTP / INFJ (論理学者・提唱者型)"
      },
      romance: {
        title: "魂の共鳴者",
        text: "言葉にしなくても通じ合える、精神的なつながりを重視します。派手なデートよりも、静かな場所で互いの価値観を共有する時間を大切にします。",
        lucky: "アンティークの時計"
      },
      philosophy: {
        title: "Taoism (Eastern Thought)",
        text: "老荘思想の「無為自然」があなたの生き方です。無理に流れに逆らわず、あるがままを受け入れる姿勢に、真の強さと美しさが宿ります。"
      }
    }
  }
};
